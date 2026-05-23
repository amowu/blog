# Chirping Astro 主題遷移設計

- **日期：** 2026-05-23
- **Branch：** `feature/chirping-astro`
- **目標：** 把現有自訂 Astro blog 遷移到 [Chirping Astro](https://aneejian.com/chirping-astro/) 主題，保留 88 篇歷史文章與 `blog.amowu.com` 自訂網域。

---

## 1. 決策摘要

| 項目 | 決策 | 備註 |
|---|---|---|
| 遷移方式 | 全新 scaffold，把內容搬進去 | 在 `feature/chirping-astro` branch 內就地替換 |
| Scaffold 執行方式 | `npx create-astro` 到 `/tmp`，再選擇性 copy | 上游檔案原汁原味 + 保留 `.git` / 內容 / `CLAUDE.md` |
| 語系 | 單一繁體中文（zh-TW），關閉 i18n 路由 | `multilingual: false`、URL 無 `/zh-tw/` 前綴 |
| 部署 | `blog.amowu.com` 自訂網域 | `SITE_URL=https://blog.amowu.com`、`BASE_PATH=/` |
| 啟用功能 | Giscus、Pagefind、Expressive Code、Auto OG images | 不啟用 KaTeX |
| 88 篇舊文 | 不補 tags/categories，照舊遷移 | frontmatter 已是 Chirping schema 子集 |
| Package manager | npm | 保留現有 `package-lock.json` |
| Lint / Format | 保留 Chirping 預設的 ESLint + Prettier | 從零新增 |
| Deploy workflow | 換成 Chirping 預設 workflow | 含 Pagefind index 步驟 |
| 字型 | 純 system stack（含 CJK fallback） | Satori OG image 仍須 bundle CJK 字型 |
| `medium-export-*` | 保留 | |
| Atkinson 字型 | 刪除 | |

---

## 2. 遷移執行策略

### 2.1 Scaffold 流程

```bash
# 1. scaffold 到暫存目錄（不影響當前 repo）
cd /tmp
npx create-astro@latest chirping-tmp \
  --template kannansuresh/chirping-astro-starter \
  --no-install --no-git

# 2. 選擇性 copy 進 blog repo（從專案根目錄執行）
REPO=/Users/amowu/Documents/Personal/blog
SRC=/tmp/chirping-tmp

cp -R $SRC/src/{components,layouts,pages,styles,utils,plugins,i18n,types} $REPO/src/
cp $SRC/src/{config.ts,content.config.ts,env.d.ts} $REPO/src/
cp -R $SRC/src/assets/images $REPO/src/assets/
cp $SRC/{package.json,astro.config.mjs,tsconfig.json,.env.example} $REPO/
cp $SRC/eslint.config.* $SRC/.prettierrc* $REPO/ 2>/dev/null || true
cp -R $SRC/.github $REPO/

# 3. 內容資料夾搬家（保留 git rename 偵測）
cd $REPO
git mv src/content/blog src/content/posts/zh-tw

# 4. 刪除範例內容與不需要的東西
rm -rf src/content/posts/en src/content/posts/fr
rm -rf src/content/pages/fr src/pages/fr
rm -rf src/assets/fonts/atkinson-*
rm -f src/consts.ts

# 5. 重裝 dependencies
npm install
```

### 2.2 保留 / 替換對照

| 來源（現有） | 處理 |
|---|---|
| `src/content/blog/<post>/index.md`（含圖片） | `git mv` → `src/content/posts/zh-tw/<post>/index.md` |
| `src/content.config.ts` | 用 Chirping 版完整覆蓋（你現有 5 個 frontmatter 欄位是 Chirping schema 子集） |
| `src/consts.ts` | 刪除，內容遷入 `src/config.ts` 的 `SITE` |
| `src/pages/`、`src/layouts/`、`src/components/`、`src/styles/` | 完全替換 |
| `src/assets/fonts/atkinson-*` | 刪除 |
| `public/`（現有 favicon 等） | **逐項檢查**（見 §3.3） |
| `medium-export-*/` | 保留 |
| `scripts/` | 保留現狀，遷移完成後再決定是否還有用 |
| `.github/workflows/deploy.yml` | 換成 Chirping starter 版 |
| `CLAUDE.md`、`.claude/`、`README.md` | 保留 |
| `tsconfig.json` | **直接覆蓋**為 Chirping 版（你現有的幾乎是 Astro 預設，無自訂內容；Chirping 版含 path aliases，是 Chirping 程式碼會用到的）。但要把 `"types": ["astro/client", "@types/bun"]` 改成 `"types": ["astro/client"]`，因為我們用 npm 不是 bun |
| `.gitignore` | **合併**（你現有的可能有自訂內容） |

### 2.3 注意事項

- `.gitignore` 要 merge，不能覆蓋 — 你現有的可能有自訂內容
- `tsconfig.json` 直接覆蓋，但移除 `@types/bun`（你用 npm）
- `--no-install --no-git` 避免 scaffold 工具動 git
- 從 Chirping 帶來的 dependency 版本**不要主動 bump**，照 starter 的鎖死版本

---

## 3. 設定檔修改

### 3.1 `src/config.ts`

```ts
SITE = {
  title: '...',                    // 從現有 src/consts.ts 搬
  description: '...',
  url: process.env.SITE_URL,       // = https://blog.amowu.com（env 注入）
  basePath: process.env.BASE_PATH ?? '/',
  defaultLocale: 'zh-tw',          // 從 'en' 改成 'zh-tw'
  locales: ['zh-tw'],              // 只保留一個
  multilingual: false,             // 關閉雙語
  author: { name: 'Amo Wu', avatar, ... },
  autoOgImage: true,
}
```

### 3.2 `astro.config.mjs`

```js
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://blog.amowu.com',
  base: process.env.BASE_PATH ?? '/',
  i18n: {
    defaultLocale: 'zh-tw',
    locales: ['zh-tw'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap(),
    expressiveCode({ themes: ['github-light', 'github-dark-dimmed'] }),
    // ...Chirping 預設帶的其他 integrations
  ],
  // 移除：現有的 fonts 區塊（Atkinson）
});
```

### 3.3 `.env`（不 commit）

```
SITE_URL=https://blog.amowu.com
BASE_PATH=/
PUBLIC_GITHUB_HANDLE=amowu
PUBLIC_TWITTER_HANDLE=
PUBLIC_CONTACT_EMAIL=
PUBLIC_GISCUS_ENABLED=true
PUBLIC_GISCUS_REPO=amowu/blog
PUBLIC_GISCUS_REPO_ID=        # 去 giscus.app 產生
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

`.env.example` 範本 commit 進 repo。Giscus 環境變數 build 時要設到 GitHub repo `Settings → Environments → github-pages → Environment variables`。

### 3.4 `package.json`

從 Chirping starter 完整覆蓋 `dependencies` / `devDependencies` / `scripts`，但保留：
- `name`（如果你想自訂）
- `engines.node >= 22.12.0`

新增主要套件：`tailwindcss@^4`、`daisyui@^5`、`astro-expressive-code`、Giscus integration、`pagefind`、`satori`、`@resvg/resvg-js`、`eslint`、`prettier` 等。

---

## 4. 內容、圖片、資產搬移

### 4.1 內容路徑映射

```
src/content/blog/<post>/index.md       →  src/content/posts/zh-tw/<post>/index.md
src/content/blog/<post>/cover.png      →  src/content/posts/zh-tw/<post>/cover.png
src/content/blog/<post>/*.png|jpg|gif  →  src/content/posts/zh-tw/<post>/*
```

執行：`git mv src/content/blog src/content/posts/zh-tw`

**URL 變化：** 透過 `prefixDefaultLocale: false`，URL 不會出現 `/zh-tw/` 前綴。預期路徑：`blog.amowu.com/posts/<slug>/`。

> ⚠️ 需要在 Phase 1 驗證確認 URL 結構是否跟原本一致。如果原本是 `/blog/<slug>/` 或其他結構，需要加 redirect 規則避免 SEO 流量流失。

### 4.2 Frontmatter 相容性

| 你現有 frontmatter 欄位 | Chirping schema | 相容性 |
|---|---|---|
| `title` (string) | `title` (string, 1–140) | ✅ |
| `description` (string) | `description` (string, 1–280) | ✅ |
| `pubDate` (date) | `pubDate` (date) | ✅ |
| `updatedDate` (date, optional) | `updatedDate` (date, optional) | ✅ |
| `heroImage` (image, optional) | `heroImage` (image \| string, optional) | ✅ |

**結論：** 88 篇舊文 frontmatter 不需要批次改寫，照搬即可通過 zod 驗證。

`tags` / `categories` 預設為 `[]`，舊文沒寫不會壞。`/tags`、`/categories` 路由會是空頁，未來新文逐篇補。

### 4.3 `public/` 內容處理

執行前先 `ls public/` 列出所有檔案，逐項決定：
- favicon → 改放 `src/assets/images/site/favicon.svg`（Chirping 慣例）
- avatar / 個人頭像 → 放 `src/assets/images/site/avatar.svg`
- CNAME（自訂網域）→ 保留在 `public/`
- robots.txt → 保留在 `public/`
- 其他靜態檔 → case by case

---

## 5. CJK / 繁體中文適配

### 5.1 字型（純 system stack）

在 `src/styles/global.css` 設：

```css
@theme {
  --font-sans: ui-sans-serif, system-ui, -apple-system,
               'PingFang TC', 'Microsoft JhengHei',
               'Noto Sans CJK TC', sans-serif;
}
```

不額外載入 web font。優點：
- 零字型 payload
- 各 OS 用內建字型，效能最佳
- 跟你目前依賴 system fallback 的習慣一致

### 5.2 Auto OG image — Satori CJK 字型（**例外，必須 bundle**）

Satori 在 build CI 跑，沒有 OS 字型可用。如果不明確傳字型 buffer，中文標題會渲染成方塊。

**做法：** 下載一份 Noto Sans TC `.otf` / `.ttf` 放 `src/assets/fonts/`，修改 Chirping 的 OG image generator（大概在 `src/pages/og/[...].png.ts` 或 `src/utils/og.ts`）：

```ts
import fs from 'node:fs/promises';

const fontData = await fs.readFile('./src/assets/fonts/NotoSansTC-Regular.otf');

await satori(<div>...</div>, {
  fonts: [{
    name: 'Noto Sans TC',
    data: fontData,
    weight: 400,
    style: 'normal',
  }],
});
```

可選優化：用 [`@fontsource/noto-sans-tc`](https://www.npmjs.com/package/@fontsource/noto-sans-tc) 或 subset 工具縮減字型檔大小（完整檔 ~10MB）。

### 5.3 Pagefind 中文分詞

Pagefind v1+ 內建 CJK 分詞，會看 `<html lang>` 屬性自動啟用。

**檢查項目：**
- `BaseLayout.astro` 的 `<html lang="zh-TW">` 是否根據 `defaultLocale` 正確設定
- Build 後 `npx pagefind --site dist` 是否跑起來（應該被 Chirping workflow 包進去）

**已知風險：** Pagefind 預設分詞可能切得不漂亮。實測後若搜尋結果差，可加 `pagefind.yml` 設 `force_language: zh`，或視需求調整。

---

## 6. 驗證與 Rollout

### Phase 1 — Local Dev 驗證

1. `npm run dev` → 開 `localhost:4321` 看首頁
2. 隨機抽 5 篇舊文（涵蓋 2009 / 2015 / 2020 / 2024 / 2026）逐一打開，確認：
   - 標題、日期、描述、heroImage 正確
   - 程式碼區塊（舊文有大量 code block）Expressive Code 渲染正常
   - 中文字型、行距、排版可讀
3. `/tags`、`/categories` 不該 500
4. dark mode 切換正常、語言切換 UI 已關閉
5. 搜尋功能：搜「策略模式」「Cypress」等中英關鍵字，驗證有結果
6. URL 結構檢查（重要）：對比舊 URL 跟新 URL，記錄差異

### Phase 2 — Production Build 驗證

1. `npm run build` 無錯
2. `npm run preview` 確認靜態檔
3. 抽查 `dist/og/` 幾張 OG 圖，**確認中文標題沒變方塊**
4. 確認 `dist/pagefind/` 有產生 index
5. 掃 `dist/sitemap-*.xml`，確認 88 篇文章 URL 都列出
6. 隨機點 10 個 URL 確認 200 回應

### Phase 3 — Staging（PR Preview）

- 透過 GitHub Actions 的 PR preview（如果有設）或本機 `preview` 自行驗收
- 不直接 merge 到 main

### Phase 4 — Cutover

1. 在 GitHub repo 設定 Giscus 5 個 env vars 到 `Settings → Environments → github-pages`
2. Merge `feature/chirping-astro` → `main`
3. 監看 GitHub Actions deploy
4. 線上驗證 `blog.amowu.com`：
   - 首頁
   - 隨機 3 篇舊文
   - 搜尋
   - Giscus 留言區（在文章頁底部）
   - 用 Twitter Card Validator / opengraph.xyz 驗證 OG 圖

### 回滾方案

`git revert <merge-commit-sha>` 即可。內容檔案沒改，只是主題層回去。

---

## 7. 已知風險與後續工作

| 風險 / 待辦 | 處理時機 |
|---|---|
| URL 結構從 `/blog/<slug>` 變成 `/posts/<slug>` 可能影響 SEO | Phase 1 確認後決定是否加 redirect |
| Satori OG image 中文字型 | 寫進實作 plan，不可遺漏 |
| Pagefind 中文搜尋品質 | 上線後實測，視情況加 `pagefind.yml` 調整 |
| 88 篇舊文沒 tags/categories，相關頁是空的 | 接受現狀，未來新文補 |
| `scripts/`、`public/` 內容逐項評估 | 實作階段處理 |
| Giscus 設定（Discussions、app 安裝、5 個 env vars） | Phase 4 cutover 前完成 |
| `CLAUDE.md` 內容（提到舊的 `/blog` base path、舊的 `src/content/blog/` 結構） | 遷移完成後一併更新 |

---

## 8. 不在範圍

- 不做 SEO redirect 規劃（除非 Phase 1 發現 URL 結構差太大）
- 不做舊文內容批次改寫（tags / categories / heroImage 補圖）
- 不切換 hosting 平台（仍是 GitHub Pages）
- 不導入 KaTeX、雙語、photo-essay 等 Chirping 額外功能
