export function setBreadcrumb(text) {
  const el = document.getElementById('breadcrumb');
  if (el) el.textContent = text;
}

export function breadcrumbForRoute(path, nav) {
  if (path === '/' || path === '') return 'Home';

  const match = path.match(/^\/lesson\/(.+)$/);
  if (!match) return 'Home';

  const lessonId = match[1];
  for (const topic of nav.topics) {
    const lesson = topic.lessons.find(l => l.id === lessonId);
    if (lesson) return `${topic.title} / ${lesson.title}`;
  }
  return 'Home';
}
