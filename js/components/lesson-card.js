import { isLessonComplete } from '../progress.js';

export function renderLessonCard(lesson, topicTitle) {
  const initials = topicTitle.slice(0, 2).toUpperCase();
  const done = isLessonComplete(lesson.id);

  return `
    <a class="card lesson-card" href="#/lesson/${lesson.id}">
      <div class="lesson-card-icon">
        ${initials}
        ${done ? '<span class="lesson-card-badge">✓</span>' : ''}
      </div>
      <div class="lesson-card-title">${lesson.title}</div>
      <div class="lesson-card-subtitle">${topicTitle} · ${lesson.level}</div>
    </a>
  `;
}

export function renderLessonGrid(topics) {
  const cards = topics.flatMap(topic =>
    topic.lessons.map(lesson => renderLessonCard(lesson, topic.title))
  );
  return `<div class="lesson-grid">${cards.join('')}</div>`;
}
