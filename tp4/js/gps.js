let map;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#map").innerHTML =
      "La géolocalisation n'est pas supportée par ce navigateur.";
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Si ya existe un mapa, lo eliminamos
  if (map) {
    map.remove();
  }

  // Crear mapa interactivo
  map = L.map("map").setView([lat, lon], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  // Añadir marcador
  L.marker([lat, lon])
    .addTo(map)
    .bindPopup("Vous êtes ici 📍")
    .openPopup();
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.querySelector("#map").innerHTML =
        "L'utilisateur a refusé la demande de géolocalisation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.querySelector("#map").innerHTML =
        "Les informations de localisation ne sont pas disponibles.";
      break;
    case error.TIMEOUT:
      document.querySelector("#map").innerHTML =
        "La demande de localisation a expiré.";
      break;
    default:
      document.querySelector("#map").innerHTML = "Erreur inconnue.";
  }
}
