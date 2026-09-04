// --- buddy-init.js ---
// Dancer creation, save/restore, and app bootstrap

function initDancers() {
    refreshObstacleCache();

    const footerEl = document.getElementById('ascii-footer');
    if (!footerEl || dancers.length > 0) return;

    footerEl.textContent = '';

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
        dancer.style.display = 'inline-block';
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
            dancer.style.position = 'static';
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

function savePosition(d) {
    if (!d.isMoved) return;
    safeStorage.setItem(d.el.dataset.id, JSON.stringify({
        x: parseFloat(d.el.style.left),
        y: parseFloat(d.el.style.top)
    }));
}

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
