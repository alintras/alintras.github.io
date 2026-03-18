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
      ${item(`<img src="/assets/smileys/mail.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/wondermail/wondermail.html", "PMD RT Wondermail Generator")}
      ${item(`<img src="/assets/smileys/pencil.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/pixelart.html", "Pixel Art Maker")}
      ${item(`<img src="/assets/smileys/count.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/cps-counter.html", "CPS Counter")}
      ${item(`<img src="/assets/smileys/lock.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/password-generator.html", "Password Generator")}
      ${item(`<img src="/assets/smileys/unit-calc.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/unit-converter.html", "Unit Converter")}
      ${item(`<img src="/assets/smileys/thbubble.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/tools/random-quote-generator.html", "Quote Generator")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/laugh.gif" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Fun</summary>
      ${item(`<img src="/assets/smileys/love-calc.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/love-calculator.html", "Love Compatibility Calculator")}
      ${item(`<img src="/assets/smileys/valentine.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/vivi.html", "Valentines 2026")}
      ${item(`<img src="/assets/smileys/dice.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/simple-physics.html", "Simple Physics")}
      ${item(`<img src="/assets/smileys/ID.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/ausweis.html", "ID Generator")}
      ${item(`<img src="/assets/smileys/car.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/fuehrerschein.html", "License Generator")}
      ${item(`<img src="/assets/smileys/coin.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/muenze.html", "Coin Generator")}
      ${item(`<img src="/assets/smileys/desktop.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/nachrichten.html", "News Generator")}
      ${item(`<img src="/assets/smileys/cards.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/sammelkarte.html", "Trading Card Generator")}
      ${item(`<img src="/assets/smileys/cert.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/urkunde.html", "Certificate Generator")}
      ${item(`<img src="/assets/smileys/newsp.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/zeitung.html", "Newspaper Generator")}
      ${item(`<img src="/assets/smileys/memo.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/zeugnis.html", "Report Card Generator")}
      ${item(`<img src="/assets/smileys/puzzle.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/fun/puzzle.html", "Custom Puzzle Generator")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/mario.gif" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Games</summary>
      ${item(`<img src="/assets/smileys/myisland.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/castaway/castaway.html", "Castaway")}
      ${item(`<img src="/assets/smileys/excl.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/mroops.html", "Mr.Oops!!")}
      ${item(`<img src="/assets/smileys/X.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/infinite-ttt.html", "Infinite TicTacToe")}
      ${item(`<img src="/assets/smileys/joystick.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/pong.html", "Pong")}
      ${item(`<img src="/assets/smileys/O.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/games/perfect-circle.html", "Perfect Circle Game")}
    </details><br>
    <details>
      <summary><img src="/assets/smileys/notebook.png" style="width:16px; height:16px; vertical-align:middle; image-rendering:pixelated;"> Stuff</summary>
      ${item(`<img src="/assets/smileys/bulb.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/git.html", "Git")}
      ${item(`<img src="/assets/smileys/code-woman.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/html.html", "HTML")}
      ${item(`<img src="/assets/smileys/code-man.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/c.html", "C")}
      ${item(`<img src="/assets/smileys/counter.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/math-history.html", "Math History")}
      ${item(`<img src="/assets/smileys/counter.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/stuff/math-prereq.html", "Math Prerequisites")}
    </details><br>
    ${item(`<img src="/assets/smileys/person.png" style="width:16px;height:16px;vertical-align:middle;image-rendering:pixelated;">`, "/pages/about.html", "About")}
    </div>
  `;

  var toggle = document.getElementById("nav-toggle");
  var layoutSidebar = document.getElementById("layout-sidebar");

  if (localStorage.getItem("sidebarCollapsed") === "1") {
    layoutSidebar.classList.add("collapsed");
  }
  document.body.classList.add("sidebar-open");  // ← add

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