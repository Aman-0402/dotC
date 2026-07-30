(function () {
  var STORAGE_KEY = "dotc-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "☀️" : "🌙";
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
