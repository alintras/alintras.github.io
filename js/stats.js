// stats.js — stay length widget
// Usage: initStats('element-id')  OR  initStats(domElement)
//
// Stay length: safeStorage-based (sessionStorage with in-memory fallback
// for private browsing / restrictive cookie settings), updates every second
//
// Requires safeStorage to be defined (see index.js) and loaded first.
//
// Example:
//   <span id="site-stats"></span>
//   <script src="index.js"></script>
//   <script src="stats.js"></script>
//   <script>initStats('site-stats')</script>
function initStats(target) {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return;

    // Track session start (once per tab)
    if (!safeStorage.getItem('visitStart')) {
        safeStorage.setItem('visitStart', Date.now());
    }

    // Render skeleton
    el.style.fontFamily = 'Courier New, monospace';
    el.style.fontSize = '0.85em';
    el.innerHTML = '<span id="_stats-stay">stay: 0s</span> <span id="_stats-score">| score: 0</span>';

    // --- Stay length (live counter) ---
    function updateStay() {
        var start = parseInt(safeStorage.getItem('visitStart'), 10);
        var elapsed = Math.floor((Date.now() - start) / 1000);
        var m = Math.floor(elapsed / 60);
        var s = elapsed % 60;
        var stayEl = document.getElementById('_stats-stay');
        if (stayEl) {
            stayEl.textContent = 'stay: ' + (m > 0 ? m + 'm ' : '') + s + 's';
        }
    }
   // --- Score (live counter) ---
    function updateScore() {
        const scoreEl = document.getElementById('_stats-score');
        if (scoreEl && typeof totalCoins !== 'undefined') {
            scoreEl.textContent = `| score: ${formatNumber(totalCoins)}`;
        }
    }
updateStay();
updateScore();
setInterval(() => {
    updateStay();
    updateScore();
}, 1000);
}
