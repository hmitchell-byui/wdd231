// scripts/home.js
document.addEventListener('DOMContentLoaded', () => {
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

  // ===== Weather widget =====
  const OPENWEATHER_KEY = 'bd56e8d57cf8467b3cfc5450cf0349d9';

  async function loadWeather() {
    const weatherEl = document.getElementById('weather');
    if (!weatherEl) return;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Gallatin,US&units=imperial&appid=${OPENWEATHER_KEY}`;

    try {
      weatherEl.innerHTML = `<p>Loading weather...</p>`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const cityName = data?.city?.name || 'Gallatin';
      const list = Array.isArray(data.list) ? data.list : [];

      // Current conditions
      const current = list[0];
      const currentTemp = Math.round(current.main.temp);
      const currentDesc = capitalize(current.weather[0].description);

      // Next 3 days (midday entries)
      const byDate = {};
      for (const item of list) {
        const d = new Date(item.dt * 1000);
        const key = d.toLocaleDateString();
        const diff = Math.abs(d.getHours() - 12);
        if (!byDate[key] || diff < byDate[key].diff) {
          byDate[key] = { diff, item, date: d };
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
            const t = Math.round(d.main.temp);
            const desc = d.weather[0].main;
            return `<li>${dateStr}: ${t}°F, ${desc}</li>`;
          }).join('')}
        </ul>
      `;
    } catch (err) {
      weatherEl.innerHTML = `<p>Unable to load weather data.</p>`;
      console.error(err);
    }
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }

  // ===== Member spotlight =====
  async function loadSpotlight() {
    const spotEl = document.getElementById('spotlight');
    if (!spotEl) return;

    try {
      spotEl.innerHTML = `<p>Loading spotlight...</p>`;
      const res = await fetch('scripts/members.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const members = Array.isArray(data.members) ? data.members : [];

      const goldSilver = members.filter(m => Number(m.membership) === 2 || Number(m.membership) === 3);
      const selected = sample(goldSilver, 3);

      spotEl.innerHTML = selected.map(m => spotlightCard(m)).join('');
    } catch (err) {
      spotEl.innerHTML = `<p>Unable to load spotlight members.</p>`;
      console.error(err);
    }
  }

  function sample(arr, n) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  }

  function levelLabel(level) {
    switch (Number(level)) {
      case 3: return 'Gold';
      case 2: return 'Silver';
      default: return 'Member';
    }
  }

  function spotlightCard(m) {
    return `
      <article class="card">
        <img class="logo" src="${m.image}" alt="${m.name} logo" loading="lazy">
        <h3>${m.name}</h3>
        <p class="meta">${levelLabel(m.membership)}</p>
        <p>${m.address}</p>
        <a class="visit" href="${m.website}" target="_blank" rel="noopener">Visit website</a>
      </article>
    `;
  }

  // Init
  loadWeather();
  loadSpotlight();
});
