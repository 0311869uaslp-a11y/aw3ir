window.onload = function () {
  console.log("DOM ready!");

  const form = document.querySelector("#userForm");
  const modal = new bootstrap.Modal(document.getElementById("myModal"));
  const modalTitle = document.querySelector(".modal-title");
  const modalBody = document.querySelector(".modal-body");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const lastname = document.querySelector("#lastname").value.trim();
    const firstname = document.querySelector("#firstname").value.trim();
    const birthday = document.querySelector("#birthday").value;
    const address = document.querySelector("#address").value.trim();
    const email = document.querySelector("#email").value.trim();

    let errors = [];

    if (lastname.length < 5)
      errors.push("Le nom doit avoir au moins 5 caractères.");
    if (firstname.length < 5)
      errors.push("Le prénom doit avoir au moins 5 caractères.");
    if (address.length < 5)
      errors.push("L'adresse doit avoir au moins 5 caractères.");
    if (!validateEmail(email))
      errors.push("L'adresse mail n'est pas valide.");

    const birthdayDate = new Date(birthday);
    const birthdayTimestamp = birthdayDate.getTime();
    const nowTimestamp = Date.now();

    if (birthdayTimestamp > nowTimestamp) {
      errors.push("La date de naissance ne peut pas être dans le futur.");
    }

    // Si hay errores → mostrar lista
    if (errors.length > 0) {
      modalTitle.textContent = "Erreur de validation";
      modalBody.innerHTML =
        "<ul class='text-start text-danger'>" +
        errors.map((e) => `<li>${e}</li>`).join("") +
        "</ul>";
      modal.show();
      return;
    }

    // Si todo está correcto → mostrar bienvenida + mapa
    modalTitle.textContent = "Formulaire validé 🎉";
    modalBody.innerHTML = `
      <p class="text-success mb-2">
        Bienvenue <strong>${firstname} ${lastname}</strong> !<br>
        Vous êtes né(e) le <strong>${birthday}</strong> et vous habitez à <strong>${address}</strong>.
      </p>
      <div id="map" style="height:300px; border-radius:10px;"></div>
    `;

    modal.show();

    // Esperar a que el modal se muestre y crear el mapa
    setTimeout(() => {
      // Crear mapa con Leaflet (OpenStreetMap)
      const map = L.map("map").setView([48.8566, 2.3522], 13); // París por defecto
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Intentar geolocalizar la dirección
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            map.setView([lat, lon], 14);
            L.marker([lat, lon])
              .addTo(map)
              .bindPopup(`<b>${firstname} ${lastname}</b><br>${address}`)
              .openPopup();
          }
        })
        .catch((err) => console.error("Erreur de géolocalisation:", err));
    }, 600);
  });

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
};
