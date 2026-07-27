export function renderCodeBlock(code) {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `
    <div class="code-block">
      <button class="code-block-copy" type="button">📋</button>
      <pre><code class="language-c">${escaped}</code></pre>
    </div>
  `;
}

const COPY_ICON = '📋';

export function initCodeBlocks(container) {
  container.querySelectorAll('.code-block-copy').forEach(button => {
    if (button.dataset.bound) {
      return;
    }
    button.dataset.bound = 'true';

    button.addEventListener('click', () => {
      const code = button.parentElement.querySelector('code').textContent;
      navigator.clipboard.writeText(code);
      if (button._copyResetTimeout) {
        clearTimeout(button._copyResetTimeout);
      }
      button.textContent = 'Copied';
      button._copyResetTimeout = setTimeout(() => {
        button.textContent = COPY_ICON;
        button._copyResetTimeout = null;
      }, 1500);
    });
  });

  if (window.Prism) {
    window.Prism.highlightAllUnder(container);
  }
}
