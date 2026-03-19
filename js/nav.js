document.addEventListener("DOMContentLoaded", function () {
  var sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  function item(emoji, href, label) {
    return `<table cellpadding="0" cellspacing="0"><tr>
      <td valign="top">${emoji}&nbsp;</td>
      <td><a href="${href}">${label}</a></td>
    </tr></table>`;
  }
  /*  ${item(`<img src="/assets/smileys/bomb.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/voltorb-solver.html", "HGSS Voltorb Solver")} */
  sidebar.innerHTML = `
    <b id="nav-toggle">Navigation</b>
    <div id="sidebar-body"><br><br>
    <a href="/../index.html"><img src="/assets/smileys/vhome.PNG" style="width:18px; height:18px; vertical-align:-2px; image-rendering:pixelated;"> Home</a><br><br>
    <details>
      <summary><img src="/assets/smileys/pickaxe.png" style="width:16px; height:16px; vertical-align:-2px; image-rendering:pixelated;"> Tools</summary>
      ${item(`<img src="/assets/smileys/mail.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/wondermail/wondermail.html", "PMD RT Wondermail Gen")}
      ${item(`<img src="/assets/smileys/pokeball.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/pokefinder.html", "GEN 3 Pokémon Finder")}
      ${item(`<img src="/assets/smileys/squirtle.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/iv-calc.html", "GEN 3 IV Calc")}
      ${item(`<img src="/assets/smileys/pencil.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/pixelart.html", "Pixel Artist")}
      ${item(`<img src="/assets/smileys/count.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/cps-counter.html", "CPS Counter")}
      ${item(`<img src="/assets/smileys/lock.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/password-generator.html", "Password Gen")}
      ${item(`<img src="/assets/smileys/unit-calc.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/unit-converter.html", "Unit Converter")}
      ${item(`<img src="/assets/smileys/thbubble.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/random-quote-generator.html", "Quote Gen")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/laugh.gif" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Fun</summary>
      ${item(`<img src="/assets/smileys/love-calc.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/love-calculator.html", "Love Calc")}
      ${item(`<img src="/assets/smileys/valentine.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/vivi.html", "Valentines2026")}
      ${item(`<img src="/assets/smileys/ID.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/ausweis.html", "ID Gen")}
      ${item(`<img src="/assets/smileys/car.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/fuehrerschein.html", "License Gen")}
      ${item(`<img src="/assets/smileys/coin.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/muenze.html", "Coin Gen")}
      ${item(`<img src="/assets/smileys/desktop.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/nachrichten.html", "News Gen")}
      ${item(`<img src="/assets/smileys/cards.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/sammelkarte.html", "Trading Card Gen")}
      ${item(`<img src="/assets/smileys/cert.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/urkunde.html", "Certificate Gen")}
      ${item(`<img src="/assets/smileys/newsp.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/zeitung.html", "Newspaper Gen")}
      ${item(`<img src="/assets/smileys/memo.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/zeugnis.html", "Report Card Gen")}
      ${item(`<img src="/assets/smileys/puzzle.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/puzzle.html", "Custom Puzzle Gen")}
      ${item(`<img src="/assets/smileys/dice.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/simple-physics.html", "Physics Test")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/mario.gif" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Games</summary>
      ${item(`<img src="/assets/smileys/myisland.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/castaway/castaway.html", "Castaway")}
      ${item(`<img src="/assets/smileys/excl.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/mroops.html", "Mr.Oops!!")}
      ${item(`<img src="/assets/smileys/X.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/infinite-ttt.html", "NEW TicTacToe")}
      ${item(`<img src="/assets/smileys/joystick.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/pong.html", "Pong")}
      ${item(`<img src="/assets/smileys/O.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/perfect-circle.html", "Perfect Circle")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/notebook.png" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Stuff</summary>
      ${item(`<img src="/assets/smileys/bulb.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/git.html", "Git")}
      ${item(`<img src="/assets/smileys/code-woman.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/html.html", "HTML")}
      ${item(`<img src="/assets/smileys/code-man.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/c.html", "C")}
      ${item(`<img src="/assets/smileys/counter.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/math-history.html", "Math History")}
      ${item(`<img src="/assets/smileys/counter.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/math-prereq.html", "Math Prereq")}
    </details><br>
    ${item(`<img src="/assets/smileys/person.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/about.html", "About")}
    </div>
  `;

  var toggle = document.getElementById("nav-toggle");
  var layoutSidebar = document.getElementById("layout-sidebar");

  if (localStorage.getItem("sidebarCollapsed") === "1") {
    layoutSidebar.classList.add("collapsed");
} else {
    document.body.classList.add("sidebar-open");  // ← only when open
}

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    layoutSidebar.classList.toggle("collapsed");
    document.body.classList.toggle("sidebar-open");  // ← add
    localStorage.setItem("sidebarCollapsed",
      layoutSidebar.classList.contains("collapsed") ? "1" : "0");
  });

  layoutSidebar.addEventListener("click", function () {
    if (layoutSidebar.classList.contains("collapsed")) {
      layoutSidebar.classList.remove("collapsed");
      document.body.classList.add("sidebar-open");  // ← add
      localStorage.setItem("sidebarCollapsed", "0");
    }
  });
});