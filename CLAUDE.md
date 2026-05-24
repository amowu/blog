# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Amo Wu 的個人部落格，建構在 [Chirping Astro](https://github.com/kannansuresh/chirping-astro) 主題上（fork 自 chirping-astro-starter，已調整為單語 zh-TW）。部署到 GitHub Pages，自訂網域 `https://blog.amowu.com`。

**Stack:** Astro 6、Tailwind v4、daisyUI v5、MDX、Pagefind（搜尋）、Giscus（留言）、Expressive Code（程式碼）、Satori + @resvg/resvg-js（自動 OG 圖）。

**Requirements:** Node.js >= 22.12.0、npm。

## Commands

```bash
npm run dev          # Dev server at http://localhost:4321/
npm run build        # Production build to ./dist/ + Pagefind index
npm run preview      # Preview production build locally
npm run typecheck    # astro check
npm run lint         # ESLint (max 0 warnings)
npm run lint:fix     # ESLint with --fix
npm run format       # Prettier write
npm run format:check # Prettier check
```

## Deployment

- 自訂網域 `blog.amowu.com`，`SITE_URL` / `BASE_PATH` 透過環境變數注入
- GitHub Actions workflow：`.github/workflows/deploy.yml`（push 到 `main` 自動 deploy）
- Build 步驟內含 Pagefind 索引產生（`postbuild` script）

## Environment Variables

範本見 `.env.example`。本機 `.env` 不會 commit。

| Var | Required | 用途 |
|---|---|---|
| `SITE_URL` | yes | Production URL (`https://blog.amowu.com`) |
| `BASE_PATH` | yes | 子路徑（自訂網域用 `/`，GitHub Pages 子路徑用 `/blog`）|
| `PUBLIC_GITHUB_HANDLE` | no | sidebar 社群連結 |
| `PUBLIC_TWITTER_HANDLE` | no | sidebar 社群連結 |
| `PUBLIC_CONTACT_EMAIL` | no | sidebar 信箱連結 |
| `PUBLIC_GISCUS_ENABLED` | no | `true` 開啟留言；其他值或留白關閉 |
| `PUBLIC_GISCUS_REPO` | 開啟留言時 | giscus.app 產生 |
| `PUBLIC_GISCUS_REPO_ID` | 開啟留言時 | giscus.app 產生 |
| `PUBLIC_GISCUS_CATEGORY` | 開啟留言時 | giscus.app 產生 |
| `PUBLIC_GISCUS_CATEGORY_ID` | 開啟留言時 | giscus.app 產生 |

CI / GitHub Actions：以上環境變數設在 repo 的 `Settings → Environments → github-pages → Environment variables`。

## i18n 與單語架構

- 站台是單語 zh-TW，介面字串在 `src/i18n/ui.ts` 的 `zh-tw` 區塊
- `SITE.locales` 保留 `['zh-tw', 'en']` 是為了滿足 Chirping 內部型別假設（部分 helper / 元件預期至少兩個 locale），但**只有 zh-tw 有內容**
- `multilingual: false` 隱藏語言切換器
- Astro 仍會 emit `/en/...` static files（內容為 404 模板）— sitemap filter 在 `astro.config.mjs` 排除這些路徑，避免搜尋引擎索引
- URL 結構：根路徑就是 zh-tw（無 `/zh-tw/` 前綴），例 `/posts/<slug>/`、`/about/`

## Internal Links

所有內部連結用 Astro 的 `import.meta.env.BASE_URL` 或 chirping 提供的 `withBase()` / `localizedPath()`（在 `src/i18n/utils.ts`），不要寫死絕對路徑。

## 內容結構

文章與 page 都放在 `src/content/` 下對應 locale 子資料夾：

```
src/content/posts/zh-tw/YYYY-MM-DD-slug/
├── index.md        # 文章內容 + frontmatter
├── cover.png       # 封面圖（選用）
└── image1.png      # 內文圖（選用）

src/content/pages/zh-tw/
└── about.md
```

圖片用 `./cover.png` 這種 relative path 引用。

## Content Schema

完整 schema 在 `src/content.config.ts`（Chirping 版，用 Zod）。常用欄位：

```typescript
{
  title: string           // required, 1–140 chars
  description: string     // required, 1–280 chars
  pubDate: date           // required (pages optional)
  updatedDate?: date
  heroImage?: image | string
  heroImageAlt?: string
  tags?: string[]         // default []
  categories?: string[]   // default []
  draft?: boolean         // default false（true 時 production 不會 build）
  unlisted?: boolean      // default false（URL 直連可達，但不出現在 listing/sitemap/RSS）
  pinned?: boolean        // default false
  toc?: boolean           // default true
  comments?: boolean      // override SITE 預設
}
```

> 88 篇舊文只有 title / description / pubDate / heroImage — 完全相容新 schema，不需要批次改寫。`/tags` 與 `/categories` 頁面目前是空的，未來新文逐篇補。

## CJK 與字型

- Body 字型走 system stack：Latin 用 Chirping 自帶的 web fonts（Source Sans 3、Lato、JetBrains Mono），CJK fallback 是 PingFang TC / Microsoft JhengHei / Noto Sans CJK TC，設定在 `src/styles/global.css`
- **OG 圖 (Satori) 必須 bundle CJK 字型**：`src/assets/fonts/NotoSansTC-Regular.otf`（~5.4MB SubsetOTF），由 `src/utils/og-image.ts` 載入。CI build 沒有系統字型，少了這個中文標題會變方塊
- 不啟用 KaTeX（沒文章用到），相關 deps 仍在但 frontmatter `math: true` 才會載

## Medium Article Migration

用 `medium-to-astro` skill（`.claude/skills/medium-to-astro/SKILL.md`）。注意：搬入位置現在是 `src/content/posts/zh-tw/`（不是舊的 `src/content/blog/`），skill 內部路徑可能要對應調整。

## 主題客製化重點檔案

| 檔案 | 用途 |
|---|---|
| `src/config.ts` | SITE 基本資料、NAV、SOCIALS、GISCUS、PAGEFIND |
| `src/styles/global.css` | daisyUI tokens、字型 stack、自訂 layout token |
| `src/i18n/ui.ts` | 介面字串字典 |
| `src/i18n/utils.ts` | locale helper（已含 zh-tw 分支）|
| `src/utils/posts.ts` | 文章 query helper |
| `src/utils/og-image.ts` | OG 圖生成（Satori） |
| `src/layouts/BaseLayout.astro` | 全站 head / shell |
| `astro.config.mjs` | site / base / i18n / integrations / sitemap filter |

## 設計與規格文件

- Spec: [`docs/superpowers/specs/2026-05-23-chirping-astro-migration-design.md`](docs/superpowers/specs/2026-05-23-chirping-astro-migration-design.md)
- Plan: [`docs/superpowers/plans/2026-05-23-chirping-astro-migration.md`](docs/superpowers/plans/2026-05-23-chirping-astro-migration.md)
