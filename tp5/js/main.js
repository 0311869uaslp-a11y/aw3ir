var app;
window.onload = function () {
    app = new Vue({
        el: "#weatherApp",
        data: {
           
            loaded: false,

            
            formCityName: "",

            message: "WebApp Loaded.",
            messageForm: "",

            
            cityList: [
                {
                    name: "Paris",
                }
            ],

        
            cityWeather: null,

           
            cityWeatherLoading: false,

            
            apiKey: "feac79144fa3d24dfbe3e8cf0dac9b51" 
        },

        
        mounted: function () {
            this.loaded = true;
            this.readData();
        },

        
        methods: {
            readData: function (event) {
                console.log("JSON.stringify(this.cityList)", JSON.stringify(this.cityList));
                console.log("this.loaded:", this.loaded);
            },
            

           
            addCity: function (event) {
                event.preventDefault(); 

                console.log("formCityName:", this.formCityName);
                
                
                if (this.isCityExist(this.formCityName)) {
                    this.messageForm = 'La ville "' + this.formCityName + '" existe déjà dans la liste';
                    return;
                }

                
                this.cityList.push({ name: this.formCityName });

               
                this.messageForm = "";

              
                this.formCityName = "";

                this.message = "Ville ajoutée avec succès";
            },

            
            isCityExist: function (_cityName) {
               
                if (this.cityList.filter(item =>
                    item.name.toUpperCase() == _cityName.toUpperCase()
                ).length > 0) {
                    return true;
                } else {
                    return false;
                }
            },

        
            remove: function (_city) {
                
                this.cityList = this.cityList.filter(item => item.name != _city.name);
                
              
                if (this.cityWeather && this.cityWeather.name === _city.name) {
                    this.cityWeather = null;
                    this.message = "Sélectionnez une ville pour voir la météo";
                }
            },

          
            meteo: function (_city) {
                this.cityWeatherLoading = true;
                this.message = "Chargement des données météo pour " + _city.name + "...";

               
                fetch('https://api.openweathermap.org/data/2.5/weather?q=' + _city.name + '&units=metric&lang=fr&appid=' + this.apiKey)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        app.cityWeatherLoading = false;

                        if (json.cod == 200) {
                            
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

            
            getWindDirection: function (degrees) {
                const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
                const index = Math.round(degrees / 45) % 8;
                return directions[index];
            }
        },
    });
};