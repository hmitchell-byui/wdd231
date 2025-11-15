// footer.js
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  const modEl = document.getElementById('lastModified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = document.lastModified;
});
