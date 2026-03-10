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
    <b>Navigation</b><br><br>

    🏠 <a href="/index.html">Home</a><br><br>

    <details>
      <summary>🛠️ Tools</summary>
      ${item("✉️", "/pages/tools/wondermail/wondermail.html", "PMD RT Wondermail Generator")}
      ${item("💣", "/pages/tools/voltorb-solver.html", "HGSS Voltorb Solver")}
      ${item("🔢", "/pages/tools/cps-counter.html", "CPS Counter")}
      ${item("🔒", "/pages/tools/password-generator.html", "Password Generator")}
      ${item("📐", "/pages/tools/unit-converter.html", "Unit Converter")}
      ${item("💬", "/pages/tools/random-quote-generator.html", "Quote Generator")}
    </details>
    <br>

    <details>
      <summary>🎮 Fun</summary>
      ${item("🎲", "/pages/fun/simple-physics.html", "Simple Physics")}
      ${item("🏝️", "/pages/fun/castaway/castaway.html", "Castaway")}
      ${item("❗", "/pages/fun/mroops.html", "Mr.Oops!!")}
      ${item("💘", "/pages/fun/love-calculator.html", "Love Compatibility Calculator")}
      ${item("👩‍❤️‍💋‍👨", "/pages/fun/vivi.html", "Valentines 2026")}
      ${item("⭕", "/pages/fun/perfect-circle.html", "Perfect Circle Game")}
      ${item("❌", "/pages/fun/infinite-ttt.html", "Infinite TicTacToe")}
      ${item("🏓", "/pages/fun/pong.html", "Pong")}
      ${item("🪪", "/pages/fun/ausweis.html", "ID Generator")}
      ${item("🚗", "/pages/fun/fuehrerschein.html", "License Generator")}
      ${item("🪙", "/pages/fun/muenze.html", "Coin Generator")}
      ${item("🗞️", "/pages/fun/nachrichten.html", "News Generator")}
      ${item("🎴", "/pages/fun/sammelkarte.html", "Trading Card Generator")}
      ${item("📜", "/pages/fun/urkunde.html", "Certificate Generator")}
      ${item("📰", "/pages/fun/zeitung.html", "Newspaper Generator")}
      ${item("📇", "/pages/fun/zeugnis.html", "Report Card Generator")}
      ${item("🧩", "/pages/fun/puzzle.html", "Custom Puzzle Generator")}
    </details>
    <br>

    <details>
      <summary>📚 Stuff</summary>
      ${item("💡", "/pages/stuff/git.html", "Git")}
      ${item("👩‍💻", "/pages/stuff/html.html", "HTML")}
      ${item("👨‍💻", "/pages/stuff/c.html", "C")}
      ${item("🧮", "/pages/stuff/math-history.html", "Math History")}
      ${item("🧮", "/pages/stuff/math-prereq.html", "Math Prerequisites")}
    </details>
  `;
});