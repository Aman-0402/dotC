(function () {
  function currentPath() {
    return window.location.pathname.split("/").slice(-2).join("/");
  }

  function buildSidebar(toc) {
    var sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    var here = currentPath();
    var container = document.createElement("div");

    toc.chapters.forEach(function (chapter) {
      var isCurrentChapter = chapter.lessons.some(function (lesson) {
        return lesson.path === here;
      });

      var details = document.createElement("details");
      details.className = "sidebar-chapter";
      details.open = isCurrentChapter;

      var summary = document.createElement("summary");
      summary.textContent = chapter.title;
      details.appendChild(summary);

      var list = document.createElement("ul");
      list.className = "sidebar-lesson-list";

      chapter.lessons.forEach(function (lesson) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "../" + lesson.path;
        a.textContent = lesson.title;
        if (lesson.path === here) {
          a.classList.add("active");
        }
        li.appendChild(a);
        list.appendChild(li);
      });

      details.appendChild(list);
      container.appendChild(details);
    });

    sidebar.appendChild(container);
  }

  function initSidebar() {
    fetch("../data/toc.json")
      .then(function (res) {
        return res.json();
      })
      .then(buildSidebar);
  }

  document.addEventListener("DOMContentLoaded", initSidebar);
})();
