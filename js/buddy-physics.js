// --- buddy-physics.js ---
// Collision resolution, bouncing, and the main physics loop

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
