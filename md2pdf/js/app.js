import { createPreview, renderMarkdown } from './render.js';
import { generatePDF } from './pdf.js';

const STORAGE_KEY = 'markdown-to-pdf.v1';
const SAMPLE = `# A little Markdown. A polished PDF.

Write freely, preview instantly, and turn your ideas into a document worth sharing.

## Your document, your way

- **Write** in Markdown on the left.
- **Style** your document with the Custom CSS tab.
- **Export** with Generate PDF, then choose Save as PDF.

> Simple tools make room for good ideas.

## مرحباً بالعالم

هذا مثال لنص عربي يدعم اتجاه الكتابة من اليمين إلى اليسار، مع تشكيل الحروف بشكل صحيح.

- اكتب أفكارك باللغة العربية.
- يمكنك الجمع بين العربية و English في المستند نفسه.

| الميزة | الوصف |
| --- | --- |
| المعاينة | تحديث مباشر أثناء الكتابة |
| التصدير | ملف PDF بنص قابل للتحديد |

## A small code example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("world"));
\`\`\`
`;
const DEFAULT_CSS = `h1 {
  font-size: 2.2em;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin: 1.5rem 0;
}

h2 {
  font-size: 1.8em;
  color: #34495e;
  margin: 1.5rem 0;
}

h3 {
  font-size: 1.4em;
  color: #455a64;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}
`;

function debounce(callback, delay) {
  let timer;
  return () => { clearTimeout(timer); timer = setTimeout(callback, delay); };
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (typeof saved?.markdown === 'string' && typeof saved?.css === 'string') return saved;
  } catch { /* Unavailable storage or invalid data: start with the sample. */ }
  return { markdown: SAMPLE, css: DEFAULT_CSS };
}

async function init() {
  const editor = document.querySelector('#editor');
  const label = document.querySelector('#editor-label');
  const status = document.querySelector('#status');
  const generate = document.querySelector('#generate');
  const markdownMode = document.querySelector('#markdown-mode');
  const cssMode = document.querySelector('#css-mode');
  const state = restore();
  let mode = 'markdown';
  let printing = false;
  let updatePreview;
  let baseCSS;
  editor.value = state[mode];

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      status.textContent = 'Saved on this device';
    } catch { status.textContent = 'Storage unavailable · edits remain in this tab'; }
  };
  const persist = debounce(save, 350);
  const render = () => {
    if (!updatePreview) return;
    try { updatePreview(renderMarkdown(state.markdown), state.css); }
    catch { status.textContent = 'Could not render this document.'; }
  };
  const scheduleRender = debounce(render, 150);

  function setMode(next) {
    mode = next;
    editor.value = state[mode];
    label.textContent = mode === 'markdown' ? 'Markdown source' : 'Custom CSS';
    editor.dir = mode === 'markdown' ? 'auto' : 'ltr';
    markdownMode.setAttribute('aria-pressed', String(mode === 'markdown'));
    cssMode.setAttribute('aria-pressed', String(mode === 'css'));
    editor.focus();
  }

  function onInput() {
    state[mode] = editor.value;
    scheduleRender();
    persist();
  }

  async function print() {
    if (printing || !updatePreview) return;
    printing = true;
    generate.disabled = true;
    status.textContent = 'Preparing print document…';
    try {
      await generatePDF(renderMarkdown(state.markdown), baseCSS, state.css);
      status.textContent = 'Print requested · choose Save as PDF';
    } catch { status.textContent = 'Printing failed. Please try again.'; }
    finally { printing = false; generate.disabled = false; }
  }

  editor.addEventListener('input', onInput);
  editor.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
    onInput();
  });
  markdownMode.addEventListener('click', () => setMode('markdown'));
  cssMode.addEventListener('click', () => setMode('css'));
  generate.addEventListener('click', print);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
      event.preventDefault();
      print();
    }
  });
  document.querySelector('#reset').addEventListener('click', () => {
    if (!window.confirm('Clear your saved Markdown and CSS and restore the sample?')) return;
    state.markdown = SAMPLE;
    state.css = DEFAULT_CSS;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled. */ }
    setMode('markdown');
    render();
    save();
  });
  window.addEventListener('pagehide', save);

  try {
    if (!window.marked || !window.DOMPurify) throw new Error('Libraries unavailable');
    const response = await fetch(new URL('../css/print.css', import.meta.url));
    if (!response.ok) throw new Error('Styles unavailable');
    baseCSS = await response.text();
    updatePreview = createPreview(document.querySelector('#preview'), baseCSS);
    render();
    generate.disabled = false;
    status.textContent = 'Ready · saved locally as you type';
  } catch {
    status.textContent = 'Could not load resources. Check your connection and use a static server.';
  }
}

// Deferred CDN scripts finish before DOMContentLoaded, including with ES modules.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
