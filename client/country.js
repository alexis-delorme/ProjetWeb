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
    //window.continent.textContent = data.continent;
    window.capital.textContent = data.capital;
    window.latitude.textContent = data.latitude.toFixed(3);
    window.longitude.textContent = data.longitude.toFixed(3);
    window.wp.href = "https://en.wikipedia.org/wiki/" + data.wp;
    window.flagimg.src = "/flags/" + data.flag;
    var marker = mapMarkers.find(marker => marker.idnum === data.wp)
    if (triggerClick) {
        window.console.log('here')
        marker.fire('click')
    }
    if (marker) {
        point_info.innerHTML = '<b><i>' + marker.getPopup().getContent() + '</i></b><br>' + data.desc;
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