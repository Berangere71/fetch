// Sélection des éléments DOM
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const searchInput = $('.search-input');
const searchButton = $('.search-button');
const coordInputs = $$('.coord-input');
const weatherImage = $('.weather-image i');
const temperature = $('.temperature');
const cityName = $('.city-name');
const weatherDescription = $('.weather-description');
const geoButton = $('.search-button-position');
const errorMessage = $('.error-message');
const loading = $('.loading');

// Déterminer l'icône météo
const getWeatherIcon = (isDay, rain, cloudCover) => {
  if (rain > 0.5) return 'fa-solid fa-cloud-rain';
  if (cloudCover > 70) return 'fa-solid fa-cloud';
  if (cloudCover > 30) return 'fa-solid fa-cloud-sun';
  return isDay ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
};

// Description météo
const getWeatherDescription = (isDay, rain, cloudCover) => {
  if (rain > 0.5) return 'Pluvieux';
  if (cloudCover > 70) return 'Nuageux';
  if (cloudCover > 30) return 'Partiellement nuageux';
  return isDay ? 'Ensoleillé' : 'Dégagé';
};

// Afficher les erreurs
const showError = (message) => {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => errorMessage.style.display = 'none', 5000);
  } else {
    alert(message);
  }
};

// Géocodage inversé (coordonnées → ville)
const getCityFromCoordinates = async (lat, lon) => {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`);
    if (!res.ok) throw new Error('Erreur géocodage');
    
    const data = await res.json();
    let city = (data.city || data.locality || data.principalSubdivision || '').replace(/\s*\([^)]*\)/g, '').trim();
    let country = (data.countryName || '').replace(/\s*\([^)]*\)/g, '').trim();
    
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    if (country) return country;
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  } catch (error) {
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
};

// Récupérer et afficher les données météo
const getWeatherData = async (lat, lon, city = '') => {
  if (loading) loading.style.display = 'block';
  
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=is_day,apparent_temperature,rain,cloud_cover&timezone=auto`);
    if (!res.ok) throw new Error('Erreur API');
    
    const data = await res.json();
    
    // Mise à jour coordonnées
    if (coordInputs[0]) coordInputs[0].value = lat.toFixed(4);
    if (coordInputs[1]) coordInputs[1].value = lon.toFixed(4);
    
    // Récupérer nom de ville si nécessaire
    if (!city) city = await getCityFromCoordinates(lat, lon);
    
    // Extraire données
    const { apparent_temperature, is_day, rain, cloud_cover } = data.current;
    const temp = Math.round(apparent_temperature);
    const isDay = is_day === 1;
    
    // Mise à jour affichage
    if (temperature) temperature.textContent = `${temp}°C`;
    if (cityName) cityName.textContent = city;
    if (weatherDescription) weatherDescription.textContent = getWeatherDescription(isDay, rain, cloud_cover);
    if (weatherImage) weatherImage.className = getWeatherIcon(isDay, rain, cloud_cover);
    
    // Mode sombre si nuit
    document.body.classList.toggle('body-dark-mode', !isDay);
    
    if (loading) loading.style.display = 'none';
  } catch (error) {
    if (loading) loading.style.display = 'none';
    showError('Erreur: ' + error.message);
  }
};

// Rechercher une ville
const searchCity = async (cityName) => {
  if (loading) loading.style.display = 'block';
  
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`);
    if (!res.ok) throw new Error('Erreur API géocodage');
    
    const data = await res.json();
    
    if (!data.results?.length) {
      if (loading) loading.style.display = 'none';
      showError('Ville introuvable. Essayez un autre nom.');
      return;
    }
    
    const { name, country, latitude, longitude } = data.results[0];
    await getWeatherData(latitude, longitude, `${name}${country ? ', ' + country : ''}`);
  } catch (error) {
    if (loading) loading.style.display = 'none';
    showError('Erreur: ' + error.message);
  }
};

// Événements
searchButton.addEventListener('click', () => {
  const city = searchInput.value.trim();
  city ? searchCity(city) : showError('Veuillez entrer un nom de ville');
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = searchInput.value.trim();
    city ? searchCity(city) : showError('Veuillez entrer un nom de ville');
  }
});

coordInputs.forEach(input => {
  input.addEventListener('change', () => {
    const lat = parseFloat(coordInputs[0].value);
    const lon = parseFloat(coordInputs[1].value);
    
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      getWeatherData(lat, lon);
    } else {
      showError('Coordonnées invalides');
    }
  });
});

geoButton.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    if (loading) loading.style.display = 'block';
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeatherData(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (loading) loading.style.display = 'none';
        showError('Erreur de géolocalisation: ' + err.message);
      }
    );
  } else {
    showError('Géolocalisation non disponible');
  }
});