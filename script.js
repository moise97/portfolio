/* ============================================================
   SCRIPT.JS — Moise Michaud Portfolio
   Terminal animation + Project filter
   ============================================================ */

/* ---- MOBILE NAV HAMBURGER ---- */
const hamburger = document.getElementById("nav-hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("nav-open");
    hamburger.textContent = isOpen ? "✕" : "☰";
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      hamburger.textContent = "☰";
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---- TERMINAL ANIMATION ---- */
const terminalCommands = [
  {
    cmd: "deploy DocChat --platform huggingface",
    output: [
      '<span class="t-success">✓ RAG pipeline initialized</span>',
      '<span class="t-info">✓ LlamaIndex + TF-IDF embeddings loaded</span>',
      '<span class="t-success">→ Live at huggingface.co/spaces/moise97/DocChat</span>',
    ],
  },
  {
    cmd: "python anomaly_detection.py --source mqtt",
    output: [
      '<span class="t-success">✓ Isolation Forest model loaded</span>',
      '<span class="t-warn">⚠ 3 anomalies detected in zone-2 pressure sensor</span>',
      '<span class="t-info">→ Dashboard updated · Streamlit live</span>',
    ],
  },
  {
    cmd: "streamlit run sales_dashboard.py",
    output: [
      '<span class="t-success">✓ Sales data loaded · 12 months · 4 regions</span>',
      '<span class="t-info">✓ Plotly charts initialized</span>',
      '<span class="t-success">→ Live at huggingface.co/spaces/moise97/sales-analytics-dashboard</span>',
    ],
  },
  {
    cmd: "run sql_mystery.js --randomize-killer",
    output: [
      '<span class="t-success">✓ SQLite database reset</span>',
      '<span class="t-warn">✓ New killer assigned · clues seeded</span>',
      '<span class="t-info">→ Game live at huggingface.co/spaces/moise97/sql-murder-mystery</span>',
    ],
  },
];

let cmdIdx = 0;
let charIdx = 0;
let isDeleting = false;
let outputVisible = false;

const cmdEl = document.getElementById("terminal-cmd");
const outputEl = document.getElementById("terminal-output");
const cursorEl = document.getElementById("terminal-cursor");

function runTerminal() {
  if (!cmdEl) return; // not on index page

  const current = terminalCommands[cmdIdx];
  const full = current.cmd;

  if (!isDeleting && !outputVisible) {
    // Type forward
    cmdEl.textContent = full.slice(0, charIdx + 1);
    charIdx++;

    if (charIdx === full.length) {
      // Done typing → show output after pause
      outputVisible = true;
      setTimeout(() => {
        outputEl.innerHTML = current.output.join("<br>");
        // Wait 3s then start deleting
        setTimeout(startDelete, 3000);
      }, 350);
      return;
    }
    setTimeout(runTerminal, 60);
  } else if (isDeleting) {
    // Delete backward
    cmdEl.textContent = full.slice(0, charIdx);
    charIdx--;

    if (charIdx < 0) {
      isDeleting = false;
      outputVisible = false;
      charIdx = 0;
      cmdIdx = (cmdIdx + 1) % terminalCommands.length;
      setTimeout(runTerminal, 500);
      return;
    }
    setTimeout(runTerminal, 28);
  }
}

function startDelete() {
  outputEl.innerHTML = "";
  isDeleting = true;
  charIdx = terminalCommands[cmdIdx].cmd.length;
  runTerminal();
}

// Kick off terminal after a short delay
setTimeout(runTerminal, 900);

/* ---- PROJECT FILTER ---- */
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll("#projects-grid .project-card");
const noResults = document.getElementById("no-results");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
    btn.classList.add("filter-btn--active");

    const filter = btn.dataset.filter;
    let visible = 0;

    projectCards.forEach((card) => {
      const cats = card.dataset.categories || "";
      const show = filter === "all" || cats.split(" ").includes(filter);

      if (show) {
        card.classList.remove("project-card--hidden");
        visible++;
      } else {
        card.classList.add("project-card--hidden");
      }
    });

    if (noResults) {
      noResults.style.display = visible === 0 ? "block" : "none";
    }
  });
});

/* ---- EXISTING SCRIPT FUNCTIONALITY (keep below) ---- */

// FAQ accordion (services page)
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("faq-open");

    // Close all
    document.querySelectorAll(".faq-item").forEach((el) => {
      el.classList.remove("faq-open");
      el.querySelector(".faq-answer").style.maxHeight = "0";
      el.querySelector(".faq-answer").style.padding = "0 var(--space-lg)";
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add("faq-open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      answer.style.padding = "0 var(--space-lg)";
    }
  });
});

// Profile photo modal
const profilePhoto = document.querySelector(".profile-photo");
const modal = document.querySelector(".photo-modal");
const modalClose = document.querySelector(".photo-modal-close");

if (profilePhoto && modal) {
  profilePhoto.addEventListener("click", () => {
    modal.classList.add("photo-modal--open");
    document.body.style.overflow = "hidden";
  });
}

if (modalClose && modal) {
  modalClose.addEventListener("click", () => {
    modal.classList.remove("photo-modal--open");
    document.body.style.overflow = "";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("photo-modal--open");
      document.body.style.overflow = "";
    }
  });
}

// Contact form validation
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    contactForm.querySelectorAll("[required]").forEach((input) => {
      const group = input.closest(".form-group");
      if (!input.value.trim()) {
        valid = false;
        group.classList.add("form-group--error");
        if (!group.querySelector(".form-error-msg")) {
          const err = document.createElement("span");
          err.className = "form-error-msg";
          err.textContent = "This field is required";
          group.appendChild(err);
        }
      } else {
        group.classList.remove("form-group--error");
        const err = group.querySelector(".form-error-msg");
        if (err) err.remove();
      }
    });

    if (valid) {
      const successMsg = contactForm.querySelector(".form-success");
      if (successMsg) successMsg.style.display = "flex";
      contactForm.reset();
    }
  });
}

// Reduced motion
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document
    .querySelectorAll(".terminal-cursor, .availability-dot")
    .forEach((el) => {
      el.style.animation = "none";
    });
}
