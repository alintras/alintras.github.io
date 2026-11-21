
const days = document.getElementById("days");
const daysInput = document.getElementById("daysInput");
const daysLabel = document.getElementById("daysLabel");
const m1 = document.getElementById("m1");
const m2 = document.getElementById("m2");
const m1Label = document.getElementById("m1Label");
const m2Label = document.getElementById("m2Label");
const timeline1 = document.getElementById("timeline1");
const timeline2 = document.getElementById("timeline2");
const result = document.getElementById("result");
const calendar1Info = document.getElementById("calendar1Info");
const calendar2Info = document.getElementById("calendar2Info");

function gcd(a,b){ return b ? gcd(b, a % b) : a; }
function lcm(a,b){ return (a*b)/gcd(a,b); }

function draw(){
  const day = parseInt(days.value);
  const len1 = parseInt(m1.value);
  const len2 = parseInt(m2.value);
  
  // Update labels
  daysLabel.textContent = day;
  daysInput.value = day;
  m1Label.textContent = len1;
  m2Label.textContent = len2;

  const align = lcm(len1, len2);
  const maxDays = align; // visualize up to next alignment

  function makeTimeline(container, monthLen, color){
    container.innerHTML = "";
    const months = Math.ceil(maxDays / monthLen);
    for(let i=1;i<=months;i++){
      const div = document.createElement("div");
      div.className = "marker " + color;
      div.style.left = (i * monthLen / maxDays * 100) + "%";
      container.appendChild(div);
    }
    // current day marker - fixed calculation
    if (day <= maxDays) {
      const current = document.createElement("div");
      current.className = "currentDay";
      current.style.left = (day / maxDays * 100) + "%";
      container.appendChild(current);
    }
  }

  makeTimeline(timeline1, len1, "blue");
  makeTimeline(timeline2, len2, "green");

  // Fixed date calculations
  const date1 = { 
    month: Math.floor(day / len1) + 1, 
    day: (day % len1) + 1 
  };
  const date2 = { 
    month: Math.floor(day / len2) + 1, 
    day: (day % len2) + 1 
  };
  
  // Update calendar info
  calendar1Info.textContent = `Month ${date1.month}, Day ${date1.day}`;
  calendar2Info.textContent = `Month ${date2.month}, Day ${date2.day}`;

  result.innerHTML = `
    🟦 Calendar 1: ${len1}-day months → Month ${date1.month}, Day ${date1.day}<br>
    🟩 Calendar 2: ${len2}-day months → Month ${date2.month}, Day ${date2.day}<br><br>
    🔁 Calendars align every <b>${align}</b> days.
    ${day >= align ? `<br><span style="color: #28a745;">🌟 The calendars are currently aligned!</span>` : ''}
  `;
}

// Event listeners for sliders
[days, m1, m2].forEach(el => el.addEventListener("input", draw));

// Event listener for the days input field
daysInput.addEventListener("input", function() {
  let value = parseInt(this.value);
  if (isNaN(value)) value = 0;
  if (value < 0) value = 0;
  if (value > 400) value = 400;
  
  days.value = value;
  draw();
});

// Initialize the visualization
draw();
