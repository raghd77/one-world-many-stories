/// One World, Many Stories — multi-story grid + bilingual toggle (Lotus)
// Files expected in repo root:
// - tara-the-brave-turtle.pdf
// - The Lotus Garden by The Nile, English Version-.pdf
// - The_Lotus_Garden_arabic.pdf

// Helpers
const $ = (sel) => document.querySelector(sel);
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Elements
const storyGrid = document.getElementById("storyGrid");
const statStories = document.getElementById("statStories");

// Selected story (hero card)
const selectedTitleEl = document.getElementById("selectedTitle");
const selectedSubEl = document.getElementById("selectedSub");
const openPdfBtn = document.getElementById("openPdfBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

// Reader
const pdfFrame = document.getElementById("pdfFrame");
const openInNewTabLink = document.getElementById("openInNewTabLink");
const downloadInReaderLink = document.getElementById("downloadInReaderLink");
const scrollToReaderBtn = document.getElementById("scrollToReaderBtn");

// Language toggles
const heroLangEn = document.getElementById("heroLangEn");
const heroLangAr = document.getElementById("heroLangAr");
const readerLangEn = document.getElementById("readerLangEn");
const readerLangAr = document.getElementById("readerLangAr");

// Theme
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

// Data
const STORIES = [
  {
    id: "lotus",
    title: "The Lotus Garden by the Nile",
    desc: "A gentle story about growing in your own way — and how one brave flower can inspire everyone.",
    tag: "EN + AR",
    hasArabic: true,
    pills: ["Nature", "Self-belief", "Kindness"],
    files: {
      en: "The Lotus Garden by The Nile, English Version-.pdf",
      ar: "The_Lotus_Garden_arabic.pdf",
    },
  },
  {
    id: "tara",
    title: "Tara the Brave Turtle",
    desc: "A kids-friendly story about courage, trying again, and showing up even when you’re scared.",
    tag: "EN",
    hasArabic: false,
    pills: ["Courage", "Growth", "Kids"],
    files: {
      en: "tara-the-brave-turtle.pdf",
      ar: null,
    },
  },
];

// State (persisted)
const savedTheme = localStorage.getItem("owms_theme");
const savedStoryId = localStorage.getItem("owms_story") || "lotus";
const savedLang = localStorage.getItem("owms_lang") || "en";

let currentStory = STORIES.find((s) => s.id === savedStoryId) || STORIES[0];
let currentLang = savedLang;

// Render story grid
function renderStories() {
  if (!storyGrid) return;

  storyGrid.innerHTML = "";

  STORIES.forEach((s) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "story-card" + (s.id === currentStory.id ? " is-selected" : "");
    card.setAttribute("aria-label", `Select story: ${s.title}`);

    const tagClass = s.hasArabic ? "" : " is-single";
    const pillsHtml = (s.pills || []).map((p) => `<span class="pill">${p}</span>`).join("");

    card.innerHTML = `
      <div class="story-top">
        <h3 class="story-title">${escapeHtml(s.title)}</h3>
        <span class="story-tag${tagClass}">${escapeHtml(s.tag)}</span>
      </div>
      <p class="story-desc">${escapeHtml(s.desc)}</p>
      <div class="story-meta">${pillsHtml}</div>
    `;

    card.addEventListener("click", () => {
      selectStory(s.id);
    });

    storyGrid.appendChild(card);
  });

  if (statStories) statStories.textContent = String(STORIES.length);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Story selection + updates
function selectStory(storyId) {
  const next = STORIES.find((s) => s.id === storyId);
  if (!next) return;

  currentStory = next;
  localStorage.setItem("owms_story", currentStory.id);

  // If story doesn't have Arabic, force EN
  if (!currentStory.hasArabic) {
    currentLang = "en";
    localStorage.setItem("owms_lang", currentLang);
  }

  applySelectionToUI();
  renderStories();
}

function setLang(lang) {
  if (lang !== "en" && lang !== "ar") return;

  // Block AR if story doesn't support it
  if (lang === "ar" && !currentStory.hasArabic) return;

  currentLang = lang;
  localStorage.setItem("owms_lang", currentLang);
  applySelectionToUI();
}

function getActiveFile() {
  const file =
    currentLang === "ar" && currentStory.files.ar ? currentStory.files.ar : currentStory.files.en;
  return file;
}

function applySelectionToUI() {
  const file = getActiveFile();

  // Selected panel
  if (selectedTitleEl) selectedTitleEl.textContent = currentStory.title;
  if (selectedSubEl) selectedSubEl.textContent = currentLang === "ar" ? "Arabic" : "English";

  if (downloadPdfBtn) {
    downloadPdfBtn.href = file;
    downloadPdfBtn.setAttribute("download", "");
  }

  // Reader links + iframe
  if (openInNewTabLink) openInNewTabLink.href = file;
  if (downloadInReaderLink) {
    downloadInReaderLink.href = file;
    downloadInReaderLink.setAttribute("download", "");
  }
  if (pdfFrame) pdfFrame.src = file;

  // Language toggle state (hero + reader)
  syncLangButtons(heroLangEn, heroLangAr);
  syncLangButtons(readerLangEn, readerLangAr);

  // Disable AR buttons if not supported
  const disableAr = !currentStory.hasArabic;
  if (heroLangAr) heroLangAr.disabled = disableAr;
  if (readerLangAr) readerLangAr.disabled = disableAr;

  if (heroLangAr) heroLangAr.style.opacity = disableAr ? "0.45" : "1";
  if (readerLangAr) readerLangAr.style.opacity = disableAr ? "0.45" : "1";
}

function syncLangButtons(enBtn, arBtn) {
  if (!enBtn || !arBtn) return;
  enBtn.classList.toggle("is-active", currentLang === "en");
  arBtn.classList.toggle("is-active", currentLang === "ar");
}

// Actions
if (openPdfBtn) {
  openPdfBtn.addEventListener("click", () => {
    // scroll to reader
    const readSection = document.getElementById("read");
    if (readSection) readSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (scrollToReaderBtn) {
  scrollToReaderBtn.addEventListener("click", () => {
    const shell = document.getElementById("readerShell");
    if (shell) shell.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Language listeners
if (heroLangEn) heroLangEn.addEventListener("click", () => setLang("en"));
if (heroLangAr) heroLangAr.addEventListener("click", () => setLang("ar"));
if (readerLangEn) readerLangEn.addEventListener("click", () => setLang("en"));
if (readerLangAr) readerLangAr.addEventListener("click", () => setLang("ar"));

// Theme toggle
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("owms_theme", next);
}
if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

applyTheme(savedTheme || "dark");

// Initial render
renderStories();
applySelectionToUI();
 Set year in footer
