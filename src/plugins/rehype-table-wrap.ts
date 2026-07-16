/**
 * rehype-table-wrap — wraps every `<table>` in a horizontally scrollable
 * `<div class="table-wrap">`.
 *
 * Why: a CSS table can never be laid out narrower than its min-content
 * width, so `width: 100%` does NOT stop a wide table from overflowing on
 * mobile. Any unbreakable cell content (a long `<code>` token, an image)
 * pins the table wider than the article column, and because nothing between
 * the table and `<html>` clips, the overflow propagates all the way up and
 * the whole page scrolls sideways.
 *
 * Giving the table its own scroll container confines that overflow. The
 * wrapper is a plain `<div>` rather than `overflow-x` on the table itself:
 * scrolling a table requires `display: block`, which drops the element's
 * implicit ARIA table role in most browsers.
 *
 * The wrapper is focusable (`tabindex="0"` + a labelled `role="region"`) so
 * keyboard users can reach and scroll it — a scrollable region that only a
 * pointer can pan fails WCAG 2.1.1.
 *
 * Paired with `.table-wrap` in src/styles/global.css.
 */

import { SITE, type Locale } from '../config';
import { messages } from './../i18n/ui';

type Element = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Element[];
};

type VFile = { path?: string; history?: string[] };

const LOCALES: readonly string[] = SITE.locales;

/**
 * Content lives at src/content/<collection>/<locale>/…, so the locale is
 * recoverable from the file path. Falls back to the default locale for
 * anything rendered outside a content collection.
 */
function localeFromPath(file: VFile): Locale {
  const path = file.path ?? file.history?.[0] ?? '';
  for (const seg of path.split(/[\\/]/)) {
    if (LOCALES.includes(seg)) return seg as Locale;
  }
  return SITE.defaultLocale;
}

export function rehypeTableWrap() {
  return (tree: Element, file: VFile) => {
    const label = messages[localeFromPath(file)]['post.tableScroll'];

    function visit(node: Element) {
      if (!Array.isArray(node.children)) return;

      const wrapped: Element[] = [];
      for (const child of node.children) {
        // Recurse first: a wrapped table must not be re-visited, or nested
        // tables would each pick up a second wrapper.
        visit(child);

        if (child.type === 'element' && child.tagName === 'table') {
          wrapped.push({
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-wrap'],
              tabIndex: 0,
              role: 'region',
              'aria-label': label,
            },
            children: [child],
          });
        } else {
          wrapped.push(child);
        }
      }
      node.children = wrapped;
    }

    visit(tree);
  };
}
