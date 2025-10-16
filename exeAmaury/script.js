/************************************************************
 *  - Comprendre comment relier un formulaire HTML à du JS
 *  - Utiliser fetch() pour appeler une API
 *  - Manipuler le DOM pour afficher des données météo
 ************************************************************/


/* ----------------------------------------------------------
   1️⃣ Fonction principale — point d’entrée du script
   ----------------------------------------------------------
   ➜ Elle écoute :
      - le submit sur formulaire
      - le clic sur "me localiser"
----------------------------------------------------------*/
function main() {

    // Récupération des éléments HTML
    const search = document.querySelector('.search-bar');   // le <form>
    const cityInput = document.querySelector('.cityInput'); // le champ texte
    const findMeBtn = document.querySelector('.find-me');   // le bouton GPS


    /* 🧠 Rappel :
       - addEventListener() permet d’écouter un événement
       - preventDefault() empêche le rechargement de la page
       - cityInput.value renvoie le texte tapé
    */

    // 👉 Quand l'utilisateur valide le formulaire
    search.addEventListener('submit', event => {
        event.preventDefault();

        // TODO : récupérer le texte tapé par l’utilisateur
        const city = /* ... */;

        // TODO : nettoyer le texte (trim) et vérifier qu’il n’est pas vide

        // TODO : IF city => appeller la fonction pour rechercher city
    });


    // 👉 Quand l'utilisateur clique sur "Me localiser"
    findMeBtn.addEventListener('click', () => {
        /* 💡 navigator.geolocation.getCurrentPosition() :
           demande la position GPS du navigateur
           → appelle la fonction onPosition() si accepté
        */

        // TODO : compléter la ligne ci-dessous :
        navigator.geolocation./*...*/(/* ... */);
    });
}

// On lance l’application
main();



/* ----------------------------------------------------------
   2️⃣ Recherche d'une ville → obtenir ses coordonnées
   ----------------------------------------------------------
   On appelle ici l’API de géocodage Open-Meteo :
   elle transforme un nom de ville en latitude + longitude.
----------------------------------------------------------*/
function searchCity(cityName) {

    // URL de l’API géocodage
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=fr&format=json`;

    // TODO :
    // 1. Fais un fetch(url)
    // 2. Convertis la réponse en JSON
    // 3. Récupère la latitude, la longitude et le nom de la ville
    // 4. Appelle ensuite : weather(lat, long, displayName)
}




/* ----------------------------------------------------------
   3️⃣ Récupération des données météo via l’API principale
   ----------------------------------------------------------
   Cette API utilise les coordonnées pour renvoyer :
   - la température actuelle
   - le code météo (type de temps)
   - d'autres infos si besoin
----------------------------------------------------------*/
function weather(lat, long, placeName) {

    // URL de l’API météo
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=is_day,temperature_2m,weather_code,precipitation`;

    // TODO :
    // - fais un fetch(url)
    // - convertis en JSON
    // - récupère :
    //     const temperature = data.current.temperature_2m;
    //     const code = /*....*/.weathercode;

    // - appelle displayWeather(placeName, temperature, code);
}



/* ----------------------------------------------------------
   4️⃣ Affichage des données dans la page
   ----------------------------------------------------------
   On met à jour les éléments HTML :
   - la ville
   - la température
   - l’icône météo
----------------------------------------------------------*/
function displayWeather(place, temperature, code) {
    /* 💡 document.querySelector('.display-city')
          permet de cibler un élément HTML (par sa classe)
       💡 .textContent sert à modifier le texte affiché
    */

    // TODO : afficher le nom de la ville
    // document.querySelector('.display-city').textContent = /* ... */;

    // TODO : afficher la température avec " °C"
    // document.querySelector('.display-temp').textContent = /* ... */;

    //TODO : appeler la fonction iconByCode
}



/* ----------------------------------------------------------
   5️⃣ Choisir l’icône météo selon le code reçu
   ----------------------------------------------------------
   Chaque code correspond à un type de temps :
   - 0 = ciel clair ☀️   ('fa-sun')
   - 1-2 = partiellement nuageux ⛅ ('fa-cloud-sun')
   - 3 = couvert ☁️         ('fa-cloud')
   - 45–48 = brouillard 🌫️  ('fa-smog')
   - 51–67 = pluie 🌧️   ('fa-cloud-rain')
   - 71–77 = neige ❄️   ('fa-snowflake')
   - 80–82 = averses 🌦️ ('fa-cloud-showers-heavy')
   - 95–99 = orages ⛈️  ('fa-cloud-bolt')
   - Default =          ('fa-temperature-half')
----------------------------------------------------------*/
function iconByCode(code) {
    // Sélection de l’élément icône
    const icon = document.querySelector('.weather-icon');

    // On réinitialise ses classes
    icon.className = 'weather-icon fa-solid';

    /* 💡 FontAwesome fonctionne avec des classes comme :
         fa-sun, fa-cloud-sun, fa-cloud, fa-smog, etc.
       💡 On ajoute aussi une couleur (classe CSS : sun, rain, fog...)
    */

    // TODO : compléter les conditions ci-dessous, s'aider du tableau plus haut pour le nom des fontAwesome

    if (code === 0) icon.classList.add('fa-sun');
    // Peu nuageux / partiellement nuageux
    else if (code === 1 || code === 2) icon.classList.add('fa-cloud-sun');
    // Couvert
    else if (code === 3) /*...*/;
    // Brouillard / brume
    else if (code >= 45 && code <= 48) /*...*/;
    // Bruine / pluie légère à forte
    else if (code >= 51 && code <= 67) /*...*/;
    // Neige
    else if (code >= 71 && code <= 77) /*...*/;
    // Averses
    else if (code >= 80 && code <= 82) /*...*/;
    // Orages
    else if (code >= 95 && code <= 99) /*...*/;
    // orage
    else icon.classList.add/*...*/;
    // valeur par défaut (si aucun code reconnu)
}



/* ----------------------------------------------------------
   6️⃣ Géolocalisation
   ----------------------------------------------------------
   Si l’utilisateur accepte le partage de position,
   on récupère directement ses coordonnées GPS.
----------------------------------------------------------*/
function onPosition(userCoords) {

    // TODO :
    // - récupérer la latitude et la longitude depuis userCoords.coords
    const latUser = userCoords.coords.latitude;

    //TODO optionel : appeler la fonction pour remplir le formulaire

    // Appel de la fonction pour récuperer la météo à partir des paramètres (lat et long);
}



/* ----------------------------------------------------------
   7️⃣ Option : afficher les coordonnées dans le formulaire
----------------------------------------------------------*/
function putCoords(lat, long) {
    document.querySelector('.latitude').value = lat;
    document.querySelector('.longitude').value = long;
}