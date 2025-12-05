// Mitchellville Farms - Header & Footer Script

document.addEventListener('DOMContentLoaded', () => {
  // ===== Nav Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isHidden = primaryNav.style.display === 'none' || !primaryNav.style.display;
      primaryNav.style.display = isHidden ? 'flex' : 'none';
    });

    // Close menu on link click (mobile)
    const navLinks = primaryNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          primaryNav.style.display = 'none';
        }
      });
    });
  }

  // ===== Footer Date =====
  const lastModEl = document.getElementById('lastModified');
  if (lastModEl) {
    const date = new Date(document.lastModified);
    const formatted = date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    lastModEl.textContent = `Last Modification: ${formatted}`;
  }

  // ===== Current Year =====
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = `© ${new Date().getFullYear()}`;
  }

  // ===== Responsive Nav Toggle Visibility =====
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && primaryNav) {
      primaryNav.style.display = 'flex';
    }
  });
});
