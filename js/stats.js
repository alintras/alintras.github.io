// stats.js — visitor count + stay length widget
// Usage: initStats('element-id')  OR  initStats(domElement)
//
// Visitor count: hits.seeyoufarm.com (free, no account needed)
//   increments on each page load, returns today + total counts
// Stay length: sessionStorage-based, updates every second
//
// Example:
//   <span id="site-stats"></span>
//   <script src="stats.js"></script>
//   <script>initStats('site-stats')</script>

function initStats(target) {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return;
  
    // Track session start (once per tab)
    if (!sessionStorage.getItem('visitStart')) {
      sessionStorage.setItem('visitStart', Date.now());
    }
  
    // Render skeleton
    el.style.fontFamily = 'Courier New, monospace';
    el.style.fontSize = '0.85em';
    el.innerHTML =
      '<span id="_stats-visits">visits: …</span>' +
      ' | ' +
      '<span id="_stats-stay">stay: 0s</span>';
  
    // --- Visit count via hits.seeyoufarm.com ---
    // Fixed URL — all pages share one counter
    const pageUrl = encodeURIComponent('https://alintras.github.io');
    fetch('https://hits.seeyoufarm.com/api/count/incr/badge.json?url=' + pageUrl)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        document.getElementById('_stats-visits').textContent =
          'visitors today: ' + data.today + ' | total: ' + data.total;
      })
      .catch(function() {
        document.getElementById('_stats-visits').textContent = 'visits: unavailable';
      });
  
    // --- Stay length (live counter) ---
    function updateStay() {
      var start = parseInt(sessionStorage.getItem('visitStart'), 10);
      var elapsed = Math.floor((Date.now() - start) / 1000);
      var m = Math.floor(elapsed / 60);
      var s = elapsed % 60;
      var stayEl = document.getElementById('_stats-stay');
      if (stayEl) {
        stayEl.textContent = 'stay: ' + (m > 0 ? m + 'm ' : '') + s + 's';
      }
    }
    updateStay();
    setInterval(updateStay, 1000);
  }