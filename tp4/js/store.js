// store.js
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

// Afficher la liste
function displayContactList() {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  const contactListString = localStorage.getItem("contactList");
  const contactList = contactListString ? JSON.parse(contactListString) : [];

  for (const contact of contactList) {
    tbody.innerHTML += `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.firstname}</td>
        <td>${contact.date}</td>
        <td>${contact.adress}</td>
        <td>${contact.mail}</td>
      </tr>`;
  }
}
