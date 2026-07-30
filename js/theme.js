(function () {
  var STORAGE_KEY = "dotc-theme";
  var PRISM_LIGHT = "https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.min.css";
  var PRISM_DARK = "https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism-tomorrow.min.css";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "☀️" : "🌙";
    }
    var prismLink = document.getElementById("prism-theme");
    if (prismLink) {
      prismLink.href = theme === "dark" ? PRISM_DARK : PRISM_LIGHT;
    }
  }

  function currentTheme() {
    return localStorage.getItem(STORAGE_KEY) || "light";
  }

  function initTheme() {
    applyTheme(currentTheme());
    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  document.addEventListener("DOMContentLoaded", initTheme);
})();
