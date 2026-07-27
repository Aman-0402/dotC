import { getProgress } from '../progress.js';

export function renderProgressCard(allLessons) {
  const progress = getProgress();
  const completed = allLessons.filter(l => progress[l.id]).length;
  const total = allLessons.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return `
    <div class="card progress-card">
      <div class="progress-card-title">Your Progress</div>
      <div class="progress-card-track">
        <div class="progress-card-fill" style="width: ${pct}%"></div>
      </div>
      <div class="progress-card-caption">${completed} of ${total} lessons complete</div>
    </div>
  `;
}
