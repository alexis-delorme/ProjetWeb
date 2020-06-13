window.addEventListener('DOMContentLoaded', () => initialize());
var map;
function initialize(latitude = 38.88333, longitude = -78, zoom = 2.5) {


    // Création d'une carte dans la balise div "map",
    // et position de la vue sur un point donné et un niveau de zoom
    map = L.map('map_container').setView([latitude, longitude], zoom);

    // Ajout d'une couche de dalles OpenStreetMap
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    get_all_countries()
}

function get_all_countries() {
    // objet pour l'envoi d'une requête Ajax
    var xhr = new XMLHttpRequest();

    // fonction appelée lorsque la réponse à la requête (liste des lieux insolites) sera arrivée
    xhr.onload = function () {
        var countries = JSON.parse(this.responseText);
        window.console.log(countries)
        countries.forEach(country =>
            L.marker([country.latitude, country.longitude]).addTo(map)
                .bindPopup('Lieu = ' + country.name)
                .addEventListener('click', OnMarkerClick)
                .idnum = country.wp
        )
    }
    xhr.open('GET', '/service/countries', true);
    xhr.send();
}


// Fonction appelée lors d'un clic sur un marqueur
function OnMarkerClick(e) {

    // objet pour l'envoi d'une requête Ajax
    var xhr = new XMLHttpRequest();

    // fonction appelée lorsque la réponse à la requête (description d'un lieu insolite) sera arrivée
    xhr.onload = function () {

        var countries = JSON.parse(this.responseText);
        window.console.log(countries)
        var capInfo = countries.find(country => country.wp === idnum).desc
        // affichage dans la zone 'description' du nom (reprise dans le popup)
        // et de la description récupérée par l'appel au serveur
        point_info.innerHTML = '<b><i>' + e.target.getPopup().getContent() + '</i></b><br>' + capInfo;
    };

    // Le numéro du lieu est récupéré via la propriété personnalisée du marqueur
    var idnum = e.target.idnum

    // Envoi de la requête Ajax pour la récupération de la description du lieu de numéro idnum
    xhr.open('GET', '/service/countries', true);
    xhr.send();
}