function initReminder(options) {
  var opts = Object.assign({
    ip: 'alintras.duckdns.org',
    version: '1.8.8',
    maxPlayers: 5,
    hostNote: 'hosted on a 1GB RAM netbook on my desk',
    statusUrl: 'https://api.mcsrvstat.us/3/' + encodeURIComponent('alintras.duckdns.org'),
    logStatsUrl: 'mc-status.json'
  }, options || {});

  if (localStorage.getItem('mcBarHidden')) return;

  var dark = document.documentElement.classList.contains('dark') ||
             document.body.classList.contains('dark') ||
             document.body.classList.contains('dark-mode') ||
             document.body.getAttribute('data-theme') === 'dark' ||
             window.matchMedia('(prefers-color-scheme: dark)').matches;

  var bg    = dark ? '#111' : '#fff';
  var fg    = dark ? '#fff' : '#000';
  var muted = dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

  var bar = document.createElement('div');
  bar.id = 'mc-bottom-bar';
  Object.assign(bar.style, {
    position: 'fixed', bottom: '0', left: '0', right: '0',
    background: bg, color: fg, borderTop: '1px solid ' + fg,
    padding: '6px 10px', fontFamily: 'Courier New, monospace',
    fontSize: '0.82em', zIndex: '9999', boxSizing: 'border-box', overflow: 'hidden'
  });

  var btnBase = [
    'font-family:inherit', 'font-size:inherit', 'line-height:1.2',
    'border:1px solid ' + fg, 'background:' + bg, 'color:' + fg,
    'padding:2px 6px', 'cursor:pointer', 'white-space:nowrap',
    'box-sizing:border-box', 'flex-shrink:0'
  ].join(';');

  bar.innerHTML =
    '<div id="_mc-panel" style="display:none;margin-bottom:6px;padding-bottom:6px;border-bottom:1px dashed ' + fg + '">' +
      '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;color:' + muted + '">' +
        '<span>' + esc(opts.hostNote) + '</span><span id="_mc-stats"></span>' +
      '</div>' +
      '<div id="_mc-events" style="display:flex;flex-direction:column;gap:2px;max-height:120px;overflow-y:auto"></div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0">' +
      '<span title="' + esc(opts.hostNote) + '" style="display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:help">' +
        '<span id="_mc-dot" style="color:#888;flex-shrink:0">●</span>' +
        '<span id="_mc-status" style="overflow:hidden;text-overflow:ellipsis">mc · ?/' + esc(opts.maxPlayers) + ' · ' + esc(opts.version) + '</span>' +
      '</span>' +
      '<span style="display:flex;align-items:center;gap:4px;flex-shrink:0">' +
        '<button id="_mc-copy" type="button" title="' + esc(opts.hostNote) + '" style="' + btnBase + ';max-width:155px;overflow:hidden;text-overflow:ellipsis">' + esc(opts.ip) + '</button>' +
        '<button id="_mc-toggle" type="button" style="' + btnBase + '">log</button>' +
        '<button id="_mc-close" type="button" style="' + btnBase + '">×</button>' +
      '</span>' +
    '</div>';

  document.body.appendChild(bar);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  var curOnline = '?', curMax = opts.maxPlayers, curVer = opts.version;
  function upd() {
    var el = document.getElementById('_mc-status');
    if (el) el.textContent = 'mc ' + curOnline + '/' + curMax + ' · ' + curVer;
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


  var loaded = false;
  document.getElementById('_mc-toggle').addEventListener('click', function() {
    var p = document.getElementById('_mc-panel'), open = p.style.display === 'none';
    p.style.display = open ? 'block' : 'none';
    this.textContent = open ? 'log ▾' : 'log';
    if (open && !loaded) { loaded = true; loadDetails(); }
  });

  document.getElementById('_mc-close').addEventListener('click', function() {
    localStorage.setItem('mcBarHidden', '1');
    bar.remove();
  });

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
    if (d && d.version) {
      var v = String(d.version).replace(/^[A-Za-z_.-]+\s+/, '');
      if (v) curVer = v;
    }
    upd();
  }).catch(function() {
    document.getElementById('_mc-dot').style.color = '#e74c3c';
  });

  function loadDetails() {
    var ev = document.getElementById('_mc-events'), st = document.getElementById('_mc-stats');
    ev.innerHTML = '<span style="color:' + muted + '">loading log...</span>';
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
            return '<div style="display:flex;gap:8px;white-space:nowrap">' +
              '<span style="color:' + muted + '">' + esc(e.time || '--:--') + '</span>' +
              '<span style="color:' + (join ? '#2ecc71' : '#e74c3c') + ';font-weight:bold">' + (join ? '+' : '-') + '</span>' +
              '<span>' + esc(e.player) + ' <span style="color:' + muted + '">' + (join ? 'joined' : 'left') + '</span></span>' +
            '</div>';
          }).join('');
        } else {
          ev.innerHTML = '<span style="color:' + muted + '">no recent joins/leaves</span>';
        }
      })
      .catch(function() {
        ev.innerHTML = '<span style="color:' + muted + '">no mc-status.json found yet</span>';
      });
  }
}
