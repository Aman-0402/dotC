export function initSearch(allLessons) {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.innerHTML = '';
      results.hidden = true;
      return;
    }

    const matches = allLessons.filter(l => l.title.toLowerCase().includes(query));
    results.innerHTML = matches.map(l => `
      <li>
        <a href="#/lesson/${l.id}">
          <span class="search-result-topic">${l.topicTitle}</span>
          ${l.title}
        </a>
      </li>
    `).join('');
    results.hidden = matches.length === 0;
  });
}
