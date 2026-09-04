// --- buddy-economy.js ---
// Coins, scoring, number formatting

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

const COMBO_COLORS = [
    '#a0a0a0', '#55ff55', '#00e5ff', '#3b82f6', '#a855ff',
    '#ffd700', '#ff8c42', '#ff2e2e', '#ff007f', '#00ffff'
];

function getBounceColor(combo) {
    const index = Math.min(Math.max(0, combo - 1), COMBO_COLORS.length - 1);
    return COMBO_COLORS[index];
}
