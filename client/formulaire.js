window.console.log("Im loaded")
window.onload = loadCountry;

function loadCountry() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("country")) {
        envoiformulaire(params.get("country"));
    }
}
function buttonclicked() {
    var ps = window.pays.value;
    window.location.href = "/country.html?country=" + ps;
    envoiformulaire(ps);
}
function envoiformulaire(ps) {
    var xhr = new XMLHttpRequest();

    // on récupère le nom du pays
    //var ps = window.pays.value;

    // requête au serveur
    xhr.open("GET", "/service/country/" + ps, true);

    // fonction callback
    xhr.onload = function () {
        // récupération des informations au format json
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            window.country_data.style.display = "block";
            window.country_name.textContent = data.name;
            //window.continent.textContent = data.continent;
            window.capital.textContent = data.capital;
            window.latitude.textContent = data.latitude.toFixed(3);
            window.longitude.textContent = data.longitude.toFixed(3);
            window.wp.href = "https://en.wikipedia.org/wiki/" + data.wp;
            window.flagimg.src = "/flags/" + data.flag;
        }
        // affichage d'un message d'erreur
        else {
            window.console.log(this.responseText)
            window.alert("404: country not found")
        }
    };
    xhr.send();
}