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

const engines = {
    google: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    ddg:    q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    brave:  q => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
};

function saveEngine() {
    localStorage.setItem("preferredEngine", document.getElementById("engine-select").value);
}

function loadEngine() {
    const saved = localStorage.getItem("preferredEngine");
    if (saved) document.getElementById("engine-select").value = saved;
}

function saveSearch(q) {
    let recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    recent = [q, ...recent.filter(r => r !== q)].slice(0, 10);
    localStorage.setItem("recentSearches", JSON.stringify(recent));
}

function getRecentSearches() {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
}

function renderResults(siteMatches, recentMatches) {
    const box = document.getElementById("site-results");
    let html = "";

    if (recentMatches.length) {
        html += '<div class="sr-label">Recent searches</div>' +
            recentMatches.map(r => `<a class="sr-recent" href="#" onclick="fillSearch(event,'${r.replace(/'/g,"\\'")}')">🕐 ${r}</a>`).join("");
    }
    if (siteMatches.length) {
        html += '<div class="sr-label">On this site</div>' +
            siteMatches.map(p => `<a href="${p.url}">${p.title}</a>`).join("");
    }

    if (!html) { box.style.display = "none"; box.innerHTML = ""; return; }
    box.innerHTML = html;
    box.style.display = "block";
}

function fillSearch(e, q) {
    e.preventDefault();
    document.getElementById("search-input").value = q;
    filterSite();
}

function filterSite() {
    const q = document.getElementById("search-input").value.trim().toLowerCase();
    const box = document.getElementById("site-results");

    if (!q) {
        const recent = getRecentSearches();
        if (!recent.length) { box.style.display = "none"; box.innerHTML = ""; return; }
        box.innerHTML = '<div class="sr-label">Recent searches</div>' +
            recent.map(r => `<a class="sr-recent" href="#" onclick="fillSearch(event,'${r.replace(/'/g,"\\'")}')"> 🕐&#xFE0E; ${r}</a>`).join("");
        box.style.display = "block";
        return;
    }

    const siteMatches = sitePages.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
    );

    const recentMatches = getRecentSearches().filter(r => r.toLowerCase().includes(q));

    renderResults(siteMatches, recentMatches);
}

function doSearch() {
    const q = document.getElementById("search-input").value.trim();
    if (!q) return;
    saveSearch(q);
    const engine = document.getElementById("engine-select").value;
    window.location.href = engines[engine](q);
}

document.addEventListener("DOMContentLoaded", () => {
    loadEngine();

    document.getElementById("search-input").addEventListener("focus", () => {
        filterSite();
    });

    document.addEventListener("click", e => {
        if (!e.target.closest("#search-bar") && !e.target.closest("#site-results")) {
            const box = document.getElementById("site-results");
            box.style.display = "none";
        }
    });
});