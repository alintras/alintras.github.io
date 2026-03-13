document.addEventListener("DOMContentLoaded", function () {
  var sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  function item(emoji, href, label) {
    return `<table cellpadding="0" cellspacing="0"><tr>
      <td valign="top">${emoji}&nbsp;</td>
      <td><a href="${href}">${label}</a></td>
    </tr></table>`;
  }

  sidebar.innerHTML = `
    <b id="nav-toggle">Navigation</b>
    <div id="sidebar-body"><br><br>
    🏠&#xFE0E; <a href="/index.html">Home</a><br><br>
    <details>
      <summary>🛠️ Tools</summary>
      ${item("✉️", "/pages/tools/wondermail/wondermail.html", "PMD RT Wondermail Generator")}
      ${item("💣", "/pages/tools/voltorb-solver.html", "HGSS Voltorb Solver")}
      ${item("🔢", "/pages/tools/cps-counter.html", "CPS Counter")}
      ${item("🔒", "/pages/tools/password-generator.html", "Password Generator")}
      ${item("📐", "/pages/tools/unit-converter.html", "Unit Converter")}
      ${item("💬", "/pages/tools/random-quote-generator.html", "Quote Generator")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/laugh.gif" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Fun</summary>
      ${item("🎲", "/pages/fun/simple-physics.html", "Simple Physics")}
      ${item("💘", "/pages/fun/love-calculator.html", "Love Compatibility Calculator")}
      ${item("👩‍❤️‍💋‍👨", "/pages/fun/vivi.html", "Valentines 2026")}
      ${item("🪪", "/pages/fun/ausweis.html", "ID Generator")}
      ${item("🚗", "/pages/fun/fuehrerschein.html", "License Generator")}
      ${item("🪙", "/pages/fun/muenze.html", "Coin Generator")}
      ${item("📰", "/pages/fun/nachrichten.html", "News Generator")}
      ${item("🎴", "/pages/fun/sammelkarte.html", "Trading Card Generator")}
      ${item("📜", "/pages/fun/urkunde.html", "Certificate Generator")}
      ${item("🗞️", "/pages/fun/zeitung.html", "Newspaper Generator")}
      ${item("📇", "/pages/fun/zeugnis.html", "Report Card Generator")}
      ${item("🧩", "/pages/fun/puzzle.html", "Custom Puzzle Generator")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/mario.gif" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Games</summary>
      ${item("🏝️", "/pages/games/castaway/castaway.html", "Castaway")}
      ${item("❗", "/pages/games/mroops.html", "Mr.Oops!!")}
      ${item("❌", "/pages/games/infinite-ttt.html", "Infinite TicTacToe")}
      ${item("🏓", "/pages/games/pong.html", "Pong")}
      ${item("⭕", "/pages/games/perfect-circle.html", "Perfect Circle Game")}
    </details><br>
    <details>
      <summary>📚 Stuff</summary>
      ${item("💡", "/pages/stuff/git.html", "Git")}
      ${item("👩‍💻", "/pages/stuff/html.html", "HTML")}
      ${item("👨‍💻", "/pages/stuff/c.html", "C")}
      ${item("🧮", "/pages/stuff/math-history.html", "Math History")}
      ${item("🧮", "/pages/stuff/math-prereq.html", "Math Prerequisites")}
    </details><br>
    ${item("🫂", "/pages/about.html", "About")}
    </div>
  `;

  var toggle = document.getElementById("nav-toggle");
  var layoutSidebar = document.getElementById("layout-sidebar");

  if (localStorage.getItem("sidebarCollapsed") === "1") {
    layoutSidebar.classList.add("collapsed");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    layoutSidebar.classList.toggle("collapsed");
    localStorage.setItem("sidebarCollapsed",
      layoutSidebar.classList.contains("collapsed") ? "1" : "0");
  });

  layoutSidebar.addEventListener("click", function () {
    if (layoutSidebar.classList.contains("collapsed")) {
      layoutSidebar.classList.remove("collapsed");
      localStorage.setItem("sidebarCollapsed", "0");
    }
  });
});