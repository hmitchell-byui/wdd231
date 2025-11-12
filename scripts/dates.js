const yearSpan = document.getElementById('currentyear');
const lastModP = document.getElementById('lastModified');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
if (lastModP) {
  lastModP.textContent = document.lastModified;
}
