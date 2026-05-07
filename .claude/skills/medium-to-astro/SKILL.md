---
name: medium-to-astro
description: 將 Medium 文章搬運到這個 Astro blog 專案。當使用者說「幫我搬運」、「migrate」、「搬運這篇文章」並附上 medium.com 的 URL，或貼上任何 medium.com 連結並提到要搬運/轉換/匯入時，立即觸發此 skill。即使使用者只說「搬這篇」並附上 Medium URL 也要觸發。
---

# Medium to Astro Migration Skill

將 Medium 文章轉換成這個 Astro blog 的 Markdown 格式，包含 front matter、正文內容與圖片下載。

## Blog 結構規範

- 文章路徑：`src/content/blog/YYYY-MM-DD-slug/index.md`
- 圖片放在同一資料夾底下（`./cover.png`, `./image1.png`, ...）
- Front matter schema（依照 `src/content.config.ts`）：
  ```yaml
  ---
  title: '文章標題'
  description: '文章摘要'
  pubDate: 'May 04 2026'   # 格式：Month DD YYYY
  heroImage: './cover.png'  # 若有封面圖才加
  ---
  ```

## 搬運流程

### Step 1：抓取 Medium 文章

**注意：Medium URL 常會 redirect**（例如到作者的自訂域名，再跳回 Medium 登入），WebFetch 會提示 redirect URL，需跟著轉址繼續抓，通常最終能取得內容。

用 WebFetch 抓取 Medium URL。若 WebFetch 無法取得完整內文（例如只回傳登入頁），改用 **Playwright `browser_navigate`** 開啟頁面，再用 `browser_evaluate` 擷取內容。

Medium 頁面的關鍵 HTML 結構：
- 標題：`<h1>` 或 `<title>`（去掉 " | Medium" 後綴）
- 發布日期：`<time datetime="...">` 屬性
- 封面圖：文章第一張 `<figure>` 裡的 `<img>`，或 `og:image` meta tag
- 正文：`<article>` 標籤內的內容
- 描述：`<meta name="description">` 或 `og:description`，或文章第一個段落的前 150 字

### Step 2：決定資料夾名稱

- 從 Medium URL 取得 slug（URL 最後一段，去掉 hash，例如 `hls-signed-cookies-4c1194920eb1` → `hls-signed-cookies`，取 `-` 分隔的前幾個有意義的詞）
- 格式：`YYYY-MM-DD-slug`（日期來自文章發布日期）
- 完整路徑：`src/content/blog/YYYY-MM-DD-slug/`

### Step 3：HTML 轉 Markdown

轉換規則：

| HTML | Markdown |
|------|----------|
| `<h1>` | `# ` |
| `<h2>` | `## ` |
| `<h3>` | `### ` |
| `<h4>` | `#### ` |
| `<strong>`, `<b>` | `**text**` |
| `<em>`, `<i>` | `*text*` |
| `<a href="url">text</a>` | `[text](url)` |
| `<code>` (inline) | `` `code` `` |
| `<pre><code class="language-js">` | ` ```js\ncode\n``` ` |
| `<blockquote>` | `> ` |
| `<ul><li>` | `* ` |
| `<ol><li>` | `1. ` |
| `<hr>`, `<div role="separator">` | `---` |
| `<figure>` with `<img>` | `![figcaption text](./imageN.ext)` |
| `<img>` without figure | `![alt](./imageN.ext)` |
| `<figcaption>` | 作為上面圖片的 alt text，或在圖片下方加一行 italic：`*caption*` |

**特別注意：**
- Medium 用 `<mark>` 做 highlight，轉換成 `==text==`（或保留為粗體）
- Medium 的分隔線實際上是 `<div role="separator">`（不是 `<hr>`），轉換成 `---`
- 去除 Medium 特有的 tracking 參數（如 `?source=...`）
- 內嵌的 Medium 文章連結（gist、tweet embed 等）保留為純連結
- 段落之間保留空行

### Step 4：圖片處理

**重要：WebFetch 不執行 JavaScript，無法取得動態載入的圖片 URL。**

取得圖片 URL 的方法，依優先順序嘗試：

**方法一（優先）：Medium `?format=json` API**

Medium 有隱藏的 JSON endpoint，直接回傳結構化資料含圖片 URL，不需要 JS：

```bash
curl -s "https://medium.com/@user/article-slug?format=json" \
  | sed 's/])}while(1);<<//' \
  | jq '[.payload.value.content.bodyModel.paragraphs[] | select(.metadata.id != null) | "https://miro.medium.com/v2/resize:fit:700/" + .metadata.id]'
```

若文章用自訂域名（如 blog.amowu.com），改用原始 medium.com URL 加 `?format=json`。

**方法二：Playwright（JSON API 失效時使用）**

改用 Playwright 抓取實際渲染後的圖片清單：

```js
// Step A：取得所有文章內圖片 URL
() => {
  const imgs = Array.from(document.querySelectorAll('article img, figure img'));
  return imgs.map(img => img.src).filter(src => src.includes('miro.medium.com'));
}

// Step B：取得每張圖的前文（用來對照 markdown 插入位置）
() => {
  const figures = Array.from(document.querySelectorAll('article figure'));
  return figures.map((fig, i) => {
    const src = fig.querySelector('img')?.src || '';
    const caption = fig.querySelector('figcaption')?.textContent?.trim() || '';
    let prev = fig.previousElementSibling;
    let prevText = '';
    while (prev && prevText.trim() === '') {
      prevText = prev.textContent?.trim() || '';
      prev = prev.previousElementSibling;
    }
    return { index: i + 1, filename: src.split('/').pop(), caption, prevText: prevText.slice(-80) };
  });
}

// Step C：取得 og:image 作為封面
() => document.querySelector('meta[property="og:image"]')?.content
```

Medium 圖片 URL 格式有兩種，下載方式不同：

| 格式 | 範例 | 最高畫質做法 |
|------|------|-------------|
| `1*` 開頭 | `resize:fit:700/1*abc.png` | 換成 `max/2400/1*abc.png` ✅ |
| `0*` 開頭 | `resize:fit:700/0*abc.png` | **不支援 max/2400**，直接用 Playwright 拿到的原始 URL ✅ |

下載規則：
- 封面圖（og:image）→ `cover.png` 或 `cover.jpg`（依原始格式）
- 其他圖片**依 figure 在文章中的順序**命名：`image1.png`, `image2.png`, ...（或 `.jpg`）
- 用 Bash 並行下載：`curl -sL <url> -o <path> &`，最後 `wait`
- 下載後用 `file` 指令驗證是否為真實圖片（非 59-byte 錯誤回應）

### Step 5：建立檔案

1. 建立資料夾：`src/content/blog/YYYY-MM-DD-slug/`
2. 下載所有圖片到該資料夾
3. 寫入 `index.md`，確認：
   - front matter 完整正確
   - 圖片路徑都是相對路徑（`./imageN.png`）
   - 正文 Markdown 格式正確

### Step 6：完成後回報

告知使用者：
- 建立的檔案路徑
- 下載的圖片數量
- 任何需要手動確認的部分（例如無法自動解析的 embed、表格格式等）
