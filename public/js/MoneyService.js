(function () {
    'use strict';

    angular.module('trip-planner').factory('MoneyService', MoneyService);

    MoneyService.inject = ['$http'];

    function MoneyService($http) {

        var service = {};
        var taxaDeCambio = 1.06;
        service.moedas = [];
        service.rates = {};

        $http.get('https://api.fixer.io/latest?base=BRL')
            .then(function (resposta) {
                service.rates = resposta.data.rates;
                service.rates.BRL = 1;
                service.moedas = Object.keys(service.rates);
            });

        service.convertToReal = function (price) {
            if (!price || !price.ammount) return 0;
            var moeda = price.moeda || 'BRL';
            var cambioTx = moeda === 'BRL' ? 1 : taxaDeCambio;
            return (price.ammount / service.rates[moeda]) * cambioTx;
        };

        return service;
    }

})();