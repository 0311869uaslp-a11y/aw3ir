window.onload = () => {
  // Récupérer les données envoyées par le formulaire
  const paramsString = document.location.search; 
  const searchParams = new URLSearchParams(paramsString);

  // Boucle sur chaque paramètre
  for (const param of searchParams) {
    console.log(param); // Affichage pour debug

    const elementId = param[0];
    const elementValue = param[1];
    const element = document.getElementById(elementId);

    if (element !== null) {
      element.textContent = elementValue; // Mettre à jour le contenu
    }

    // Lien Google Maps pour l'adresse
    if (param[0] === "address") {
      element.href = `https://www.google.com/maps/search/?api=1&query=${elementValue}`;
    }
    // Lien mailto pour l'email
    else if (param[0] === "email") {
      element.href = `mailto:${elementValue}?subject=Hello!&body=What's up?`;
    }
  }
};
