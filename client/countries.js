window.onload = getCountries;
function getCountries(e) {
    var xhr = new XMLHttpRequest();

    // requête au serveur
    xhr.open("GET", "/service/countries", true);

    // fonction callback
    xhr.onload = function () {
        // récupération des informations au format json
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            // window.console.log(data);
            window.result.innerHTML = data.map(country => country.name)
                //.filter((name) => name[0] == "A")
                //.filter(function (name) {
                //  return name[0] == "B";
                //})
                //.filter((name) => filterA(name, "B"))
                .map(
                    (name) =>
                        '<p><a href="/country.html?country=' +
                        name +
                        '">' +
                        name +
                        "</a></p>"
                )
                .join("");
        }
        // affichage d'un message d'erreur
        else {
            window.country_data.style.display = "none";
            window.error_msg.innerHTML = this.statusText;
        }
    };
    xhr.send();
}

function filterA(name, letter) {
    return name[0] == letter;
}