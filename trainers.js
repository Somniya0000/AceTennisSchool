const requestModal = document.querySelector("[data-request-modal]");
const requestOpeners = document.querySelectorAll("[data-request-open]");
const requestClose = document.querySelector("[data-request-close]");
const ctaForms = document.querySelectorAll(".cta-form");

const setRequestModal = (isOpen) => {
  if (!requestModal) {
    return;
  }

  requestModal.classList.toggle("is-open", isOpen);
  requestModal.setAttribute("aria-hidden", (!isOpen).toString());
  document.body.classList.toggle("request-modal-open", isOpen);
};

requestOpeners.forEach((button) => {
  button.addEventListener("click", () => setRequestModal(true));
});

ctaForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setRequestModal(true);
  });
});
}

if (requestClose) {
  requestClose.addEventListener("click", () => setRequestModal(false));
}

if (requestModal) {
  requestModal.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      setRequestModal(false);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setRequestModal(false);
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
