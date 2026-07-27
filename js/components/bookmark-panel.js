const STORAGE_KEY = 'bookmarks';

export function getBookmarks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function toggleBookmark(lessonId) {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(lessonId);
  if (index === -1) {
    bookmarks.push(lessonId);
  } else {
    bookmarks.splice(index, 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function renderBookmarkPanel(bookmarkedLessons) {
  const items = bookmarkedLessons.map(lesson => `
    <div class="bookmark-panel-item">⭐ <a href="#/lesson/${lesson.id}">${lesson.title}</a></div>
  `).join('');

  return `
    <div class="card bookmark-panel">
      <div class="bookmark-panel-title">Bookmarks</div>
      <div class="bookmark-panel-list">${items}</div>
    </div>
  `;
}
