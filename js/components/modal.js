let escapeHandler = null;

export function openModal({ title, body, onConfirm }) {
  closeModal();

  const root = document.getElementById('modal-root');

  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <span class="modal-close" role="button">✕</span>
        </div>
        <div class="modal-body">${typeof body === 'string' ? body : ''}</div>
        ${onConfirm ? '<button class="modal-confirm" type="button">Confirm</button>' : ''}
      </div>
    </div>
  `;

  if (typeof body !== 'string') {
    root.querySelector('.modal-body').appendChild(body);
  }

  root.querySelector('.modal-backdrop').addEventListener('click', event => {
    if (event.target.classList.contains('modal-backdrop')) closeModal();
  });

  root.querySelector('.modal-close').addEventListener('click', closeModal);

  if (onConfirm) {
    root.querySelector('.modal-confirm').addEventListener('click', () => {
      onConfirm();
      closeModal();
    });
  }

  escapeHandler = event => {
    if (event.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', escapeHandler);
}

export function closeModal() {
  const root = document.getElementById('modal-root');
  root.innerHTML = '';

  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
}
