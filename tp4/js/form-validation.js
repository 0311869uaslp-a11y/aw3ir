
function calcNbChar(id) {
  const input = document.querySelector(`#${id}`);
  if (!input) return;

  
  const parent = input.closest('.d-flex') || input.parentElement;

 
  const span = parent.querySelector('span');

  if (span) {
    span.textContent = input.value.length;
  }
}



document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const firstname = document.getElementById("firstname");
  const date = document.getElementById("birthdate");
  const adress = document.getElementById("adress");
  const mail = document.getElementById("mail");

  
  let valid = true;

  if (name.value.length < 5) valid = false;
  if (firstname.value.length < 5) valid = false;

  const today = new Date().toISOString().split("T")[0];
  if (date.value === "") valid = false;            // ✅ no permitir fecha vacía

  if (date.value > today) valid = false;

  if (adress.value.length < 5) valid = false;

  const mailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!mail.value.match(mailPattern)) valid = false;

  if (!valid) {
    this.classList.add("was-validated");
    return;
  }

  
  contactStore.add(name.value, firstname.value, date.value, adress.value, mail.value);
  displayContactList();
  showSuccessMessage();   
  this.reset();
  this.classList.remove("was-validated");


});


document.getElementById("gpsBtn").addEventListener("click", function () {
  getLocation();
});


document.getElementById("resetBtn").addEventListener("click", function () {
  contactStore.reset();
  displayContactList();
});


window.onload = function () {
  displayContactList();
};

function showSuccessMessage() {
  const msg = document.getElementById("successMessage");
  msg.classList.remove("d-none");

  
  setTimeout(() => {
    msg.classList.add("d-none");
  }, 3000);
}

