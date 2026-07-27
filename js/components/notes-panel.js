export function mountNotesPanel(container) {
  container.innerHTML = `
    <div class="card notes-panel">
      <div class="notes-panel-title">Notes</div>
      <textarea class="notes-panel-textarea" placeholder="Write your notes here..."></textarea>
      <div class="notes-panel-status">Saved</div>
    </div>
  `;
}
