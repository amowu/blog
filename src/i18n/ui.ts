/**
 * UI dictionaries.
 * Add new locales by adding a key to `messages` and to `SITE.locales` in
 * src/config.ts. All keys must exist for every locale (TypeScript enforces it).
 */

import type { Locale } from '../config';

export const messages = {
  en: {
    'site.skipToContent': 'Skip to content',
    'nav.home': 'Home',
    'nav.posts': 'Posts',
    'nav.tags': 'Tags',
    'nav.categories': 'Categories',
    'nav.archives': 'Archives',
    'nav.about': 'About',
    'nav.search': 'Search',
    'nav.toggleMenu': 'Toggle menu',

    'theme.toggle': 'Toggle theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',

    'lang.switcher': 'Language',
    'lang.en': 'English',
    'lang.fr': 'French',

    'post.publishedOn': 'Published on',
    'post.updatedOn': 'Updated on',
    'post.readingTime': 'min read',
    'post.toc': 'Table of contents',
    'post.tableScroll': 'Table, scrollable',
    'post.tags': 'Tags',
    'post.categories': 'Categories',
    'post.previous': 'Previous',
    'post.next': 'Next',
    'post.comments': 'Comments',
    'post.commentsDisabled': 'Comments are disabled for this post.',
    'post.commentsSetupTitle': 'Comments need configuration',
    'post.commentsSetupBody':
      'Giscus is enabled but not yet configured. Add the repository details below to start collecting comments.',
    'post.commentsSetupStep1':
      'Visit `giscus.app` and select your public GitHub repository (Discussions must be enabled).',
    'post.commentsSetupStep2':
      'Copy the generated `data-repo-id`, `data-category` and `data-category-id` values.',
    'post.commentsSetupStep3':
      'Set the `PUBLIC_GISCUS_ENABLED`, `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY` and `PUBLIC_GISCUS_CATEGORY_ID` env vars in your `.env` file.',
    'post.commentsSetupStep4':
      'Rebuild the site — this notice will be replaced by the live comments thread.',
    'post.commentsSetupDocs': 'Open giscus.app',
    'post.share': 'Share',
    'post.copyLink': 'Copy link',
    'post.copied': 'Copied!',
    'post.author': 'Author',

    'list.allPosts': 'All posts',
    'list.empty': 'No posts found.',
    'list.tagPosts': 'Posts tagged',
    'list.categoryPosts': 'Posts in',
    'list.totalPosts': 'posts',
    'list.totalPostsOne': 'post',

    'pagination.previous': 'Previous page',
    'pagination.next': 'Next page',
    'pagination.page': 'Page',
    'pagination.of': 'of',

    'archives.title': 'Archives',
    'archives.empty': 'No posts yet.',

    'tags.title': 'Tags',
    'tags.empty': 'No tags yet.',

    'categories.title': 'Categories',
    'categories.empty': 'No categories yet.',

    'search.title': 'Search',
    'search.placeholder': 'Search the site',
    'search.openLabel': 'Open search',
    'search.closeLabel': 'Close search',
    'search.empty': 'No results.',
    'search.loading': 'Loading search…',
    'search.typeToStart': 'Type to search…',
    'search.hintShortcut': 'Press / anywhere to open search',
    'search.searching': 'Searching…',
    'search.noResultsFor': 'No results for',
    'search.resultsCount': 'results',
    'search.resultsCountOne': 'result',
    'search.hintNavigate': 'to navigate',
    'search.hintSelect': 'to open',
    'search.clearLabel': 'Clear',

    'code.copy': 'Copy',
    'code.copied': 'Copied',

    '404.title': 'Page not found',
    '404.description': 'The page you are looking for has flown away.',
    '404.cta': 'Back to home',

    'footer.poweredBy': 'Powered by',
    'footer.theme': 'Theme',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': 'All rights reserved.',
  },

  'zh-tw': {
    'site.skipToContent': '跳到內容',
    'nav.home': '首頁',
    'nav.posts': '文章',
    'nav.tags': '標籤',
    'nav.categories': '分類',
    'nav.archives': '封存',
    'nav.about': '關於',
    'nav.search': '搜尋',
    'nav.toggleMenu': '切換選單',

    'theme.toggle': '切換主題',
    'theme.light': '淺色',
    'theme.dark': '深色',
    'theme.system': '跟隨系統',

    'lang.switcher': '語言',
    'lang.en': '英文',
    'lang.fr': '法文',

    'post.publishedOn': '發布於',
    'post.updatedOn': '更新於',
    'post.readingTime': '分鐘閱讀',
    'post.toc': '目錄',
    'post.tableScroll': '表格，可左右捲動',
    'post.tags': '標籤',
    'post.categories': '分類',
    'post.previous': '上一篇',
    'post.next': '下一篇',
    'post.comments': '留言',
    'post.commentsDisabled': '這篇文章已關閉留言。',
    'post.commentsSetupTitle': '留言功能尚未設定',
    'post.commentsSetupBody':
      'Giscus 已啟用但尚未設定。請依照下方步驟填入 repo 資訊以開始收集留言。',
    'post.commentsSetupStep1':
      '前往 `giscus.app` 選取你的公開 GitHub repo（需要啟用 Discussions）。',
    'post.commentsSetupStep2':
      '複製產生的 `data-repo-id`、`data-category` 和 `data-category-id` 值。',
    'post.commentsSetupStep3':
      '在 `.env` 設定 `PUBLIC_GISCUS_ENABLED`、`PUBLIC_GISCUS_REPO`、`PUBLIC_GISCUS_REPO_ID`、`PUBLIC_GISCUS_CATEGORY` 與 `PUBLIC_GISCUS_CATEGORY_ID` 等環境變數。',
    'post.commentsSetupStep4': '重新 build 網站 — 這段提示會被替換成留言串。',
    'post.commentsSetupDocs': '打開 giscus.app',
    'post.share': '分享',
    'post.copyLink': '複製連結',
    'post.copied': '已複製！',
    'post.author': '作者',

    'list.allPosts': '所有文章',
    'list.empty': '沒有文章。',
    'list.tagPosts': '標籤文章',
    'list.categoryPosts': '分類文章',
    'list.totalPosts': '篇文章',
    'list.totalPostsOne': '篇文章',

    'pagination.previous': '上一頁',
    'pagination.next': '下一頁',
    'pagination.page': '第',
    'pagination.of': '頁，共',

    'archives.title': '封存',
    'archives.empty': '尚未有文章。',

    'tags.title': '標籤',
    'tags.empty': '尚未有標籤。',

    'categories.title': '分類',
    'categories.empty': '尚未有分類。',

    'search.title': '搜尋',
    'search.placeholder': '搜尋網站',
    'search.openLabel': '打開搜尋',
    'search.closeLabel': '關閉搜尋',
    'search.empty': '沒有結果。',
    'search.loading': '載入搜尋中…',
    'search.typeToStart': '輸入關鍵字搜尋…',
    'search.hintShortcut': '在任何地方按 / 打開搜尋',
    'search.searching': '搜尋中…',
    'search.noResultsFor': '找不到結果',
    'search.resultsCount': '個結果',
    'search.resultsCountOne': '個結果',
    'search.hintNavigate': '切換',
    'search.hintSelect': '開啟',
    'search.clearLabel': '清除',

    'code.copy': '複製',
    'code.copied': '已複製',

    '404.title': '找不到頁面',
    '404.description': '你要找的頁面飛走了。',
    '404.cta': '回到首頁',

    'footer.poweredBy': 'Powered by',
    'footer.theme': 'Theme',
    'footer.privacy': '隱私政策',
    'footer.copyright': 'All rights reserved.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof messages)['en'];
