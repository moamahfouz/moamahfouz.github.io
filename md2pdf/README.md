# Markdown to PDF

A static Markdown editor with an isolated live preview and native browser PDF printing. Plain HTML, CSS and JavaScript; no backend, framework, build step or npm dependencies.

## Run locally

From this directory:

```sh
python -m http.server 8000
```

Open http://localhost:8000. Use a static server rather than opening `index.html` as a `file://` URL: ES modules and the shared stylesheet fetch require HTTP. An internet connection is needed for CDN libraries and Google Fonts.

## Deploy on GitHub Pages

1. Create a public GitHub repository (public repositories support Pages on free accounts).
2. Commit these files at the repository root and push to `main`.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose **main**, then **/ (root)** and save.
5. Open `https://<username>.github.io/<repo>/` after deployment completes.

All app paths are relative, including module imports and the shared stylesheet. The empty `.nojekyll` file disables Jekyll processing. No Actions workflow is required.

## Search engine metadata

The page includes a descriptive title, meta description, visible heading and introduction, Open Graph / Twitter sharing metadata, and WebApplication structured data describing the free converter. Suggested target phrases, based on the app's features (not measured search volumes): **Markdown to PDF**, **MD to PDF**, **free Markdown to PDF converter online**, **Markdown to PDF without signup**, **Markdown to PDF with custom CSS**, and **Arabic Markdown to PDF**. Use them naturally in useful content rather than repeating keyword lists. Google does not use the meta keywords tag for ranking, so it is intentionally omitted.

Once your production URL is known, add an absolute canonical link and an `og:url` meta tag to `index.html`, both pointing to the final public URL (including the repository path and trailing slash on GitHub Pages). Add that URL as `url` in the JSON-LD too. Avoid publishing placeholder URLs. Then verify the site in Google Search Console and request indexing of the homepage. Search engines decide how to display titles and descriptions; metadata does not guarantee rankings or rich results.

## Editing and exporting

- Type Markdown to update the preview after 150 ms. Switch to **Custom CSS** to style the document with selectors such as `h1`, `table` or `.document`.
- Markdown and CSS are saved to localStorage on this browser and origin. **Reset** confirms before restoring the sample. Private browsing or storage restrictions can prevent persistence; the status bar reports this.
- Tab inserts two spaces. Ctrl+P / Cmd+P opens the same PDF flow as **Generate PDF**.
- Choose **Save as PDF** in the browser print dialog. Use A4, default CSS margins, and disable browser headers/footers for a clean document. The app cannot control print dialog settings.

The print iframe receives sanitized HTML, shared document styles, custom CSS and Google Fonts. It waits for fonts and inline images, calls native `print()`, and is removed after `afterprint` (with a ten-minute fallback for missing browser events). Text stays selectable and Arabic shaping uses the browser text engine. Browser pagination avoids breaks within tables, code, quotations and images where possible; content taller than one printable page must still split. Custom CSS can override the defaults. CSS background images are not covered by the inline image loading wait.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Accessible two-pane UI and pinned CDN scripts |
| `css/style.css` | Responsive app chrome |
| `css/print.css` | Shared preview/print typography, RTL spacing, A4 pagination |
| `js/app.js` | Editing modes, debounce, shortcuts, reset and persistence |
| `js/render.js` | Parse, sanitize, block direction, highlighting and Shadow DOM preview |
| `js/pdf.js` | Isolated print document and resource readiness |

Versions verified against official stable releases: [marked 18.2.0](https://github.com/markedjs/marked/releases/tag/v18.2.0), [DOMPurify 3.4.17](https://github.com/cure53/DOMPurify/releases/tag/3.4.17), [highlight.js 11.12.0](https://github.com/highlightjs/highlight.js/releases/tag/11.12.0). All are loaded from exact jsDelivr URLs via script tags.

## Security and privacy

Markdown passes through DOMPurify before preview or printing. Scripts, event handlers, iframes, forms, embedded objects and source styles are removed. Highlighting operates on sanitized code. Custom CSS is inserted as style text and cannot terminate the print style element. Shadow DOM confines selectors to the preview; style the document using `.document` rather than `body`. Documents stay in the browser; externally referenced images, CSS URLs, libraries and fonts still make network requests. Treat custom CSS and remote resources as trusted inputs.

## Browser verification

Designed for current Chrome, Edge and Firefox using native Shadow DOM, ES modules, `document.fonts` and print APIs. For each browser, verify:

1. Edit both modes; confirm styles affect the preview while the toolbar stays unchanged.
2. Reload and verify both sources persist; cancel and confirm Reset separately.
3. Paste `<script>alert(1)</script><img src=x onerror=alert(1)><iframe src="https://example.com"></iframe>`; no code should execute and no iframe should remain.
4. Export the bilingual sample through the button and keyboard shortcut. Check RTL list markers, Arabic table columns, connected Arabic letters, selectable text and A4 margins in the saved PDF.
5. Add several pages of content and confirm tables/code move together when they fit on a page. Test narrow widths below 800px and keyboard focus visibility.

Native print dialogs and final PDF appearance require manual browser verification.
