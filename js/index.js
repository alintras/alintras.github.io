const safeStorage = {
  _memory: {},
  getItem(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return this._memory[key] || null;
    }
  },
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      this._memory[key] = value;
    }
  }
};

function getGreeting(hour) {
    if (hour < 5)  return 'Hey there!';
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Hey there!';
    if (hour < 22) return 'Hey there!';
    return 'Burning the midnight oil?';
}

function getSignoff(hour) {
    if (hour < 12) return 'Welcome to my page. Have a nice day!';
    if (hour < 18) return 'Welcome to my page. Have a good rest of your day!';
    return 'Welcome to my page. Have a good evening!';
}

// CLOCK + GREETING
setInterval(() => {
    const now = new Date();
    document.getElementById("clock").textContent = now.toLocaleTimeString();
    document.getElementById("greeting").textContent = getGreeting(now.getHours());
    document.getElementById("signoff").textContent = getSignoff(now.getHours());
}, 1000);

// ASCII FOOTER — draggable, throwable dancing guys with physics + obstacle collision
const dancerFrames = [
` (•.•)/
 <)  )
  /  \\`,
` \\(•.•)
  (  (>
   /  \\`
];

const NUM_DANCERS = 3;
const footerEl = document.getElementById('ascii-footer');
const dancers = [];

const GRAVITY = 0.6;
const FRICTION = 0.985;
const BOUNCE = 0.55;
const MIN_VELOCITY = 0.3;

// Outer bounds calculation (document coordinates)
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

// Initialize dancers inside the footer container so they scroll naturally
function initDancers() {
    if (!footerEl) return;

    // Clear static text inside footer
    footerEl.textContent = '';
    footerEl.style.display = 'flex';
    footerEl.style.gap = '25px';
    footerEl.style.flexWrap = 'wrap';

    for (let i = 0; i < NUM_DANCERS; i++) {
        const dancer = document.createElement('div');
        dancer.className = 'dancer';
        dancer.dataset.id = 'dancer-' + i;
        dancer.style.whiteSpace = 'pre';
        dancer.style.cursor = 'grab';
        dancer.style.userSelect = 'none';
        dancer.style.webkitUserSelect = 'none';
        dancer.style.touchAction = 'none'; // Prevent touch scroll on mobile drag
        dancer.style.fontFamily = 'monospace';
        dancer.style.display = 'inline-block';
        dancer.textContent = dancerFrames[0];

        const dancerObj = { el: dancer, vx: 0, vy: 0, physicsActive: false, isMoved: false };

        // Read saved position OR keep inside static flexbox flow
        const saved = safeStorage.getItem(dancer.dataset.id);
        if (saved) {
            const pos = JSON.parse(saved);
            dancer.style.position = 'absolute';
            dancer.style.left = pos.x + 'px';
            dancer.style.top = pos.y + 'px';
            document.body.appendChild(dancer); // Attached directly to body only if moved
            dancerObj.isMoved = true;
        } else {
            footerEl.appendChild(dancer); // Sits cleanly in normal page layout
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

// Dance animation loop: continuous dance EXCEPT when being dragged
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
        '.search-results',      // Search suggestion lists / favorites
        '.dropdown-menu',       // Generic dropdowns
        'details[open]',        // Expanded details elements & contents
        'p',                    // Page text blocks
        'h1, h2, h3, h4',       // Headings
        'a',                    // Links
        '.search-help'          // Search keywords container
    ];

    const elements = [];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => elements.push(el));
    });

    return elements
        .filter(el => {
            // Ignore the dancer elements themselves so they don't treat themselves as background obstacles
            if (el.classList.contains('dancer') || el.closest('#ascii-footer')) return false;
            
            // Only include visible elements on screen
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

function resolveObstacleCollision(d, dancerRect, obstacle) {
    const overlapX = dancerRect.left < obstacle.right && dancerRect.right > obstacle.left;
    const overlapY = dancerRect.top < obstacle.bottom && dancerRect.bottom > obstacle.top;
    if (!overlapX || !overlapY) return false;

    const overlapLeft = dancerRect.right - obstacle.left;
    const overlapRight = obstacle.right - dancerRect.left;
    const overlapTop = dancerRect.bottom - obstacle.top;
    const overlapBottom = obstacle.bottom - dancerRect.top;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    const el = d.el;
    let x = parseFloat(el.style.left);
    let y = parseFloat(el.style.top);

    if (minOverlap === overlapLeft) {
        x -= overlapLeft;
        d.vx = -Math.abs(d.vx) * BOUNCE - 0.5;
    } else if (minOverlap === overlapRight) {
        x += overlapRight;
        d.vx = Math.abs(d.vx) * BOUNCE + 0.5;
    } else if (minOverlap === overlapTop) {
        y -= overlapTop;
        d.vy = -Math.abs(d.vy) * BOUNCE - 0.5;
    } else {
        y += overlapBottom;
        d.vy = Math.abs(d.vy) * BOUNCE + 0.5;
    }

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    d.physicsActive = true;
    return true;
}

function resolveDancerCollisions() {
    const passes = 2;
    for (let pass = 0; pass < passes; pass++) {
        for (let i = 0; i < dancers.length; i++) {
            for (let j = i + 1; j < dancers.length; j++) {
                const d1 = dancers[i];
                const d2 = dancers[j];

                // Skip if neither has been moved into dynamic space
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
                        const shift = minOverlap / 2;
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
                        const shift = minOverlap / 2;
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

    function detachToBody() {
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
        detachToBody();
        d.physicsActive = false;
        d.vx = 0;
        d.vy = 0;
        
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
        }
        
        savePosition(d);
    }

    el.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', onUp);

    el.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        const t = e.touches[0];
        onDown(t.clientX, t.clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (el.classList.contains('dragging')) {
            if (e.cancelable) e.preventDefault();
            const t = e.touches[0];
            onMove(t.clientX, t.clientY);
        }
    }, { passive: false });

    document.addEventListener('touchend', onUp);
}

let GRAVITY_ENABLED = false;

const gravityToggleBtn = document.getElementById('gravity-toggle');
if (gravityToggleBtn) {
    gravityToggleBtn.addEventListener('click', () => {
        GRAVITY_ENABLED = !GRAVITY_ENABLED;
        gravityToggleBtn.textContent = GRAVITY_ENABLED ? '🌍 Gravity: ON' : '🌌 Gravity: OFF';

        if (GRAVITY_ENABLED) {
            dancers.forEach(d => { 
                if (d.makeDraggable) d.makeDraggable.detachToBody();
                d.physicsActive = true; 
            });
        }
    });
}

function globalPhysicsLoop() {
    const outer = getOuterBounds();
    const obstacles = getObstacleRects();

    // Multi-pass dancer-to-dancer collisions
    resolveDancerCollisions();

    dancers.forEach(d => {
        if (d.el.classList.contains('dragging')) return;

        // Automatically detach to absolute body positioning if pushed by expanding layout
        let x = d.isMoved ? parseFloat(d.el.style.left) : (d.el.getBoundingClientRect().left + window.scrollX);
        let y = d.isMoved ? parseFloat(d.el.style.top) : (d.el.getBoundingClientRect().top + window.scrollY);

        const width = d.el.offsetWidth || 50;
        const height = d.el.offsetHeight || 50;

        const dancerRect = {
            left: x,
            right: x + width,
            top: y,
            bottom: y + height
        };

        // Check collisions against text & expanding menus
        let pushedByObstacle = false;
        obstacles.forEach(obs => {
            if (resolveObstacleCollision(d, dancerRect, obs)) {
                pushedByObstacle = true;
            }
        });

        // If a newly expanded menu pushed the dancer, detach it so it can float freely
        if (pushedByObstacle && !d.isMoved) {
            d.isMoved = true;
            d.el.style.position = 'absolute';
            document.body.appendChild(d.el);
        }

        // Keep inside screen boundaries
        if (x < outer.minX) {
            d.el.style.left = outer.minX + 'px';
            d.vx = Math.abs(d.vx) * BOUNCE + 1;
            d.physicsActive = true;
        }

        if (!d.physicsActive) return;

        if (GRAVITY_ENABLED) {
            d.vy += GRAVITY;
        }
        d.vx *= FRICTION;
        d.vy *= FRICTION;

        x += d.vx;
        y += d.vy;

        const maxX = outer.maxX - width;
        const minX = outer.minX;
        const maxY = outer.maxY - height;
        const minY = outer.minY;

        if (x < minX) { x = minX; d.vx *= -BOUNCE; }
        if (x > maxX) { x = maxX; d.vx *= -BOUNCE; }
        if (y > maxY) { y = maxY; d.vy *= -BOUNCE; d.vx *= 0.9; }
        if (y < minY) { y = minY; d.vy *= -BOUNCE; }

        d.el.style.left = x + 'px';
        d.el.style.top = y + 'px';

        // Settle physics once momentum fades
        if (Math.abs(d.vx) < MIN_VELOCITY && Math.abs(d.vy) < MIN_VELOCITY && (!GRAVITY_ENABLED || y >= maxY - 1)) {
            d.physicsActive = false;
            d.vx = 0;
            d.vy = 0;
            savePosition(d);
        }
    });

    requestAnimationFrame(globalPhysicsLoop);
}
requestAnimationFrame(globalPhysicsLoop);

// DETAILS TOGGLE TEXT
document.querySelectorAll(".search-help").forEach(details => {
    const summary = details.querySelector(".search-help-summary");

    details.addEventListener("toggle", () => {
        summary.textContent = details.open
            ? "[-] Try out search keywords!"
            : "[+] Try out search keywords!";
    });
});

// SEARCH EVENTS
document.getElementById("search-input").addEventListener("input", filterSite);

document.getElementById("search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
});

document.getElementById("search-button").addEventListener("click", doSearch);
document.getElementById("search-clear").addEventListener("click", clearSearchInput);
document.getElementById("engine-select").addEventListener("change", saveEngine);

// THEME BUTTON
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// LATEST UPDATE
async function fetchLatestCommit(username, repo) {
    const messageElement = document.getElementById('commit-message');
    const dateElement = document.getElementById('commit-date');
  
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const lastCommit = data[0];
  
      messageElement.textContent = lastCommit.commit.message + '  ';
      
      const commitDate = new Date(lastCommit.commit.author.date);
      dateElement.textContent = `(${commitDate.toLocaleDateString()})`;
  
    } catch (error) {
      console.error('Error fetching GitHub commit:', error);
      messageElement.textContent = 'Failed to load update.';
    }
}
  
fetchLatestCommit('alintras', 'alintras.github.io');

// SERVICE WORKER
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/service-worker.js");
}