# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog built with Astro 6.2.2, deployed to GitHub Pages at `https://amowu.github.io/blog`.

**Requirements:** Node.js >= 22.12.0

## Commands

```bash
npm run dev      # Local dev server at localhost:4321
npm run build    # Production build to ./dist/
npm run preview  # Preview production build locally
```

No linter or formatter is configured — Astro's built-in defaults apply.

## GitHub Pages Base Path

The site is deployed at `/blog` (not `/`). All internal links must use Astro's `import.meta.env.BASE_URL` — never hardcode `/blog` directly.

## Blog Post Structure

Each post lives in its own folder:

```
src/content/blog/YYYY-MM-DD-slug/
├── index.md        # Post content with frontmatter
├── cover.png       # Cover image (optional)
└── image1.png      # Additional images (optional)
```

Images are referenced with relative paths (e.g., `./cover.png`) inside the markdown.

## Content Schema

Defined in `src/content.config.ts` using Zod. Required fields for every post:

```typescript
{
  title: string       // required
  description: string // required
  pubDate: date       // required (coerced from string)
  updatedDate?: date  // optional
  heroImage?: image   // optional
}
```

## Medium Article Migration

Use the `medium-to-astro` skill (`.claude/skills/medium-to-astro/SKILL.md`) when migrating articles from Medium. It handles HTML-to-Markdown conversion, image downloading via Medium JSON API (with Playwright as fallback), and correct frontmatter generation.
