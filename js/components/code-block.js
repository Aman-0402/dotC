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

export function initCodeBlocks(container) {
  container.querySelectorAll('.code-block-copy').forEach(button => {
    button.addEventListener('click', () => {
      const code = button.parentElement.querySelector('code').textContent;
      navigator.clipboard.writeText(code);
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    });
  });

  if (window.Prism) {
    window.Prism.highlightAllUnder(container);
  }
}
