import { renderTable } from './table.js';

export function renderMemoryDiagram(entries) {
  return renderTable({
    headers: ['Name', 'Value', 'Address'],
    rows: entries.map(entry => [entry.name, entry.value, entry.address]),
  });
}
