(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // Elements
  const storyGrid = $("storyGrid");

  const selectedTitle = $("selectedTitle");
  const selectedSub = $("selectedSub");

  const heroLangEn = $("heroLangEn");
  const heroLangAr = $("heroLangAr");

  const openPdfBtn = $("openPdfBtn");
  const downloadPdfBtn = $("downloadPdfBtn");

  const readerTitleText = $("readerTitleText");
  const pdfFrame = $("pdfFrame");

  const readerLangEn = $("readerLangEn");
  const readerLangAr = $("readerLangAr");

  const openInNewTabLink = $("openInNewTabLink");
  const downloadInReaderLink = $("downloadInReaderLink");
  const scrollToReaderBtn = $("scrollToReaderBtn");

  const themeBtn = $("themeBtn");
  const themeIcon = $("themeIcon");

  const yearEl = $("year");

  // Data (make sure these filenames exist in your repo root)
  const STORIES = [
    {
      id: "lotus",
      title: "The Lotus Garden by the Nile",
      desc: "A gentle story about growing in your own way — and how one brave flower can inspire everyone.",
      tag: "EN + AR",
      hasArabic: true,
      pills: ["Nature", "Self-belief", "Kindness"],
      files: {
        en: "./lotus_en.pdf",
        ar: "./lotus_ar.pdf",
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
        en: "./tara-the-brave-turtle.pdf",
      },
    },
  ];

  // State
  let selectedStoryId = "lotus";
  let selectedLang = "en"; // "en" or "ar"

  function getSelectedStory() {
    return STORIES.find((s) => s.id === selectedStoryId) || STORIES[0];
  }

  function setActiveChip(group, lang) {
    const isHero = group === "hero";
    const enBtn = isHero ? heroLangEn : readerLangEn;
    const arBtn = isHero ? heroLangAr : readerLangAr;

    enBtn.classList.toggle("is-active", lang === "en");
    arBtn.classList.toggle("is-active", lang === "ar");
  }

  function applyLangAvailability(story) {
    // Enable/disable Arabic buttons depending on story
    const hasAr = !!story.hasArabic;

    heroLangAr.disabled = !hasAr;
    readerLangAr.disabled = !hasAr;

    // If story has no Arabic and user was on Arabic, force EN
    if (!hasAr && selectedLang === "ar") {
      selectedLang = "en";
    }

    // Update chip state
    setActiveChip("hero", selectedLang);
    setActiveChip("reader", selectedLang);
  }

  function currentPdfUrl(story) {
    if (selectedLang === "ar" && story.hasArabic) return story.files.ar;
    return story.files.en;
  }

  function updateSelectedUI() {
    const story = getSelectedStory();
    applyLangAvailability(story);

    const pdfUrl = currentPdfUrl(story);

    selectedTitle.textContent = story.title;
    selectedSub.textContent = selectedLang === "ar" ? "Arabic" : "English";

    // Hero download button
    downloadPdfBtn.href = pdfUrl;
    downloadPdfBtn.setAttribute("download", "");

    // Reader
    readerTitleText.textContent = story.title;

    openInNewTabLink.href = pdfUrl;
    downloadInReaderLink.href = pdfUrl;
    downloadInReaderLink.setAttribute("download", "");

    pdfFrame.src = pdfUrl;
  }

  function renderStories() {
    storyGrid.innerHTML = "";

    STORIES.forEach((story) => {
      const card = document.createElement("div");
      card.className = "story-card" + (story.id === selectedStoryId ? " is-selected" : "");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      const pillsHtml = story.pills
        .map((p) => `<span class="pill">${p}</span>`)
        .join("");

      card.innerHTML = `
        <div class="story-top">
          <div class="story-title">${story.title}</div>
          <div class="story-tag">${story.tag}</div>
        </div>
        <div class="story-desc">${story.desc}</div>
        <div class="pills">${pillsHtml}</div>
      `;

      const selectStory = () => {
        selectedStoryId = story.id;
        // keep language if possible; updateSelectedUI will force EN when needed
        renderStories();
        updateSelectedUI();
      };

      card.addEventListener("click", selectStory);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectStory();
        }
      });

      storyGrid.appendChild(card);
    });
  }

  function scrollToReader() {
    const el = $("read");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initTheme() {
    // simple: toggles a "light" class (optional future use)
    const saved = localStorage.getItem("owms-theme") || "dark";
    document.documentElement.dataset.theme = saved;
    themeIcon.textContent = saved === "dark" ? "🌙" : "☀️";

    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("owms-theme", next);
      themeIcon.textContent = next === "dark" ? "🌙" : "☀️";
    });
  }

  function bindEvents() {
    // Hero language
    heroLangEn.addEventListener("click", () => {
      selectedLang = "en";
      updateSelectedUI();
    });
    heroLangAr.addEventListener("click", () => {
      const story = getSelectedStory();
      if (!story.hasArabic) return;
      selectedLang = "ar";
      updateSelectedUI();
    });

    // Reader language
    readerLangEn.addEventListener("click", () => {
      selectedLang = "en";
      updateSelectedUI();
    });
    readerLangAr.addEventListener("click", () => {
      const story = getSelectedStory();
      if (!story.hasArabic) return;
      selectedLang = "ar";
      updateSelectedUI();
    });

    // Open in reader from hero
    openPdfBtn.addEventListener("click", () => {
      scrollToReader();
    });

    scrollToReaderBtn.addEventListener("click", () => {
      const frame = $("pdfFrame");
      frame?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function boot() {
    yearEl.textContent = new Date().getFullYear();

    initTheme();
    renderStories();
    bindEvents();
    updateSelectedUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
