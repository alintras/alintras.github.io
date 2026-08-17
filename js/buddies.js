// --- buddies.js ---

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
let GRAVITY_ENABLED = false;

// --- COIN SYSTEM UI ---
let totalCoins = parseInt(localStorage.getItem('buddy_coins') || '0');
const coinDisplay = document.createElement('div');
coinDisplay.id = 'buddy-coin-display';
coinDisplay.style.position = 'fixed';
coinDisplay.style.top = '15px';
coinDisplay.style.right = '15px';
coinDisplay.style.fontFamily = 'monospace';
coinDisplay.style.color = '#ffd700'; // Gold
coinDisplay.style.fontSize = '16px';
coinDisplay.style.zIndex = '1000';
coinDisplay.style.pointerEvents = 'none';
coinDisplay.textContent = `Coins: ${totalCoins}`;
document.body.appendChild(coinDisplay);

function addCoins(amount) {
    totalCoins += amount;
    coinDisplay.textContent = `Coins: ${totalCoins}`;
    localStorage.setItem('buddy_coins', totalCoins.toString());
}

function createFloatingText(x, y, text, color = '#ffd700', duration = 1500) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'absolute';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = color;
    el.style.fontFamily = 'monospace';
    el.style.fontWeight = 'bold';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.transition = `top ${duration}ms ease-out, opacity ${duration}ms ease-in`;
    document.body.appendChild(el);

    // Trigger reflow
    void el.offsetWidth;
    el.style.top = `${y - 60}px`; // Float upwards
    el.style.opacity = '0';

    setTimeout(() => el.remove(), duration);
}

// --- CORE LOGIC ---
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

function initDancers() {
    const footerEl = document.getElementById('ascii-footer');
    if (!footerEl) return;
    footerEl.textContent = '';

    const dancerRow = document.createElement('div');
    dancerRow.id = 'dancer-row';
    dancerRow.style.display = 'flex';
    dancerRow.style.gap = '25px';
    dancerRow.style.flexWrap = 'wrap';
    dancerRow.style.width = '100%';
    footerEl.appendChild(dancerRow);

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
        dancer.style.display = 'inline-block';
        dancer.textContent = dancerFrames[0];

        const dancerObj = { 
            el: dancer, 
            vx: 0, 
            vy: 0, 
            physicsActive: false, 
            isMoved: false,
            // Coin properties
            inSwing: false,
            bounceCombo: 0,
            swingTotal: 0,
            lastBounceTime: 0
        };

        const saved = safeStorage.getItem(dancer.dataset.id);
        if (saved) {
            const pos = JSON.parse(saved);
            dancer.style.position = 'absolute';
            dancer.style.left = pos.x + 'px';
            dancer.style.top = pos.y + 'px';
            document.body.appendChild(dancer);
            dancerObj.isMoved = true;
        } else {
            dancerRow.appendChild(dancer);
        }

        dancers.push(dancerObj);
        makeDraggable(dancerObj);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDancers);
} else {
    initDancers();
}

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

function getObstacleRects() {
    const selectors = [
        '#search-input',
        '#engine-select',
        '#search-button',
        '#clock',
        '.search-results',
        '.dropdown-menu',
        'details[open] > *:not(summary)',
        '.search-help summary'
    ];

    const elements = [];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => elements.push(el));
    });

    return elements
        .filter(el => {
            if (el.classList.contains('dancer') || el.closest('#ascii-footer')) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
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

function triggerBounce(d, x, y) {
    const now = performance.now();
    // Debounce to prevent multiple triggers in a single frame/corner snag
    if (d.inSwing && (now - d.lastBounceTime > 150)) {
        d.bounceCombo++;
        d.lastBounceTime = now;
        
        // Exponential formula: base 5, * 1.5 per extra bounce
        const gained = Math.floor(5 * Math.pow(1.5, d.bounceCombo - 1));
        d.swingTotal += gained;
        addCoins(gained);
        
        // Show gained per bounce
        createFloatingText(x + 20, y, `+${gained} (x${d.bounceCombo})`, '#ffd700');
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

            // Added + 1.5 pushback to strictly un-stick from the containers
            if (minOverlap === overlapLeft) {
                x -= (overlapLeft + 1.5);
                if (d.vx > 0) d.vx = -d.vx * BOUNCE - 0.5;
            } else if (minOverlap === overlapRight) {
                x += (overlapRight + 1.5);
                if (d.vx < 0) d.vx = -d.vx * BOUNCE + 0.5;
            } else if (minOverlap === overlapTop) {
                y -= (overlapTop + 1.5);
                if (d.vy > 0) d.vy = -d.vy * BOUNCE - 0.5;
            } else {
                y += (overlapBottom + 1.5);
                if (d.vy < 0) d.vy = -d.vy * BOUNCE + 0.5;
            }
            
            triggerBounce(d, x, y);
            hitAny = true;
            pushed = true;
            
            // Update rect for next obstacle check
            rect.left = x; rect.right = x + width;
            rect.top = y; rect.bottom = y + height;
        }
        if (!hitAny) break;
    }

    if (pushed) {
        if (!d.isMoved) {
            d.isMoved = true;
            d.el.style.position = 'absolute';
            document.body.appendChild(d.el);
        }
        d.el.style.left = x + 'px';
        d.el.style.top = y + 'px';
        d.physicsActive = true;
    }
    return { x, y, width, height };
}

// ... [Keep existing resolveDancerCollisions exact logic here] ...
function resolveDancerCollisions() {
    const passes = 2;
    for (let pass = 0; pass < passes; pass++) {
        for (let i = 0; i < dancers.length; i++) {
            for (let j = i + 1; j < dancers.length; j++) {
                const d1 = dancers[i];
                const d2 = dancers[j];
                if (!d1.isMoved && !d2.isMoved) continue;

                const r1 = d1.el.getBoundingClientRect();
                const r2 = d2.el.getBoundingClientRect();

                const overlapX = r1.left < r2.right && r1.right > r2.left;
                const overlapY = r1.top < r2.bottom && r1.bottom > r2.top;

                if (overlapX && overlapY) {
                    const overlapLeft = r1.right - r2.left;
                    const overlapRight = r2.right - r1.left;
                    const overlapTop = r1.bottom - r2.top;
                    const overlapBottom = r2.bottom - r1.top;

                    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                    if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                        const shift = (minOverlap / 2) + 1; // +1 to prevent sticking
                        if (r1.left < r2.left) {
                            if (d1.isMoved) d1.el.style.left = (parseFloat(d1.el.style.left) - shift) + 'px';
                            if (d2.isMoved) d2.el.style.left = (parseFloat(d2.el.style.left) + shift) + 'px';
                        } else {
                            if (d1.isMoved) d1.el.style.left = (parseFloat(d1.el.style.left) + shift) + 'px';
                            if (d2.isMoved) d2.el.style.left = (parseFloat(d2.el.style.left) - shift) + 'px';
                        }
                        const v1 = d1.vx, v2 = d2.vx;
                        d1.vx = v2 * BOUNCE;
                        d2.vx = v1 * BOUNCE;
                    } else {
                        const shift = (minOverlap / 2) + 1; // +1 to prevent sticking
                        if (r1.top < r2.top) {
                            if (d1.isMoved) d1.el.style.top = (parseFloat(d1.el.style.top) - shift) + 'px';
                            if (d2.isMoved) d2.el.style.top = (parseFloat(d2.el.style.top) + shift) + 'px';
                        } else {
                            if (d1.isMoved) d1.el.style.top = (parseFloat(d1.el.style.top) + shift) + 'px';
                            if (d2.isMoved) d2.el.style.top = (parseFloat(d2.el.style.top) - shift) + 'px';
                        }
                        const v1 = d1.vy, v2 = d2.vy;
                        d1.vy = v2 * BOUNCE;
                        d2.vy = v1 * BOUNCE;
                    }

                    triggerBounce(d1, parseFloat(d1.el.style.left), parseFloat(d1.el.style.top));
                    triggerBounce(d2, parseFloat(d2.el.style.left), parseFloat(d2.el.style.top));
                    d1.physicsActive = true;
                    d2.physicsActive = true;
                }
            }
        }
    }
}

function makeDraggable(d) {
    const el = d.el;
    let offsetX = 0, offsetY = 0;
    let lastX = 0, lastY = 0, lastTime = 0;

    d.detachToBody = function() {
        if (!d.isMoved) {
            const rect = el.getBoundingClientRect();
            el.style.position = 'absolute';
            el.style.left = (rect.left + window.scrollX) + 'px';
            el.style.top = (rect.top + window.scrollY) + 'px';
            document.body.appendChild(el);
            d.isMoved = true;
        }
    }

    function onDown(clientX, clientY) {
        d.detachToBody();
        d.physicsActive = false;
        d.vx = 0;
        d.vy = 0;
        
        // Reset swing logic on grab
        if (d.inSwing && d.swingTotal > 0) {
            // If they grabbed it before it stopped, show what they had so far
            createFloatingText(parseFloat(el.style.left), parseFloat(el.style.top), `Swing Total: ${d.swingTotal}`, '#00ffcc', 2000);
        }
        d.inSwing = false;
        d.bounceCombo = 0;
        d.swingTotal = 0;
        
        const pageX = clientX + window.scrollX;
        const pageY = clientY + window.scrollY;

        offsetX = pageX - parseFloat(el.style.left || 0);
        offsetY = pageY - parseFloat(el.style.top || 0);
        
        lastX = pageX;
        lastY = pageY;
        lastTime = performance.now();
        
        el.classList.add('dragging');
        el.style.cursor = 'grabbing';
        el.style.zIndex = 1000;
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

        lastX = pageX;
        lastY = pageY;
        lastTime = now;
    }

    function onUp() {
        if (!el.classList.contains('dragging')) return;
        el.classList.remove('dragging');
        el.style.cursor = 'grab';

        const now = performance.now();
        if (now - lastTime > 100 || (Math.abs(d.vx) < 1.5 && Math.abs(d.vy) < 1.5)) {
            d.vx = 0;
            d.vy = 0;
            d.physicsActive = GRAVITY_ENABLED;
        } else {
            d.physicsActive = true;
            // Initiate swing state if thrown!
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

const gravityToggleBtn = document.getElementById('gravity-toggle');
if (gravityToggleBtn) {
    gravityToggleBtn.addEventListener('click', () => {
        GRAVITY_ENABLED = !GRAVITY_ENABLED;
        gravityToggleBtn.textContent = GRAVITY_ENABLED ? '🌍 Gravity: ON' : '🌌 Gravity: OFF';
        if (GRAVITY_ENABLED) {
            dancers.forEach(d => { 
                d.detachToBody();
                d.physicsActive = true; 
            });
        }
    });
}

function globalPhysicsLoop() {
    const outer = getOuterBounds();
    const obstacles = getObstacleRects();

    resolveDancerCollisions();

    dancers.forEach(d => {
        if (d.el.classList.contains('dragging')) return;

        const pos = resolveObstaclesForDancer(d, obstacles);
        let x = pos.x;
        let y = pos.y;
        const width = pos.width;
        const height = pos.height;

        // Outer bounds checks & bounce triggers
        if (x < outer.minX) { 
            x = outer.minX; d.vx = Math.abs(d.vx) * BOUNCE + 1; d.physicsActive = true; 
            triggerBounce(d, x, y);
        }
        if (x > outer.maxX - width) { 
            x = outer.maxX - width; d.vx = -Math.abs(d.vx) * BOUNCE - 1; d.physicsActive = true; 
            triggerBounce(d, x, y);
        }
        if (y < outer.minY) { 
            y = outer.minY; d.vy = Math.abs(d.vy) * BOUNCE + 1; d.physicsActive = true; 
            triggerBounce(d, x, y);
        }
        if (y > outer.maxY - height) { 
            y = outer.maxY - height; d.vy = -Math.abs(d.vy) * BOUNCE - 1; d.physicsActive = true; 
            triggerBounce(d, x, y);
        }

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

        // Check if movement stopped
        if (Math.abs(d.vx) < MIN_VELOCITY && Math.abs(d.vy) < MIN_VELOCITY && (!GRAVITY_ENABLED || y >= outer.maxY - height - 1)) {
            d.physicsActive = false;
            d.vx = 0;
            d.vy = 0;
            
            // End of swing!
            if (d.inSwing) {
                d.inSwing = false;
                if (d.swingTotal > 0) {
                    createFloatingText(x, y - 20, `Swing Total: ${d.swingTotal}`, '#00ffcc', 2500);
                }
            }
            savePosition(d);
        }
    });

    requestAnimationFrame(globalPhysicsLoop);
}
requestAnimationFrame(globalPhysicsLoop);

// --- BUG FIX: DETAILS ELEMENT GLITCH ---
// Push dancers out of the way when details open so they don't get trapped.
document.querySelectorAll("details").forEach(details => {
    details.addEventListener("toggle", () => {
        if (details.open) {
            const rect = details.getBoundingClientRect();
            dancers.forEach(d => {
                const dr = d.el.getBoundingClientRect();
                
                // If the dancer is currently inside the newly expanded details bounding box...
                if (dr.left < rect.right && dr.right > rect.left && dr.top < rect.bottom && dr.bottom > rect.top) {
                    d.detachToBody();
                    
                    const toRight = rect.right - dr.left;
                    const toBottom = rect.bottom - dr.top;
                    
                    // Push them to whichever escape route is shorter (right or below)
                    if (toRight < toBottom) {
                        d.el.style.left = (parseFloat(d.el.style.left || dr.left) + toRight + 15) + "px";
                    } else {
                        d.el.style.top = (parseFloat(d.el.style.top || dr.top) + toBottom + 15) + "px";
                    }
                    d.physicsActive = true;
                }
            });
        }
    });
});