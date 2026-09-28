// Scavenger Game Frontend

document.addEventListener("DOMContentLoaded", () => {
  initRainCanvas();
  initRoadmapAndCountdown();
});

/* =========================================================================
   1. SUBTLE BACKGROUND RAIN
   ========================================================================= */
function initRainCanvas() {
  const canvas = document.getElementById("rainCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const raindrops = [];
  const maxDrops = Math.min(100, Math.floor(window.innerWidth / 12));

  class Drop {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (width + 100) - 50;
      this.y = Math.random() * -height;
      this.length = Math.random() * 18 + 12;
      this.speed = Math.random() * 12 + 14;
      this.slant = -2.5;
      this.opacity = Math.random() * 0.25 + 0.15;
    }
    update() {
      this.x += this.slant;
      this.y += this.speed;
      if (this.y > height) {
        this.reset();
        this.y = 0;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.slant * 2, this.y + this.length);
      ctx.strokeStyle = `rgba(180, 215, 255, ${this.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  for (let i = 0; i < maxDrops; i++) {
    const drop = new Drop();
    drop.y = Math.random() * height;
    raindrops.push(drop);
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < raindrops.length; i++) {
      raindrops[i].update();
      raindrops[i].draw();
    }
    requestAnimationFrame(render);
  }

  render();
}

/* =========================================================================
   2. ROADMAP & COUNTDOWN
   ========================================================================= */
let countdownInterval = null;

async function initRoadmapAndCountdown() {
  try {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error("Failed to load config");
    const data = await res.json();
    setupCountdown(data.game);
  } catch (e) {
    console.warn("Using default roadmap data:", e);
    setupCountdown({
      milestones: [
        { name: "Closed / Selective Alpha", date: "2027-01-01T00:00:00Z", displayDate: "January 1, 2027" },
        { name: "Open Alpha Testing", date: "2027-02-01T00:00:00Z", displayDate: "February 1, 2027" },
        { name: "Full Launch", date: "2027-04-01T00:00:00Z", displayDate: "April 1, 2027" }
      ]
    });
  }
}

function setupCountdown(game) {
  const milestones = game.milestones || [];
  const now = new Date();

  // Find next future milestone
  let targetMilestone = milestones.find((m) => new Date(m.date) > now);

  const targetNameEl = document.getElementById("countdownTargetName");
  const targetDateEl = document.getElementById("countdownTargetDate");

  if (targetMilestone) {
    if (targetNameEl) targetNameEl.textContent = targetMilestone.name;
    if (targetDateEl) targetDateEl.textContent = targetMilestone.displayDate || targetMilestone.date;
    startCountdown(new Date(targetMilestone.date));
  } else if (milestones.length > 0) {
    // If all past milestone dates have been reached
    const latest = milestones[milestones.length - 1];
    if (targetNameEl) targetNameEl.textContent = "Current Phase: " + latest.name;
    if (targetDateEl) targetDateEl.textContent = "Live / In Progress";
    
    // Set zeros cleanly
    setZeroCountdown();
  }
}

function setZeroCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.textContent = "00";
  if (hoursEl) hoursEl.textContent = "00";
  if (minutesEl) minutesEl.textContent = "00";
  if (secondsEl) secondsEl.textContent = "00";
}

function startCountdown(targetDate) {
  if (countdownInterval) clearInterval(countdownInterval);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function update() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      setZeroCountdown();
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  countdownInterval = setInterval(update, 1000);
}
