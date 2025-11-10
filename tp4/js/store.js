
var contactStore = (function () {
  let contactListString = localStorage.getItem("contactList");
  var contactList = contactListString ? JSON.parse(contactListString) : [];

  return {
    add: function (_name, _firsname, _date, _adress, _mail) {
      var contact = {
        name: _name,
        firstname: _firsname,
        date: _date,
        adress: _adress,
        mail: _mail,
      };
      contactList.push(contact);
      localStorage.setItem("contactList", JSON.stringify(contactList));
      return contactList;
    },

    reset: function () {
      localStorage.removeItem("contactList");
      contactList = [];
      return contactList;
    },

    getList: function () {
      return contactList;
    },
  };
})();


function displayContactList() {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  const contactListString = localStorage.getItem("contactList");
  const contactList = contactListString ? JSON.parse(contactListString) : [];

  for (const contact of contactList) {

    // Convertir dirección a enlace de Google Maps
let mapLink = contact.adress;
if (mapLink.includes(",")) {
  const coords = contact.adress.split(",").map(c => c.trim());
  mapLink = `<a href="https://www.google.com/maps?q=${coords[0]},${coords[1]}" target="_blank">
               ${contact.adress}
             </a>`;
}


let mailLink = `<a href="mailto:${contact.mail}">${contact.mail}</a>`;


    tbody.innerHTML += `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.firstname}</td>
        <td>${contact.date}</td>
        <td>${mapLink}</td>
    <td>${mailLink}</td>
      </tr>`;
  }

  
  updateContactCount();
}

function updateContactCount() {
    const rows = document.querySelector("table tbody").children.length;
    document.getElementById("contactTitle").textContent = `Liste des contacts (${rows})`;
}

