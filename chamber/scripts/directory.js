// directory.js

document.addEventListener('DOMContentLoaded', () => {
  // Footer dates
  const yearEl = document.getElementById('year');
  const modEl = document.getElementById('lastModified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = document.lastModified;

  // Nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.style.display = expanded ? 'none' : 'block';
    });
  }

  // View toggle
  const gridBtn = document.getElementById('gridBtn');
  const listBtn = document.getElementById('listBtn');
  const membersContainer = document.getElementById('members');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');

  let members = [];
  let currentView = 'grid';

  function togglePressed(active, inactive) {
    active.classList.add('is-active');
    inactive.classList.remove('is-active');
    active.setAttribute('aria-pressed', 'true');
    inactive.setAttribute('aria-pressed', 'false');
  }

  function levelLabel(level) {
    switch (Number(level)) {
      case 3: return 'Gold';
      case 2: return 'Silver';
      default: return 'Member';
    }
  }

  function renderGrid(items) {
    membersContainer.className = 'cards';
    membersContainer.innerHTML = items.map(m => `
      <article class="card">
        <img class="logo" src="images/members/${m.image}" alt="${m.name} logo">
        <div>
          <h3>${m.name}</h3>
          <p class="meta">${m.address}</p>
          <p class="meta">${m.phone}</p>
          <p class="meta">Membership: ${levelLabel(m.membership)}</p>
          <a class="visit" href="${m.website}" target="_blank" rel="noopener">Visit website</a>
        </div>
      </article>
    `).join('');
  }

  function renderList(items) {
    membersContainer.className = 'list';
    membersContainer.innerHTML = items.map(m => `
      <div class="list-item">
        <span class="name">${m.name}</span>
        <span class="contact">${m.phone} • <a href="${m.website}" target="_blank" rel="noopener">Website</a></span>
      </div>
    `).join('');
  }

  function initViewControls() {
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
  }

  async function loadMembers() {
    try {
      loadingEl.hidden = false;
      errorEl.hidden = true;
      const res = await fetch('scripts/members.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      members = Array.isArray(data) ? data : (data.members || []);
      currentView === 'grid' ? renderGrid(members) : renderList(members);
    } catch (err) {
      console.error(err);
      errorEl.hidden = false;
    } finally {
      loadingEl.hidden = true;
    }
  }

  initViewControls();
  loadMembers();
});
