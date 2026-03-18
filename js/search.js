/* =============================================================
   SITE PAGES
============================================================= */

const sitePages = [
    { title: "Home",                          url: "/index.html",                                 tags: ["home", "about", "ali", "alintras"] },
    // Tools
    { title: "PMD RT Wondermail Generator",   url: "/pages/tools/wondermail/wondermail.html",     tags: ["tool", "pokemon", "mystery dungeon", "wondermail", "pmd"] },
    { title: "HGSS Voltorb Solver",           url: "/pages/tools/voltorb-solver.html",            tags: ["tool", "voltorb", "flip", "heartgold", "soulsilver", "pokemon", "solver"] },
    { title: "CPS Counter",                   url: "/pages/tools/cps-counter.html",               tags: ["tool", "cps", "click", "counter"] },
    { title: "Password Generator",            url: "/pages/tools/password-generator.html",        tags: ["tool", "password", "generator", "security"] },
    { title: "Unit Converter",                url: "/pages/tools/unit-converter.html",            tags: ["tool", "unit", "converter", "convert"] },
    { title: "Quote Generator",               url: "/pages/tools/random-quote-generator.html",    tags: ["tool", "quote", "random", "generator"] },
    // Fun
    { title: "Simple Physics",                url: "/pages/fun/simple-physics.html",              tags: ["fun", "physics", "simulation"] },
    { title: "Castaway",                      url: "/pages/fun/castaway/castaway.html",           tags: ["fun", "game", "castaway"] },
    { title: "Mr.Oops!!",                     url: "/pages/fun/mroops.html",                      tags: ["fun", "game", "mroops", "oops"] },
    { title: "Love Compatibility Calculator", url: "/pages/fun/love-calculator.html",             tags: ["fun", "love", "calculator", "compatibility"] },
    { title: "Valentines 2026",               url: "/pages/fun/vivi.html",                        tags: ["fun", "valentine", "love"] },
    { title: "Perfect Circle Game",           url: "/pages/fun/perfect-circle.html",              tags: ["fun", "game", "circle", "draw"] },
    { title: "Infinite TicTacToe",            url: "/pages/fun/infinite-ttt.html",                tags: ["fun", "game", "tic tac toe", "infinite"] },
    { title: "Pong",                          url: "/pages/fun/pong.html",                        tags: ["fun", "game", "pong"] },
    { title: "ID Generator",                  url: "/pages/fun/ausweis.html",                     tags: ["fun", "generator", "id", "ausweis", "personalausweis"] },
    { title: "License Generator",             url: "/pages/fun/fuehrerschein.html",               tags: ["fun", "generator", "license", "führerschein"] },
    { title: "Coin Generator",                url: "/pages/fun/muenze.html",                      tags: ["fun", "generator", "coin", "münze"] },
    { title: "News Generator",                url: "/pages/fun/nachrichten.html",                 tags: ["fun", "generator", "news", "nachrichten"] },
    { title: "Trading Card Generator",        url: "/pages/fun/sammelkarte.html",                 tags: ["fun", "generator", "trading card", "sammelkarte"] },
    { title: "Certificate Generator",         url: "/pages/fun/urkunde.html",                     tags: ["fun", "generator", "certificate", "urkunde"] },
    { title: "Newspaper Generator",           url: "/pages/fun/zeitung.html",                     tags: ["fun", "generator", "newspaper", "zeitung"] },
    { title: "Report Card Generator",         url: "/pages/fun/zeugnis.html",                     tags: ["fun", "generator", "report card", "zeugnis"] },
    { title: "Custom Puzzle Generator",       url: "/pages/fun/puzzle.html",                      tags: ["fun", "generator", "puzzle"] },
    // Stuff
    { title: "Git",                           url: "/pages/stuff/git.html",                       tags: ["stuff", "git", "programming", "guide"] },
    { title: "HTML",                          url: "/pages/stuff/html.html",                      tags: ["stuff", "html", "programming", "guide"] },
    { title: "C",                             url: "/pages/stuff/c.html",                         tags: ["stuff", "c", "programming", "guide"] },
    { title: "Math History",                  url: "/pages/stuff/math-history.html",              tags: ["stuff", "math", "history", "mathematics"] },
    { title: "Math Prerequisites",            url: "/pages/stuff/math-prereq.html",               tags: ["stuff", "math", "prerequisites", "mathematics"] },
];

/* =============================================================
   ENGINES
============================================================= */

const engines = {
    google: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    ddg:    q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    brave:  q => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    ecosia: q => `https://www.ecosia.org/search?q=${encodeURIComponent(q)}`,
    yandex: q => `https://yandex.com/search/?text=${encodeURIComponent(q)}`,
};

/* =============================================================
   SHORTCUT COMMANDS
============================================================= */
const shortcutBases = {
    yt:        "https://www.youtube.com",
    gh:        "https://github.com",
    r:         "https://www.reddit.com",
    w:         "https://en.wikipedia.org",
    mdn:       "https://developer.mozilla.org",
    so:        "https://stackoverflow.com",
    npm:       "https://www.npmjs.com",
    maps:      "https://maps.google.com",
    img:       "https://images.google.com",
    tw:        "https://x.com",
    bp:        "https://bulbapedia.bulbagarden.net",
    pw:        "https://www.pokewiki.de",
    ig:        "https://www.instagram.com",
    emoji:     "https://emojipedia.org",
    op:        "https://onepiece.tube",
    ud:        "https://www.urbandictionary.com",
};

const shortcuts = {
    yt:        q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
    gh:        q => `https://github.com/search?q=${encodeURIComponent(q)}`,
    r:         q => `https://www.reddit.com/search/?q=${encodeURIComponent(q)}`,
    w:         q => `https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(q)}`,
    mdn:       q => `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(q)}`,
    so:        q => `https://stackoverflow.com/search?q=${encodeURIComponent(q)}`,
    npm:       q => `https://www.npmjs.com/search?q=${encodeURIComponent(q)}`,
    maps:      q => `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
    img:       q => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`,
    tw:        q => `https://x.com/search?q=${encodeURIComponent(q)}`,
    bp:        q => `https://bulbapedia.bulbagarden.net/wiki/Special:Search?search=${encodeURIComponent(q)}`,
    pw:        q => `https://www.pokewiki.de/Spezial:Suche?search=${encodeURIComponent(q)}`,
    ig:        q => `https://www.instagram.com/${encodeURIComponent(q)}/`,
    emoji:     q => `https://emojipedia.org/search/?q=${encodeURIComponent(q)}`,
    op:        q => `https://onepiece.tube/anime/folge/${encodeURIComponent(q)}`,
    ud:        q => `https://www.urbandictionary.com/define.php?term=${encodeURIComponent(q)}`,
};

/* =============================================================
   HELPERS
============================================================= */

function isURL(str) {
    if (/\s/.test(str)) return false;
    return /^https?:\/\/.+/.test(str)
        || /^www\..+\..+/.test(str)
        || /^[^\s.]+\.[a-zA-Z]{2,}(\/.*)?$/.test(str);
}

function normalizeURL(str) {
    return /^https?:\/\//.test(str) ? str : `https://${str}`;
}

function isMath(str) {
    return /\d/.test(str)
        && /[+\-*/^%]/.test(str)
        && /^[\d\s().+\-*/^%]+$/.test(str.trim());
}

function evalMath(expr) {
    try {
        const val = Function(`"use strict"; return (${expr})`)();
        if (typeof val === "number" && isFinite(val)) return val;
    } catch { /* ignore */ }
    return null;
}

/* =============================================================
   RESULTS BOX HELPERS
============================================================= */

function getBox() {
    return document.getElementById("site-results");
}

function isShowingCalc() {
    const label = getBox().querySelector(".sr-label");
    return label && label.textContent.trim() === "calculator";
}

function isShowingShortcut() {
    const label = getBox().querySelector(".sr-label");
    return label && label.textContent.trim().startsWith("shortcut");
}

function showCalc(val) {
    const box = getBox();
    box.style.display = "block";
    box.innerHTML = `<div class="sr-label">calculator</div><a>= ${val}</a>`;
}

function showShortcutHint(keyword, query) {
    const box = getBox();
    box.style.display = "block";
    if (!query) {
        box.innerHTML = `<div class="sr-label">shortcut → ${keyword}</div><a>Press Enter to open <b>${shortcutBases[keyword]}</b></a>`;
    } else {
        box.innerHTML = `<div class="sr-label">shortcut → ${keyword}</div><a>Press Enter to search <b>${query}</b></a>`;
    }
}

function clearSpecialResults() {
    if (isShowingCalc() || isShowingShortcut()) {
        const box = getBox();
        box.style.display = "none";
        box.innerHTML = "";
    }
}

/* =============================================================
   ENGINE / RECENT SEARCH PERSISTENCE
============================================================= */

function clearSearchInput() {
    const input = document.getElementById("search-input");
    input.value = "";
    input.focus();
    filterSite();
}

function saveEngine() {
    localStorage.setItem("preferredEngine", document.getElementById("engine-select").value);
}

function loadEngine() {
    const saved = localStorage.getItem("preferredEngine");
    if (saved) document.getElementById("engine-select").value = saved;
}

function saveSearch(q) {
    if (!q) return;
    let recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    recent = [q, ...recent.filter(r => r !== q)].slice(0, 10);
    localStorage.setItem("recentSearches", JSON.stringify(recent));
}

function getRecentSearches() {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
}

/* =============================================================
   FAVORITES
============================================================= */

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function isFavorite(url) {
    return getFavorites().some(f => f.url === url);
}

function toggleFavorite(url, title) {
    let favs = getFavorites();
    const idx = favs.findIndex(f => f.url === url);
    if (idx === -1) favs.push({ url, title });
    else            favs.splice(idx, 1);
    localStorage.setItem("favorites", JSON.stringify(favs));
    filterSite();
    renderFavoritesBar();
    renderFavoritesSidebar();
}

function toggleFavoriteSearch(query) {
    const engine = document.getElementById("engine-select").value;
    const url = engines[engine](query);
    toggleFavorite(url, query);
}

function renderFavoritesBar() {
    const bar = document.getElementById("favorites-bar");
    if (!bar) return;
    const favs = getFavorites();
    if (!favs.length) { bar.innerHTML = ""; return; }
    bar.innerHTML =
        `<details id="fav-details">
            <summary><img src="/assets/smileys/star.png" style="width:12px;height:12px;image-rendering:pixelated;vertical-align:middle;"> Favorites (${favs.length})</summary>
            <div id="favorites-list">
                ${favs.map(f =>
                    `<div class="fav-item">
                        <a href="${f.url}">${f.title}</a>
                        <button class="fav-remove" onclick="toggleFavorite('${f.url.replace(/'/g,"\\'")}','${f.title.replace(/'/g,"\\'")}')"><img src="/assets/smileys/star.png" style="width:12px;height:12px;image-rendering:pixelated;vertical-align:middle;"></button>
                    </div>`
                ).join("")}
            </div>
        </details>`;
}

function renderFavoritesSidebar() {
    const sidebar = document.getElementById("favorites-sidebar");
    if (!sidebar) return;
    const favs = getFavorites();
    if (!favs.length) { sidebar.innerHTML = ""; return; }
    const base = window.location.origin;
    sidebar.innerHTML = favs.map(f => {
        const domain = f.url.startsWith("http") ? new URL(f.url).origin : base;
        return `<a href="${f.url}" title="${f.title}" class="fav-icon">
            <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=16"
                 onerror="this.src='/favicon.ico'">
        </a>`;
    }).join("");
}

/* =============================================================
   SITE SEARCH / SUGGESTIONS
============================================================= */

function clearRecentSearches() {
    localStorage.removeItem("recentSearches");
    const box = getBox();
    box.style.display = "none";
    box.innerHTML = "";
}

function recentBlock(matches) {
    return '<div class="sr-label">Recent searches</div>' +
        matches.map(r => {
            const engine  = document.getElementById("engine-select").value;
            const starred = isFavorite(engines[engine](r));
            const safeR   = r.replace(/'/g, "\\'");
            return `<div class="sr-item">
                <a class="sr-recent" href="#" onclick="fillSearch(event,'${safeR}')">
                    <img src="/assets/smileys/3oclock.png" style="width:15px;height:15px;vertical-align:-2px;image-rendering:pixelated;"> ${r}
                </a>
                <button class="sr-star${starred ? " starred" : ""}"
                    onclick="event.preventDefault();event.stopPropagation();toggleFavoriteSearch('${safeR}')">
                    <img src="/assets/smileys/star.png" style="width:12px;height:12px;image-rendering:pixelated;vertical-align:middle;">
                </button>
            </div>`;
        }).join("") +
        `<a href="#" class="sr-clear" onclick="event.preventDefault();clearRecentSearches()">
            <img src="/assets/smileys/milk.png" style="width:12px;height:12px;image-rendering:pixelated;vertical-align:middle;"> Clear recent searches
        </a>`;
}

function renderResults(siteMatches, recentMatches) {
    const box = getBox();
    let html = "";

    if (recentMatches.length) html += recentBlock(recentMatches);
    if (siteMatches.length) {
        html += '<div class="sr-label">On this site</div>' +
            siteMatches.map(p => {
                const starred   = isFavorite(p.url);
                const safeUrl   = p.url.replace(/'/g, "\\'");
                const safeTitle = p.title.replace(/'/g, "\\'");
                return `<div class="sr-item">
                    <a href="${p.url}">${p.title}</a>
                    <button class="sr-star${starred ? " starred" : ""}"
                        onclick="event.preventDefault();event.stopPropagation();toggleFavorite('${safeUrl}','${safeTitle}')">
                        <img src="/assets/smileys/star.png" style="width:12px;height:12px;image-rendering:pixelated;vertical-align:middle;">
                    </button>
                </div>`;
            }).join("");
    }

    if (!html) { box.style.display = "none"; box.innerHTML = ""; return; }
    box.innerHTML = html;
    box.style.display = "block";
}

function fillSearch(e, q) {
    e.preventDefault();
    document.getElementById("search-input").value = q;
    doSearch();
}

function filterSite() {
    const raw = document.getElementById("search-input").value;
    const q   = raw.trim().toLowerCase();
    const box = getBox();

    if (isShowingCalc() || isShowingShortcut()) return;

    if (!q) {
        const recent = getRecentSearches();
        if (!recent.length) { box.style.display = "none"; box.innerHTML = ""; return; }
        box.innerHTML = recentBlock(recent);
        box.style.display = "block";
        return;
    }

    const siteMatches   = sitePages.filter(p =>
        p.title.toLowerCase().includes(q) || p.tags.some(t => t.includes(q))
    );
    const recentMatches = getRecentSearches().filter(r => r.toLowerCase().includes(q));
    renderResults(siteMatches, recentMatches);
}

/* =============================================================
   DOSEARCH — single entry point
============================================================= */

function doSearch() {
    const text = document.getElementById("search-input").value.trim();
    if (!text) return;

    saveSearch(text);

    const engine = document.getElementById("engine-select").value;

    if (text.startsWith('"') && text.endsWith('"') && text.length > 1) {
        const exactQuery = text.slice(1, -1);
        window.location.href = engines[engine](exactQuery);
        return;
    }

    const spaceAt  = text.indexOf(" ");
    const hasSpace = spaceAt !== -1;
    const keyword  = (hasSpace ? text.slice(0, spaceAt) : text).toLowerCase();
    const query    = hasSpace ? text.slice(spaceAt + 1).trim() : "";

    if (shortcuts[keyword]) {
        if (query) {
            window.location.href = shortcuts[keyword](query);
        } else {
            window.location.href = shortcutBases[keyword];
        }
        return;
    }

    if (!hasSpace && isURL(text)) {
        window.location.href = normalizeURL(text);
        return;
    }

    if (isMath(text)) {
        const val = evalMath(text);
        if (val !== null) { showCalc(val); return; }
    }

    window.location.href = engines[engine](text);
}

/* =============================================================
   LIVE INPUT HANDLER
============================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadEngine();
    renderFavoritesBar();
    renderFavoritesSidebar();

    const input = document.getElementById("search-input");

    input.focus();

    input.addEventListener("focus", () => {
        filterSite();
    });

    input.addEventListener("input", () => {
        const text = input.value.trim();

        if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
            clearSpecialResults();
            filterSite();
            return;
        }

        const spaceAt  = text.indexOf(" ");
        const hasSpace = spaceAt !== -1;
        const keyword  = (hasSpace ? text.slice(0, spaceAt) : text).toLowerCase();
        const query    = hasSpace ? text.slice(spaceAt + 1).trim() : "";

        if (shortcuts[keyword]) {
            showShortcutHint(keyword, query);
            return;
        }

        if (isMath(text)) {
            const val = evalMath(text);
            if (val !== null) { showCalc(val); return; }
        }

        clearSpecialResults();
        filterSite();
    });

    document.addEventListener("click", e => {
        if (!e.target.closest("#search-bar") && !e.target.closest("#site-results")) {
            const box = getBox();
            box.style.display = "none";
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "/" && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
        if (e.key === "Escape") {
            input.blur();
        }
        if (e.key === "Enter" && document.activeElement === input) {
            doSearch();
        }
    });
});