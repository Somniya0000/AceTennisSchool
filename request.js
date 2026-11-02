const requestFormModal = document.querySelector("[data-request-form-modal]");
const requestSuccessModal = document.querySelector("[data-request-success]");
const requestOpeners = document.querySelectorAll(
  "[data-request-open], .slot-btn"
);
const requestFormClose = document.querySelector("[data-request-form-close]");
const requestSuccessClose = document.querySelector(
  "[data-request-success-close]"
);
const ctaForm = document.querySelector(".cta-form");
const requestForm = document.querySelector("[data-request-form]");

const setModalState = (modal, isOpen) => {
  if (!modal) {
    return;
  }

  modal.classList.toggle("is-open", isOpen);
  modal.setAttribute("aria-hidden", (!isOpen).toString());
};

const setBodyState = (isOpen) => {
  document.body.classList.toggle("request-modal-open", isOpen);
};

const closeAll = () => {
  setModalState(requestFormModal, false);
  setModalState(requestSuccessModal, false);
  setBodyState(false);
};

const setScheduleDetails = (opener) => {
  if (!requestFormModal || !opener) {
    return;
  }

  const dayEl = requestFormModal.querySelector("[data-schedule-day]");
  const timeEl = requestFormModal.querySelector("[data-schedule-time]");
  const trainerEl = requestFormModal.querySelector("[data-schedule-trainer]");
  const locationEl = requestFormModal.querySelector(
    "[data-schedule-location]"
  );

  if (!dayEl && !timeEl && !trainerEl && !locationEl) {
    return;
  }

  const slotCard = opener.closest(".slot-card");
  const daySource = document.querySelector(".schedule-day h2");
  const timeSource = slotCard?.querySelector(".slot-time");
  const trainerSource = slotCard?.querySelector(".icon-user")
    ?.parentElement;
  const locationSource = document.body.dataset.scheduleLocation;

  if (dayEl && daySource) {
    dayEl.textContent = daySource.textContent.trim();
  }

  if (timeEl && timeSource) {
    timeEl.textContent = timeSource.textContent.trim();
  }

  if (trainerEl && trainerSource) {
    trainerEl.textContent = trainerSource.textContent.replace(/\s+/g, " ").trim();
  }

  if (locationEl && locationSource) {
    locationEl.textContent = locationSource.trim();
  }
};

const openForm = (opener) => {
  const isSchedule = opener.classList.contains("slot-btn");

  if (isSchedule) {
    setScheduleDetails(opener);
  } else {
    // очистка полей (ВАЖНО)
    const dayEl = requestFormModal.querySelector("[data-schedule-day]");
    const timeEl = requestFormModal.querySelector("[data-schedule-time]");
    const trainerEl = requestFormModal.querySelector("[data-schedule-trainer]");

    if (dayEl) dayEl.textContent = "";
    if (timeEl) timeEl.textContent = "";
    if (trainerEl) trainerEl.textContent = "";
  }

  setModalState(requestFormModal, true);
  setModalState(requestSuccessModal, false);
  setBodyState(true);
};

const openSuccess = () => {
  setModalState(requestFormModal, false);
  setModalState(requestSuccessModal, true);
  setBodyState(true);
};



document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-request-open], .slot-btn");
  if (!opener) {
    return;
  }
  event.preventDefault();
  openForm(opener);
});

const clearForm = (form) => {
  if (!form) {
    return;
  }
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = "";
  });
};

const handleRequestSubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  clearForm(form);
  if (requestSuccessModal) {
    openSuccess();
  } else {
    closeAll();
  }
};

if (ctaForm) {
  ctaForm.addEventListener("submit", handleRequestSubmit);
}

if (requestForm) {
  requestForm.addEventListener("submit", handleRequestSubmit);
}

if (requestFormClose) {
  requestFormClose.addEventListener("click", closeAll);
}

if (requestSuccessClose) {
  requestSuccessClose.addEventListener("click", closeAll);
}

if (requestFormModal) {
  requestFormModal.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeAll();
    }
  });
}

if (requestSuccessModal) {
  requestSuccessModal.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeAll();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAll();
  }
});

const nameInputs = document.querySelectorAll(".name-input");
const phoneInputs = document.querySelectorAll(".phone-input");


// Только буквы
nameInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(
      /[^a-zA-Zа-яА-ЯёЁ ]/g,
      ""
    );
  });
});


// Только цифры
phoneInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value
      .replace(/\D/g, "")
      .slice(0, 11);
  });
});
