/* ============================================================
   A LITTLE REMINDER — behaviour
   Vanilla JS only. Three jobs:
     1. Reveal sections as you scroll (subtle fade-up).
     2. Open / close the "secret" love-letter modal.
     3. Draw soft falling petals on a canvas inside the modal.
   ============================================================ */

/* ============================================================
   LOVE LETTER — EDIT THIS.
   Each string in the array becomes one paragraph. Add or remove
   entries freely. Keep the quotes — use \u2019 for an apostrophe
   if you must, or simply write normal text (single quotes inside
   the text are fine as long as you wrap each line in double quotes).
   ============================================================ */
const LETTER_PARAGRAPHS = [
  "I built this little page because words feel too small for everything I feel about you, my Otter.",
  "From our crazy adventures to every normal office Tuesday in between \u2014 being with you is my favorite thing in the whole world.",
  "Thank you for the laughter, the quiet moments, the way you steal the blanket and more than half the bed every time we sleep, in the end you stole my heart <3",
  "They say opposites attract \u2014 but i think a mega alpha straightforward otter and one very chill laid back gorilla turned out to be the best team there is.",
  "Our story is not normal babe, from day one it's already like a K-drama, everyday feels like an adventure with you around :3.",
  "In every life and every universe, I know i'll be with you, and I can't wait to see us grow old happily and lovingly together if possible",
  "If its meant to be, it's meant to be",
];

/* The sign-off line under the letter. */
const LETTER_SIGNOFF = "Yours, always \u2014 Gorilla";

/* ============================================================
   1. REVEAL ON SCROLL
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target); // animate once, then stop watching
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ============================================================
   2. MODAL OPEN / CLOSE
   ============================================================ */
const modal = document.getElementById("modal");
const secretBtn = document.getElementById("secretBtn");
const closeBtn = document.getElementById("modalClose");

/* Fill the letter from the array above */
document.getElementById("letterBody").innerHTML = LETTER_PARAGRAPHS.map(
  (p) => `<p>${p}</p>`
).join("");
document.getElementById("letterSignoff").textContent = LETTER_SIGNOFF;

function openModal() {
  modal.hidden = false;
  // Force a reflow so the [open] transition (opacity + card rise) plays.
  requestAnimationFrame(() => modal.setAttribute("open", ""));
  // Lock page scroll while the modal is open.
  document.body.style.overflow = "hidden";
  startPetals();
}

function closeModal() {
  modal.removeAttribute("open");
  document.body.style.overflow = "";
  // Wait for the fade-out transition, then truly hide (so it can't be tabbed to).
  setTimeout(() => {
    if (!modal.hasAttribute("open")) modal.hidden = true;
  }, 400);
  stopPetals();
}

secretBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

/* Close on backdrop click (clicking outside the card) */
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/* Close on Escape key */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

/* ============================================================
   3. FALLING PETALS (canvas)
   A lightweight particle system — no libraries. Petals drift
   down with a slow sway and a gentle spin, drawn on each frame.
   ============================================================ */
const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");

let petals = [];
let rafId = null;
let running = false;

/* Petal palette — soft blush / rose tones */
const PETAL_COLORS = ["#f6dcdd", "#e3a9ad", "#f2e3e0", "#d98e97", "#f8e9e4"];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function spawnPetal(initial) {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  return {
    x: Math.random() * w,
    y: initial ? Math.random() * h : -20, // begin above the screen when spawning live
    size: 6 + Math.random() * 8,          // petal "diameter"
    speedY: 0.6 + Math.random() * 1.1,    // fall speed
    sway: Math.random() * 2 * Math.PI,    // phase offset for the sway
    swaySpeed: 0.008 + Math.random() * 0.012,
    swayAmp: 20 + Math.random() * 30,     // horizontal travel
    spin: Math.random() * 2 * Math.PI,    // rotation
    spinSpeed: (Math.random() - 0.5) * 0.02,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    opacity: 0.55 + Math.random() * 0.4,
  };
}

function startPetals() {
  if (running) return;
  running = true;
  resizeCanvas();
  // Pre-fill so the modal opens with petals already drifting.
  petals = Array.from({ length: 60 }, () => spawnPetal(true));
  window.addEventListener("resize", resizeCanvas);
  loop();
}

function stopPetals() {
  running = false;
  cancelAnimationFrame(rafId);
  petals = [];
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  window.removeEventListener("resize", resizeCanvas);
}

function loop() {
  if (!running) return;
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  petals.forEach((p) => {
    // Fall + sway
    p.y += p.speedY;
    p.sway += p.swaySpeed;
    p.x += Math.sin(p.sway) * p.swayAmp * 0.02;
    p.spin += p.spinSpeed;

    // Draw a leaf/petal shape using a rotated ellipse
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Reset when off the bottom (or drifted off the sides)
    if (p.y > canvas.offsetHeight + 30 || p.x < -50 || p.x > canvas.offsetWidth + 50) {
      Object.assign(p, spawnPetal(false));
    }
  });

  rafId = requestAnimationFrame(loop);
}

/* ============================================================
   4. CAROUSEL LOOP
   The strip in the HTML holds ONE group of 5 slides. For the
   marquee to loop seamlessly, the same group is duplicated here
   and appended — the CSS animation slides the track by -50%,
   which is exactly one group width, then restarts invisibly.
   ============================================================ */
(function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const group = track && track.querySelector(".carousel__group");
  if (!group) return;

  const clone = group.cloneNode(true);
  clone.setAttribute("aria-hidden", "true"); // screen readers see the set once
  track.appendChild(clone);
})();

/* ============================================================
   5. BACKGROUND MUSIC
   Tries to autoplay as soon as the page loads. Browsers block
   sound until the visitor interacts first, so it also starts on
   the very first tap/scroll — giving the effect of "music starts
   as soon as she opens the site."
   ============================================================ */
(function initMusic() {
  const start = () => {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;

    const play = () => {
      audio.play().catch(() => {
        /* still blocked — wait for the next interaction */
      });
    };

    play(); // try immediately (works on desktop)
    // Fallbacks: start on the first touch / click / scroll.
    ["pointerdown", "touchstart", "scroll"].forEach((event) => {
      document.addEventListener(event, play, { once: true });
    });
  };

  // If the music element isn't in the DOM yet, wait for it.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();