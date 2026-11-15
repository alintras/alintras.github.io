// stats.js — stay length widget
function initStats(target) {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return;

    // Track session start (once per tab)
    if (!safeStorage.getItem('visitStart')) {
        safeStorage.setItem('visitStart', Date.now());
    }

    // Grund-Styling + nowrap, damit auf Mobile nichts mitten im Text umbricht
    el.style.fontFamily = 'Courier New, monospace';
    el.style.fontSize = '0.85em';
    el.style.whiteSpace = 'nowrap';
    el.style.display = 'inline-block';

    // Struktur direkt sauber per JS anlegen (vermeidet unnötige IDs im DOM)
    el.innerHTML = '<span>stay: 0s</span> <span>| score: 0</span>';
    const stayEl = el.children[0];
    const scoreEl = el.children[1];

    // --- Stay length (live counter) ---
    function updateStay() {
        var start = parseInt(safeStorage.getItem('visitStart'), 10);
        var elapsed = Math.floor((Date.now() - start) / 1000);
        var m = Math.floor(elapsed / 60);
        var s = elapsed % 60;
        if (stayEl) {
            stayEl.textContent = 'stay: ' + (m > 0 ? m + 'm ' : '') + s + 's';
        }
    }

    // --- Score (live counter) ---
    function updateScore() {
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