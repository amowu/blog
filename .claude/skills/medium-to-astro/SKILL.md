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

用 WebFetch 抓取 Medium URL。Medium 頁面的關鍵 HTML 結構：
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
| `<hr>` | `---` |
| `<figure>` with `<img>` | `![figcaption text](./imageN.ext)` |
| `<img>` without figure | `![alt](./imageN.ext)` |
| `<figcaption>` | 作為上面圖片的 alt text，或在圖片下方加一行 italic：`*caption*` |

**特別注意：**
- Medium 用 `<mark>` 做 highlight，轉換成 `==text==`（或保留為粗體）
- Medium 的分隔線通常是 `<hr>` 或裝飾性 `<div>`，轉換成 `---`
- 去除 Medium 特有的 tracking 參數（如 `?source=...`）
- 內嵌的 Medium 文章連結（gist、tweet embed 等）保留為純連結
- 段落之間保留空行

### Step 4：圖片處理

Medium 圖片 URL 格式：`https://miro.medium.com/v2/resize:fit:700/1*xxxxx.jpeg`

取得最佳畫質：將 URL 中的 `resize:fit:NNN` 替換為 `max/2400`，例如：
- 原始：`https://miro.medium.com/v2/resize:fit:700/1*abc.png`
- 最佳：`https://miro.medium.com/v2/max/2400/1*abc.png`

下載規則：
- 封面圖（第一張或 og:image）→ `cover.png` 或 `cover.jpg`（依原始格式）
- 其他圖片依序命名：`image1.png`, `image2.png`, ...（或 `.jpg`）
- 用 Bash `curl -L -o <path> <url>` 下載

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
