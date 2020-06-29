window.onload = load;

function load() {
    window.console.log('here')
    initializeMap(marker => {
        if (window.country_wp !== marker.idnum) {
            getCountry(marker.idnum, populateFields)
        }
    });
    loadCountry();
}

function loadCountry() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("country")) {
        getCountry(params.get("country"), populateFields);
    }
}
function buttonclicked() {
    var ps = window.pays.value;
    window.history.replaceState(null, null, "/country.html?country=" + ps);
    getCountry(ps, data => populateFields(data, true));

}

function populateFields(data, triggerClick = false) {
    window.country_data.style.display = "block";
    window.country_name.textContent = data.name;
    window.capital.textContent = data.capital;
    window.wp.href = "https://en.wikipedia.org/wiki/" + data.wp;
    window.flagimg.src = "/flags/" + data.flag;
    var marker = mapMarkers.find(marker => marker.idnum === data.name)
    if (triggerClick) {
        window.console.log('here')
        marker.fire('click')
    }
    if (marker) {
        //point_info.innerHTML = '<b><i>' + 'Capital : ' + '</i></b><br>' + data.capital + '<br>' + data.latitude.toFixed(3) + '<br>' + data.longitude.toFixed(3);
        capital1.innerHTML = '<p><b>Coordonnées de la capitale:</b></p>';
        latitude1.innerHTML = '<span class="label">Latitude:</span>' + data.latitude.toFixed(2);
        longitude1.innerHTML = '<span class="label">Longitude:</span>' + data.longitude.toFixed(2);
    } else {
        window.console.error("could not find marker of that country...")
    }
}


function getCountry(ps, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "/service/country/" + ps, true);

    // fonction callback
    xhr.onload = function done() {
        if (this.status == 200) {
            callback(JSON.parse(this.responseText))
        }
        // affichage d'un message d'erreur
        else {
            window.console.log(this.responseText)
            window.alert("404: country not found")
        }
    }
    xhr.send();
}