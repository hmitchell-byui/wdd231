document.addEventListener("DOMContentLoaded", () => {
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

  // Footer logic
  let d = new Date();
  document.getElementById('currentYear').innerHTML = `©${d.getFullYear()}`;
  document.querySelector('#lastModified').textContent = `Last Modification: ${document.lastModified}`;
});
