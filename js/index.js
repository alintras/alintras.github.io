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
    if (hour < 5)  return 'Working late?';
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Hey there!';
    if (hour < 22) return 'Hey there!';
    return 'Hey there!';
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

/*
const frames = [
    `
(•.•)/  (•.•)/  (•.•)/  (•.•)/  (•.•)/
<)  )   <)  )   <)  )   <)  )   <)  )  
/  \\    /  \\    /  \\    /  \\    /  \\  
    `,
    `
\\(•.•)  \\(•.•)  \\(•.•)  \\(•.•)  \\(•.•) 
 (  (>   (  (>   (  (>   (  (>   (  (>  
 /  \\    /  \\    /  \\    /  \\    /  \\  
    `  
];


// ASCII FOOTER ANIMATION

const frames = [
` 
 ,…,    ,_     ,…,    ,_     ,…,    ,_     
[•.•]  [•.•]  [•.•]  [•.•]  [•.•]  [•.•]   
 """    """    """    """    """    """    
`,
` 
 ,_     ,…,    ,_     ,…,    ,_     ,…,    
[•.•]  [•.•]  [•.•]  [•.•]  [•.•]  [•.•]    
 """    """    """    """    """    """   
`
];


let i = 0;

setInterval(() => {
    document.getElementById("ascii-footer").textContent = frames[i];
    i = (i + 1) % frames.length;
}, 300);
*/


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

for (let i = 0; i < NUM_DANCERS; i++) {
    const dancer = document.createElement('div');
    dancer.className = 'dancer';
    dancer.dataset.id = 'dancer-' + i;
    dancer.style.position = 'fixed';
    dancer.style.whiteSpace = 'pre';
    dancer.style.cursor = 'grab';
    dancer.style.userSelect = 'none';
    dancer.style.fontFamily = 'monospace';
    dancer.textContent = dancerFrames[0];

    const saved = safeStorage.getItem(dancer.dataset.id);
    if (saved) {
        const pos = JSON.parse(saved);
        dancer.style.left = pos.x + 'px';
        dancer.style.top = pos.y + 'px';
    } else {
        const rect = footerEl.getBoundingClientRect();
        dancer.style.left = (rect.left + i * 80) + 'px';
        dancer.style.top = rect.top + 'px';
    }

    document.body.appendChild(dancer);
    dancers.push({ el: dancer, vx: 0, vy: 0, physicsActive: false });
}

let frameIndex = 0;
setInterval(() => {
    frameIndex = (frameIndex + 1) % dancerFrames.length;
    dancers.forEach((d, i) => {
        if (!d.el.classList.contains('dragging') && !d.physicsActive) {
            d.el.textContent = dancerFrames[(frameIndex + i) % dancerFrames.length];
        }
    });
}, 300);

function savePosition(d) {
    const rect = d.el.getBoundingClientRect();
    safeStorage.setItem(d.el.dataset.id, JSON.stringify({ x: rect.left, y: rect.top }));
}

// Äußere Grenzen
function getOuterBounds() {
    const sidebar = document.querySelector('#sidebar') || document.querySelector('nav');
    const footer = document.querySelector('footer');
    const header = document.querySelector('header');

    return {
        minX: sidebar ? sidebar.getBoundingClientRect().right : 0,
        maxX: window.innerWidth,
        minY: header ? header.getBoundingClientRect().bottom : 0,
        maxY: footer ? footer.getBoundingClientRect().top : window.innerHeight
    };
}

// Feste Hindernisse
function getObstacleRects() {
    const selectors = ['#search-input', '#engine-select', '#search-button', '#clock'];
    return selectors
        .map(sel => document.querySelector(sel))
        .filter(Boolean)
        .map(el => el.getBoundingClientRect());
}

// Prüft & löst Kollision einer einzelnen Rect gegen ein Hindernis-Rect auf,
// gibt zurück ob eine Kollision stattfand
function resolveObstacleCollision(d, dancerRect, obstacle) {
    const overlapX = dancerRect.left < obstacle.right && dancerRect.right > obstacle.left;
    const overlapY = dancerRect.top < obstacle.bottom && dancerRect.bottom > obstacle.top;
    if (!overlapX || !overlapY) return false;

    // Überlappungstiefe pro Richtung berechnen, kleinste Achse rausschieben
    const overlapLeft = dancerRect.right - obstacle.left;
    const overlapRight = obstacle.right - dancerRect.left;
    const overlapTop = dancerRect.bottom - obstacle.top;
    const overlapBottom = obstacle.bottom - dancerRect.top;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    const el = d.el;
    let x = el.offsetLeft;
    let y = el.offsetTop;

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

function makeDraggable(d) {
    const el = d.el;
    let offsetX = 0, offsetY = 0;
    let lastX = 0, lastY = 0, lastTime = 0;

    function onDown(clientX, clientY) {
        d.physicsActive = false;
        const rect = el.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        lastX = clientX;
        lastY = clientY;
        lastTime = performance.now();
        el.classList.add('dragging');
        el.style.cursor = 'grabbing';
        el.style.zIndex = 1000;
    }

    function onMove(clientX, clientY) {
        if (!el.classList.contains('dragging')) return;
        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);

        el.style.left = (clientX - offsetX) + 'px';
        el.style.top = (clientY - offsetY) + 'px';

        d.vx = (clientX - lastX) / dt * 16;
        d.vy = (clientY - lastY) / dt * 16;

        lastX = clientX;
        lastY = clientY;
        lastTime = now;
    }

    function onUp() {
        if (!el.classList.contains('dragging')) return;
        el.classList.remove('dragging');
        el.style.cursor = 'grab';
        d.physicsActive = true;
    }

    el.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', onUp);

    el.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        onDown(t.clientX, t.clientY);
    });
    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        onMove(t.clientX, t.clientY);
    }, { passive: true });
    document.addEventListener('touchend', onUp);
}

dancers.forEach(makeDraggable);

let GRAVITY_ENABLED = false;

const gravityToggleBtn = document.getElementById('gravity-toggle');
if (gravityToggleBtn) {
    gravityToggleBtn.addEventListener('click', () => {
        GRAVITY_ENABLED = !GRAVITY_ENABLED;
        gravityToggleBtn.textContent = GRAVITY_ENABLED ? '🌍 Gravity: ON' : '🌌 Gravity: OFF';

        // Ohne Gravity sollen ruhende Figuren nicht "tot" bleiben,
        // damit sie bei erneuter Aktivierung sofort weiterfallen
        if (GRAVITY_ENABLED) {
            dancers.forEach(d => { d.physicsActive = true; });
        }
    });
}
// Ein einziger durchgehender Loop für ALLE Figuren — prüft Kollisionen
// jeden Frame, auch für ruhende Figuren (z.B. bei Sidebar-Toggle)
function globalPhysicsLoop() {
    const outer = getOuterBounds();
    const obstacles = getObstacleRects();

    dancers.forEach(d => {
        if (d.el.classList.contains('dragging')) return;

        // Erst Hindernis-Kollision prüfen (auch im Ruhezustand)
        let hitObstacle = false;
        const rect = d.el.getBoundingClientRect();
        obstacles.forEach(obs => {
            if (resolveObstacleCollision(d, rect, obs)) hitObstacle = true;
        });

        // Sidebar/Rand-Kollision auch im Ruhezustand prüfen (Sidebar-Toggle-Fall)
        const currentRect = d.el.getBoundingClientRect();
        if (currentRect.left < outer.minX) {
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

        let x = d.el.offsetLeft + d.vx;
        let y = d.el.offsetTop + d.vy;

        const r = d.el.getBoundingClientRect();
        const maxX = outer.maxX - r.width;
        const minX = outer.minX;
        const maxY = outer.maxY - r.height;
        const minY = outer.minY;

        if (x < minX) { x = minX; d.vx *= -BOUNCE; }
        if (x > maxX) { x = maxX; d.vx *= -BOUNCE; }
        if (y > maxY) { y = maxY; d.vy *= -BOUNCE; d.vx *= 0.9; }
        if (y < minY) { y = minY; d.vy *= -BOUNCE; }

        d.el.style.left = x + 'px';
        d.el.style.top = y + 'px';

        if (Math.abs(d.vx) < MIN_VELOCITY && Math.abs(d.vy) < MIN_VELOCITY && y >= maxY - 1) {
            d.physicsActive = false;
            d.vx = 0;
            d.vy = 0;
            savePosition(d);
        }
    });

    requestAnimationFrame(globalPhysicsLoop);
}
requestAnimationFrame(globalPhysicsLoop);

dancers.forEach(makeDraggable);

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
