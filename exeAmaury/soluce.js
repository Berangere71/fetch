
function main() {

    const search = document.querySelector('.search-bar');
    const cityInput = document.querySelector('.cityInput');
    const findMeBtn = document.querySelector('.find-me');

    // SI formulaire
    if (search) {
        search.addEventListener('submit', e => {
            e.preventDefault();
            const city = cityInput.value.trim().toLowerCase();;
            if (city) searchCity(city);
        });
    }

    // SI loc user
    if (findMeBtn) {
        findMeBtn.addEventListener('click', () => {
            navigator.geolocation.getCurrentPosition(onPosition);
        });
    }
}

main();

// Recherche par ville
function searchCity(cityName) {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=fr&format=json`)
        .then(res => res.json())
        .then(dataCity => {
            // Verifie SI city.results et test lenght           
            if (dataCity.results?.length) {
                const city = dataCity.results[0];
                const latCity = city.latitude;
                const longCity = city.longitude;

                // condition ? valueTrue : valueFalse
                const displayName = city.name + (city.country ? ", " + city.country : "");

                putCoords(latCity, longCity);

                weather(latCity, longCity, displayName);
            }
        })
}


function weather(lat, long, placeName) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=is_day,temperature_2m,weather_code,precipitation`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const current = data.current;
            const temperature = current.temperature_2m;
            const code = current.weather_code;
            const isDay = current.is_day;

            displayWeather(placeName, temperature, code, isDay);

            dayOrNight(isDay);
        })
}

function dayOrNight(isDay) {
    if (isDay) {
        document.body.style.background = "linear-gradient(180deg, #0a4b9c, #39c0b5)";
    } else {
        document.body.style.background = "linear-gradient(180deg, #00112b, #0d1f3a)";
    }
}

// function weather(lat, long, placeName) {
//     fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`)
//         .then(res => res.json())
//         .then(data => {
//             console.log(data)
//             const current = data.current_weather;
//             const temperature = current.temperature;
//             const code = current.weathercode;

//             displayWeather(placeName, temperature, code);
//         })
// }

function displayWeather(place, temperature, code) {
    document.querySelector('.display-city').textContent = place;
    document.querySelector('.display-temp').textContent = temperature + " °C";
    document.querySelector('.display-icon').textContent = iconByCode(code);
}

// function iconByCode(code) {
//     if (code === 0) return "☀️";
//     if (code === 1 || code === 2) return "⛅";
//     if (code === 3) return "☁️";
//     if (code >= 45 && code <= 48) return "🌫️";
//     if (code >= 51 && code <= 67) return "🌧️";
//     if (code >= 71 && code <= 77) return "❄️";
//     if (code >= 80 && code <= 82) return "🌦️";
//     if (code >= 95 && code <= 99) return "⛈️";
//     return "🌡️";
// }

// function displayWeather(place, temperature, code, isDay) {
//     document.querySelector('.display-city').textContent = place;
//     document.querySelector('.display-temp').textContent = temperature + " °C";
//     iconByCode(code, isDay);
// }


function iconByCode(code) {
    const icon = document.querySelector('.weather-icon');

    // Reset
    icon.className = 'weather-icon fa-solid';

    // Ciel clair
    // 2e version
    // icon.className = 'weather-icon fa-regular fa-sun';
    if (code === 0) icon.classList.add('fa-sun');
    // Peu nuageux / partiellement nuageux
    else if (code === 1 || code === 2) icon.classList.add('fa-cloud-sun');
    // Couvert
    else if (code === 3) icon.classList.add('fa-cloud');
    // Brouillard / brume
    else if (code >= 45 && code <= 48) icon.classList.add('fa-smog');
    // Bruine / pluie légère à forte
    else if (code >= 51 && code <= 67) icon.classList.add('fa-cloud-rain');
    // Neige
    else if (code >= 71 && code <= 77) icon.classList.add('fa-snowflake');
    // Averses
    else if (code >= 80 && code <= 82) icon.classList.add('fa-cloud-showers-heavy');
    // Orages
    else if (code >= 95 && code <= 99) icon.classList.add('fa-cloud-bolt');
    // Valeur par défaut
    else icon.classList.add('fa-temperature-half');
}

// function iconByCode(code, isDay) {
//     const icon = document.querySelector('.weather-icon');

//     // Reset
//     icon.className = 'weather-icon fa-solid';

//     let colorClass = "";

//     if (code === 0) colorClass = 'sun';
//     else if (code === 1 || code === 2) colorClass = 'partly-cloudy';
//     else if (code === 3) colorClass = 'cloudy';
//     else if (code >= 45 && code <= 48) colorClass = 'fog';
//     else if (code >= 51 && code <= 67) colorClass = 'rain';
//     else if (code >= 71 && code <= 77) colorClass = 'snow';
//     else if (code >= 80 && code <= 82) colorClass = 'showers';
//     else if (code >= 95 && code <= 99) colorClass = 'thunder';
//     else colorClass = 'default-weather';


//     if (code === 0) icon.classList.add('fa-sun');
//     else if (code === 1 || code === 2) icon.classList.add('fa-cloud-sun');
//     else if (code === 3) icon.classList.add('fa-cloud');
//     else if (code >= 45 && code <= 48) icon.classList.add('fa-smog');
//     else if (code >= 51 && code <= 67) icon.classList.add('fa-cloud-rain');
//     else if (code >= 71 && code <= 77) icon.classList.add('fa-snowflake');
//     else if (code >= 80 && code <= 82) icon.classList.add('fa-cloud-showers-heavy');
//     else if (code >= 95 && code <= 99) icon.classList.add('fa-cloud-bolt');
//     else icon.classList.add('fa-temperature-half');


//     if (isDay) icon.classList.add(colorClass);
//     else icon.classList.add(colorClass + "-night");
// }


/**
 * S'execute quand l'utilisateur a accepté la geolocalisation.
 * 
 * @param {*} position_obj 
 */

function onPosition(userCoords) {

    const latUser = userCoords.coords.latitude;
    const longUser = userCoords.coords.longitude;

    // Auto complete form
    putCoords(latUser, longUser);

    weather(latUser, longUser, "Ma position");
}

function putCoords(lat, long) {
    document.querySelector('.latitude').value = lat;
    document.querySelector('.longitude').value = long;
}