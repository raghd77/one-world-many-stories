/* One World, Many Stories - Stories Grid + Reader
   Filenames MUST match repo:
   - lotus_en.pdf
   - lotus_ar.pdf
   - tara-the-brave-turtle.pdf
*/

const heroLangEn = document.getElementById("heroLangEn");
const heroLangAr = document.getElementById("heroLangAr");
const readerLangEn = document.getElementById("readerLangEn");
const readerLangAr = document.getElementById("readerLangAr");

const storyGrid = document.getElementById("storyGrid");

const selectedTitle = document.getElementById("selectedTitle");
const selectedSub = document.getElementById("selectedSub");

const openPdfBtn = document.getElementById("openPdfBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

const pdfFrame = document.getElementById("pdfFrame");
const openInNewTabLink = document.getElementById("openInNewTabLink");
const downloadInReaderLink = document.getElementById("downloadInReaderLink");
const scrollToReaderBtn = document.getElementById("scrollToReaderBtn");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

const STORIES = [
  {
    id: "lotus",
    title: "The Lotus Garden by the Nile",
    desc: "A gentle story about growing in your own way — and how one brave flower can inspire everyone.",
    tag: "EN + AR",
    hasArabic: true,
    pills: ["Nature", "Self-belief", "Kindness"],
    files: {
      en: "lotus_en.pdf",
      ar: "lotus_ar.pdf"
    }
  },
  {
    id: "tara",
    title: "Tara the Brave Turtle",
    desc: "A kids-friendly story about courage, trying again, and showing up even when you’re scared.",
    tag: "EN",
    hasArabic: false,
    pills: ["Courage", "Growth", "Kids"],
    files: {
      en: "tara-the-brave-turtle.pdf"
    }
  }
];

let selectedStoryId = "lotus";
let lang = "en"; // en | ar

function setTheme(next) {
  if (next === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.textContent = "☀️";
    localStorage.setItem("owms-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeIcon.textContent = "🌙";
    localStorage.setItem("owms-theme", "dark");
  }
}

function initTheme() {
  const saved = localStorage.getItem("owms-theme");
  if (saved === "light") setTheme("light");
  else setTheme("dark");
}

function getStoryById(id) {
  return STORIES.find((s) => s.id === id) || STORIES[0];
}

function getActiveFile(story) {
  if (lang === "ar" && story.hasArabic && story.files.ar) return story.files.ar;
  return story.files.en;
}

function updateLangButtons(story) {
  // Hero chips
  heroLangEn.classList.toggle("is-active", lang === "en");
  heroLangAr.classList.toggle("is-active", lang === "ar");

  // Reader chips
  readerLangEn.classList.toggle("is-active", lang === "en");
  readerLangAr.classList.toggle("is-active", lang === "ar");

  // Disable Arabic if story doesn't have it
  const arDisabled = !(story.hasArabic && story.files.ar);
  heroLangAr.disabled = arDisabled;
  readerLangAr.disabled = arDisabled;

  heroLangAr.style.opacity = arDisabled ? "0.5" : "1";
  readerLangAr.style.opacity = arDisabled ? "0.5" : "1";
}

function updateSelectedUI() {
  const story = getStoryById(selectedStoryId);

  // if story doesn't support Arabic but we are on ar, switch back to en
  if (lang === "ar" && !(story.hasArabic && story.files.ar)) {
    lang = "en";
  }

  const file = getActiveFile(story);

  selectedTitle.textContent = story.title;
  selectedSub.textContent = lang === "ar" ? "Arabic" : "English";

  // Buttons
  openPdfBtn.onclick = () => {
    document.getElementById("read").scrollIntoView({ behavior: "smooth", block: "start" });
    // Small delay so scroll feels natural
    setTimeout(() => {
      pdfFrame.focus();
    }, 300);
  };

  downloadPdfBtn.href = file;
  downloadPdfBtn.setAttribute("download", file);

  // Reader links + iframe
  openInNewTabLink.href = file;
  downloadInReaderLink.href = file;
  downloadInReaderLink.setAttribute("download", file);
  pdfFrame.src = file;

  updateLangButtons(story);

  // highlight active card
  document.querySelectorAll(".story-card").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.id === selectedStoryId);
  });
}

function renderGrid() {
  storyGrid.innerHTML = "";

  STORIES.forEach((s) => {
    const card = document.createElement("article");
    card.className = "story-card";
    card.dataset.id = s.id;

    const top = document.createElement("div");
    top.className = "story-top";

    const title = document.createElement("h3");
    title.className = "story-title";
    title.textContent = s.title;

    const tag = document.createElement("span");
    tag.className = "story-tag";
    tag.textContent = s.tag;

    top.appendChild(title);
    top.appendChild(tag);

    const desc = document.createElement("p");
    desc.className = "story-desc";
    desc.textContent = s.desc;

    const pills = document.createElement("div");
    pills.className = "pills";
    s.pills.forEach((p) => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = p;
      pills.appendChild(pill);
    });

    card.appendChild(top);
    card.appendChild(desc);
    card.appendChild(pills);

    card.addEventListener("click", () => {
      selectedStoryId = s.id;
      updateSelectedUI();
      // Move user to selected story panel area (nice UX)
      document.querySelector(".hero-right").scrollIntoView({ behavior: "smooth", block: "center" });
    });

    storyGrid.appendChild(card);
  });
}

function hookLanguageEvents() {
  const setLang = (next) => {
    lang = next;
    updateSelectedUI();
  };

  heroLangEn.addEventListener("click", () => setLang("en"));
  heroLangAr.addEventListener("click", () => setLang("ar"));
  readerLangEn.addEventListener("click", () => setLang("en"));
  readerLangAr.addEventListener("click", () => setLang("ar"));

  scrollToReaderBtn.addEventListener("click", () => {
    document.getElementById("read").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function hookTheme() {
  themeBtn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    setTheme(isLight ? "dark" : "light");
  });
}

function init() {
  initTheme();
  hookTheme();
  renderGrid();
  hookLanguageEvents();
  updateSelectedUI();
}

document.addEventListener("DOMContentLoaded", init);
