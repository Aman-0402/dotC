(function () {
  function currentPath() {
    return window.location.pathname.split("/").slice(-2).join("/");
  }

  function flattenLessons(toc) {
    var lessons = [];
    toc.chapters.forEach(function (chapter) {
      chapter.lessons.forEach(function (lesson) {
        lessons.push(lesson);
      });
    });
    return lessons;
  }

  function wireNav(toc) {
    var lessons = flattenLessons(toc);
    var here = currentPath();
    var index = lessons.findIndex(function (l) {
      return l.path === here;
    });
    if (index === -1) return;

    var navEl = document.querySelector(".lesson-nav");
    if (!navEl) return;

    if (index > 0) {
      var prev = lessons[index - 1];
      var prevLink = document.createElement("a");
      prevLink.href = "../" + prev.path;
      prevLink.textContent = "← " + prev.title;
      navEl.appendChild(prevLink);
    }

    if (index < lessons.length - 1) {
      var next = lessons[index + 1];
      var nextLink = document.createElement("a");
      nextLink.href = "../" + next.path;
      nextLink.textContent = next.title + " →";
      navEl.appendChild(nextLink);
    }
  }

  function initNav() {
    fetch("../data/toc.json")
      .then(function (res) {
        return res.json();
      })
      .then(wireNav);
  }

  document.addEventListener("DOMContentLoaded", initNav);
})();
