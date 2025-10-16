// Récupérer les données Météo depuis l'API
fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=is_day,apparent_temperature,rain,cloud_cover&timezone=auto")
  .then(response_obj => response_obj.json())
  .then(data => console.log(data));

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const coordInputs = document.querySelectorAll('.coord-input');
const weatherImage = document.querySelector('.weather-image i');
const temperature = document.querySelector('.temperature');
const cityName = document.querySelector('.city-name');
const weatherDescription = document.querySelector('.weather-description');
const geoButton = document.querySelector('.search-button-position');
const errorMessage = document.querySelector('.error-message');
const loading = document.querySelector('.loading');
const locationDisplay = document.querySelector('.location-display');

// Fonction pour obtenir l'icône météo selon les conditions
function getWeatherIcon(isDay, rain, cloudCover) {
  if (rain > 0.5) {
    return 'fa-solid fa-cloud-rain';
  } else if (cloudCover > 70) {
    return 'fa-solid fa-cloud';
  } else if (cloudCover > 30) {
    return 'fa-solid fa-cloud-sun';
  } else if (isDay) {
    return 'fa-solid fa-sun';
  } else {
    return 'fa-solid fa-moon';
  }
}

// Fonction pour obtenir la description météo
function getWeatherDescription(isDay, rain, cloudCover) {
  if (rain > 0.5) {
    return 'Pluvieux';
  } else if (cloudCover > 70) {
    return 'Nuageux';
  } else if (cloudCover > 30) {
    return 'Partiellement nuageux';
  } else if (isDay) {
    return 'Ensoleillé';
  } else {
    return 'Dégagé';
  }
}

// Fonction pour afficher les erreurs
function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage;
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  } else {
    console.error(message);
    alert(message);
  }
}

// NOUVELLE FONCTION: Géocodage inversé pour obtenir le nom de la ville depuis les coordonnées
async function getCityFromCoordinates(lat, lon) {
  try {
    // Utiliser l'API BigDataCloud pour le géocodage inversé (gratuite, sans clé)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du géocodage inversé');
    }
    
    const data = await response.json();
    console.log('Résultat géocodage inversé:', data);
    
    // Construire le nom avec ville et pays
    let cityName = data.city || data.locality || data.principalSubdivision;
    let countryName = data.countryName;
    
    // Enlever tout ce qui est entre parenthèses
    if (cityName) {
      cityName = cityName.replace(/\s*\([^)]*\)/g, '').trim();
    }
    if (countryName) {
      countryName = countryName.replace(/\s*\([^)]*\)/g, '').trim();
    }
    
    if (cityName && countryName) {
      return `${cityName}, ${countryName}`;
    } else if (cityName) {
      return cityName;
    } else if (countryName) {
      return countryName;
    }
    
    // Si aucun résultat, retourner les coordonnées
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  } catch (error) {
    console.error('Erreur géocodage inversé:', error);
    // En cas d'erreur, retourner les coordonnées
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
}

// Fonction pour récupérer les données météo
async function getWeatherData(lat, lon, city = '') {
  if (loading) loading;
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=is_day,apparent_temperature,rain,cloud_cover&timezone=auto`
    );
    
    if (!response.ok) throw new Error('Erreur lors de la récupération des données');
    
    const data = await response.json();
    
    // Mettre à jour les coordonnées
    if (coordInputs[0]) coordInputs[0].value = lat.toFixed(4);
    if (coordInputs[1]) coordInputs[1].value = lon.toFixed(4);
    
    // Si aucun nom de ville n'est fourni, faire un géocodage inversé
    if (!city) {
      city = await getCityFromCoordinates(lat, lon);
    }
    
    // Mettre à jour l'affichage météo
    const temp = Math.round(data.current.apparent_temperature);
    const isDay = data.current.is_day === 1;
    const rain = data.current.rain;
    const cloudCover = data.current.cloud_cover;
    
    if (temperature) temperature.textContent = `${temp}°C`;
    if (cityName) cityName.textContent = city;
    if (weatherDescription) weatherDescription.textContent = getWeatherDescription(isDay, rain, cloudCover);
    
    // Changer l'icône
    if (weatherImage) weatherImage.className = getWeatherIcon(isDay, rain, cloudCover);
    
    // Mode sombre si c'est la nuit
    if (!isDay) {
      document.body.classList.add('body-dark-mode');
    } else {
      document.body.classList.remove('body-dark-mode');
    }
    
    if (loading) loading.style.display = 'none';
  } catch (error) {
    if (loading) loading.style.display = 'none';
    showError('Erreur: ' + error.message);
  }
}

// Recherche par ville 
async function searchCity(cityName) {
  if (loading) loading;
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Erreur de connexion à l\'API de géocodage');
    }
    
    const data = await response.json();
    console.log('Résultat géocodage:', data);
    
    if (!data.results || data.results.length === 0) {
      if (loading) loading.style.display = 'none';
      showError('Ville introuvable. Essayez un autre nom.');
      return;
    }
    
    const result = data.results[0];
    const fullCityName = `${result.name}${result.country ? ', ' + result.country : ''}`;
    await getWeatherData(result.latitude, result.longitude, fullCityName);
  } catch (error) {
    if (loading) loading.style.display = 'none';
    showError('Erreur lors de la recherche: ' + error.message);
    console.error('Erreur:', error);
  }
}

// Event listeners
searchButton.addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (city) {
    searchCity(city);
  } else {
    showError('Veuillez entrer un nom de ville');
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = searchInput.value.trim();
    if (city) {
      searchCity(city);
    } else {
      showError('Veuillez entrer un nom de ville');
    }
  }
});

// Recherche par coordonnées
coordInputs.forEach(input => {
  input.addEventListener('change', () => {
    const lat = parseFloat(coordInputs[0].value);
    const lon = parseFloat(coordInputs[1].value);
    
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      // Appel sans nom de ville pour déclencher le géocodage inversé
      getWeatherData(lat, lon);
    } else {
      showError('Coordonnées invalides');
    }
  });
});

// Géolocalisation
geoButton.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    if (loading) loading;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Appel sans nom de ville pour déclencher le géocodage inversé
        getWeatherData(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        if (loading) loading.style.display = 'none';
        showError('Erreur de géolocalisation: ' + error.message);
      }
    );
  } else {
    showError('La géolocalisation n\'est pas disponible sur ce navigateur');
  }
});