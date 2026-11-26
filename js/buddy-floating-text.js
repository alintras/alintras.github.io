// --- buddy-floating-text.js ---
// Popup text for coin gains / totals

function createFloatingText(x, y, text, color = 'white', duration = 1500) {
    const el = document.createElement('div');
    el.textContent = text;
    el.className = 'buddy-floating-text';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = color;
    el.style.setProperty('--floating-text-duration', `${duration}ms`);
    document.body.appendChild(el);

    const viewportLeft = window.scrollX;
    const viewportRight = viewportLeft + document.documentElement.clientWidth;
    const maxLeft = Math.max(viewportLeft, viewportRight - el.getBoundingClientRect().width);
    el.style.left = `${Math.min(Math.max(x, viewportLeft), maxLeft)}px`;

    void el.offsetWidth;
    el.style.top = `${y - 60}px`;
    el.style.opacity = '0';

    setTimeout(() => el.remove(), duration);
}
