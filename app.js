angular
    .module('climAngularApp', []);

angular
    .module('climAngularApp')
    .controller("ClimAngularCtrl", ClimAngularCtrl);

// La función controladora se crea con nombre de maner independiente
// En lugar de programarla inline dentro del constructor del controlador
function ClimAngularCtrl($http) {
    // Esta función necesita una dependencia y la declara como un parametro
    // AngularJS se encarga de instaciar y proveer los parámetros necesarios
    // En este caso es $http que es un servicio includo en el paquete básico
    var vm = this;
    vm.city_list = [];
    // El array de valores que se enlaza al desplegable generado con ng-options
    vm.countries = [
        {
            name: 'Argentina',
            code: 'AR'
        },
        {
            name: 'Brasil',
            code: 'BR'
        },
        {
            name: 'España',
            code: 'ES'
        },
        {
            name: 'Portugal',
            code: 'PT'
        }];
    // Las funciones pueden, y deben, definirse con su nombre, y publicarlas a través del viewmodel
    vm.add_city = addCity;

    function addCity() {
        var city = {
            city_name: vm.city_name,
            country_code: vm.country_code
        }

        var baseurl = "http://api.openweathermap.org/data/2.5/weather?q=";
        var jsonp = "&units=metric&callback=JSON_CALLBACK";
        var url = baseurl + city.city_name + ',' + city.country_code + jsonp
        
        // Uso del servicio de $http para hacer una llamada, en este caso JSONP
        // $http devuleve promesas y debemos proveerle de callbacks para cuando se resuelvan
        $http
            .jsonp(url)
            .success(fillWeatherAndPushCity);
        // funcion callback que se ejcuta cuando responda openweathermap
        function fillWeatherAndPushCity(weatherData) {
            city.weather = weatherData
            // AngularJS usando el ng-repeat agregará una ciudad y su clima a la interfaz
            vm.city_list.push(city);
        }
    };
}