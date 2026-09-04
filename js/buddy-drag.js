// --- buddy-drag.js ---
// Mouse/touch dragging interaction

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
