var map;
var selectedMapMarker;
var mapMarkers = [];

function initializeMap(markerEventListener, latitude = 39.049404, longitude = -78, zoom = 2) {


    // Création d'une carte dans la balise div "map",
    // et position de la vue sur un point donné et un niveau de zoom
    map = L.map('map_container').setView([latitude, longitude], zoom);

    // Ajout d'une couche de dalles OpenStreetMap
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    get_all_countries(markerEventListener)
}

function get_all_countries(markerEventListener) {
    // objet pour l'envoi d'une requête Ajax
    var xhr = new XMLHttpRequest();

    // fonction appelée lorsque la réponse à la requête (liste des lieux insolites) sera arrivée
    xhr.onload = function () {
        var countries = JSON.parse(this.responseText);
        window.console.log(countries)
        mapMarkers = countries.map(country => {
            var marker = L.marker([country.latitude, country.longitude]);
            marker.addTo(map)
                .bindPopup(country.name)
                .addEventListener('click', e => {
                    selectedMapMarker = e.target
                    if (markerEventListener) {
                        markerEventListener(e.target)
                    }
                })
                .idnum = country.name
            return marker
        })
    }
    xhr.open('GET', '/service/countries', true);
    xhr.send();
}

