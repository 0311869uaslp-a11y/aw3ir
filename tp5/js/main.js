var app;
window.onload = function () {
    app = new Vue({
        el: "#weatherApp", // cible l'élement HTML où nous pourrons utiliser toutes les variables ci-dessous
        data: {
            // sera utilisé comme indicateur de chargement de l'application
            loaded: false,

            // cityName, variable utilisé dans le formulaire via v-model
            formCityName: "",

            message: "WebApp Loaded.",
            messageForm: "",

            // liste des villes saisies, initialiser avec Paris
            cityList: [
                {
                    name: "Paris",
                }
            ],

            // cityWeather contiendra les données météo reçus par openWeatherMap
            cityWeather: null,

            // indicateur de chargement
            cityWeatherLoading: false,

            // ⚠️ REMPLACEZ CETTE CLÉ API PAR LA VÔTRE
            apiKey: "feac79144fa3d24dfbe3e8cf0dac9b51" // Exemple - utilisez votre propre clé
        },

        // 'mounted' est exécuté une fois l'application VUE totalement disponible
        // Plus d'info. sur le cycle de vie d'une app VUE :
        // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
        mounted: function () {
            this.loaded = true;
            this.readData();
        },

        // ici, on définit les methodes qui vont traiter les données décrites dans DATA
        methods: {
            readData: function (event) {
                console.log("JSON.stringify(this.cityList)", JSON.stringify(this.cityList));
                console.log("this.loaded:", this.loaded);
            },

            // 5. Ajouter une méthode addCity
            addCity: function (event) {
                event.preventDefault(); // pour ne pas recharger la page à la soumission du formulaire

                console.log("formCityName:", this.formCityName);
                
                // 7. Tester si la ville existe déjà
                if (this.isCityExist(this.formCityName)) {
                    this.messageForm = 'La ville "' + this.formCityName + '" existe déjà dans la liste';
                    return;
                }

                // Ajouter la ville à la liste avec la méthode push
                this.cityList.push({ name: this.formCityName });

                // remise à zero du message affiché sous le formulaire
                this.messageForm = "";

                // remise à zero du champ de saisie
                this.formCityName = "";

                this.message = "Ville ajoutée avec succès";
            },

            // 6. Tester si la ville est déjà dans la liste
            isCityExist: function (_cityName) {
                // la méthode 'filter' retourne une liste contenant tous les items ayant un nom égale à _cityName
                // doc. sur filter : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/filter
                if (this.cityList.filter(item =>
                    item.name.toUpperCase() == _cityName.toUpperCase()
                ).length > 0) {
                    return true;
                } else {
                    return false;
                }
            },

            // 9. Suppression d'une ville
            remove: function (_city) {
                // on utilise 'filter' pour retourne une liste avec tous les items ayant un nom différent de _city.name
                this.cityList = this.cityList.filter(item => item.name != _city.name);
                
                // Si la ville supprimée est celle affichée, nettoyer l'affichage
                if (this.cityWeather && this.cityWeather.name === _city.name) {
                    this.cityWeather = null;
                    this.message = "Sélectionnez une ville pour voir la météo";
                }
            },

            // 10. Demande des données météo à OpenWeatherMap
            meteo: function (_city) {
                this.cityWeatherLoading = true;
                this.message = "Chargement des données météo pour " + _city.name + "...";

                // appel AJAX avec fetch
                // https://davidwalsh.name/fetch
                // https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch
                // ⚠️ IMPORTANT: Remplacez apiKey par votre vraie clé OpenWeatherMap
                fetch('https://api.openweathermap.org/data/2.5/weather?q=' + _city.name + '&units=metric&lang=fr&appid=' + this.apiKey)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        app.cityWeatherLoading = false;

                        // test du code retour
                        // 200 = OK
                        // 404 = city not found
                        if (json.cod == 200) {
                            // on met la réponse du webservice dans la variable cityWeather
                            app.cityWeather = json;
                            app.message = null;
                        } else {
                            app.cityWeather = null;
                            app.message = 'Météo introuvable pour ' + _city.name +
                                ' (' + json.message + ')';
                        }
                    })
                    .catch(function (error) {
                        app.cityWeatherLoading = false;
                        app.cityWeather = null;
                        app.message = 'Erreur lors du chargement des données météorologiques';
                        console.error('Error:', error);
                    });
            },

            // Méthode additionnelle pour la direction du vent
            getWindDirection: function (degrees) {
                const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
                const index = Math.round(degrees / 45) % 8;
                return directions[index];
            }
        },
    });
};