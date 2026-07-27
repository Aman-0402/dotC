export async function initSidebar() {
  const container = document.getElementById('sidebar-nav');
  if (!container) return;

  const res = await fetch('./data/nav.json');
  const nav = await res.json();

  container.innerHTML = nav.topics.map(renderTopic).join('');
}

function renderTopic(topic) {
  return `
    <div class="sidebar-topic">
      <div class="sidebar-topic-title">${topic.title}</div>
      <ul class="sidebar-lesson-list">
        ${topic.lessons.map(renderLesson).join('')}
      </ul>
    </div>
  `;
}

function renderLesson(lesson) {
  return `<li><a href="#/lesson/${lesson.id}">${lesson.title}</a></li>`;
}
