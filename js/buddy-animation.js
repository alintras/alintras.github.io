// --- buddy-animation.js ---
// Frame cycling and starting-row layout

let frameIndex = 0;
setInterval(() => {
    frameIndex = (frameIndex + 1) % dancerFrames.length;
    dancers.forEach((d, i) => {
        if (!d.el.classList.contains('dragging')) {
            d.el.textContent = dancerFrames[(frameIndex + i) % dancerFrames.length];
        }
    });
}, 300);

function placeDancersInStartingRow() {
    let container = document.getElementById('dancer-row');

    if (!container) {
        container = document.createElement('div');
        container.id = 'dancer-row';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.gap = '20px';
        container.style.marginTop = '12px';
        container.style.marginBottom = '12px';
        container.style.alignItems = 'flex-start';

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
