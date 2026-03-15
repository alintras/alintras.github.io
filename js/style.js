(function () {
    const style = document.createElement('style');
    style.textContent = `
      :root { --bg:#ffffff; --fg:#131313; --border:#131313; --border-muted:#cccccc; }
      [data-theme="dark"] { --bg:#111111; --fg:#e0e0e0; --border:#555555; --border-muted:#444444; }
      body { background:var(--bg) !important; color:var(--fg) !important; }
    `;
    document.head.appendChild(style);
  
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  })();
  
  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIcon(next);
  }
  
  function setIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
      ? '<img src="/assets/smileys/vsun32b.PNG" style="width:18px;height:18px;vertical-align:-4px;image-rendering:pixelated;">'
      : '<img src="/assets/smileys/Moon.gif" style="width:18px;height:18px;vertical-align:-2px;image-rendering:pixelated;">';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    setIcon(document.documentElement.getAttribute('data-theme'));
  });