// --- buddies.js ---

// Storage fallback helper
const safeStorage = {
    _memory: {},
    getItem(key) {
        try { return sessionStorage.getItem(key); }
        catch (e) { return this._memory[key] || null; }
    },
    setItem(key, value) {
        try { sessionStorage.setItem(key, value); }
        catch (e) { this._memory[key] = value; }
    }
};

// Dancer frames & configuration
const dancerFrames = [
` (•.•)/
 <)  )
  /  \\`,
` \\(•.•)
  (  (>
   /  \\`
];

const NUM_DANCERS = 3;
const dancers = [];

const GRAVITY = 0.6;
const FRICTION = 0.985;
const BOUNCE = 0.55;
const MIN_VELOCITY = 0.3;
const REST_THRESHOLD = 1;
let GRAVITY_ENABLED = false;

// --- COIN DISPLAY ---
let totalCoins = parseInt(localStorage.getItem('buddy_coins') || '0');

function formatNumber(n) {
    return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function abbreviateNumber(n) {
    n = Math.floor(n);
    if (n < 1000) return n.toString();

    const tiers = [
        { value: 1e12, suffix: 't' },
        { value: 1e9,  suffix: 'b' },
        { value: 1e6,  suffix: 'm' },
        { value: 1e3,  suffix: 'k' }
    ];

    for (const tier of tiers) {
        if (n >= tier.value) {
            if (tier.suffix === 't' && n >= 1e15) {
                return n.toExponential(2).replace('e+', 'e');
            }
            const scaled = n / tier.value;
            const short = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
            return short + tier.suffix;
        }
    }
}

function addCoins(amount) {
    totalCoins += amount;
    localStorage.setItem('buddy_coins', totalCoins.toString());
}

function createFloatingText(x, y, text, color = 'white', duration = 1500) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'absolute';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = color;
    el.style.fontFamily = 'monospace';
    el.style.fontWeight = 'bold';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '10000';
    el.style.transition = `top ${duration}ms ease-out, opacity ${duration}ms ease-in`;
    document.body.appendChild(el);

    void el.offsetWidth;
    el.style.top = `${y - 60}px`;
    el.style.opacity = '0';

    setTimeout(() => el.remove(), duration);
}

// --- CACHED OBSTACLES ---
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
        '#greeting', '#signoff',
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

// --- BOUNDS & OBSTACLES ---
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

// --- INITIALIZATION ---
function initDancers() {
    refreshObstacleCache();

    const footerEl = document.getElementById('ascii-footer');
    if (!footerEl || dancers.length > 0) return;

    footerEl.textContent = '';

    // Create container with explicit inline-flex styling so items NEVER stack vertically
    let dancerRow = document.getElementById('dancer-row');
    if (!dancerRow) {
        dancerRow = document.createElement('div');
        dancerRow.id = 'dancer-row';
        dancerRow.style.display = 'flex';
        dancerRow.style.flexDirection = 'row';
        dancerRow.style.flexWrap = 'nowrap';
        dancerRow.style.gap = '25px';
        dancerRow.style.alignItems = 'flex-start';
        dancerRow.style.width = '100%';
        dancerRow.style.marginTop = '10px';
        footerEl.appendChild(dancerRow);
    }

    for (let i = 0; i < NUM_DANCERS; i++) {
        const dancer = document.createElement('div');
        dancer.className = 'dancer';
        dancer.dataset.id = 'dancer-' + i;
        dancer.style.whiteSpace = 'pre';
        dancer.style.cursor = 'grab';
        dancer.style.userSelect = 'none';
        dancer.style.webkitUserSelect = 'none';
        dancer.style.touchAction = 'none';
        dancer.style.fontFamily = 'monospace';
        dancer.style.fontSize = '12px';
        dancer.style.lineHeight = '1.2';
        dancer.style.color = 'currentColor';
        dancer.style.display = 'inline-block'; // Ensures inline layout behavior
        dancer.style.zIndex = '999';
        dancer.textContent = dancerFrames[0];

        const dancerObj = { 
            el: dancer, 
            vx: 0, 
            vy: 0, 
            physicsActive: false, 
            isMoved: false,
            inSwing: false,
            bounceCombo: 0,
            swingTotal: 0,
            lastBounceTime: 0
        };

        const saved = safeStorage.getItem(dancer.dataset.id);
        let restored = false;

        if (saved) {
            try {
                const pos = JSON.parse(saved);
                const outer = getOuterBounds();
                const clampedX = Math.max(outer.minX, Math.min(pos.x, outer.maxX - 60));
                const clampedY = Math.max(outer.minY, Math.min(pos.y, outer.maxY - 60));

                // Only treat as moved if Y coordinate is reasonable and non-zero
                if (!isNaN(clampedX) && !isNaN(clampedY) && clampedY > 50) {
                    dancer.style.position = 'absolute';
                    dancer.style.left = clampedX + 'px';
                    dancer.style.top = clampedY + 'px';
                    dancer.style.zIndex = '999';
                    document.body.appendChild(dancer);
                    dancerObj.isMoved = true;
                    restored = true;
                }
            } catch(e) {
                restored = false;
            }
        }

        if (!restored) {
            dancer.style.position = 'static'; // Keep in flex container flow
            dancerRow.appendChild(dancer);
        }

        dancers.push(dancerObj);
        makeDraggable(dancerObj);
    }

    requestAnimationFrame(() => {
        dancers.forEach(d => {
            if (d.isMoved) {
                resolveObstaclesForDancer(d, cachedObstacles);
            }
        });
        resolveDancerCollisions();
    });
}

// Frame Animation Loop
let frameIndex = 0;
setInterval(() => {
    frameIndex = (frameIndex + 1) % dancerFrames.length;
    dancers.forEach((d, i) => {
        if (!d.el.classList.contains('dragging')) {
            d.el.textContent = dancerFrames[(frameIndex + i) % dancerFrames.length];
        }
    });
}, 300);

function savePosition(d) {
    if (!d.isMoved) return;
    safeStorage.setItem(d.el.dataset.id, JSON.stringify({ 
        x: parseFloat(d.el.style.left), 
        y: parseFloat(d.el.style.top) 
    }));
}

// --- COMBO COLOR TIERS (1x to 10x+) ---
const COMBO_COLORS = [
    '#a0a0a0', '#55ff55', '#00e5ff', '#3b82f6', '#a855ff',
    '#ffd700', '#ff8c42', '#ff2e2e', '#ff007f', '#00ffff'
];

function getBounceColor(combo) {
    const index = Math.min(Math.max(0, combo - 1), COMBO_COLORS.length - 1);
    return COMBO_COLORS[index];
}

// --- BOUNCE & PHYSICS LOGIC ---
function triggerBounce(d, x, y) {
    const now = performance.now();
    if (d.inSwing && (now - d.lastBounceTime > 150)) {
        d.bounceCombo++;
        d.lastBounceTime = now;
        
        const gained = Math.floor(5 * Math.pow(1.5, d.bounceCombo - 1));
        d.swingTotal += gained;
        addCoins(gained);

        const color = getBounceColor(d.bounceCombo);
        createFloatingText(x + 20, y, `+${abbreviateNumber(gained)} (x${d.bounceCombo})`, color);
    }
}

function resolveObstaclesForDancer(d, obstacles, iterations = 3) {
    let x = d.isMoved ? parseFloat(d.el.style.left) : (d.el.getBoundingClientRect().left + window.scrollX);
    let y = d.isMoved ? parseFloat(d.el.style.top) : (d.el.getBoundingClientRect().top + window.scrollY);
    const width = d.el.offsetWidth || 50;
    const height = d.el.offsetHeight || 50;
    let pushed = false;

    for (let iter = 0; iter < iterations; iter++) {
        let hitAny = false;
        const rect = { left: x, right: x + width, top: y, bottom: y + height };

        for (const obs of obstacles) {
            const overlapX = rect.left < obs.right && rect.right > obs.left;
            const overlapY = rect.top < obs.bottom && rect.bottom > obs.top;
            if (!overlapX || !overlapY) continue;

            const overlapLeft = rect.right - obs.left;
            const overlapRight = obs.right - rect.left;
            const overlapTop = rect.bottom - obs.top;
            const overlapBottom = obs.bottom - rect.top;
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft) {
                x -= (overlapLeft + 2);
                d.vx = Math.abs(d.vx) < 1 ? 0 : -d.vx * BOUNCE;
            } else if (minOverlap === overlapRight) {
                x += (overlapRight + 2);
                d.vx = Math.abs(d.vx) < 1 ? 0 : -d.vx * BOUNCE;
            } else if (minOverlap === overlapTop) {
                y -= (overlapTop + 2);
                d.vy = Math.abs(d.vy) < 1 ? 0 : -d.vy * BOUNCE;
            } else {
                y += (overlapBottom + 2);
                d.vy = Math.abs(d.vy) < 1 ? 0 : -d.vy * BOUNCE;
            }

            if (Math.abs(d.vx) > 0.5 || Math.abs(d.vy) > 0.5) {
                triggerBounce(d, x, y);
            }

            hitAny = true;
            pushed = true;
            
            rect.left = x; rect.right = x + width;
            rect.top = y; rect.bottom = y + height;
        }
        if (!hitAny) break;
    }

    if (pushed) {
        if (!d.isMoved) {
            d.isMoved = true;
            d.el.style.position = 'absolute';
            d.el.style.zIndex = '999';
            document.body.appendChild(d.el);
        }
        d.el.style.left = x + 'px';
        d.el.style.top = y + 'px';
        d.physicsActive = true;
    }
    return { x, y, width, height };
}

function resolveDancerCollisions() {
    for (let i = 0; i < dancers.length; i++) {
        for (let j = i + 1; j < dancers.length; j++) {
            const d1 = dancers[i];
            const d2 = dancers[j];
            if (!d1.isMoved && !d2.isMoved) continue;

            const r1 = d1.el.getBoundingClientRect();
            const r2 = d2.el.getBoundingClientRect();

            if (r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top) {
                const overlapLeft = r1.right - r2.left;
                const overlapRight = r2.right - r1.left;
                const overlapTop = r1.bottom - r2.top;
                const overlapBottom = r2.bottom - r1.top;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                    const shift = (minOverlap / 2) + 1;
                    if (r1.left < r2.left) {
                        if (d1.isMoved) d1.el.style.left = (parseFloat(d1.el.style.left) - shift) + 'px';
                        if (d2.isMoved) d2.el.style.left = (parseFloat(d2.el.style.left) + shift) + 'px';
                    } else {
                        if (d1.isMoved) d1.el.style.left = (parseFloat(d1.el.style.left) + shift) + 'px';
                        if (d2.isMoved) d2.el.style.left = (parseFloat(d2.el.style.left) - shift) + 'px';
                    }
                    const v1 = d1.vx; d1.vx = d2.vx * BOUNCE; d2.vx = v1 * BOUNCE;
                } else {
                    const shift = (minOverlap / 2) + 1;
                    if (r1.top < r2.top) {
                        if (d1.isMoved) d1.el.style.top = (parseFloat(d1.el.style.top) - shift) + 'px';
                        if (d2.isMoved) d2.el.style.top = (parseFloat(d2.el.style.top) + shift) + 'px';
                    } else {
                        if (d1.isMoved) d1.el.style.top = (parseFloat(d1.el.style.top) + shift) + 'px';
                        if (d2.isMoved) d2.el.style.top = (parseFloat(d2.el.style.top) - shift) + 'px';
                    }
                    const v1 = d1.vy; d1.vy = d2.vy * BOUNCE; d2.vy = v1 * BOUNCE;
                }

                triggerBounce(d1, parseFloat(d1.el.style.left), parseFloat(d1.el.style.top));
                triggerBounce(d2, parseFloat(d2.el.style.left), parseFloat(d2.el.style.top));
                d1.physicsActive = true;
                d2.physicsActive = true;
            }
        }
    }
}

// --- DRAGGING INTERACTION ---
function makeDraggable(d) {
    const el = d.el;
    let offsetX = 0, offsetY = 0;
    let lastX = 0, lastY = 0, lastTime = 0;

    d.detachToBody = function() {
        if (el.parentNode !== document.body) {
            const rect = el.getBoundingClientRect();
            el.style.position = 'absolute';
            el.style.left = (rect.left + window.scrollX) + 'px';
            el.style.top = (rect.top + window.scrollY) + 'px';
            el.style.zIndex = '999';
            document.body.appendChild(el);
        }
    };

    function onDown(clientX, clientY) {
        d.detachToBody();
        d.isMoved = true;
        d.physicsActive = false;
        d.vx = 0; d.vy = 0;
        
        if (d.inSwing && d.swingTotal > 0) {
            createFloatingText(parseFloat(el.style.left), parseFloat(el.style.top), `Total: ${abbreviateNumber(d.swingTotal)}`, 'white', 2000);
        }
        d.inSwing = false;
        d.bounceCombo = 0;
        d.swingTotal = 0;
        
        const pageX = clientX + window.scrollX;
        const pageY = clientY + window.scrollY;

        const currentLeft = parseFloat(el.style.left) || (el.getBoundingClientRect().left + window.scrollX);
        const currentTop = parseFloat(el.style.top) || (el.getBoundingClientRect().top + window.scrollY);

        offsetX = pageX - currentLeft;
        offsetY = pageY - currentTop;
        
        lastX = pageX; lastY = pageY;
        lastTime = performance.now();
        
        el.classList.add('dragging');
        el.style.cursor = 'grabbing';
        el.style.zIndex = '1000';
    }

    function onMove(clientX, clientY) {
        if (!el.classList.contains('dragging')) return;
        
        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        const pageX = clientX + window.scrollX;
        const pageY = clientY + window.scrollY;

        el.style.left = (pageX - offsetX) + 'px';
        el.style.top = (pageY - offsetY) + 'px';

        d.vx = (pageX - lastX) / dt * 16;
        d.vy = (pageY - lastY) / dt * 16;

        lastX = pageX; lastY = pageY;
        lastTime = now;
    }

    function onUp() {
        if (!el.classList.contains('dragging')) return;
        el.classList.remove('dragging');
        el.style.cursor = 'grab';
        el.style.zIndex = '999';

        const currentX = parseFloat(el.style.left);
        const currentY = parseFloat(el.style.top);

        if (d.isMoved && !isNaN(currentX) && !isNaN(currentY)) {
            if (isInsideAnyObstacle(currentX, currentY, el.offsetWidth, el.offsetHeight)) {
                const outer = getOuterBounds();
                el.style.top = (outer.maxY - 50) + 'px';
                d.vx = 0;
                d.vy = 0;
            }
        }

        const now = performance.now();
        if (now - lastTime > 100 || (Math.abs(d.vx) < 1.5 && Math.abs(d.vy) < 1.5)) {
            d.vx = 0; d.vy = 0;
            d.physicsActive = GRAVITY_ENABLED;
        } else {
            d.physicsActive = true;
            d.inSwing = true;
        }
        
        savePosition(d);
    }

    el.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', onUp);

    el.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        onDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (el.classList.contains('dragging') && e.cancelable) {
            e.preventDefault();
            onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    document.addEventListener('touchend', onUp);
}

// --- GLOBAL PHYSICS LOOP ---
function globalPhysicsLoop() {
    const outer = getOuterBounds();

    resolveDancerCollisions();

    dancers.forEach(d => {
        if (d.el.classList.contains('dragging')) return;

        const pos = resolveObstaclesForDancer(d, cachedObstacles);
        let x = pos.x, y = pos.y;
        const width = pos.width, height = pos.height;

        if (x < outer.minX) { x = outer.minX; d.vx = Math.abs(d.vx) * BOUNCE + 1; d.physicsActive = true; triggerBounce(d, x, y); }
        if (x > outer.maxX - width) { x = outer.maxX - width; d.vx = -Math.abs(d.vx) * BOUNCE - 1; d.physicsActive = true; triggerBounce(d, x, y); }
        if (y < outer.minY) { y = outer.minY; d.vy = Math.abs(d.vy) * BOUNCE + 1; d.physicsActive = true; triggerBounce(d, x, y); }
        if (y > outer.maxY - height) { y = outer.maxY - height; d.vy = -Math.abs(d.vy) * BOUNCE - 1; d.physicsActive = true; triggerBounce(d, x, y); }

        if (d.isMoved) {
            d.el.style.left = x + 'px';
            d.el.style.top = y + 'px';
        }

        if (!d.physicsActive) return;

        if (GRAVITY_ENABLED) d.vy += GRAVITY;
        d.vx *= FRICTION;
        d.vy *= FRICTION;

        x += d.vx;
        y += d.vy;

        d.el.style.left = x + 'px';
        d.el.style.top = y + 'px';

        if (Math.abs(d.vx) < MIN_VELOCITY && Math.abs(d.vy) < MIN_VELOCITY && (!GRAVITY_ENABLED || y >= outer.maxY - height - 1)) {
            d.physicsActive = false;
            d.vx = 0; d.vy = 0;
            if (d.inSwing) {
                d.inSwing = false;
                if (d.swingTotal > 0) createFloatingText(x, y - 20, `Total: ${abbreviateNumber(d.swingTotal)}`, 'white', 2500);
            }
            savePosition(d);
        }
    });

    requestAnimationFrame(globalPhysicsLoop);
}

// --- UPDATED STARTING LINEUP ---
function placeDancersInStartingRow() {
    let container = document.getElementById('dancer-row');
    
    // Create the starting row container if it doesn't exist yet
    if (!container) {
        container = document.createElement('div');
        container.id = 'dancer-row';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.gap = '20px';
        container.style.marginTop = '12px';
        container.style.marginBottom = '12px';
        container.style.alignItems = 'flex-start';

        // Insert right after search container or search help
        const anchorEl = document.querySelector('.search-help') || 
                         document.querySelector('#search-input') ||
                         document.querySelector('#search-bar');

        if (anchorEl && anchorEl.parentNode) {
            anchorEl.parentNode.insertBefore(container, anchorEl.nextSibling);
        } else {
            document.body.appendChild(container);
        }
    }

    dancers.forEach((d) => {
        // If the user hasn't dragged this dancer yet, keep it flow-positioned inside the flex row
        if (!d.isMoved) {
            if (d.el.parentNode !== container) {
                container.appendChild(d.el);
            }
            d.el.style.position = 'static';
            d.vx = 0;
            d.vy = 0;
        }
    });
}

// Auto-start initialization when DOM is ready
function startBuddiesApp() {
    initDancers();
    placeDancersInStartingRow();
    requestAnimationFrame(globalPhysicsLoop);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBuddiesApp);
} else {
    startBuddiesApp();
}

window.addEventListener('load', () => {
    refreshObstacleCache();
    placeDancersInStartingRow();
});
