
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#map").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}


function showPosition(position) {

  
  document.getElementById("adress").value =
    position.coords.latitude.toFixed(6) + ", " + position.coords.longitude.toFixed(6);
  calcNbChar("adress");  


  
  const zoom = 5;
  const delta = 0.05 / Math.pow(2, zoom - 10);

  const bboxEdges = {
    south: position.coords.latitude - delta,
    north: position.coords.latitude + delta,
    west: position.coords.longitude - delta,
    east: position.coords.longitude + delta,
  };

  const bbox = `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${position.coords.latitude}%2C${position.coords.longitude}`;

 
  document.getElementById("map").innerHTML = `
        <iframe
          width="100%"
          height="200"
          frameborder="0"
          scrolling="no"
          src="${iframeSrc}" >
        </iframe>
      `;
}


function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.querySelector("#map").innerHTML =
        "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.querySelector("#map").innerHTML =
        "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.querySelector("#map").innerHTML =
        "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.querySelector("#map").innerHTML = "An unknown error occurred.";
      break;
  }
}
