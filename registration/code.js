const main = document.getElementById('main');

const signInContainer = document.getElementById("sign-in");
const signInForm = document.getElementById("sign-in-form");
signInForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
const signInError1 = document.getElementById("sign-in-error1");
const signInEmail = document.getElementById("sign-in-email");
signInEmail.addEventListener("input", () => {
  signInError1.classList.add("hidden");
});
signInEmail.addEventListener("keydown", noSpaces);
const signInError2 = document.getElementById("sign-in-error2");
const signInPassword = document.getElementById("sign-in-password");
signInPassword.addEventListener("input", () => {
  signInError2.classList.add("hidden");
});
const signInButton = document.getElementById("sign-in-button");
signInButton.addEventListener("click", enterAccount);
const signUpButton = document.getElementById("sign-up-button");
signUpButton.addEventListener("click", startRegistration);

const signUpContainer = document.getElementById("sign-up");
const signUpForm = document.getElementById("sign-up-form");
signUpForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
const nameInput = document.getElementById("sign-up-name");
nameInput.addEventListener("keydown", noSpaces);
const surnameInput = document.getElementById("sign-up-surname");
surnameInput.addEventListener("keydown", noSpaces);
const signUpError1 = document.getElementById("sign-up-error1");
const emailInput = document.getElementById("sign-up-email");
emailInput.addEventListener("input", () => {
  signUpError1.classList.add("hidden");
});
emailInput.addEventListener("keydown", noSpaces);
const signUpError2 = document.getElementById("sign-up-error2");
const passwordInput = document.getElementById("sign-up-password");
passwordInput.addEventListener("input", () => {
  signUpError2.classList.add("hidden");
});
const password2Input = document.getElementById("sign-up-password-repeat");
password2Input.addEventListener("input", () => {
  signUpError2.classList.add("hidden");
});
const endSignUpButton = document.getElementById("end-sign-up-button");
endSignUpButton.addEventListener("click", endSignUp);
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", returnToSignIn);

const createdContainer = document.getElementById("created-message");
const enterButton = document.getElementById("enter-button");
enterButton.addEventListener("click", returnAfterSignUp);

const accountContainer = document.getElementById("account");
const accountHeader = document.getElementById("account-header");
const exitButton = document.getElementById("exit-button");
exitButton.addEventListener("click", exitAccount);

const testData = {
  "user@mail.ru": {
    name: "Игорь",
    surname: "Игоревич",
    password: "fff",
  },
};

let users = JSON.parse(localStorage.getItem("users")) || {};
let activeUser = localStorage.getItem("active");

if (activeUser && Object.keys(users).includes(activeUser)) {
  accountHeader.innerHTML = `Добро пожаловать,<br>${users[activeUser].name} ${users[activeUser].surname}!`;
  signInContainer.classList.add("hidden");
  accountContainer.classList.remove("hidden");
}

[...document.querySelectorAll(".show-password")].forEach((button) => {
  button.addEventListener("click", showPassword);
});

function noSpaces(event) {
  if (event.keyCode === 32) event.preventDefault();
}

function showPassword(event) {
  const button = event.target;
  const input = button.parentNode.querySelector("input");
  input.type = "text";
  button.removeEventListener("click", showPassword);
  button.addEventListener("click", hidePassword);
  button.classList.add("active");
}
function hidePassword(event) {
  const button = event.target;
  const input = button.parentNode.querySelector("input");
  input.type = "password";
  button.removeEventListener("click", hidePassword);
  button.addEventListener("click", showPassword);
  button.classList.remove("active");
}

function startRegistration() {
  signUpError1.classList.add('hidden');
  signUpError2.classList.add('hidden');
  nameInput.value = '';
  surnameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
  password2Input.value = '';
  signInContainer.classList.add("hidden");
  signUpContainer.classList.remove("hidden");
  signInError1.classList.add('hidden');
  signInError2.classList.add('hidden');
  signInPassword.value = '';
}

function returnToSignIn() {
  signUpContainer.classList.add("hidden");
  signInContainer.classList.remove("hidden");
  signInError1.classList.add('hidden');
  signInError2.classList.add('hidden');
}
function returnAfterSignUp() {
  signInError1.classList.add('hidden');
  signInError2.classList.add('hidden');
  signInEmail.value = emailInput.value;
  signInPassword.value = '';
  createdContainer.classList.add("hidden");
  signInContainer.classList.remove("hidden");
  signInPassword.focus();
}

function enterAccount() {
  if (signInEmail.validity.valid && signInPassword.validity.valid) {
    const email = signInEmail.value.toLowerCase();
    const password = signInPassword.value;
    if (Object.keys(users).includes(email)) {
      if (users[email].password === password) {
        activeUser = email;
        localStorage.setItem("active", activeUser);
        accountHeader.innerHTML = `Добро пожаловать,<br>${users[activeUser].name} ${users[activeUser].surname}!`;
        signInContainer.classList.add("hidden");
        accountContainer.classList.remove("hidden");
      } else {
        signInError2.classList.remove("hidden");
        signInPassword.focus();
      }
    } else {
      signInError1.classList.remove("hidden");
      signInEmail.focus();
    }
  }
}

function endSignUp() {
  signUpError1.classList.add('hidden');
  signUpError2.classList.add('hidden');
  if (
    nameInput.validity.valid &&
    surnameInput.validity.valid &&
    emailInput.validity.valid &&
    passwordInput.validity.valid &&
    password2Input.validity.valid
  ) {
    const name = nameInput.value;
    const surname = surnameInput.value;
    const email = emailInput.value.toLowerCase();
    const password = passwordInput.value;
    const password2 = password2Input.value;
    if (Object.keys(users).includes(email)) {
      signUpError1.classList.remove('hidden');
      emailInput.focus();
      return;
    }
    if (password !== password2) {
      signUpError2.classList.remove('hidden');
      passwordInput.focus();
      return;
    }
    users[email] = { name, surname, password };
    localStorage.setItem('users', JSON.stringify(users));
    signUpContainer.classList.add('hidden');
    createdContainer.classList.remove('hidden');
  }
}

function exitAccount() {
  activeUser = null;
  localStorage.removeItem("active");
  signInPassword.value = '';
  accountContainer.classList.add("hidden");
  signInContainer.classList.remove("hidden");
}
