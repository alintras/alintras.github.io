
    // --- Age of C ---
   const currentYear = new Date().getFullYear();
   const age = currentYear - 1972;
   document.getElementById("cyears").textContent = age;
 
   // --- Terminal Component ---
   customElements.define("terminal-block", class extends HTMLElement {
   connectedCallback() {
     const content = this.textContent.trim()
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;");
     this.innerHTML = `
       <div class="terminal">
         <div class="terminal-header">
           <span class="dot"></span>
           <span class="dot"></span>
           <span class="dot"></span>
         </div>
         <pre><code>${content}</code></pre>
       </div>
     `;
   }
 });
 
 // --- Terminal2 Component with click functionality ---
 customElements.define("terminal2-block", class extends HTMLElement {
  connectedCallback() {
    const content = this.textContent.trim()
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    this.innerHTML = `
      <div class="terminal2">
        <div class="terminal2-header">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="toggle-text">▶ Click to show</span>
          <span class="output-label">Output</span>
        </div>
        <div class="terminal2-content">
          <pre><code>${content}</code></pre>
        </div>
      </div>
    `;

    const terminal2 = this.querySelector(".terminal2");
    const header = this.querySelector(".terminal2-header");
    const toggleText = this.querySelector(".toggle-text");

    header.addEventListener("click", () => {
      terminal2.classList.toggle("show");
      toggleText.textContent = terminal2.classList.contains("show")
        ? "▼ Click to hide"
        : "▶ Click to show";
    });
  }
});

 