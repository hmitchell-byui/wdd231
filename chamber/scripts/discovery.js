// scripts/discovery.js
import { attractions } from '../data/attractions.mjs';

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

  // ===== Visitor Message - localStorage for last visit =====
  const visitorSection = document.getElementById('visitor-message');
  if (visitorSection) {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    const lastVisitDate = lastVisit ? new Date(lastVisit) : null;
    
    let message = '';
    
    if (!lastVisit) {
      // First visit
      message = 'Welcome! Let us know if you have any questions.';
    } else {
      const now = new Date();
      const timeDiff = now - lastVisitDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Less than a day
        message = 'Back so soon! Awesome!';
      } else {
        // n days ago
        const dayText = daysDiff === 1 ? 'day' : 'days';
        message = `You last visited ${daysDiff} ${dayText} ago.`;
      }
    }
    
    // Update localStorage with today's visit
    localStorage.setItem('lastVisit', today);
    
    // Display the message
    visitorSection.innerHTML = `<p>${message}</p>`;
  }

  // ===== Render attraction cards =====
  const discoverGrid = document.getElementById('discover-grid');
  if (discoverGrid && attractions.length > 0) {
    discoverGrid.innerHTML = attractions
      .map(
        (attr) => `
      <article class="discover-card">
        <h2>${attr.name}</h2>
        <figure>
          <img src="${attr.image}" alt="${attr.name}" loading="lazy" />
        </figure>
        <address>${attr.address}</address>
        <p>${attr.description}</p>
        <button type="button">Learn More</button>
      </article>
    `
      )
      .join('');
  }
});
