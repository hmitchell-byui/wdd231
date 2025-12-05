document.addEventListener("DOMContentLoaded", () => {
  // ===== Footer dates =====
  const yearEl = document.getElementById('year');
  const modEl = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) {
    const raw = document.lastModified;
    const dt = new Date(raw);
    const formatted = !isNaN(dt.getTime())
      ? dt.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : new Date().toLocaleString();
    modEl.textContent = formatted;
  }

  // ===== Nav toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.style.display = expanded ? 'none' : 'block';
    });
  }

  const form = document.getElementById("join-form");
  const timestampField = document.getElementById("timestamp");

  // Populate hidden timestamp when page loads
  timestampField.value = new Date().toISOString();

  // Ensure timestamp is refreshed on submit
  form.addEventListener("submit", () => {
    timestampField.value = new Date().toISOString();
  });

  // Membership benefit highlight logic
  const membershipSelect = document.getElementById("membership");
  membershipSelect.addEventListener("change", (e) => {
    const level = e.target.value;
    if (level) {
      highlightMembershipBenefits(level);
    }
  });

  function highlightMembershipBenefits(level) {
    // Remove highlight from all benefit sections
    document.querySelectorAll(".membership-benefits .benefit").forEach(section => {
      section.classList.remove("highlight");
    });

    // Add highlight to the selected level
    const target = document.querySelector(`.membership-benefits .benefit[data-level="${level}"]`);
    if (target) {
      target.classList.add("highlight");
    }
  }

  // Legacy footer logic (if using old footer)
  let d = new Date();
  const oldYear = document.getElementById('currentYear');
  if (oldYear) oldYear.innerHTML = `©${d.getFullYear()}`;
  const oldMod = document.querySelector('#lastModified');
  if (oldMod && !modEl) oldMod.textContent = `Last Modification: ${document.lastModified}`;
});
