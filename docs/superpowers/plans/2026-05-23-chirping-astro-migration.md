# Chirping Astro 主題遷移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把現有自訂 Astro blog 遷移到 Chirping Astro 主題，保留 88 篇歷史文章與 `blog.amowu.com` 自訂網域。

**Architecture:** 在 `feature/chirping-astro` branch 內就地替換：scaffold Chirping starter 到 `/tmp`，選擇性 copy 進現有 repo（保留 `.git` / 文章內容 / `CLAUDE.md`），改名 `src/content/blog` → `src/content/posts/zh-tw`，重寫設定檔，刪除範例與雙語內容。CJK 字型走 system stack，唯一例外是 Satori OG image 必須 bundle Noto Sans TC。

**Tech Stack:** Astro 6、Tailwind v4、daisyUI v5、MDX、Pagefind、Giscus、Expressive Code、Satori + @resvg/resvg-js、npm。

**Spec reference:** [`docs/superpowers/specs/2026-05-23-chirping-astro-migration-design.md`](../specs/2026-05-23-chirping-astro-migration-design.md)

---

## 注意事項

- **Verification 重於 TDD。** 這是靜態網站主題遷移，沒有要寫單元測試。每個 task 的驗證方式是「build 跑得起來 + 抽查輸出 + smoke test」。
- **每個 task 結束 commit。** 中間 break 不會掉太多進度，回滾單位也清楚。
- **不要主動 bump dependency 版本。** Chirping starter 鎖什麼版本就用什麼版本。
- **本機要有 npm + Node >= 22.12.0。**
- 所有路徑以 `/Users/amowu/Documents/Personal/blog` 為 repo root（後面簡稱 `$REPO`）。

---

## Phase 0：前置確認

### Task 0: 確認工作環境

**Files:** 無

- [ ] **Step 1: 確認在正確的 branch 與乾淨的工作目錄**

```bash
cd /Users/amowu/Documents/Personal/blog
git status
git branch --show-current
```

Expected: 在 `feature/chirping-astro` branch，working tree clean（或只有 spec 修改未 commit）。如有未 commit 改動先 stash 或 commit。

- [ ] **Step 2: 確認 Node 與 npm 版本**

```bash
node --version  # 應該 >= v22.12.0
npm --version   # 任意版本即可
```

- [ ] **Step 3: 確認 `npx create-astro` 能跑**

```bash
npx --yes create-astro@latest --help | head -20
```

Expected: 看到 create-astro 的 help 訊息（含 `--template` flag）。

---

## Phase 1：Scaffold + 內容搬家

### Task 1: Scaffold Chirping starter 到 /tmp

**Files:** 無 repo 變更（暫存目錄）

- [ ] **Step 1: 清除可能殘留的暫存目錄**

```bash
rm -rf /tmp/chirping-tmp
```

- [ ] **Step 2: Scaffold**

```bash
cd /tmp
npx --yes create-astro@latest chirping-tmp \
  --template kannansuresh/chirping-astro-starter \
  --no-install --no-git --skip-houston --yes
```

Expected: 在 `/tmp/chirping-tmp/` 產生完整的 starter 目錄。執行時間約 10-30 秒。

> **如果 scaffold 工具不認得 `--no-git` / `--skip-houston` flag：** 改用 `git clone https://github.com/kannansuresh/chirping-astro-starter.git /tmp/chirping-tmp && rm -rf /tmp/chirping-tmp/.git`。

- [ ] **Step 3: 確認 scaffold 產出**

```bash
ls /tmp/chirping-tmp/src/
ls /tmp/chirping-tmp/
test -f /tmp/chirping-tmp/src/config.ts && echo "config.ts OK"
test -f /tmp/chirping-tmp/astro.config.mjs && echo "astro.config.mjs OK"
test -d /tmp/chirping-tmp/src/content/posts/en && echo "posts/en OK"
test -f /tmp/chirping-tmp/.github/workflows/deploy.yml && echo "deploy.yml OK"
```

Expected: `src/` 含 `components/`、`layouts/`、`pages/`、`styles/`、`utils/`、`plugins/`、`i18n/`、`types/`、`config.ts`、`content.config.ts`、`env.d.ts`、`assets/`、`content/`，根目錄含 `package.json`、`astro.config.mjs`、`tsconfig.json`、`.env.example`、`.github/`。

### Task 2: Copy theme code 進 repo

**Files affected:** 整個 `src/` 大部分目錄會新增/覆蓋，根目錄會新增/覆蓋設定檔

- [ ] **Step 1: 設環境變數方便後續指令**

```bash
export REPO=/Users/amowu/Documents/Personal/blog
export SRC=/tmp/chirping-tmp
```

- [ ] **Step 2: Copy src/ 子目錄（components / layouts / pages / styles / utils / plugins / i18n / types）**

```bash
cp -R $SRC/src/components $REPO/src/
cp -R $SRC/src/layouts    $REPO/src/
cp -R $SRC/src/pages      $REPO/src/
cp -R $SRC/src/styles     $REPO/src/
cp -R $SRC/src/utils      $REPO/src/
cp -R $SRC/src/plugins    $REPO/src/ 2>/dev/null || true
cp -R $SRC/src/i18n       $REPO/src/
cp -R $SRC/src/types      $REPO/src/ 2>/dev/null || true
```

- [ ] **Step 3: Copy 設定型檔案到 src/**

```bash
cp $SRC/src/config.ts          $REPO/src/
cp $SRC/src/content.config.ts  $REPO/src/
cp $SRC/src/env.d.ts           $REPO/src/
```

- [ ] **Step 4: Copy 圖片資產目錄（avatar、favicon 等的 Chirping 預設）**

```bash
cp -R $SRC/src/assets/images $REPO/src/assets/
```

- [ ] **Step 5: Copy 根目錄設定檔（package.json / astro.config.mjs / tsconfig.json / .env.example / lint+format / .github）**

```bash
cp $SRC/package.json     $REPO/
cp $SRC/astro.config.mjs $REPO/
cp $SRC/tsconfig.json    $REPO/
cp $SRC/.env.example     $REPO/
cp $SRC/eslint.config.*  $REPO/ 2>/dev/null || true
cp $SRC/.prettierrc*     $REPO/ 2>/dev/null || true
cp $SRC/.prettierignore  $REPO/ 2>/dev/null || true
cp -R $SRC/.github       $REPO/
```

- [ ] **Step 6: 確認重要檔案都進來了**

```bash
cd $REPO
test -f src/config.ts && echo "config.ts OK"
test -d src/components && echo "components/ OK"
test -d src/i18n && echo "i18n/ OK"
test -f astro.config.mjs && echo "astro.config.mjs OK"
test -f .env.example && echo ".env.example OK"
test -f .github/workflows/deploy.yml && echo "deploy.yml OK"
```

Expected: 每行印出 OK。

- [ ] **Step 7: 看一下 git status 大致確認改動範圍**

```bash
git status --short | head -40
```

Expected: 大量新增（`??`）與修改（`M`）。`src/content/blog/` 不該出現在這列表（內容沒動）。

### Task 3: 搬家文章內容 + 清除範例內容 + 清除舊資產

**Files:**
- Modify: `src/content/blog/` → `src/content/posts/zh-tw/`（git rename）
- Delete: `src/content/posts/en/`、`src/content/posts/fr/`、`src/content/pages/fr/`、`src/pages/fr/`、`src/assets/fonts/atkinson-*`、`src/consts.ts`、`src/assets/fonts/`（若空）

- [ ] **Step 1: 把現有 88 篇文章搬到 Chirping 的 locale 目錄結構**

```bash
cd $REPO
mkdir -p src/content/posts
git mv src/content/blog src/content/posts/zh-tw
```

Expected: 不報錯。`git status` 應該看到大量 `R`（rename）。

- [ ] **Step 2: 確認搬家成功**

```bash
ls src/content/posts/zh-tw | head -5
test -d src/content/blog && echo "WARN: blog/ 還在" || echo "blog/ 已搬走"
test -f src/content/posts/zh-tw/2009-05-20-strategy-pattern-20/index.md && echo "舊文 OK"
```

Expected: 看到舊文 slug、`blog/ 已搬走`、`舊文 OK`。

- [ ] **Step 3: 刪除 Chirping 帶來的英文 / 法文範例文**

```bash
rm -rf src/content/posts/en
rm -rf src/content/posts/fr
rm -rf src/content/pages/fr 2>/dev/null || true
rm -rf src/pages/fr 2>/dev/null || true
```

- [ ] **Step 4: 確認 src/content/posts/ 只剩 zh-tw**

```bash
ls src/content/posts/
```

Expected: 只列出 `zh-tw`（可能還有 `pages/` 如果結構不同，那是 OK 的）。

- [ ] **Step 5: 刪除 Atkinson 字型與 consts.ts**

```bash
rm -f src/assets/fonts/atkinson-regular.woff
rm -f src/assets/fonts/atkinson-bold.woff
rm -f src/consts.ts
# 如果 fonts/ 變空就一起刪
rmdir src/assets/fonts 2>/dev/null || true
```

Expected: 不報錯。

- [ ] **Step 6: Commit Phase 1**

```bash
git add -A
git commit -m "$(cat <<'EOF'
搬入 Chirping Astro starter 並重組內容目錄

- 從 chirping-astro-starter scaffold 出 layouts/components/styles/utils/i18n/plugins/types
- 搬入 config.ts / content.config.ts / env.d.ts / astro.config.mjs / package.json / tsconfig.json / .env.example
- 帶入 .github/workflows/deploy.yml（含 Pagefind index step）
- src/content/blog → src/content/posts/zh-tw（保留 git rename）
- 刪除範例 posts/en、posts/fr、pages/fr、src/pages/fr
- 刪除 Atkinson 字型與舊 consts.ts

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit 成功。

---

## Phase 2：合併設定檔 + 安裝

### Task 4: 修 tsconfig.json（移除 @types/bun）

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: 讀目前的 tsconfig.json 確認結構**

```bash
cat $REPO/tsconfig.json
```

Expected: 看到 `"types": ["astro/client", "@types/bun"]` 那一行（或類似）。

- [ ] **Step 2: 把 `@types/bun` 從 types 陣列移除**

打開 `tsconfig.json`，把 `"types": ["astro/client", "@types/bun"]` 改成 `"types": ["astro/client"]`。其他欄位不動。

- [ ] **Step 3: 確認**

```bash
grep -A1 '"types"' $REPO/tsconfig.json
```

Expected: 看到 `"types": ["astro/client"]`，沒有 `@types/bun`。

### Task 5: 合併 .gitignore

**Files:**
- Modify: `.gitignore`

> Task 2 Step 5 **沒有** copy `.gitignore`（避免蓋掉自訂的 `medium-export-*` 排除），所以這裡 repo 的 `.gitignore` 仍是原本那份。Task 5 要主動把 Chirping 的項目加進來。

- [ ] **Step 1: 確認目前的 .gitignore 內容**

```bash
cat $REPO/.gitignore
```

Expected: 看到原本的內容，含 `medium-export-...` 那一行。

- [ ] **Step 2: 寫一份合併後的 .gitignore**

以 Chirping 版為基底（內含 `bun.lockb`、`pagefind/`、`.env.local` 等），加回你原本 .gitignore 裡的自訂項（`medium-export-...`）。完整內容如下：

```
# build output
dist/
.output/
.vercel/
.netlify/

# generated types
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# environment variables
.env
.env.local
.env.production
.env.development

# editor
.idea/

# os
.DS_Store
Thumbs.db

# bun
bun.lockb
.bun-cache/

# pagefind cache
pagefind/

# misc
*.log

# medium export (local working copy, do not commit)
medium-export-267691624371025aa03d686595aa31a7565514e7142ce6cecdc42e703924e08a/
```

把這份內容寫入 `$REPO/.gitignore`。

- [ ] **Step 3: 驗證 medium-export 沒被 git 追到**

```bash
cd $REPO
git status --ignored | grep medium-export
```

Expected: 看到 `medium-export-267691...` 在 ignored 區，**不在**未追蹤 / 已修改區。

### Task 6: 安裝 dependencies

**Files:**
- Modify: `package.json`（Task 2 已覆蓋）
- Create: `package-lock.json`（npm install 產生）

- [ ] **Step 1: 先確認 package.json 看起來合理**

```bash
cd $REPO
cat package.json | head -30
```

Expected: `dependencies` 含 `astro`、`tailwindcss`、`daisyui`、`@astrojs/mdx`、`astro-expressive-code`、`pagefind`、`satori`、`@resvg/resvg-js` 等。

- [ ] **Step 2: 把 `package.json` 的 `engines.node` 加回來（若被 Chirping 版覆蓋掉了）**

確認 `package.json` 有：

```json
"engines": {
  "node": ">=22.12.0"
}
```

如果沒有，加進去。

- [ ] **Step 3: npm install**

```bash
cd $REPO
rm -f package-lock.json
npm install
```

Expected: 安裝成功。可能有 deprecation warning，OK。如有 `ERESOLVE` 錯誤，**先停下來**回報細節，不要強推 `--force` / `--legacy-peer-deps`。

- [ ] **Step 4: 確認關鍵套件都裝了**

```bash
ls node_modules/astro node_modules/tailwindcss node_modules/daisyui node_modules/pagefind node_modules/satori node_modules/@resvg/resvg-js >/dev/null && echo "deps OK"
```

Expected: 印 `deps OK`。

### Task 7: 設定 src/config.ts

**Files:**
- Modify: `src/config.ts`

- [ ] **Step 1: 讀目前的 src/config.ts 看結構**

```bash
cat $REPO/src/config.ts
```

仔細看欄位名稱與 export 形式（可能是 `export const SITE = { ... }` 或一整個 `export default`）。下面的編輯需要對齊它的實際結構。

- [ ] **Step 2: 編輯 SITE 區塊（站台基本資料）**

把 SITE 物件改成（保留原本其他欄位，只覆蓋這幾個 key）：

```ts
title: 'Amo Wu',           // 或你想要的站名
description: 'Amo Wu 的部落格',
url: process.env.SITE_URL ?? 'https://blog.amowu.com',
basePath: process.env.BASE_PATH ?? '/',
defaultLocale: 'zh-tw',
locales: ['zh-tw'],
multilingual: false,
autoOgImage: true,
```

> 如果現有 title/description 來自舊的 `src/consts.ts`，回想一下你原本怎麼寫的，或從 git 歷史抓：`git show main:src/consts.ts`

- [ ] **Step 3: 編輯 author 區塊**

把 `SITE.author`（或同等位置）改成：

```ts
author: {
  name: 'Amo Wu',
  // avatar 等 Task 11 處理頭像時再回來補
},
```

- [ ] **Step 4: 編輯 NAV / SOCIAL 區塊（如果有）**

- NAV：保留 Chirping 預設（Home / Posts / Tags / Categories / About），文字若是英文可改成中文（Home → 首頁、Posts → 文章、Tags → 標籤、Categories → 分類、About → 關於）
- SOCIAL：填你的 GitHub handle 等。如果 Chirping 是透過 env vars 注入就跳過

- [ ] **Step 5: TypeScript 編譯檢查**

```bash
cd $REPO
npx astro check 2>&1 | head -30
```

Expected: 不能有 type error（warning 可接受）。如有 error，依錯誤訊息修正 config.ts。

### Task 8: 設定 astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: 讀目前的 astro.config.mjs**

```bash
cat $REPO/astro.config.mjs
```

- [ ] **Step 2: 確認 / 加入這幾個關鍵設定**

`astro.config.mjs` 的 `defineConfig({ ... })` 內必須含：

```js
site: process.env.SITE_URL ?? 'https://blog.amowu.com',
base: process.env.BASE_PATH ?? '/',
i18n: {
  defaultLocale: 'zh-tw',
  locales: ['zh-tw'],
  routing: { prefixDefaultLocale: false },
},
```

`integrations` 陣列保留 Chirping 預設帶來的整合（`mdx()`、`sitemap()`、`expressiveCode({...})` 等）— 不要刪。

- [ ] **Step 3: 確認沒有殘留舊的 Atkinson font 區塊**

```bash
grep -n "atkinson\|Atkinson\|fontProviders" $REPO/astro.config.mjs
```

Expected: 沒輸出（已被 Chirping 版覆蓋）。如果還有，整個 `fonts: [...]` 區塊刪掉。

### Task 9: 建立 .env

**Files:**
- Create: `$REPO/.env`（不 commit，被 .gitignore 蓋）

- [ ] **Step 1: 從 .env.example 複製範本**

```bash
cd $REPO
cp .env.example .env
```

- [ ] **Step 2: 編輯 .env 填上自訂網域 + Giscus 先 disable**

打開 `$REPO/.env`，設成：

```
SITE_URL=https://blog.amowu.com
BASE_PATH=/
PUBLIC_GITHUB_HANDLE=amowu
PUBLIC_TWITTER_HANDLE=
PUBLIC_CONTACT_EMAIL=
PUBLIC_GISCUS_ENABLED=false
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

Giscus 先設 `false`，等 Phase 5 cutover 前再開（避免 dev 時跳出 setup 指引）。

- [ ] **Step 3: 確認 .env 在 .gitignore 內**

```bash
git check-ignore $REPO/.env && echo "ignored OK"
```

Expected: 印 `.env` 跟 `ignored OK`。

- [ ] **Step 4: Commit Phase 2**

```bash
cd $REPO
git add -A
git commit -m "$(cat <<'EOF'
合併 Chirping 設定檔並安裝依賴

- tsconfig.json：移除 @types/bun（本專案用 npm）
- .gitignore：合併 Chirping 與原本 medium-export 排除
- package.json：套用 Chirping deps、保留 engines.node >= 22.12.0
- src/config.ts：site 改 blog.amowu.com、locale 改 zh-tw、multilingual: false
- astro.config.mjs：site/base 注入環境變數、i18n.prefixDefaultLocale: false
- .env.example：commit 範本；.env 本地產生並暫時關閉 Giscus

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit 成功。注意 `.env` 不該出現在 commit 內容。

```bash
git show --stat HEAD | grep "\.env" | grep -v ".env.example"
```

Expected: 沒輸出（`.env` 沒被 commit）。

---

## Phase 3：資產與 CJK 適配

### Task 10: Favicon / Apple touch icon / Web manifest 處理

**Files:**
- Modify: `src/assets/images/site/favicon.svg`（Chirping 慣例）
- Move: `public/favicon.svg` → `src/assets/images/site/favicon.svg`
- Keep in `public/`：`favicon.ico`、`apple-touch-icon.png`、`favicon-96x96.png`、`web-app-manifest-*.png`、`site.webmanifest`（這些 Chirping 不會自動接管，留在 public/ 由 `<head>` 引用）

- [ ] **Step 1: 用你現有的 favicon.svg 覆蓋 Chirping 預設**

```bash
cd $REPO
cp public/favicon.svg src/assets/images/site/favicon.svg
```

- [ ] **Step 2: 處理 favicon.svg 在 public/ 的重複**

Chirping 預設透過 `src/assets/images/site/favicon.svg` 引用 → 走 Astro image pipeline。但 `public/favicon.svg` 留著也無害，瀏覽器會優先讀 `<head>` 指定的那個。**保留 `public/favicon.svg`** 避免任何寫死 `/favicon.svg` 的舊連結壞掉。

- [ ] **Step 3: 確認其他 icon / manifest 還在 public/**

```bash
ls $REPO/public/
```

Expected: 看到 `apple-touch-icon.png`、`favicon-96x96.png`、`favicon.ico`、`favicon.svg`、`site.webmanifest`、`web-app-manifest-192x192.png`、`web-app-manifest-512x512.png`。

- [ ] **Step 4: 檢查 BaseLayout 是否需要補上多餘 icon 連結**

```bash
grep -rn "apple-touch-icon\|webmanifest\|favicon-96" $REPO/src/layouts/ $REPO/src/components/ 2>/dev/null
```

如果 grep 沒結果，Chirping 預設沒引用這些。**現在不做修改**，等 Phase 4 npm run dev 時看 DevTools Network tab 確認 favicon 有載到，再決定要不要在 BaseLayout 加 `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` 等。

- [ ] **Step 5: Avatar 暫用 Chirping 預設**

`src/assets/images/site/avatar.svg`（Chirping 帶的）暫時保留。你想換成自己的頭像，把檔案覆蓋進去同位置即可，**檔名必須相同**否則要改 config.ts 的引用。

### Task 11: 設定 CJK system font stack

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 找 global.css 內的字型設定**

```bash
grep -n "font-sans\|--font\|font-family" $REPO/src/styles/global.css | head -10
```

- [ ] **Step 2: 加入 / 替換 `--font-sans` 為 CJK system stack**

在 `src/styles/global.css` 的 `@theme` 區塊內（如果沒有就新增一個 `@theme { ... }` 區塊放在檔案開頭附近）加入：

```css
@theme {
  --font-sans: ui-sans-serif, system-ui, -apple-system,
               'PingFang TC', 'Microsoft JhengHei',
               'Noto Sans CJK TC', sans-serif;
}
```

如果原本已有 `--font-sans`，把它整行替換成上面的字串。

- [ ] **Step 3: 確認**

```bash
grep -A2 "font-sans" $REPO/src/styles/global.css | head -5
```

Expected: 看到 `PingFang TC` / `Microsoft JhengHei` 等中文 fallback。

### Task 12: Satori OG image 內嵌 Noto Sans TC

**Files:**
- Create: `src/assets/fonts/NotoSansTC-Regular.otf`（從 Google Fonts 下載）
- Modify: Chirping 的 OG image generator（位置需先找出）

- [ ] **Step 1: 找 OG image generator 的路徑**

```bash
cd $REPO
grep -rln "satori\|@resvg/resvg-js" src/ 2>/dev/null
```

Expected: 找到 1-2 個檔案，可能是 `src/pages/og/[...slug].png.ts` 或 `src/utils/og*.ts`。記下實際路徑（後續步驟用 `<og-generator-path>` 代稱）。

- [ ] **Step 2: 下載 Noto Sans TC Regular**

```bash
cd $REPO
mkdir -p src/assets/fonts
# Google Fonts 直接下載靜態 OTF（無 API key）
curl -L -o src/assets/fonts/NotoSansTC-Regular.otf \
  "https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/TC/NotoSansTC-Regular.otf"
ls -lh src/assets/fonts/NotoSansTC-Regular.otf
```

Expected: 檔案大小 8-12 MB。如下載失敗，從 https://fonts.google.com/noto/specimen/Noto+Sans+TC 手動下載一份 Regular 字重的 OTF/TTF 放同位置。

- [ ] **Step 3: 確認字型檔不被 .gitignore 排除**

```bash
git check-ignore src/assets/fonts/NotoSansTC-Regular.otf && echo "WARN: 被 ignore 了" || echo "OK 會被追蹤"
```

Expected: 印 `OK 會被追蹤`。

- [ ] **Step 4: 讀 OG image generator 確認 satori call 結構**

```bash
cat $REPO/<og-generator-path>
```

仔細看 `satori(...)` 的呼叫，看 `fonts` 陣列目前長怎樣（Chirping 預設可能載了某個 Latin font）。

- [ ] **Step 5: 在 satori call 的 fonts 陣列**加入** Noto Sans TC（不取代原本的 Latin font）

在 `<og-generator-path>` 開頭加入：

```ts
import fs from 'node:fs/promises';
import path from 'node:path';

const notoSansTcData = await fs.readFile(
  path.resolve('./src/assets/fonts/NotoSansTC-Regular.otf')
);
```

並在 `satori(...)` 呼叫的 `fonts` 陣列**加一筆**（不取代既有的 Latin font 設定）：

```ts
fonts: [
  // ... 原本 Chirping 帶的 fonts 留著
  {
    name: 'Noto Sans TC',
    data: notoSansTcData,
    weight: 400,
    style: 'normal',
  },
],
```

- [ ] **Step 6: 確保 OG image 的 JSX 用得到這個字型**

在 satori 的 JSX root element 加 `style={{ fontFamily: 'Noto Sans TC, sans-serif' }}` 或在現有 fontFamily 後面 append `, Noto Sans TC`。

> 若不確定如何修改，**先讀完整個 og generator 一次**再決定插入點。Satori 會依字型 fallback 找字，所以 Latin 字仍會走原本字型，CJK 字會 fall through 到 Noto Sans TC。

- [ ] **Step 7: 試 build 一張 OG 圖驗證**

```bash
cd $REPO
npm run build 2>&1 | tail -30
```

Expected: build 不報錯。如果掛在 OG image 生成步驟，回到 Step 5/6 檢查。

- [ ] **Step 8: 開幾張 OG 圖看中文字**

```bash
ls $REPO/dist | grep -i og
# 找到 og image 路徑後，用系統預覽
open $REPO/dist/og/<隨便一篇有中文標題的>.png 2>/dev/null
# 或
find $REPO/dist -name "*.png" -path "*og*" | head -3 | xargs -I{} open {}
```

Expected: 圖片裡的中文標題顯示正常，不是方塊。

- [ ] **Step 9: Commit Phase 3**

```bash
cd $REPO
git add -A
git commit -m "$(cat <<'EOF'
資產與 CJK 適配

- favicon.svg：用本站既有 SVG 覆蓋 Chirping 預設
- global.css：font-sans 改成 CJK 友善 system stack
- Satori OG image：bundle Noto Sans TC Regular（CI build 無 OS 字型，避免中文標題變方塊）

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4：本機驗證

### Task 13: Dev server smoke test

**Files:** 無

- [ ] **Step 1: 啟動 dev server**

```bash
cd $REPO
npm run dev
```

Expected: server 起在 `http://localhost:4321/`，無錯誤。如果有 error 訊息**停下來**回報。

> 接下來步驟需要瀏覽器手動驗證，請在另一個 terminal 視窗或瀏覽器操作。Dev server 持續執行。

- [ ] **Step 2: 開首頁**

開瀏覽器到 `http://localhost:4321/`：
- 首頁能載入、看到文章列表
- 中文字型顯示正常（行距、字重看起來舒服）
- 切換 dark mode 正常
- **沒有**語言切換器（multilingual: false 有生效）
- 側邊欄、導覽顯示中文（如果 Task 7 Step 4 改過 NAV）

- [ ] **Step 3: 抽查 5 篇舊文**

依序開：
- `http://localhost:4321/posts/2009-05-20-strategy-pattern-20/`
- `http://localhost:4321/posts/2013-08-06-coscup-2013/`
- `http://localhost:4321/posts/2020-09-04-hls-signed-cookies/`
- `http://localhost:4321/posts/2024-05-18-heptabase/`
- `http://localhost:4321/posts/2026-05-04-drm/`

每篇確認：
- title、date、description 顯示正確
- heroImage 有圖的能顯示
- 程式碼區塊有 Expressive Code 樣式（檔名 bar、複製按鈕、語法反白）
- 內文中的圖片（`./image1.png` 之類的）顯示正常
- TOC 側邊欄顯示 H2-H4 章節（有 heading 的話）

> **如果 URL 不是 `/posts/<slug>/`：** 把實際 URL 結構記下來，回報。可能要回去調整 i18n 設定。

- [ ] **Step 4: 檢查 /tags 與 /categories 路由不會 500**

開 `http://localhost:4321/tags/` 與 `http://localhost:4321/categories/`：
- 不該 500
- 預期是空頁或 placeholder（88 篇舊文沒有 tags/categories）

- [ ] **Step 5: 記錄發現**

把 Step 2-4 任何「看起來壞了」或「跟預期不符」的點寫下來。Dev mode 下 Pagefind 搜尋通常不會運作（要 build 後才有 index），暫時跳過。

- [ ] **Step 6: 關掉 dev server**

回到 dev server terminal，按 `Ctrl+C`。

### Task 14: Production build 驗證

**Files:** 無

- [ ] **Step 1: Build**

```bash
cd $REPO
rm -rf dist
npm run build 2>&1 | tee /tmp/build.log | tail -50
```

Expected: 結尾有 `Complete!` 或類似訊息，無 error。Pagefind index 應該在 build 後跑（看 .github/workflows/deploy.yml 跟本機 build script 是否一致；如果本機沒跑 Pagefind，需要手動 `npx pagefind --site dist`）。

- [ ] **Step 2: 確認 dist 內容**

```bash
ls $REPO/dist | head -20
test -f $REPO/dist/index.html && echo "index OK"
test -d $REPO/dist/posts && echo "posts/ OK"
find $REPO/dist/posts -name "index.html" | wc -l  # 應該接近 88
test -f $REPO/dist/sitemap-index.xml && echo "sitemap OK"
```

Expected: 看到 `index OK` / `posts/ OK` / 88 左右篇 HTML / `sitemap OK`。

- [ ] **Step 3: 手動跑 Pagefind（如果 npm run build 沒包進去）**

```bash
cd $REPO
test -d dist/pagefind && echo "已有 pagefind index" || npx pagefind --site dist
ls dist/pagefind | head -5
```

Expected: 看到 `pagefind.js`、`pagefind-ui.js`、`fragment/`、`index/` 等。

- [ ] **Step 4: 確認 OG image 都有中文字**

```bash
find $REPO/dist -name "*.png" -path "*og*" | head -3
# 開幾張看
find $REPO/dist -name "*.png" -path "*og*" | head -3 | xargs -I{} open {}
```

Expected: 圖中中文標題正常顯示（不是方塊 / 缺字）。

- [ ] **Step 5: Preview production build**

```bash
cd $REPO
npm run preview
```

開 `http://localhost:4321/`（或 preview 印出的 port）：
- 搜尋功能能用（按搜尋按鈕/快捷鍵，搜「策略模式」「Cypress」），有結果
- 隨機開 1-2 篇文，整體看起來跟 dev mode 一致

按 `Ctrl+C` 關掉 preview。

### Task 15: 更新 CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: 讀目前 CLAUDE.md**

```bash
cat $REPO/CLAUDE.md
```

- [ ] **Step 2: 更新 CLAUDE.md 反映新架構**

要改的點：
- `GitHub Pages Base Path` 段：移除整段（現在用自訂網域 `blog.amowu.com`、base = `/`）。`import.meta.env.BASE_URL` 仍然有效但實際是 `/`
- `Blog Post Structure` 段：路徑從 `src/content/blog/YYYY-MM-DD-slug/` 改成 `src/content/posts/zh-tw/YYYY-MM-DD-slug/`
- `Content Schema` 段：用 Chirping 的 schema 取代（含 `tags`、`categories`、`toc`、`pinned` 等 optional 欄位 — 可以摘要寫，指向 `src/content.config.ts` 看完整版）
- `Commands` 段：保留 `npm run dev` / `npm run build` / `npm run preview`，**加** `npm run lint`、`npm run format`（Chirping 帶來的）
- 新增一段 `Theme` 簡介：說明這站基於 Chirping Astro，整合 Tailwind v4 + daisyUI v5 + Pagefind + Giscus + Expressive Code + Auto OG images
- 新增 `Environment Variables` 段：列 `SITE_URL`、`BASE_PATH`、`PUBLIC_GISCUS_*`，引用 `.env.example`

- [ ] **Step 3: Commit Phase 4**

```bash
cd $REPO
git add -A
git commit -m "$(cat <<'EOF'
更新 CLAUDE.md 反映 Chirping Astro 架構

- 移除 /blog base path 段（改用 blog.amowu.com 自訂網域）
- 內容路徑改 src/content/posts/zh-tw/
- Content schema 改指向 Chirping 版（src/content.config.ts）
- 加入 npm run lint / format / 環境變數說明 / theme 簡介

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5：Cutover

> **STOP — 在繼續之前：** Phase 4 全部通過？OG image 中文沒方塊？搜尋有結果？88 篇舊文抽查都 OK？沒問題才往下走 Phase 5。

### Task 16: 設定 Giscus（外部步驟）

**Files:** 無 repo 變更（在 GitHub / Giscus 網站操作）

- [ ] **Step 1: 確認 blog repo 的 GitHub Discussions 已啟用**

到 `https://github.com/amowu/blog/settings`（依實際 repo 名）→ Features → 勾選 Discussions。

> 若 blog repo 不是 public，Giscus 不會運作。確認是 public。

- [ ] **Step 2: 安裝 Giscus GitHub App**

到 `https://github.com/apps/giscus` → Install → 選 `amowu/blog` repo（或 All repos）。

- [ ] **Step 3: 到 giscus.app 產生設定值**

到 `https://giscus.app/`：
1. Repository 欄填 `amowu/blog`
2. Page ↔ Discussions Mapping 選 **pathname**
3. Discussion Category 選一個 announcement 類別（若沒有，先到 GitHub repo Discussions 建一個 e.g. "Comments"，Type 選 Announcement）
4. 其他選項看自己喜好

捲到下方「Enable giscus」區塊，記下這 4 個值：
- `data-repo`
- `data-repo-id`
- `data-category`
- `data-category-id`

- [ ] **Step 4: 設 GitHub Actions environment variables**

到 blog repo `Settings → Environments → github-pages → Environment variables` → 加 5 個：

| Name | Value |
|---|---|
| `PUBLIC_GISCUS_ENABLED` | `true` |
| `PUBLIC_GISCUS_REPO` | （從 giscus.app 抄）|
| `PUBLIC_GISCUS_REPO_ID` | （同上）|
| `PUBLIC_GISCUS_CATEGORY` | （同上）|
| `PUBLIC_GISCUS_CATEGORY_ID` | （同上）|

> **這些變數在 build time 注入到 client bundle**，不是 secret，用 environment variable 就好（不需要 secret）。

- [ ] **Step 5: 本機 .env 也填上（可選，方便本機預覽 Giscus）**

把 Step 3 拿到的 4 個值 + `PUBLIC_GISCUS_ENABLED=true` 填到 `$REPO/.env`，跑 `npm run dev` 開一篇文章拉到底，看 Giscus 留言區是否載入。

### Task 17: Merge 與線上驗證

**Files:** 無 repo 內變更（merge + 觀察）

- [ ] **Step 1: Push branch 到 remote**

```bash
cd $REPO
git push -u origin feature/chirping-astro
```

- [ ] **Step 2: 開 PR 或直接 merge**

如果你有 PR review 習慣：
```bash
gh pr create --title "Chirping Astro 主題遷移" --body "$(cat <<'EOF'
## Summary
- 把 blog 主題換成 Chirping Astro（Astro 6 + Tailwind v4 + daisyUI v5）
- 啟用 Pagefind 搜尋、Expressive Code、Auto OG images、Giscus 留言
- 88 篇舊文搬到 src/content/posts/zh-tw/，frontmatter 完全相容
- CJK 字型走 system stack，OG image bundle Noto Sans TC

Spec：docs/superpowers/specs/2026-05-23-chirping-astro-migration-design.md
Plan：docs/superpowers/plans/2026-05-23-chirping-astro-migration.md

## Test plan
- [x] 本機 dev / build / preview 全通過
- [x] 抽查 5 篇舊文（2009 / 2013 / 2020 / 2024 / 2026）
- [x] OG image 中文標題顯示正常
- [x] 搜尋功能可用（中英關鍵字）
- [ ] 線上 blog.amowu.com 驗證
- [ ] Giscus 留言運作

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

或直接 merge：
```bash
git checkout main
git merge --no-ff feature/chirping-astro -m "Chirping Astro 主題遷移"
git push origin main
```

- [ ] **Step 3: 監看 GitHub Actions deploy**

```bash
gh run watch
```

或到 `https://github.com/amowu/blog/actions` 看 workflow 跑完。

Expected: workflow 綠燈，deploy 成功。

- [ ] **Step 4: 線上 blog.amowu.com 驗證**

逐項打開驗證：
- `https://blog.amowu.com/` — 首頁
- 隨機 3 篇舊文 — 內容、heroImage、程式碼區塊
- 搜尋（搜「策略模式」「Cypress」）
- 滑到文章底部看 Giscus 留言區載入
- 用 https://opengraph.xyz/ 或 Twitter Card Validator 貼一篇文 URL，**確認 OG 圖中文不是方塊**

- [ ] **Step 5: 回滾備案（如果線上爛掉）**

如果線上有嚴重問題（首頁 500、舊文全壞），立刻：

```bash
cd $REPO
git checkout main
git revert -m 1 HEAD  # revert merge commit
git push origin main
```

等 Actions 重 deploy 後驗證舊版回來。然後回到 feature branch 修問題。

---

## 完成標準

- ✅ `blog.amowu.com` 線上可正常瀏覽
- ✅ 88 篇舊文 URL 都回 200
- ✅ 搜尋功能可用
- ✅ OG 圖中文正常顯示
- ✅ Giscus 留言區載入
- ✅ Dark mode 切換正常
- ✅ Spec / Plan 文件都 commit 在 repo

---

## 已知後續工作（不在本次 plan）

- URL 結構從 `/<slug>/` 變成 `/posts/<slug>/`（若有 SEO 顧慮，未來加 redirect 規則）
- 88 篇舊文逐篇補 tags / categories（未來新文順手做）
- `scripts/migrate-medium-export.py` 是否與 Chirping 結構相容（下次搬 Medium 文時再驗）
- 字型如不滿意純 system stack，可改 self-host Noto Sans TC（修 global.css + 加 fontProviders）
