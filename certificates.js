const openButton = document.querySelector(".certificates-button");
const formModal = document.querySelector("[data-cert-modal]");
const successModal = document.querySelector("[data-cert-success]");
const formClose = document.querySelector("[data-cert-close]");
const successClose = document.querySelector("[data-cert-success-close]");
const form = document.querySelector("[data-cert-form]");

const setModalState = (modal, isOpen) => {
  if (!modal) {
    return;
  }

  modal.classList.toggle("is-open", isOpen);
  modal.setAttribute("aria-hidden", (!isOpen).toString());
};

const closeAll = () => {
  setModalState(formModal, false);
  setModalState(successModal, false);
  document.body.classList.remove("modal-open");
};

const openForm = () => {
  setModalState(formModal, true);
  setModalState(successModal, false);
  document.body.classList.add("modal-open");
};

const openSuccess = () => {
  setModalState(formModal, false);
  setModalState(successModal, true);
  document.body.classList.add("modal-open");
};

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeAll();
  }
};

if (openButton) {
  openButton.addEventListener("click", openForm);
}

if (formClose) {
  formClose.addEventListener("click", closeAll);
}

if (successClose) {
  successClose.addEventListener("click", closeAll);
}

if (formModal) {
  formModal.addEventListener("click", handleBackdropClick);
}

if (successModal) {
  successModal.addEventListener("click", handleBackdropClick);
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    openSuccess();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAll();
  }
});

const nameInputs = document.querySelectorAll(
  'input[name="recipient"], input[name="from"]'
);

nameInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(
      /[^a-zA-Zа-яА-ЯёЁ\s-]/g,
      ""
    );
  });
});