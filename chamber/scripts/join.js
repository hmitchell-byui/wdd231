document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("join-form");
  const timestampField = document.getElementById("timestamp");

  // Populate hidden timestamp when page loads
  timestampField.value = new Date().toISOString();

  // Ensure timestamp is refreshed on submit
  form.addEventListener("submit", () => {
    timestampField.value = new Date().toISOString();
  });

  // Optional: membership benefit modal logic
  const membershipSelect = document.getElementById("membership");
  membershipSelect.addEventListener("change", (e) => {
    const level = e.target.value;
    if (level) {
      showMembershipBenefits(level);
    }
  });

  function showMembershipBenefits(level) {
    const benefits = {
      bronze: [
        "Basic directory listing",
        "Access to monthly newsletter"
      ],
      silver: [
        "Directory listing with logo",
        "Event discounts",
        "Social media shoutouts"
      ],
      gold: [
        "Premium directory placement",
        "Spotlight feature on homepage",
        "Priority event sponsorship"
      ],
      platinum: [
        "All Gold benefits",
        "Exclusive networking events",
        "Custom marketing package"
      ]
    };

    alert(`Membership Benefits for ${level.toUpperCase()}:\n- ${benefits[level].join("\n- ")}`);
  }
});
