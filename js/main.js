import { initTheme } from './theme.js';
import { initRouter, registerRoute, registerNotFound } from './router.js';
import { initSidebar } from './components/sidebar.js';
import { initSearch } from './search.js';
import { setBreadcrumb, breadcrumbForRoute } from './components/navbar.js';
import { renderProgressCard } from './components/progress-card.js';
import { renderLessonGrid } from './components/lesson-card.js';

async function bootstrap() {
  initTheme();
  await initSidebar();

  const res = await fetch('./data/nav.json');
  const nav = await res.json();
  const allLessons = nav.topics.flatMap(t => t.lessons.map(l => ({ ...l, topicTitle: t.title })));
  initSearch(allLessons);

  registerRoute('/', () => renderHome(nav, allLessons));
  registerNotFound(() => renderPlaceholder('Not Found'));
  initRouter();

  window.addEventListener('hashchange', () => {
    const path = window.location.hash.slice(1) || '/';
    setBreadcrumb(breadcrumbForRoute(path, nav));
  });
  setBreadcrumb(breadcrumbForRoute(window.location.hash.slice(1) || '/', nav));

  initMobileSidebarToggle();
}

function renderPlaceholder(title) {
  const main = document.getElementById('main-content');
  if (main) main.innerHTML = `<h1>${title}</h1><p>Lesson engine not built yet.</p>`;
}

function renderHome(nav, allLessons) {
  const main = document.getElementById('main-content');
  if (!main) return;
  main.innerHTML = renderProgressCard(allLessons) + renderLessonGrid(nav.topics);
}

function initMobileSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('app-sidebar');
  toggle?.addEventListener('click', () => sidebar?.classList.toggle('is-open'));
}

bootstrap();
