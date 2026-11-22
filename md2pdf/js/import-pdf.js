const PDFJS_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/';

function escapeMarkdown(text) {
  return text.replace(/[\\`*_{}\[\]<>#|~&=+-]/g, '\\$&')
    .replace(/^(\d{1,9})([.)])/, '$1\\$2');
}

function readLines(items) {
  const lines = [];
  let text = '';
  let y;
  let size = 0;
  const finishLine = () => {
    lines.push({ text: text.trim(), y, size });
    text = '';
    y = undefined;
    size = 0;
  };

  for (const item of items) {
    const [a, b, c, d, , baseline] = item.transform ?? [];
    const fontSize = Math.hypot(c, d) || Math.hypot(a, b) || item.height || 0;
    const parts = item.str.split(/\r\n?|\n/);
    for (const [index, part] of parts.entries()) {
      if (index) finishLine();
      if (part.trim()) {
        if (Math.abs(baseline - y) > 0.7 * Math.max(size, fontSize)) finishLine();
        y ??= baseline;
        size = Math.max(size, fontSize);
      }
      text += part;
    }
    if (item.hasEOL) finishLine();
  }
  if (text) finishLine();
  return lines;
}

function formatLine(text) {
  const task = /^(?:[•●◦▪*-]\s+)?(☐|☑|☒|\[[ xX]\])\s+(.+)$/.exec(text);
  if (task) {
    const checked = /[☑☒x]/i.test(task[1]);
    return { type: 'list', markdown: '- [' + (checked ? 'x' : ' ') + '] ' + escapeMarkdown(task[2]) };
  }
  const bullet = /^(?:[•●◦▪‣]\s*|[-–*]\s+)(.+)$/.exec(text);
  if (bullet) return { type: 'list', markdown: '- ' + escapeMarkdown(bullet[1]) };
  const ordered = /^(\d{1,9})[.)]\s+(.+)$/.exec(text);
  if (ordered) return { type: 'list', markdown: ordered[1] + '. ' + escapeMarkdown(ordered[2]) };
  const quote = /^>\s+(.+)$/.exec(text);
  if (quote) return { type: 'quote', markdown: '> ' + escapeMarkdown(quote[1]) };
  return { type: 'text', markdown: escapeMarkdown(text) };
}

function pageToMarkdown(items) {
  const blocks = [];
  let previous;
  let type;
  let block;

  for (const line of readLines(items)) {
    if (!line.text) {
      previous = undefined;
      continue;
    }
    const formatted = formatLine(line.text);
    // PDF text items give us baselines, but rarely identify paragraph boundaries.
    const fontSize = Math.max(line.size, previous?.size ?? 0);
    const gap = Math.abs(line.y - previous?.y);
    const startsBlock = !previous || gap > 1.95 * fontSize || formatted.type !== type;

    if (!blocks.length || (startsBlock && formatted.type === 'text')) {
      blocks.push({ lines: ['# ' + escapeMarkdown(line.text)], separator: '' });
      block = undefined;
    } else {
      if (startsBlock || !block) {
        block = { lines: [], separator: formatted.type === 'text' ? '  \n' : '\n' };
        blocks.push(block);
      }
      block.lines.push(formatted.markdown);
    }
    previous = line;
    type = formatted.type;
  }

  return blocks.map(({ lines, separator }) => lines.join(separator)).join('\n\n');
}

export async function pdfToMarkdown(file) {
  const { getDocument, GlobalWorkerOptions } = await import(PDFJS_URL + 'build/pdf.mjs');
  GlobalWorkerOptions.workerSrc = PDFJS_URL + 'build/pdf.worker.mjs';
  const task = getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    cMapUrl: PDFJS_URL + 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: PDFJS_URL + 'standard_fonts/',
    wasmUrl: PDFJS_URL + 'wasm/',
  });

  try {
    const pdf = await task.promise;
    const pages = [];
    for (let number = 1; number <= pdf.numPages; number++) {
      const page = await pdf.getPage(number);
      const { items } = await page.getTextContent();
      const markdown = pageToMarkdown(items);
      if (markdown) pages.push(markdown);
      page.cleanup();
    }
    return pages.length ? pages.join('\n\n') + '\n' : '';
  } finally {
    await task.destroy();
  }
}
