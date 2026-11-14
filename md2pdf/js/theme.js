(() => {
  const key = 'markdown-to-pdf.theme';
  const root = document.documentElement;
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch { /* Use dark mode when storage is unavailable. */ }
  root.dataset.theme = theme;

  document.addEventListener('DOMContentLoaded', () => {
    const picker = document.querySelector('.theme-picker');
    const options = picker.querySelectorAll('[data-theme-option]');
    const sync = () => {
      options.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeOption === theme)));
      document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#141416' : '#f4f6f4';
    };
    const close = () => { picker.open = false; };
    options.forEach(button => button.addEventListener('click', () => {
      theme = button.dataset.themeOption;
      root.dataset.theme = theme;
      sync();
      try {
        localStorage.setItem(key, theme);
        document.querySelector('#theme-status').textContent = '';
      } catch {
        document.querySelector('#theme-status').textContent = 'Storage unavailable; theme applies to this tab.';
        return;
      }
      close();
      picker.querySelector('summary').focus();
    }));
    document.addEventListener('click', event => {
      if (!picker.contains(event.target)) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && picker.open) {
        close();
        picker.querySelector('summary').focus();
      }
    });
    sync();
  }, { once: true });
})();
