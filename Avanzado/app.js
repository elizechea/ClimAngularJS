angular
    .module('climAngularApp', []);

angular
    .module('climAngularApp')
    .controller("ClimAngularCtrl", climAngularCtrl);

// En esta versión avanzada, extreremos lógica del controlador llevándola a servicios especializados
// Inialmente será la factoría que nos provea de la lista de paises, de forma que en el futuro se pueda poblar desde otro servicio externo
function climAngularCtrl($http,climAngularFactory) {
    var vm = this;
    vm.city_list = [];
    vm.countries = climAngularFactory.countries;
    vm.add_city = add_city;

    function add_city() {
        var city = {
            city_name: vm.city_name,
            country_code: vm.country_code
        }

        var baseurl = "http://api.openweathermap.org/data/2.5/weather?q=";
        var jsonp = "&units=metric&callback=JSON_CALLBACK";
        var url = baseurl + city.city_name + ',' + city.country_code + jsonp
        $http
            .jsonp(url)
            .success(fillWeatherAndPushCity);

        function fillWeatherAndPushCity(weatherData) {
            city.weather = weatherData
            vm.city_list.push(city);
        }
    };
}


// La creación de una factoría es similar a la de un controlador: un nombre y una función
angular
    .module('climAngularApp')
    .factory("climAngularFactory", climAngularFactory);

// las funciones usadas como factorías tienen que devolver un objeto de forma obligatoria
function climAngularFactory() {
    // En este caso es un objeto con una propiedad única en la que guardamos el array de paises
    return{ countries: [
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
        }]};
}

// Las directivas extienden el html, creando nuevos elementos y atributos
// Como las factorias son funciones que devuelven objetos
// En este caso los objetos ha de tener una estructura predeterminada
angular
    .module('climAngularApp')
    .directive('piePagina', function () {
        // La directiva más simple es un template de html reutilizable
        return {
            restrict: 'AE',
            replace: 'true',
            // Lo ideal es sacar este html aun fichero externo y usar la propuedad templateUrl en lugar del html inline usado aquí
            template: '<span><p>API provided by <a href="http://openweathermap.org/api">Openweathermap</a> - AngularJS by Google</p><p>Alberto Basalo - <a href="http://agorabinaria.com">Ágora Binaria SL</a></p></span>'
        };
    }).directive('ciudadConClima', function () {
        return {
            restrict: 'AE',
            replace: 'true',
            // Una directiva es como una mini aplicaión, con su vista y su modelo
            // El modelo se define en la propiedad scope
            // sus propiedades se rellenaran desde la vista como atributos
            scope: { ciudad : '='},
            // La plantilla accede al scope como culaquier vista de AngularJS accede a su controlador
            template :'<span><span>{{ciudad.city_name}}, {{ciudad.country_code}} </span>                <span name="icon"><img ng-src="http://openweathermap.org/img/w/{{ciudad.weather.weather[0].icon}}.png" /></span><span name="status">{{ciudad.weather.main.temp}} ºC</span><span name="status">{{ciudad.weather.weather[0].description | uppercase}}</span><span name="sunrise">Sunrise: {{ciudad.weather.sys.sunrise *1000 | date:"HH:mm:ss Z"}}</span></span>'
        }
});