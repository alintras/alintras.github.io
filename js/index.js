// CLOCK
setInterval(() => {
    const now = new Date();
    document.getElementById("clock").textContent =
        now.toLocaleTimeString();
}, 1000);


// ASCII FOOTER ANIMATION
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
      const lastCommit = data[0]; // The first item is always the newest
  
      // Update the UI
      messageElement.textContent = lastCommit.commit.message;
      
      // Optional: Format the date
      const commitDate = new Date(lastCommit.commit.author.date);
      dateElement.textContent = ` (${commitDate.toLocaleDateString()})`;
  
    } catch (error) {
      console.error('Error fetching GitHub commit:', error);
      messageElement.textContent = 'Failed to load update.';
    }
  }
  
  // Initialize: Replace with your actual username and repo name
  fetchLatestCommit('alintras', 'alintras.github.io');

// SERVICE WORKER
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/service-worker.js");
}