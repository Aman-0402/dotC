export function mountAccordion(container, sections) {
  container.innerHTML = sections.map((section, i) => `
    <div class="accordion-section" data-index="${i}">
      <div class="accordion-header">
        ${section.title} <span class="accordion-arrow">▸</span>
      </div>
      <div class="accordion-body" hidden>${section.content}</div>
    </div>
  `).join('');

  container.querySelectorAll('.accordion-header').forEach(header => {
    if (header.dataset.bound) {
      return;
    }
    header.dataset.bound = 'true';

    header.addEventListener('click', () => {
      const section = header.parentElement;
      const body = section.querySelector('.accordion-body');
      const arrow = section.querySelector('.accordion-arrow');
      const isOpen = !body.hidden;

      body.hidden = isOpen;
      arrow.textContent = isOpen ? '▸' : '▾';
    });
  });
}
