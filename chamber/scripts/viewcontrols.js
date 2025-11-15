// viewControls.js
export function initViewControls(members, renderGrid, renderList) {
  const gridBtn = document.getElementById('gridBtn');
  const listBtn = document.getElementById('listBtn');

  let currentView = 'grid';

  function togglePressed(active, inactive) {
    active.classList.add('is-active');
    inactive.classList.remove('is-active');
    active.setAttribute('aria-pressed', 'true');
    inactive.setAttribute('aria-pressed', 'false');
  }

  gridBtn.addEventListener('click', () => {
    if (currentView === 'grid') return;
    currentView = 'grid';
    togglePressed(gridBtn, listBtn);
    renderGrid(members);
  });

  listBtn.addEventListener('click', () => {
    if (currentView === 'list') return;
    currentView = 'list';
    togglePressed(listBtn, gridBtn);
    renderList(members);
  });

  // initial render
  renderGrid(members);
}
