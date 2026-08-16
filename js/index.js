const safeStorage = {
  _memory: {},
  getItem(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return this._memory[key] || null;
    }
  },
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      this._memory[key] = value;
    }
  }
};

function getGreeting(hour) {
    if (hour < 5)  return 'Working late?';
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    if (hour < 22) return 'Good evening!';
    return 'Burning the midnight oil?';
}

function getSignoff(hour) {
    if (hour < 12) return 'Welcome to my page. Have a great day!';
    if (hour < 18) return 'Welcome to my page. Have a good rest of your day!';
    return 'Welcome to my page. Have a good evening!';
}

// CLOCK + GREETING
setInterval(() => {
    const now = new Date();
    document.getElementById("clock").textContent = now.toLocaleTimeString();
    document.getElementById("greeting").textContent = getGreeting(now.getHours());
    document.getElementById("signoff").textContent = getSignoff(now.getHours());
}, 1000);

const frames = [
    `
(•.•)/  (•.•)/  (•.•)/  (•.•)/  (•.•)/
<)  )   <)  )   <)  )   <)  )   <)  )  
/  \\    /  \\    /  \\    /  \\    /  \\  
    `,
    `
\\(•.•)  \\(•.•)  \\(•.•)  \\(•.•)  \\(•.•) 
 (  (>   (  (>   (  (>   (  (>   (  (>  
 /  \\    /  \\    /  \\    /  \\    /  \\  
    `  
];

/*
const frames = [
` 
 ,…,    ,_     ,…,    ,_     ,…,    ,_     ,…,   
[•.•]  [•.•]  [•.•]  [•.•]  [•.•]  [•.•]  [•.•]  
 """    """    """    """    """    """    """   
`,
` 
 ,_     ,…,    ,_     ,…,    ,_     ,…,    ,_    
[•.•]  [•.•]  [•.•]  [•.•]  [•.•]  [•.•]  [•.•]  
 """    """    """    """    """    """    """ 
`
];
*/

let i = 0;

setInterval(() => {
    document.getElementById("ascii-footer").textContent = frames[i];
    i = (i + 1) % frames.length;
}, 300);


// DETAILS TOGGLE TEXT
document.querySelectorAll(".search-help").forEach(details => {
    const summary = details.querySelector(".search-help-summary");

    details.addEventListener("toggle", () => {
        summary.textContent = details.open
            ? "[-] Try out search keywords!"
            : "[+] Try out search keywords!";
    });
});


// SEARCH EVENTS
document.getElementById("search-input").addEventListener("input", filterSite);

document.getElementById("search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
});

document.getElementById("search-button").addEventListener("click", doSearch);
document.getElementById("search-clear").addEventListener("click", clearSearchInput);
document.getElementById("engine-select").addEventListener("change", saveEngine);


// THEME BUTTON
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);


// LATEST UPDATE
async function fetchLatestCommit(username, repo) {
    const messageElement = document.getElementById('commit-message');
    const dateElement = document.getElementById('commit-date');
  
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const lastCommit = data[0];
  
      messageElement.textContent = lastCommit.commit.message + '  ';
      
      const commitDate = new Date(lastCommit.commit.author.date);
      dateElement.textContent = `(${commitDate.toLocaleDateString()})`;
  
    } catch (error) {
      console.error('Error fetching GitHub commit:', error);
      messageElement.textContent = 'Failed to load update.';
    }
  }
  
  fetchLatestCommit('alintras', 'alintras.github.io');

// SERVICE WORKER
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/service-worker.js");
}
