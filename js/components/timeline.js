export function renderTimeline(steps) {
  const items = steps.map((step, i) => {
    const isLast = i === steps.length - 1;
    return `
      <div class="timeline-step">
        <div class="timeline-marker">
          <div class="timeline-dot">${i + 1}</div>
          ${isLast ? '' : '<div class="timeline-line"></div>'}
        </div>
        <div class="timeline-content">
          <div class="timeline-title">${step.title}</div>
          <div class="timeline-description">${step.description}</div>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="timeline">${items}</div>`;
}
