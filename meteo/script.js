// Sélection des éléments DOM
// Fonction pour sélectionner un élément unique dans le document
const $ = (sel) => document.querySelector(sel);
// Fonction pour sélectionner plusieurs éléments dans le document
const $$ = (sel) => document.querySelectorAll(sel);

// Sélection des éléments spécifiques du DOM
const searchInput = $('.search-input'); // Champ de saisie pour la recherche de ville
const searchButton = $('.search-button'); // Bouton pour déclencher la recherche
const coordInputs = $$('.coord-input'); // Champs de saisie pour les coordonnées (latitude et longitude)
const weatherImage = $('.weather-image i'); // Icône pour l'affichage de la météo
const temperature = $('.temperature'); // Élément pour afficher la température
const cityName = $('.city-name'); // Élément pour afficher le nom de la ville
const weatherDescription = $('.weather-description'); // Élément pour afficher la description de la météo
const geoButton = $('.search-button-position'); // Bouton pour obtenir la position géographique
const errorMessage = $('.error-message'); // Élément pour afficher les messages d'erreur
const loading = $('.loading'); // Élément pour afficher une animation de chargement

// Déterminer l'icône météo
// Fonction pour obtenir l'icône météo selon les conditions (jour/nuit, pluie, couverture nuageuse)
const getWeatherIcon = (isDay, rain, cloudCover) => {
  if (rain > 0.5) return 'fa-solid fa-cloud-rain'; // Icône pluie
  if (cloudCover > 70) return 'fa-solid fa-cloud'; // Icône nuageux
  if (cloudCover > 30) return 'fa-solid fa-cloud-sun'; // Icône partiellement nuageux
  return isDay ? 'fa-solid fa-sun' : 'fa-solid fa-moon'; // Icône soleil ou lune
};

// Description météo
// Fonction pour obtenir la description de la météo selon les conditions
const getWeatherDescription = (isDay, rain, cloudCover) => {
  if (rain > 0.5) return 'Pluvieux'; // Si pluie
  if (cloudCover > 70) return 'Nuageux'; // Si beaucoup de nuages
  if (cloudCover > 30) return 'Partiellement nuageux'; // Si un peu de nuages
  return isDay ? 'Ensoleillé' : 'Dégagé'; // Description selon le jour ou la nuit
};

// Afficher les erreurs
// Fonction pour afficher les messages d'erreur
const showError = (message) => {
  if (errorMessage) { // Vérifie si l'élément d'erreur existe
    errorMessage.textContent = message; // Met à jour le texte de l'élément d'erreur
    errorMessage.style.display = 'block'; // Affiche l'élément d'erreur
    setTimeout(() => errorMessage.style.display = 'none', 5000); // Cache l'erreur après 5 secondes
  } else {
    alert(message); // Affiche une alerte si l'élément d'erreur n'existe pas
  }
};

// Géocodage inversé (coordonnées → ville)
// Fonction pour obtenir le nom de la ville à partir des coordonnées
const getCityFromCoordinates = async (lat, lon) => {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`); // Appel à l'API de géocodage inversé
    if (!res.ok) throw new Error('Erreur géocodage'); // Vérifie si la réponse est correcte
    
    const data = await res.json(); // Convertit la réponse en JSON
    // Extrait le nom de la ville et du pays, en nettoyant les espaces
    let city = (data.city || data.locality || data.principalSubdivision || '').replace(/\s*\([^)]*\)/g, '').trim();
    let country = (data.countryName || '').replace(/\s*\([^)]*\)/g, '').trim();
    
    // Retourne le nom de la ville et du pays, ou des valeurs alternatives
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    if (country) return country;
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`; // Retourne les coordonnées si aucune ville n'est trouvée
  } catch (error) {
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`; // Retourne les coordonnées en cas d'erreur
  }
};

// Récupérer et afficher les données météo
// Fonction pour obtenir les données météo à partir des coordonnées
const getWeatherData = async (lat, lon, city = '') => {
  if (loading) loading.style.display = 'block'; // Affiche le chargement
  
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=is_day,apparent_temperature,rain,cloud_cover&timezone=auto`); // Appel à l'API météo
    if (!res.ok) throw new Error('Erreur API'); // Vérifie si la réponse est correcte
    
    const data = await res.json(); // Convertit la réponse en JSON
    
    // Mise à jour coordonnées
    if (coordInputs[0]) coordInputs[0].value = lat.toFixed(4); // Met à jour le champ latitude
    if (coordInputs[1]) coordInputs[1].value = lon.toFixed(4); // Met à jour le champ longitude
    
    // Récupérer nom de ville si nécessaire
    if (!city) city = await getCityFromCoordinates(lat, lon); // Si le nom de la ville n'est pas fourni, le récupérer à partir des coordonnées
    
    // Extraire données
    const { apparent_temperature, is_day, rain, cloud_cover } = data.current; // Récupère les données pertinentes de la réponse
    const temp = Math.round(apparent_temperature); // Arrondit la température
    const isDay = is_day === 1; // Détermine si c'est le jour
    
    // Mise à jour affichage
    if (temperature) temperature.textContent = `${temp}°C`; // Met à jour l'affichage de la température
    if (cityName) cityName.textContent = city; // Met à jour l'affichage du nom de la ville
    if (weatherDescription) weatherDescription.textContent = getWeatherDescription(isDay, rain, cloud_cover); // Met à jour la description de la météo
    if (weatherImage) weatherImage.className = getWeatherIcon(isDay, rain, cloud_cover); // Met à jour l'icône météo
    
    // Mode sombre si nuit
    document.body.classList.toggle('body-dark-mode', !isDay); // Active le mode sombre si c'est la nuit
    
    if (loading) loading.style.display = 'none'; // Cache le chargement
  } catch (error) {
    if (loading) loading.style.display = 'none'; // Cache le chargement en cas d'erreur
    showError('Erreur: ' + error.message); // Affiche un message d'erreur
  }
};

// Rechercher une ville
// Fonction pour rechercher une ville par son nom
const searchCity = async (cityName) => {
  if (loading) loading.style.display = 'block'; // Affiche le chargement
  
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`); // Appel à l'API de géocodage
    if (!res.ok) throw new Error('Erreur API géocodage'); // Vérifie si la réponse est correcte
    
    const data = await res.json(); // Convertit la réponse en JSON
    
    // Vérifie si des résultats ont été trouvés
    if (!data.results?.length) {
      if (loading) loading.style.display = 'none'; // Cache le chargement
      showError('Ville introuvable. Essayez un autre nom.'); // Affiche un message d'erreur
      return;
    }
    
    // Récupère les informations de la première ville trouvée
    const { name, country, latitude, longitude } = data.results[0];
    await getWeatherData(latitude, longitude, `${name}${country ? ', ' + country : ''}`); // Récupère les données météo pour la ville trouvée
  } catch (error) {
    if (loading) loading.style.display = 'none'; // Cache le chargement en cas d'erreur
    showError('Erreur: ' + error.message); // Affiche un message d'erreur
  }
};

// Événements
// Écoute l'événement de clic sur le bouton de recherche
searchButton.addEventListener('click', () => {
  const city = searchInput.value.trim(); // Récupère la valeur du champ de recherche
  city ? searchCity(city) : showError('Veuillez entrer un nom de ville'); // Recherche la ville ou affiche une erreur
});

// Écoute l'événement de pression de touche sur le champ de recherche
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') { // Vérifie si la touche pressée est "Entrée"
    const city = searchInput.value.trim(); // Récupère la valeur du champ de recherche
    city ? searchCity(city) : showError('Veuillez entrer un nom de ville'); // Recherche la ville ou affiche une erreur
  }
});

// Écoute les changements dans les champs de coordonnées
coordInputs.forEach(input => {
  input.addEventListener('change', () => {
    const lat = parseFloat(coordInputs[0].value); // Récupère la latitude
    const lon = parseFloat(coordInputs[1].value); // Récupère la longitude
    
    // Vérifie si les coordonnées sont valides
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      getWeatherData(lat, lon); // Récupère les données météo avec les coordonnées fournies
    } else {
      showError('Coordonnées invalides'); // Affiche un message d'erreur si les coordonnées ne sont pas valides
    }
  });
});

// Écoute l'événement de clic pour obtenir la position géographique
geoButton.addEventListener('click', () => {
  if ('geolocation' in navigator) { // Vérifie si la géolocalisation est disponible dans le navigateur
    if (loading) loading.style.display = 'block'; // Affiche le chargement
    navigator.geolocation.getCurrentPosition( // Obtient la position actuelle de l'utilisateur
      (pos) => getWeatherData(pos.coords.latitude, pos.coords.longitude), // Récupère les données météo avec les coordonnées obtenues
      (err) => { // Gestion des erreurs
        if (loading) loading.style.display = 'none'; // Cache le chargement en cas d'erreur
        showError('Erreur de géolocalisation: ' + err.message); // Affiche un message d'erreur
      }
    );
  } else {
    showError('Géolocalisation non disponible'); // Affiche un message d'erreur si la géolocalisation n'est pas disponible
  }
});