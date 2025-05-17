const input = document.getElementById('input');
const inputButton = document.getElementById('input-button');
const inputCard = document.getElementById('input-card');
const container = document.getElementById('container');
const deleteAllButton = document.getElementById('delete-all');

if (localStorage.getItem('innerHTML')) {
   container.innerHTML = localStorage.getItem('innerHTML');
   [...document.querySelectorAll('.done-button')].forEach((item) => item.addEventListener('click', doneCard));
   [...document.querySelectorAll('.delete-button')].forEach((item) => item.addEventListener('click', deleteCard));
}
// document.addEventListener('click', updateLocaleStore);

input.addEventListener('input', resizeInput);
input.addEventListener('keydown', endInput);
input.addEventListener('focus', focusInputCard);
input.addEventListener('blur', blurInputCard);
deleteAllButton.addEventListener('click', deleteAll);

function resizeInput() {
  input.style.height = 'auto';
  input.style.height = input.scrollHeight + 'px';
  //inputButton.disabled = input.value.trim().length === 0;
}
function endInput(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (input.value.trim().length !== 0) {
      createCard(input.value);
      input.blur();
      inputCard.classList.remove('focus');
      input.value = '';
      resizeInput();
    }
  }
}
function focusInputCard() {
  input.classList.add('focus');
  inputCard.classList.add('focus');
}
function blurInputCard() {
  inputCard.classList.remove('focus');
  setTimeout(() => { input.classList.remove('focus')}, 500);
}

function deleteCard(event) {
  const card = event.target.parentNode;
  card.remove();
  updateLocaleStore();
}

function doneCard(event) {
  const button = event.target;
  const card = button.parentNode;
  button.classList.toggle('done');
  card.classList.toggle('done');
  updateLocaleStore();
}

function createCard(content) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('sided');

  const text = document.createElement('div');
  text.classList.add('text');
  text.textContent = content;

  const doneButton = document.createElement('button');
  doneButton.classList.add('icon');
  doneButton.classList.add('done-button');
  doneButton.addEventListener('click', doneCard);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('icon');
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', deleteCard);

  const corner = document.createElement('div');
  corner.classList.add('corner');

  card.append(text, doneButton, deleteButton, corner);
  container.prepend(card);
  setTimeout(() => {
    card.classList.remove('sided');
    updateLocaleStore();
  }, 0);
}

function deleteAll() {
  container.innerHTML = '';
  updateLocaleStore();
}

function updateLocaleStore() {
  localStorage.setItem('innerHTML', container.innerHTML);
}
