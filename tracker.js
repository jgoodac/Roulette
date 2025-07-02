javascript:(()=>{ (() => {
  const el = document.querySelector('.value--dd5c7');
  if (!el) return console.error('Element not found!');

  const MAX = 6;
  const history = [];
  const seen = new Set();
  let prev = parseFloat(el.textContent.trim());

  const computeRow = val => ({
    Value: val,
    'Val−3': val - 3,
    'Val−6': val - 6,
    Diff: (val - 3) - (val - 6)
  });

  const addRow = val => {
    history.push(computeRow(val));
    seen.add(val);
    if (history.length > MAX) history.shift();
    prev = val;
  };

  if (!isNaN(prev)) addRow(prev);
  console.table(history);

  new MutationObserver(() => {
    const curr = parseFloat(el.textContent.trim());
    if (!isNaN(curr) && curr !== prev && !seen.has(curr)) {
      addRow(curr);
      console.clear();
      console.table(history);
    }
  }).observe(el, {childList: true, characterData: true, subtree: true});

  console.log('✅ Value capture active.');
  
  // Attach export function to window for manual trigger
  window.exportToCSV = () => {
    const rows = [
      ['Value','Val-3','Val-6','Diff'],
      ...history.map(r => [r.Value, r['Val−3'], r['Val−6'], r.Diff])
    ];
    const csv = rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob(["\uFEFF" + csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('📥 CSV download triggered.');
  };
})(); })();
