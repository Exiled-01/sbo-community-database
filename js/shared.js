// =========================================
// SHARED UI BEHAVIOR
// Sidebar toggle (mobile) + generic modal close
// =========================================

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebar-scrim");

  if (toggle && sidebar && scrim) {
    toggle.addEventListener("click", function () {
      sidebar.classList.add("open");
      scrim.classList.add("visible");
    });

    scrim.addEventListener("click", function () {
      sidebar.classList.remove("open");
      scrim.classList.remove("visible");
    });

    // Close sidebar after navigating on mobile
    sidebar.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        sidebar.classList.remove("open");
        scrim.classList.remove("visible");
      });
    });
  }
});

// Close any modal when clicking its backdrop directly
document.addEventListener("click", function (event) {
  if (event.target.classList && event.target.classList.contains("modal-backdrop")) {
    event.target.classList.remove("visible");
  }
});

// Close any open modal on Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.visible").forEach(function (box) {
      box.classList.remove("visible");
    });
  }
});
