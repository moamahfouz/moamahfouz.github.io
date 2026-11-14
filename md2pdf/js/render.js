export const FONT_URL = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;600;700&display=swap';

// Only sanitized HTML enters a connected document. Source styles belong in CSS mode.
export function renderMarkdown(source) {
  const html = window.DOMPurify.sanitize(window.marked.parse(source, { gfm: true }), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe', 'style', 'link', 'object', 'embed', 'form', 'input', 'button', 'textarea'],
    FORBID_ATTR: ['style', 'srcdoc', 'autofocus'],
  });
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,ul,ol,blockquote,table,th,td,div,section').forEach(element => {
    element.setAttribute('dir', 'auto');
  });
  template.content.querySelectorAll('pre').forEach(element => element.setAttribute('dir', 'ltr'));
  template.content.querySelectorAll('pre code').forEach(element => {
    if (window.hljs) window.hljs.highlightElement(element);
  });
  template.content.querySelectorAll('img').forEach(element => element.setAttribute('loading', 'eager'));
  return template.innerHTML;
}

export function createPreview(host, baseCSS) {
  const root = host.attachShadow({ mode: 'open' });
  const base = document.createElement('style');
  base.textContent = baseCSS;
  const custom = document.createElement('style');
  const article = document.createElement('article');
  article.className = 'document';
  article.dir = 'auto';
  root.append(base, custom, article);
  return (html, css) => {
    custom.textContent = css;
    article.innerHTML = html;
  };
}
