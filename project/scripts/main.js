// Mitchellville Farms - Main Script

document.addEventListener('DOMContentLoaded', () => {
  // ===== Weather Widget =====
  const OPENWEATHER_KEY = 'bd56e8d57cf8467b3cfc5450cf0349d9';

  async function loadWeather() {
    const weatherEl = document.getElementById('weather');
    if (!weatherEl) return;

    try {
      weatherEl.innerHTML = '<p>Loading weather...</p>';
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=Mitchellville,US&units=imperial&appid=${OPENWEATHER_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const cityName = data?.city?.name || 'Mitchellville';
      const list = Array.isArray(data.list) ? data.list : [];

      const current = list[0];
      const currentTemp = Math.round(current?.main?.temp || 0);
      const currentDesc = current?.weather?.[0]?.main || 'Unknown';

      const byDate = {};
      for (const item of list) {
        const d = new Date(item.dt * 1000);
        const key = d.toLocaleDateString();
        const diff = Math.abs(d.getHours() - 12);
        if (!byDate[key] || diff < byDate[key].diff) {
          byDate[key] = { diff, item };
        }
      }
      const days = Object.values(byDate)
        .map(x => x.item)
        .filter((_, idx) => idx > 0)
        .slice(0, 3);

      weatherEl.innerHTML = `
        <p><strong>${cityName}:</strong> ${currentTemp}°F, ${currentDesc}</p>
        <ul>
          ${days.map(d => {
            const dateStr = new Date(d.dt * 1000).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const t = Math.round(d.main?.temp || 0);
            const desc = d.weather?.[0]?.main || 'Unknown';
            return `<li>${dateStr}: ${t}°F, ${desc}</li>`;
          }).join('')}
        </ul>
      `;
    } catch (err) {
      weatherEl.innerHTML = '<p>Unable to load weather. Please try again later.</p>';
      console.error('Weather error:', err);
    }
  }

  // ===== Member Spotlight =====
  async function loadSpotlight() {
    const spotEl = document.getElementById('spotlight');
    if (!spotEl) return;

    try {
      spotEl.innerHTML = '<p>Loading spotlight...</p>';
      const res = await fetch('scripts/members.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const members = Array.isArray(data.members) ? data.members : [];

      // Spotlight top-tier supporters (Pig and Horse)
      const goldSilver = members.filter(m => Number(m.membership) === 3 || Number(m.membership) === 4);
      const selected = randomSample(goldSilver, 3);

      spotEl.innerHTML = selected.map(m => memberCard(m)).join('');
    } catch (err) {
      spotEl.innerHTML = '<p>Unable to load spotlight.</p>';
      console.error('Spotlight error:', err);
    }
  }

  function randomSample(arr, n) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  }

  function membershipLevel(level) {
    const levels = {
      4: 'Horse Patron 🐎',
      3: 'Pig Supporter 🐖',
      2: 'Cow Supporter 🐄',
      1: 'Chicken Supporter 🐔'
    };
    return levels[Number(level)] || 'Member';
  }

  function memberCard(m) {
    return `
      <article class="card">
        <img class="logo" src="${m.image}" alt="${m.name} logo" loading="lazy">
        <h3>${m.name}</h3>
        <p class="meta">${membershipLevel(m.membership)}</p>
        <p>${m.description}</p>
        <a href="${m.website}" target="_blank" rel="noopener">Visit website →</a>
      </article>
    `;
  }

  // ===== Directory =====
  async function loadDirectory() {
    const membersEl = document.getElementById('members');
    if (!membersEl) return;

    try {
      membersEl.innerHTML = '<p>Loading members...</p>';
      const res = await fetch('scripts/members.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const members = Array.isArray(data.members) ? data.members : [];

      window.allMembers = members;
      renderMembers('grid');
    } catch (err) {
      membersEl.innerHTML = '<p>Unable to load member directory.</p>';
      console.error('Directory error:', err);
    }
  }

  function renderMembers(view) {
    const membersEl = document.getElementById('members');
    if (!membersEl || !window.allMembers) return;

    if (view === 'list') {
      membersEl.className = 'list-view';
      const tableHTML = `
        <table role="table" aria-label="Member directory table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Business Name</th>
              <th>Membership</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            ${window.allMembers.map(m => `
              <tr>
                <td><img src="${m.image}" alt="${m.name} logo" loading="lazy"></td>
                <td>${m.name}</td>
                <td>${membershipLevel(m.membership)}</td>
                <td>${m.address}</td>
                <td><a href="tel:${m.phone}">${m.phone}</a></td>
                <td><a href="${m.website}" target="_blank" rel="noopener">Visit →</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      membersEl.innerHTML = tableHTML;
    } else {
      membersEl.className = 'grid-view cards';
      membersEl.innerHTML = window.allMembers.map(m => {
        return `
          <article class="card">
            <img class="logo" src="${m.image}" alt="${m.name} logo" loading="lazy">
            <h3>${m.name}</h3>
            <p class="meta">${membershipLevel(m.membership)}</p>
            <p>${m.description}</p>
            <p>${m.address}</p>
            <a href="tel:${m.phone}">${m.phone}</a><br>
            <a href="${m.website}" target="_blank" rel="noopener">Website →</a>
          </article>
        `;
      }).join('');
    }
  }

  // ===== Directory View Toggle =====
  const gridBtn = document.getElementById('gridBtn');
  const listBtn = document.getElementById('listBtn');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => {
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      renderMembers('grid');
    });

    listBtn.addEventListener('click', () => {
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      renderMembers('list');
    });

    gridBtn.classList.add('active');
  }

  // ===== Form Handling =====
  const joinForm = document.getElementById('joinForm');
  if (joinForm) {
    const timestampField = document.getElementById('timestamp');

    if (timestampField) {
      timestampField.value = new Date().toISOString();
    }

    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (timestampField) {
        timestampField.value = new Date().toISOString();
      }

      const formData = new FormData(joinForm);
      const params = new URLSearchParams(formData);

      // Redirect to thank you page
      window.location.href = `thank-you.html?${params.toString()}`;
    });
  }

  // ===== Membership Highlight =====
  const membershipSelect = document.getElementById('membership');
  if (membershipSelect) {
    membershipSelect.addEventListener('change', () => {
      highlightBenefits();
    });

    function highlightBenefits() {
      const level = membershipSelect.value;
      const benefits = document.querySelectorAll('.benefit');

      benefits.forEach(b => {
        b.classList.remove('highlight');
        if (b.dataset.level === level) {
          b.classList.add('highlight');
        }
      });
    }
  }

  // ===== Initialize =====
  loadWeather();
  loadSpotlight();
  loadDirectory();
});
