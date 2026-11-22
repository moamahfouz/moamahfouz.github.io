const PDFJS_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/';

function pageToMarkdown(items) {
  const text = items.map(item => item.str + (item.hasEOL ? '\n' : '')).join('');
  const lines = text.split('\n').map(line => line.trim()
    .replace(/[\\`*_{}\[\]<>#|~&=+-]/g, '\\$&')
    .replace(/^(\d{1,9})([.)])/, '$1\\$2'));
  return lines.join('\n').trim().replace(/(?<=\S)\n(?=\S)/g, '  \n');
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
