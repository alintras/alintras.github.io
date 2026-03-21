// reminder.js — add-to-homescreen (mobile) / set-as-homepage (PC) banner
// Usage: initReminder()  — call once after DOM is ready
//
// - Auto-detects mobile vs desktop
// - Shows platform-specific instructions
// - "dismiss" hides for this session only
// - "don't remind me" sets localStorage flag, never shows again
//
// Example:
//   <script src="reminder.js"></script>
//   <script>document.addEventListener('DOMContentLoaded', initReminder)</script>

function initReminder() {
    if (localStorage.getItem('reminderDismissed')) return;
   
    var ua = navigator.userAgent;
    var isMobile  = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    var isIOS     = /iPhone|iPad|iPod/i.test(ua);
    var isAndroid = /Android/i.test(ua);
   
    var headline, hint, showCopy;
   
    if (isMobile) {
      headline = 'I recommend adding any page to your home screen.';
      if (isIOS)          hint = 'Tap the Share button ↑ then "Add to Home Screen".';
      else if (isAndroid) hint = 'Tap ⋮ in your browser then "Add to Home screen".';
      else                hint = 'Use your browser menu to add to home screen.';
      showCopy = false;
    } else {
      headline = 'I recommend setting this page as your homepage.';
      hint = 'Go to browser Settings → On startup → Open a specific page, and add this URL.';
      showCopy = true;
    }
   
    var dark = document.documentElement.classList.contains('dark') ||
               document.body.classList.contains('dark') ||
               document.body.classList.contains('dark-mode') ||
               document.body.getAttribute('data-theme') === 'dark' ||
               window.matchMedia('(prefers-color-scheme: dark)').matches;
   
    var bg    = dark ? '#111' : '#fff';
    var fg    = dark ? '#fff' : '#000';
    var invBg = dark ? '#fff' : '#000';
    var invFg = dark ? '#000' : '#fff';
   
    var banner = document.createElement('div');
    banner.id = 'reminder-banner';
    Object.assign(banner.style, {
      position:       'fixed',
      bottom:         '0',
      left:           '0',
      right:          '0',
      background:     bg,
      color:          fg,
      borderTop:      '1px solid ' + fg,
      padding:        '8px 12px',
      fontFamily:     'Courier New, monospace',
      fontSize:       '0.82em',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      gap:            '10px',
      zIndex:         '9999',
      boxSizing:      'border-box'
    });
   
    var btnBase = [
      'font-family:inherit',
      'font-size:inherit',
      'border:1px solid ' + fg,
      'color:' + fg,
      'padding:2px 8px',
      'cursor:pointer',
      'white-space:nowrap'
    ].join(';');
   
    var copyBtn = showCopy
      ? '<button id="_reminder-copy"    style="' + btnBase + ';background:' + bg + '">copy URL</button>'
      : '';
   
    banner.innerHTML =
      '<span>' +
        headline +
        ' <span style="opacity:0.55">' + hint + '</span>' +
      '</span>' +
      '<span style="display:flex;gap:6px;flex-shrink:0">' +
        copyBtn +
        '<button id="_reminder-once"    style="' + btnBase + ';background:' + bg  + '">dismiss</button>' +
        '<button id="_reminder-forever" style="' + btnBase + ';background:' + invBg + ';color:' + invFg + ';border-color:' + invBg + '">don\'t remind me</button>' +
      '</span>';
   
    document.body.appendChild(banner);
   
    if (showCopy) {
      document.getElementById('_reminder-copy').addEventListener('click', function() {
        navigator.clipboard.writeText(location.href).then(function() {
          document.getElementById('_reminder-copy').textContent = 'copied!';
        });
      });
    }
   
    document.getElementById('_reminder-once').addEventListener('click', function() {
      banner.remove();
    });
   
    document.getElementById('_reminder-forever').addEventListener('click', function() {
      localStorage.setItem('reminderDismissed', '1');
      banner.remove();
    });
  }
   