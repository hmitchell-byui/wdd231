const courses = [
  { subject: "WDD", number: 130, title: "Web Fundamentals", credits: 2, completed: true, description: "HTML, CSS, Media" },
  { subject: "WDD", number: 131, title: "Web Design and Development", credits: 2, completed: true, description: "Semantic HTML, modular CSS, responsive layout" },
  { subject: "WDD", number: 230, title: "Web Frontend Development", credits: 2, completed: false, description: "Responsive, accessibility" },
  { subject: "CSE", number: 110, title: "Programming Building Blocks", credits: 2, completed: true, description: "Programming fundamentals" },
  { subject: "CSE", number: 111, title: "Intro to Data Structures", credits: 2, completed: true, description: "Arrays, recursion, algorithm basics" },
  { subject: "CSE", number: 210, title: "Programming with Classes", credits: 3, completed: false, description: "OOP concepts" }
];


document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  renderCourses(courses);
  updateCredits(courses);
});

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.filter;
      let filtered = courses;

      if (key === 'WDD') filtered = courses.filter(c => c.subject === 'WDD');
      else if (key === 'CSE') filtered = courses.filter(c => c.subject === 'CSE');

      renderCourses(filtered);
      updateCredits(filtered);
    });
  });
}

function renderCourses(list) {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  grid.innerHTML = '';

  list.forEach(course => {
    const card = document.createElement('article');
    card.className = 'course-card' + (course.completed ? ' completed' : '');
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
      <header>
        <h3 class="course-title">${course.subject} ${course.number} – ${course.title}</h3>
        ${course.completed ? '<span class="course-badge">Completed</span>' : ''}
      </header>
      <p class="course-meta"><strong>Credits:</strong> ${course.credits}</p>
      <p class="course-desc">${course.description}</p>
    `;

    grid.appendChild(card);
  });
}

function updateCredits(list) {
  const totalEl = document.getElementById('creditTotal');
  if (!totalEl) return;

  const total = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  totalEl.textContent = total;
}
