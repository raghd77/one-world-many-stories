// Set year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth focus on reader
const openPdfBtn = document.getElementById("openPdfBtn");
const scrollToReaderBtn = document.getElementById("scrollToReaderBtn");
const readerShell = document.getElementById("readerShell");

// Make sure the download link points to your PDF
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const pdfFrame = document.getElementById("pdfFrame");

// Change this to your real PDF path:
const pdfPath = "tara-the-brave-turtle.pdf";

// Apply the PDF path
downloadPdfBtn.href = pdfPath;
pdfFrame.src = pdfPath;

// Buttons
openPdfBtn.addEventListener("click", () => {
  document.querySelector("#read").scrollIntoView({ behavior: "smooth", block: "start" });
});

scrollToReaderBtn.addEventListener("click", () => {
  readerShell.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Theme toggle
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("owms_theme", theme);
  themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
}

const savedTheme = localStorage.getItem("owms_theme");
setTheme(savedTheme || "dark");

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});
