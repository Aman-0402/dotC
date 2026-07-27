const routes = new Map();
let notFoundHandler = () => {};

export function registerRoute(path, handler) {
  routes.set(path, handler);
}

export function registerNotFound(handler) {
  notFoundHandler = handler;
}

export function initRouter() {
  window.addEventListener('hashchange', resolveRoute);
  resolveRoute();
}

export function navigateTo(path) {
  window.location.hash = path;
}

function resolveRoute() {
  const path = window.location.hash.slice(1) || '/';
  const handler = routes.get(path);
  if (handler) {
    handler();
  } else {
    notFoundHandler(path);
  }
}
