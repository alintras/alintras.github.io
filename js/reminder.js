function initReminder(options) {
  var opts = Object.assign({
    ip: 'alintras.duckdns.org',
    version: '1.8.x',
    maxPlayers: 5,
    hostNote: 'hosted on a 1GB RAM netbook on my desk',
    statusUrl: 'https://api.mcsrvstat.us/3/' + encodeURIComponent('alintras.duckdns.org'),
    logStatsUrl: 'mc-status.json'
  }, options || {});

  var bar = document.createElement('div');
  bar.id = 'mc-bottom-bar';
  bar.className = 'mc-bottom-bar';

  bar.innerHTML =
    '<div id="_mc-panel" class="mc-panel" hidden>' +
      '<div class="mc-panel-header">' +
        '<span class="mc-muted">' + esc(opts.hostNote) + '</span><span id="_mc-stats"></span>' +
      '</div>' +
      '<div id="_mc-events" class="mc-events"></div>' +
    '</div>' +
    '<div id="_mc-main-row" class="mc-main-row">' +
      '<span class="mc-status-group" title="' + esc(opts.hostNote) + '">' +
        '<span id="_mc-dot" class="mc-status-dot">●</span>' +
        '<span id="_mc-status" class="mc-status">minecraft ' + esc(opts.version) + ' · ?/' + esc(opts.maxPlayers) + '</span>' +
      '</span>' +
      '<span class="mc-controls">' +
        '<button id="_mc-copy" class="mc-button mc-copy" type="button" title="' + esc(opts.hostNote) + '">' + esc(opts.ip) + '</button>' +
        '<button id="_mc-toggle" class="mc-button" type="button">log</button>' +
        '<button id="_mc-collapse" class="mc-button" type="button" title="minimize">▾</button>' +
      '</span>' +
    '</div>' +
    '<div id="_mc-mini-row" class="mc-mini-row">' +
      '<button id="_mc-expand" class="mc-button" type="button" title="show mc status">▴</button>' +
    '</div>';

  document.body.appendChild(bar);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function setMinimized(min) {
    var panel   = document.getElementById('_mc-panel');
    var togBtn  = document.getElementById('_mc-toggle');

    if (min) {
      panel.hidden = true;
      togBtn.textContent = 'log';
      bar.classList.add('is-minimized');
      localStorage.setItem('mcBarMinimized', '1');
    } else {
      bar.classList.remove('is-minimized');
      localStorage.removeItem('mcBarMinimized');
    }
  }

  if (localStorage.getItem('mcBarMinimized') === '1') {
    setMinimized(true);
  }

  document.getElementById('_mc-collapse').addEventListener('click', function() {
    setMinimized(true);
  });

  document.getElementById('_mc-expand').addEventListener('click', function() {
    setMinimized(false);
  });

  var curOnline = '?', curMax = opts.maxPlayers, curVer = opts.version;
  function upd() {
    var el = document.getElementById('_mc-status');
    if (el) el.textContent = 'minecraft ' + curVer + ' | ' + curOnline + '/' + curMax;
  }

  document.getElementById('_mc-copy').addEventListener('click', function() {
    var b = this, orig = opts.ip;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(opts.ip).then(function() {
        b.textContent = 'copied!';
        clearTimeout(b._mcTimer);
        b._mcTimer = setTimeout(function() { b.textContent = orig; }, 5000);
      });
    }
  });

  document.getElementById('_mc-toggle').addEventListener('click', function() {
    var p = document.getElementById('_mc-panel'), open = p.hidden;
    p.hidden = !open;
    this.textContent = open ? 'log ▾' : 'log';
    if (open) { loadDetails(); }
  });

  function updateMainStatus() {
    fetch(opts.statusUrl).then(function(r) { return r.json(); }).then(function(d) {
      var dot = document.getElementById('_mc-dot');
      if (d && d.online) {
        dot.style.color = '#2ecc71';
        curOnline = (d.players && typeof d.players.online === 'number') ? d.players.online : 0;
        curMax = (d.players && typeof d.players.max === 'number') ? d.players.max : opts.maxPlayers;
      } else {
        dot.style.color = '#e74c3c';
        curOnline = 0;
      }
      upd();
    }).catch(function() {
      var dot = document.getElementById('_mc-dot');
      if (dot) dot.style.color = '#e74c3c';
    });
  }

  updateMainStatus();
  setInterval(function() {
    updateMainStatus();
    var p = document.getElementById('_mc-panel');
    if (p && !p.hidden) {
      loadDetails();
    }
  }, 60000);

  function loadDetails() {
    var ev = document.getElementById('_mc-events'), st = document.getElementById('_mc-stats');
    ev.innerHTML = '<span class="mc-muted">loading log...</span>';
    fetch(opts.logStatsUrl, { cache: 'no-store' })
      .then(function(r) { if (!r.ok) throw 0; return r.json(); })
      .then(function(j) {
        if (j.stats) {
          var arr = [];
          if (typeof j.stats.totalPlayers === 'number') arr.push('players: ' + j.stats.totalPlayers);
          if (j.stats.topPlaytime) arr.push('top: ' + j.stats.topPlaytime);
          if (j.stats.updated) arr.push('upd ' + j.stats.updated);
          st.textContent = arr.join(' · ');
        }
        if (Array.isArray(j.events) && j.events.length) {
          ev.innerHTML = j.events.slice(-8).reverse().map(function(e) {
            var join = e.type === 'join';
            return '<div class="mc-event">' +
              '<span class="mc-muted">' + esc(e.time || '--:--') + '</span>' +
              '<span class="mc-event-action ' + (join ? 'is-join' : 'is-leave') + '">' + (join ? '+' : '-') + '</span>' +
              '<span>' + esc(e.player) + ' <span class="mc-muted">' + (join ? 'joined' : 'left') + '</span></span>' +
            '</div>';
          }).join('');
        } else {
          ev.innerHTML = '<span class="mc-muted">no recent joins/leaves</span>';
        }
      })
      .catch(function() {
        ev.innerHTML = '<span class="mc-muted">no mc-status.json found yet</span>';
      });
  }
}