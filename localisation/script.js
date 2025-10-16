// init map

// 1. create a map
const map = L.map('map').setView([51.505, -0.09], 13);

// 2. Associate tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

console.log("Hello geo");

// Utiliser watchPosition pour suivre la position en temps réel
navigator.geolocation.watchPosition(onPosition, null, {enableHighAccuracy: true});

function onPosition(position_obj) {
    const lat = position_obj.coords.latitude;
    const long = position_obj.coords.longitude;
    console.log(lat, long);
    document.querySelector(".lat").innerText = "Latitude: " + lat;
    document.querySelector(".long").innerText = "Longitude: " + long;

    // 3. Positioner la map
    map.setView([lat, long]);

    // 4. Create a marker
    const marker = L.marker([lat, long]);

    // 5. Add marker to map
    marker.addTo(map);

    const pokeMarker = L.marker([lat, long + 0.010]);
    pokeMarker.addTo(map);

    // Bonus: Text popup
    pokeMarker.bindPopup("Bulbizarre").openPopup();
}

