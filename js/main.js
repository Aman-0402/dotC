import { initTheme } from './theme.js';
import { initRouter, registerRoute, registerNotFound } from './router.js';
import { initSidebar } from './sidebar.js';
import { initSearch } from './search.js';

async function bootstrap() {
  initTheme();
  await initSidebar();

  const res = await fetch('./data/nav.json');
  const nav = await res.json();
  const allLessons = nav.topics.flatMap(t => t.lessons);
  initSearch(allLessons);

  registerRoute('/', () => renderPlaceholder('Home'));
  registerNotFound(() => renderPlaceholder('Not Found'));
  initRouter();

  initMobileSidebarToggle();
}

function renderPlaceholder(title) {
  const main = document.getElementById('main-content');
  if (main) main.innerHTML = `<h1>${title}</h1><p>Lesson engine not built yet.</p>`;
}

function initMobileSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('app-sidebar');
  toggle?.addEventListener('click', () => sidebar?.classList.toggle('is-open'));
}

bootstrap();
