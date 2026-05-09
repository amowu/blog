#!/usr/bin/env python3
"""Batch migrate Medium export HTML files to Astro blog posts.

Usage: python3 scripts/migrate-medium-export.py

Resume-safe: skips posts where src/content/blog/YYYY-MM-DD-slug/index.md already exists.
"""

import os
import re
import sys
import subprocess
import concurrent.futures
from pathlib import Path
from datetime import datetime
from typing import Optional
from urllib.parse import unquote

try:
    from bs4 import BeautifulSoup, NavigableString, Tag
except ImportError:
    print("ERROR: beautifulsoup4 required. Run: pip3 install beautifulsoup4")
    sys.exit(1)

BLOG_ROOT = Path(__file__).parent.parent
EXPORT_POSTS = next(BLOG_ROOT.glob("medium-export-*/posts"), None)
BLOG_DIR = BLOG_ROOT / "src" / "content" / "blog"
MAX_WORKERS = 5


# ---------------------------------------------------------------------------
# URL / slug helpers
# ---------------------------------------------------------------------------

def clean_url(url: str) -> str:
    """Strip Medium tracking params (?ref=, ?source=) from a URL."""
    if not url:
        return url
    for param in ("ref", "source"):
        url = re.sub(rf"\?{param}=[^&]*(&|$)", "?", url)
        url = re.sub(rf"&{param}=[^&]*", "", url)
    url = re.sub(r"\?$", "", url)
    return url


def upgrade_image_url(src: str) -> str:
    """Convert cdn-images-1.medium.com URLs to miro.medium.com (publicly accessible).
    1* images → max/2400 (high quality); 0* images → fit:700 (max available)."""
    if not src:
        return src
    # Extract image ID from cdn-images-1 or miro URLs
    m = re.search(r"/(?:max/\d+|fit/[^/]+)/([01]\*[^/\s]+)$", src)
    if m:
        img_id = m.group(1)
        if img_id.startswith("1*"):
            return f"https://miro.medium.com/v2/resize:fit:2400/{img_id}"
        else:
            return f"https://miro.medium.com/v2/resize:fit:700/{img_id}"
    return src


def image_ext(src: str, data_image_id: str = "") -> str:
    ref = data_image_id or src or ""
    m = re.search(r"\.(png|jpg|jpeg|gif|webp|svg)(\?|$)", ref, re.IGNORECASE)
    return ("." + m.group(1).lower()) if m else ".png"


def canonical_slug(soup: BeautifulSoup) -> Optional[str]:
    a = soup.find("a", class_="p-canonical")
    if not a:
        return None
    path = (a.get("href", "")).rstrip("/").split("/")[-1]
    path = unquote(path)  # decode %E6%84%9F → Chinese chars
    slug = re.sub(r"-[a-f0-9]{12}$", "", path)
    if not slug or slug == path:
        return None
    # Truncate only when bytes would exceed macOS 255-byte filename limit.
    # Use a safe 200-byte ceiling to leave room for the date prefix.
    while len(slug.encode("utf-8")) > 200:
        slug = slug.rsplit("-", 1)[0]
    return slug or None


def filename_slug(stem: str) -> str:
    """Fallback slug derived from the export filename stem."""
    # Strip YYYY-MM-DD_ prefix
    name = re.sub(r"^\d{4}-\d{2}-\d{2}_", "", stem)
    # Strip trailing 12-char hex hash
    name = re.sub(r"-[a-f0-9]{12}$", "", name)
    name = name.lower()
    name = re.sub(r"[_\s]+", "-", name)
    name = re.sub(r"[^\w-]", "", name, flags=re.ASCII)
    name = re.sub(r"-{2,}", "-", name).strip("-")
    return name or "post"


# ---------------------------------------------------------------------------
# Inline markdown conversion
# ---------------------------------------------------------------------------

def inline_md(node) -> str:
    """Convert a node and its children to inline markdown."""
    if isinstance(node, NavigableString):
        return str(node)
    tag = node.name
    if tag is None:
        return ""
    children = "".join(inline_md(c) for c in node.children)
    if tag in ("strong", "b"):
        return f"**{children}**" if children.strip() else children
    if tag in ("em", "i"):
        return f"*{children}*" if children.strip() else children
    if tag == "code":
        return f"`{children}`"
    if tag == "mark":
        return f"=={children}=="
    if tag == "a":
        href = clean_url(node.get("href", ""))
        text = children.strip() or href
        return f"[{text}]({href})"
    if tag == "br":
        return "\n"
    return children


def pre_text(node) -> str:
    """Extract plain text from <pre> content, converting <br> to newline."""
    parts = []
    for child in node.children:
        if isinstance(child, NavigableString):
            parts.append(str(child))
        elif child.name == "br":
            parts.append("\n")
        elif child.name is not None:
            parts.append(pre_text(child))
    return "".join(parts)


# ---------------------------------------------------------------------------
# Body → Markdown conversion
# ---------------------------------------------------------------------------

def body_to_markdown(body_section, image_map: list[tuple]) -> str:
    """
    Convert the <section data-field="body"> element to Markdown.
    image_map: [(filename_or_None, caption), ...] in document figure order.
    """
    lines: list[str] = []
    image_idx = [0]
    first_title_done = [False]

    def emit(text: str):
        lines.append(text)

    def process(node):
        if isinstance(node, NavigableString):
            return
        tag = node.name
        if tag is None:
            return
        classes = " ".join(node.get("class", []))

        # ── Section-level wrappers ──────────────────────────────────────────
        if tag == "section" and "section--body" in classes:
            for child in node.children:
                process(child)
            return

        if tag == "div" and "section-divider" in classes:
            emit("---")
            emit("")
            return

        if tag == "hr" and "section-divider" in classes:
            return  # already emitted by the wrapper div

        if tag == "div" and any(c in classes for c in (
            "section-content", "section-inner", "sectionLayout"
        )):
            for child in node.children:
                process(child)
            return

        # ── Headings ────────────────────────────────────────────────────────
        if tag in ("h1", "h2", "h3", "h4"):
            if "graf--title" in classes and not first_title_done[0]:
                first_title_done[0] = True
                return
            prefix = {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### "}.get(tag, "### ")
            text = "".join(inline_md(c) for c in node.children).strip()
            if text:
                emit(f"{prefix}{text}")
                emit("")
            return

        # ── Paragraphs ──────────────────────────────────────────────────────
        if tag == "p":
            text = "".join(inline_md(c) for c in node.children).strip()
            if text:
                emit(text)
                emit("")
            return

        # ── Blockquotes ─────────────────────────────────────────────────────
        if tag == "blockquote":
            text = "".join(inline_md(c) for c in node.children).strip()
            for line in text.splitlines():
                emit(f"> {line}")
            emit("")
            return

        # ── Lists ───────────────────────────────────────────────────────────
        if tag == "ul":
            for li in node.find_all("li", recursive=False):
                emit(f"* {''.join(inline_md(c) for c in li.children).strip()}")
            emit("")
            return

        if tag == "ol":
            for i, li in enumerate(node.find_all("li", recursive=False), 1):
                emit(f"{i}. {''.join(inline_md(c) for c in li.children).strip()}")
            emit("")
            return

        # ── Code blocks ─────────────────────────────────────────────────────
        if tag == "pre":
            lang = node.get("data-code-block-lang", "")
            content_span = node.find("span", class_="pre--content")
            code = pre_text(content_span if content_span else node).rstrip()
            emit(f"```{lang}")
            emit(code)
            emit("```")
            emit("")
            return

        # ── Figures / images ────────────────────────────────────────────────
        if tag == "figure":
            img = node.find("img")
            if img:
                idx = image_idx[0]
                image_idx[0] += 1
                if idx < len(image_map):
                    filename, caption = image_map[idx]
                    if filename:
                        alt = caption or ""
                        emit(f"![{alt}](./{filename})")
                        if caption:
                            emit(f"*{caption}*")
                        emit("")
                        return
                # Fallback: use CDN URL
                src = img.get("src", "")
                figcap = node.find("figcaption")
                cap = figcap.get_text().strip() if figcap else ""
                emit(f"![{cap}]({src})")
                if cap:
                    emit(f"*{cap}*")
                emit("")
            return

        # ── Mixtape embed (link preview card) ───────────────────────────────
        if tag == "div" and "graf--mixtapeEmbed" in classes:
            anchor = node.find("a", class_=re.compile("markup--anchor"))
            if anchor:
                href = clean_url(anchor.get("href", ""))
                strong = anchor.find("strong")
                title = strong.get_text().strip() if strong else anchor.get_text().strip()
                if href and title:
                    emit(f"[{title}]({href})")
                    emit("")
            return

        # ── Default: recurse ────────────────────────────────────────────────
        for child in node.children:
            process(child)

    process(body_section)

    # Collapse consecutive blank lines
    result: list[str] = []
    prev_blank = False
    for line in lines:
        if line == "":
            if not prev_blank:
                result.append(line)
            prev_blank = True
        else:
            result.append(line)
            prev_blank = False

    return "\n".join(result).strip()


# ---------------------------------------------------------------------------
# Image downloading
# ---------------------------------------------------------------------------

def download_images(post_dir: Path, figures: list) -> tuple:
    """
    Download images for a post.
    figures: [(src, data_image_id, caption, is_featured), ...]
    Returns (image_map, cover_filename_or_None)
    image_map: [(filename_or_None, caption), ...] in same order as figures.
    """
    if not figures:
        return [], None

    # Determine filenames before downloading
    has_featured = any(is_feat for _, _, _, is_feat in figures)
    cover_idx = next((i for i, (_, _, _, f) in enumerate(figures) if f), 0) if has_featured else 0

    filenames = []
    img_num = 1
    for i, (src, data_img_id, caption, _) in enumerate(figures):
        ext = image_ext(src, data_img_id)
        if i == cover_idx:
            filenames.append(f"cover{ext}")
        else:
            filenames.append(f"image{img_num}{ext}")
            img_num += 1

    # Launch parallel downloads
    procs = []
    for (src, data_img_id, caption, _), fname in zip(figures, filenames):
        if not src:
            procs.append((None, None, fname, caption))
            continue
        url = upgrade_image_url(src)
        local = post_dir / fname
        proc = subprocess.Popen(
            ["curl", "-sL", "-o", str(local), url],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        procs.append((proc, local, fname, caption))

    # Wait and verify
    image_map = []
    cover_filename = None

    for proc, local, fname, caption in procs:
        if proc is None:
            image_map.append((None, caption))
            continue
        proc.wait()
        ok = False
        if local and local.exists() and local.stat().st_size > 200:
            result = subprocess.run(["file", str(local)], capture_output=True, text=True)
            if "HTML" not in result.stdout and "text" not in result.stdout.lower():
                ok = True
        if ok:
            image_map.append((fname, caption))
            if fname.startswith("cover"):
                cover_filename = fname
        else:
            if local and local.exists():
                local.unlink()
            image_map.append((None, caption))

    return image_map, cover_filename


# ---------------------------------------------------------------------------
# Per-post migration
# ---------------------------------------------------------------------------

def yaml_str(s: str) -> str:
    """Wrap a string in single-quoted YAML, escaping inner single quotes."""
    return "'" + s.replace("'", "''") + "'"


def migrate_post(html_file: Path, force: bool = False) -> str:
    try:
        m = re.match(r"^(\d{4}-\d{2}-\d{2})_", html_file.name)
        if not m:
            return f"[SKIP] {html_file.name} — no date prefix"

        date_str = m.group(1)
        pub_date = datetime.strptime(date_str, "%Y-%m-%d").strftime("%b %d %Y")

        soup = BeautifulSoup(html_file.read_text(encoding="utf-8"), "html.parser")

        # Title
        h1 = soup.find("h1", class_="p-name")
        title_tag = soup.find("title")
        title = (h1 or title_tag).get_text().strip() if (h1 or title_tag) else html_file.stem

        # Description
        sub = soup.find("section", attrs={"data-field": "subtitle"})
        if sub and sub.get_text().strip():
            desc = sub.get_text().strip()
        else:
            first_p = soup.find("p", class_=re.compile("graf--p"))
            desc = (first_p.get_text().strip()[:150] if first_p else "").rstrip("…") + ("…" if first_p and len(first_p.get_text().strip()) > 150 else "")

        # Slug → folder
        slug = canonical_slug(soup) or filename_slug(html_file.stem)
        folder = f"{date_str}-{slug}"
        post_dir = BLOG_DIR / folder
        index_md = post_dir / "index.md"

        if index_md.exists() and not force:
            return f"[SKIP] {folder} (already exists)"

        # Title-based dedup: check if same-date post with identical title exists
        # (skip in force mode when the folder name matches, to allow re-migration)
        for existing_dir in BLOG_DIR.glob(f"{date_str}-*"):
            if existing_dir == post_dir:
                continue  # same folder — force will overwrite it
            existing_md = existing_dir / "index.md"
            if existing_md.exists():
                for line in existing_md.read_text(encoding="utf-8").split("\n")[:6]:
                    if line.startswith("title:"):
                        existing_title = line[6:].strip().strip("'\"").replace("''", "'")
                        if existing_title == title:
                            return f"[SKIP] {folder} (title duplicate of {existing_dir.name})"
                        break

        # Body
        body = soup.find("section", attrs={"data-field": "body"})
        if not body:
            return f"[FAIL] {folder} — no body section"

        # Collect figures in document order
        figures_raw = []
        for fig in body.find_all("figure"):
            img = fig.find("img")
            if img:
                src = img.get("src", "")
                data_id = img.get("data-image-id", "")
                is_feat = img.get("data-is-featured") == "true"
                figcap = fig.find("figcaption")
                cap = "".join(inline_md(c) for c in figcap.children).strip() if figcap else ""
                figures_raw.append((src, data_id, cap, is_feat))

        post_dir.mkdir(parents=True, exist_ok=True)

        image_map, cover = download_images(post_dir, figures_raw)
        markdown = body_to_markdown(body, image_map)

        # Front matter
        fm_lines = [
            "---",
            f"title: {yaml_str(title)}",
            f"description: {yaml_str(desc)}",
            f"pubDate: {yaml_str(pub_date)}",
        ]
        if cover:
            fm_lines.append(f"heroImage: './{cover}'")
        fm_lines.append("---")

        content = "\n".join(fm_lines) + "\n\n" + markdown + "\n"
        index_md.write_text(content, encoding="utf-8")

        img_count = sum(1 for f, _ in image_map if f)
        return f"[OK]   {folder} — {img_count} image(s)"

    except Exception as e:
        import traceback
        return f"[FAIL] {html_file.name} — {e}\n{traceback.format_exc()}"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    force = "--force" in sys.argv

    if EXPORT_POSTS is None or not EXPORT_POSTS.exists():
        print("ERROR: medium-export-*/posts directory not found under blog root")
        sys.exit(1)

    BLOG_DIR.mkdir(parents=True, exist_ok=True)

    html_files = sorted(
        f for f in EXPORT_POSTS.glob("*.html")
        if not f.name.startswith("draft_") and re.match(r"^\d{4}-\d{2}-\d{2}_", f.name)
    )

    mode = "FORCE (re-processing all)" if force else "normal (skip existing)"
    print(f"Found {len(html_files)} published posts — mode: {mode} (MAX_WORKERS={MAX_WORKERS})\n")

    counts = {"ok": 0, "skip": 0, "fail": 0}

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(migrate_post, f, force): f for f in html_files}
        for fut in concurrent.futures.as_completed(futures):
            msg = fut.result()
            print(msg)
            if msg.startswith("[OK]"):
                counts["ok"] += 1
            elif msg.startswith("[SKIP]"):
                counts["skip"] += 1
            else:
                counts["fail"] += 1

    print(f"\nDone: {counts['ok']} migrated, {counts['skip']} skipped, {counts['fail']} failed")


if __name__ == "__main__":
    main()
