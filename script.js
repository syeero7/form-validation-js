const form = document.querySelector("form");
const email = document.querySelector("#email");
const country = document.querySelector("#country");
const zipCode = document.querySelector("#zipCode");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const submitError = document.querySelector("span.submitError");

window.addEventListener("load", () => {
  const elements = [
    { id: "#email", function: showEmailError },
    { id: "#country", function: showSelectCountryError },
    { id: "#password", function: checkPassword },
  ];

  elements.forEach((element) => {
    const el = document.querySelector(element.id);
    const error = el.nextElementSibling;

    if (element.value == null) {
      element.function(error);
    }
  });
});

email.addEventListener("input", (e) => {
  const error = e.target.nextElementSibling;

  if (email.validity.valid) {
    email.classList.remove("invalid");
    email.classList.add("valid");
    clearErrorMessage(error);
  } else {
    showEmailError(error);
  }
});

country.addEventListener("change", (e) => {
  const error = e.target.nextElementSibling;

  if (country.selectedIndex !== 0) {
    country.classList.remove("invalid");
    country.classList.add("valid");
    clearErrorMessage(error);

    zipCode.disabled = false;
    checkZipCode(zipCode.nextElementSibling);
  }
});

zipCode.addEventListener("input", (e) => {
  const error = e.target.nextElementSibling;
  checkZipCode(error);
});

password.addEventListener("input", (e) => {
  const error = e.target.nextElementSibling;
  checkPassword(error);
});

confirmPassword.addEventListener("input", (e) => {
  const error = e.target.nextElementSibling;
  checkConfirmPassword(error);
});

form.addEventListener("submit", (e) => {
  if (checkValidFormFields()) {
    console.log("yes");
  } else {
    e.preventDefault();
    submitError.textContent = "* Please complete the form.";
  }
});

form.addEventListener("input", () => {
  if (checkValidFormFields()) {
    setTimeout(() => {
      submitError.textContent = "";
    }, 500);
  }
});

function checkValidFormFields() {
  const fields = form.querySelectorAll("input, select");
  const isValid = [...fields].every((field) => field.matches(".valid"));

  return isValid;
}

function clearErrorMessage(errorMessageElement) {
  errorMessageElement.textContent = "";
  errorMessageElement.classList.remove("active");
}

function showEmailError(errorMessageElement) {
  errorMessageElement.classList.add("active");
  email.classList.add("invalid");
  email.classList.remove("valid");

  if (email.validity.valueMissing) {
    errorMessageElement.textContent = "Please enter an email address";
  } else if (email.validity.typeMismatch) {
    errorMessageElement.textContent =
      "Entered value needs to be an email address";
  }
}

function showSelectCountryError(errorMessageElement) {
  errorMessageElement.classList.add("active");
  country.classList.add("invalid");
  country.classList.remove("valid");

  if (country.selectedIndex === 0) {
    errorMessageElement.textContent = "Please select a country";
    zipCode.disabled = true;
  }
}

function checkZipCode(errorMessageElement) {
  const constraints = {
    ch: [
      "^(CH-)?\\d{4}$",
      "Swiss postal codes must have exactly 4 digits\r\ne.g. CH-1950 or 1950",
    ],
    fr: [
      "^(F-)?\\d{5}$",
      "French postal codes must have exactly 5 digits\r\ne.g. F-75012 or 75012",
    ],
    de: [
      "^(D-)?\\d{5}$",
      "German postal codes must have exactly 5 digits\r\ne.g. D-12345 or 12345",
    ],
    nl: [
      "^(NL-)?\\d{4}\\s*([A-RT-Z][A-Z]|S[BCE-RT-Z])$",
      "Dutch postal codes must have exactly 4 digits, \r\nfollowed by 2 letters except SA, SD and SS",
    ],
  };

  const constraint = new RegExp(constraints[country.value][0], "");

  if (constraint.test(zipCode.value)) {
    zipCode.classList.remove("invalid");
    zipCode.classList.add("valid");
    clearErrorMessage(errorMessageElement);
  } else {
    errorMessageElement.classList.add("active");
    zipCode.classList.add("invalid");
    zipCode.classList.remove("valid");
    errorMessageElement.textContent = constraints[country.value][1];
  }
}

function checkPassword(errorMessageElement) {
  errorMessageElement.classList.add("active");
  password.classList.add("invalid");
  password.classList.remove("valid");

  if (password.validity.valueMissing) {
    errorMessageElement.textContent = "Please enter a password";
    return;
  }

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]|[_]).{8,}$/;

  if (passwordRegex.test(password.value)) {
    password.classList.remove("invalid");
    password.classList.add("valid");

    clearErrorMessage(errorMessageElement);
  } else {
    errorMessageElement.textContent =
      "The password must be a minimum of 8 characters without spaces and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.";
  }
}

function checkConfirmPassword(errorMessageElement) {
  errorMessageElement.classList.add("active");

  if (!password.validity.valid) return;

  if (password.value !== confirmPassword.value) {
    confirmPassword.classList.remove("valid");
    confirmPassword.classList.add("invalid");

    errorMessageElement.textContent = "Password do not match";
  } else {
    confirmPassword.classList.add("valid");
    confirmPassword.classList.remove("invalid");
    clearErrorMessage(errorMessageElement);
  }
}
