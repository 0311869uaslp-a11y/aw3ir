// form-validation.js

// 1️⃣ Contador de caracteres
function calcNbChar(id) {
  const input = document.querySelector(`#${id}`);
  if (!input) return;

  // Buscamos dentro del mismo contenedor padre (por ejemplo, el .d-flex)
  const parent = input.closest('.d-flex') || input.parentElement;

  // Buscamos el primer <span> dentro del mismo contenedor
  const span = parent.querySelector('span');

  if (span) {
    span.textContent = input.value.length;
  }
}


// 2️⃣ Validación + envoi
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const firstname = document.getElementById("firstname");
  const date = document.getElementById("birthdate");
  const adress = document.getElementById("adress");
  const mail = document.getElementById("mail");

  // Validaciones básicas
  let valid = true;

  if (name.value.length < 5) valid = false;
  if (firstname.value.length < 5) valid = false;

  const today = new Date().toISOString().split("T")[0];
  if (date.value > today) valid = false;

  if (adress.value.length < 5) valid = false;

  const mailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!mail.value.match(mailPattern)) valid = false;

  if (!valid) {
    this.classList.add("was-validated");
    return;
  }

  // Si válido → guardar
  contactStore.add(name.value, firstname.value, date.value, adress.value, mail.value);
  displayContactList();
  this.reset();
  this.classList.remove("was-validated");
});

// 3️⃣ Botón GPS
document.getElementById("gpsBtn").addEventListener("click", function () {
  getLocation();
});

// 4️⃣ Botón reset
document.getElementById("resetBtn").addEventListener("click", function () {
  contactStore.reset();
  displayContactList();
});

// 5️⃣ Mostrar lista al cargar
window.onload = function () {
  displayContactList();
};
