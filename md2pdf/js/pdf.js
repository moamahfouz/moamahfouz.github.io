import { FONT_URL } from './render.js';

function waitForImage(image) {
  if (image.complete) return Promise.resolve();
  return new Promise(resolve => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
  });
}

// Serialize styles as DOM text, preventing a CSS </style> from becoming markup.
function buildDocument(html, baseCSS, customCSS) {
  const doc = document.implementation.createHTMLDocument('Markdown to PDF');
  doc.documentElement.lang = 'en';
  const charset = doc.createElement('meta');
  charset.setAttribute('charset', 'utf-8');
  const base = doc.createElement('base');
  base.href = document.baseURI;
  const fonts = doc.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = FONT_URL;
  doc.head.prepend(charset, base);
  doc.head.append(fonts);
  // Raw-text style elements require escaping '<' before HTML serialization.
  for (const css of [baseCSS, customCSS]) {
    const style = doc.createElement('style');
    style.textContent = css.replace(/</g, '\\3c ');
    doc.head.append(style);
  }
  const article = doc.createElement('article');
  article.className = 'document';
  article.dir = 'auto';
  article.innerHTML = html;
  doc.body.append(article);
  return '<!doctype html>' + doc.documentElement.outerHTML;
}

export async function generatePDF(html, baseCSS, customCSS) {
  const frame = document.createElement('iframe');
  frame.title = 'PDF print document';
  frame.setAttribute('aria-hidden', 'true');
  // Keep it laid out for browser printing; display:none breaks some engines.
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;pointer-events:none;';
  let cleanupTimer;
  const cleanup = () => { clearTimeout(cleanupTimer); frame.remove(); };
  try {
    const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
    frame.srcdoc = buildDocument(html, baseCSS, customCSS);
    document.body.append(frame);
    await loaded;
    const doc = frame.contentDocument;
    await Promise.all([doc.fonts.ready, ...Array.from(doc.images, waitForImage)]);
    // Force layout and explicitly request both Latin and Arabic font faces.
    await Promise.all([
      doc.fonts.load('400 11pt "Inter"', 'Markdown'),
      doc.fonts.load('400 11pt "Cairo"', 'العربية'),
      doc.fonts.load('400 11pt "Noto Naskh Arabic"', 'العربية'),
    ]).catch(() => {}); // Local system fonts remain usable if Google Fonts is unavailable.
    await new Promise(resolve => frame.contentWindow.requestAnimationFrame(() => frame.contentWindow.requestAnimationFrame(resolve)));
    frame.contentWindow.addEventListener('afterprint', cleanup, { once: true });
    // Fallback for engines which omit afterprint; never remove on print() return.
    cleanupTimer = setTimeout(cleanup, 10 * 60 * 1000);
    frame.contentWindow.focus();
    frame.contentWindow.print();
  } catch (error) {
    cleanup();
    throw error;
  }
}
