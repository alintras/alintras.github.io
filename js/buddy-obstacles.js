// --- buddy-obstacles.js ---
// Obstacle detection and page boundary calculation

let cachedObstacles = [];

function refreshObstacleCache() {
    cachedObstacles = getObstacleRects();
}

window.addEventListener('resize', refreshObstacleCache);
window.addEventListener('scroll', refreshObstacleCache);
setInterval(refreshObstacleCache, 500);

function getObstacleRects() {
    const selectors = [
        '#search-input', '#engine-select', '#search-button', '#clock',
        '.search-results', '.dropdown-menu', 'details[open] > *:not(summary)', '.search-help summary',
        '.search-help', '#favorites-bar', '#favorites-sidebar',
        '#greeting', '#signoff', '#site-results'
    ];

    const elements = [];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => elements.push(el));
    });

    return elements
        .filter(el => {
            if (el.classList.contains('dancer') || el.closest('#ascii-footer')) return false;

            const r = el.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) return false;

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

            return true;
        })
        .map(el => {
            const r = el.getBoundingClientRect();
            return {
                left: r.left + window.scrollX,
                right: r.right + window.scrollX,
                top: r.top + window.scrollY,
                bottom: r.bottom + window.scrollY
            };
        });
}

function isInsideAnyObstacle(x, y, width = 40, height = 40) {
    const rect = { left: x, right: x + width, top: y, bottom: y + height };
    return cachedObstacles.some(obs =>
        rect.left < obs.right && rect.right > obs.left &&
        rect.top < obs.bottom && rect.bottom > obs.top
    );
}

function getOuterBounds() {
    const sidebar = document.querySelector('#sidebar') || document.querySelector('nav');
    const footer = document.querySelector('footer');
    const header = document.querySelector('header');

    return {
        minX: sidebar ? sidebar.getBoundingClientRect().right + window.scrollX : 0,
        maxX: window.innerWidth + window.scrollX,
        minY: header ? header.getBoundingClientRect().bottom + window.scrollY : 0,
        maxY: footer ? footer.getBoundingClientRect().top + window.scrollY : (document.documentElement.scrollHeight || window.innerHeight)
    };
}
