const menuOpenButtons = document.querySelectorAll("[data-menu-open]");
const menuOverlay = document.querySelector("[data-menu-overlay]");
const menuCloseButton = document.querySelector("[data-menu-close]");
const scheduleToggle = document.querySelector("[data-menu-schedule]");
const schedulePanel = document.querySelector("[data-menu-schedule-panel]");
const headerScheduleToggle = document.querySelector("[data-header-schedule]");
const headerSchedulePanel = document.querySelector(
  "[data-header-schedule-panel]"
);

const closeHeaderSchedule = () => {
  if (!headerSchedulePanel || !headerScheduleToggle) {
    return;
  }

  headerSchedulePanel.classList.remove("is-open");
  headerSchedulePanel.setAttribute("aria-hidden", "true");
  headerScheduleToggle.classList.remove("is-active");
};

const toggleHeaderSchedule = () => {
  if (!headerSchedulePanel || !headerScheduleToggle) {
    return;
  }

  const nextState = !headerSchedulePanel.classList.contains("is-open");
  headerSchedulePanel.classList.toggle("is-open", nextState);
  headerSchedulePanel.setAttribute("aria-hidden", String(!nextState));
  headerScheduleToggle.classList.toggle("is-active", nextState);
};

if (menuOverlay) {
  const openMenu = () => {
    document.body.classList.add("menu-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    closeHeaderSchedule();
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuOverlay.setAttribute("aria-hidden", "true");
    if (schedulePanel && scheduleToggle) {
      schedulePanel.classList.remove("is-open");
      schedulePanel.setAttribute("aria-hidden", "true");
      scheduleToggle.classList.remove("is-active");
    }
  };

  menuOpenButtons.forEach((button) => {
    button.addEventListener("click", openMenu);
  });

  if (menuCloseButton) {
    menuCloseButton.addEventListener("click", closeMenu);
  }

  if (scheduleToggle && schedulePanel) {
    scheduleToggle.addEventListener("click", () => {
      const nextState = !schedulePanel.classList.contains("is-open");
      schedulePanel.classList.toggle("is-open", nextState);
      schedulePanel.setAttribute("aria-hidden", String(!nextState));
      scheduleToggle.classList.toggle("is-active", nextState);
    });
  }

  menuOverlay.addEventListener("click", (event) => {
    if (event.target === menuOverlay) {
      closeMenu();
    }
  });

  if (schedulePanel) {
    schedulePanel.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        closeMenu();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  menuOverlay.querySelectorAll(".menu-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

if (headerScheduleToggle && headerSchedulePanel) {
  headerScheduleToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleHeaderSchedule();
  });

  headerSchedulePanel.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      closeHeaderSchedule();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      headerSchedulePanel.classList.contains("is-open") &&
      !headerSchedulePanel.contains(event.target) &&
      !headerScheduleToggle.contains(event.target)
    ) {
      closeHeaderSchedule();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHeaderSchedule();
    }
  });
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector("button");
  if (!button || button.dataset.faqBound === "true") {
    return;
  }

  button.dataset.faqBound = "true";
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen.toString());
  });
});

