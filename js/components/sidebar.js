import { isLessonComplete } from '../progress.js';

const EXPANDED_KEY = 'sidebar-expanded';

export async function initSidebar() {
  const container = document.getElementById('sidebar-nav');
  if (!container) return;

  const res = await fetch('./data/nav.json');
  const nav = await res.json();
  const expanded = new Set(JSON.parse(localStorage.getItem(EXPANDED_KEY) || '[]'));

  renderAndBind(container, nav, expanded);
}

function renderAndBind(container, nav, expanded) {
  container.innerHTML = nav.topics.map(topic => renderTopic(topic, expanded)).join('');

  container.querySelectorAll('.sidebar-topic-title').forEach(header => {
    header.addEventListener('click', () => {
      const topicId = header.dataset.topicId;
      if (expanded.has(topicId)) {
        expanded.delete(topicId);
      } else {
        expanded.add(topicId);
      }
      localStorage.setItem(EXPANDED_KEY, JSON.stringify([...expanded]));
      renderAndBind(container, nav, expanded);
    });
  });
}

function renderTopic(topic, expanded) {
  const isOpen = expanded.has(topic.id);
  return `
    <div class="sidebar-topic">
      <div class="sidebar-topic-title" data-topic-id="${topic.id}">
        ${topic.title} <span class="sidebar-topic-arrow">${isOpen ? '▾' : '▸'}</span>
      </div>
      ${isOpen ? `<ul class="sidebar-lesson-list">${topic.lessons.map(renderLesson).join('')}</ul>` : ''}
    </div>
  `;
}

function renderLesson(lesson) {
  const done = isLessonComplete(lesson.id);
  const cls = done ? 'sidebar-lesson-done' : '';
  const check = done ? ' ✓' : '';
  return `<li><a class="${cls}" href="#/lesson/${lesson.id}">${lesson.title}${check}</a></li>`;
}
