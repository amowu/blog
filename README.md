# blog.amowu.com

Amo Wu 的個人部落格原始碼。建構在 [Chirping Astro](https://github.com/kannansuresh/chirping-astro) 主題上，調整為單語 zh-TW 並部署到 GitHub Pages 自訂網域 [blog.amowu.com](https://blog.amowu.com)。

## Stack

Astro 6、Tailwind v4、daisyUI v5、MDX、Pagefind（搜尋）、Giscus（留言）、Expressive Code（程式碼）、Satori + @resvg/resvg-js（自動 OG 圖）。

## Requirements

Node.js >= 22.12.0、npm。

## Commands

```bash
npm install          # 安裝依賴
npm run dev          # Dev server at http://localhost:4321/
npm run build        # Production build to ./dist/ + Pagefind index
npm run preview      # Preview production build locally
npm run typecheck    # astro check
npm run lint         # ESLint
npm run format       # Prettier write
```

## Project Structure

```
src/
├── assets/                       # 站台 image、font 等資產（會走 Astro pipeline）
├── components/                   # 主題元件
├── content/
│   ├── posts/zh-tw/<slug>/       # 88+ 篇文章，每篇一個資料夾
│   │   ├── index.md
│   │   └── *.png                 # 文章內圖片，relative path 引用
│   └── pages/zh-tw/              # 靜態頁面（about 等）
├── layouts/
├── pages/                        # 路由
├── styles/global.css             # daisyUI tokens、字型 stack、layout token
├── i18n/ui.ts                    # 介面字串字典
├── config.ts                     # SITE、NAV、SOCIALS、GISCUS、PAGEFIND
└── utils/og-image.ts             # Satori OG 圖生成（內嵌 Noto Sans TC）

public/                           # 靜態檔（favicon、manifest、robots.txt 等）
.github/workflows/deploy.yml      # 自動部署
```

## Environment Variables

範本見 `.env.example`。完整說明見 [CLAUDE.md](CLAUDE.md#environment-variables)。

| Var | 用途 |
|---|---|
| `SITE_URL` | Production URL |
| `BASE_PATH` | 子路徑（自訂網域用 `/`）|
| `PUBLIC_GISCUS_*` | Giscus 留言設定 |

## Deployment

Push 到 `main` 觸發 `.github/workflows/deploy.yml`，build 後部署到 GitHub Pages。

## 設計與規格文件

- Spec：[`docs/superpowers/specs/2026-05-23-chirping-astro-migration-design.md`](docs/superpowers/specs/2026-05-23-chirping-astro-migration-design.md)
- Plan：[`docs/superpowers/plans/2026-05-23-chirping-astro-migration.md`](docs/superpowers/plans/2026-05-23-chirping-astro-migration.md)

## Credits

主題基於 [Chirping Astro](https://github.com/kannansuresh/chirping-astro)（MIT），fork 自 chirping-astro-starter。
