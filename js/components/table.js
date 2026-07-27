export function renderTable({ headers, rows }) {
  return `
    <table class="data-table">
      <thead>
        <tr>${headers.map((h, i) => `<th data-index="${i}">${h} <span class="sort-indicator">⇅</span></th>`).join('')}</tr>
      </thead>
      <tbody>${renderRows(rows)}</tbody>
    </table>
  `;
}

export function initTable(tableEl, rows) {
  let currentRows = [...rows];
  let sortIndex = null;
  let ascending = true;

  tableEl.querySelectorAll('th').forEach(th => {
    if (th.dataset.bound) {
      return;
    }
    th.dataset.bound = 'true';

    th.addEventListener('click', () => {
      const index = Number(th.dataset.index);
      ascending = sortIndex === index ? !ascending : true;
      sortIndex = index;

      const isNumeric = currentRows.every(row => {
        const trimmed = row[index].trim();
        return trimmed !== '' && !isNaN(Number(trimmed));
      });
      currentRows = [...currentRows].sort((a, b) => {
        const valA = isNumeric ? parseFloat(a[index]) : a[index];
        const valB = isNumeric ? parseFloat(b[index]) : b[index];
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });

      tableEl.querySelectorAll('.sort-indicator').forEach(el => (el.textContent = '⇅'));
      th.querySelector('.sort-indicator').textContent = ascending ? '▲' : '▼';

      tableEl.querySelector('tbody').innerHTML = renderRows(currentRows);
    });
  });
}

function renderRows(rows) {
  return rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
}
