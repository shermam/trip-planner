(function () {
    'use strict';

    angular.module('trip-planner').controller('DespesasController', DespesasController);

    DespesasController.inject = ['$mdDialog', '$mdBottomSheet', 'MoneyService'];

    function DespesasController($mdDialog, $mdBottomSheet, MoneyService) {

        var despesa = this;

        despesa.selected = null;
        despesa.showLista = true;
        despesa.MoneyService = MoneyService;

        despesa.cancel = function () {
            $mdDialog.cancel();
        };

        despesa.ok = function () {
            if (despesa.showLista) {
                $mdDialog.hide(despesa.dia);
            } else {
                despesa.dia.lista = despesa.dia.lista || [];
                if (despesa.dia.lista.indexOf(despesa.selected) === -1) {
                    despesa.dia.lista.push(despesa.selected);
                }
                // despesa.dia.total += MoneyService.convertToReal(despesa.selected.price);
                despesa.calculaTotalDespesas();
                despesa.selected = null;
                despesa.showLista = true;
            }
        };

        despesa.calculaTotalDespesas = function () {
            despesa.dia.total = 0;
            despesa.dia.lista.forEach(function (item) {
                despesa.dia.total += MoneyService.convertToReal(item.price);
            });
        };

        despesa.voltar = function () {
            despesa.showLista = true;
        };

        despesa.excluir = function () {
            // despesa.dia.total -= MoneyService.convertToReal(despesa.selected.price);
            despesa.dia.lista.splice(despesa.dia.lista.indexOf(despesa.selected), 1);
            despesa.calculaTotalDespesas();
            despesa.showLista = true;
        };

        despesa.hideExcluir = function () {
            return despesa.showLista || !despesa.dia.lista || despesa.dia.lista.indexOf(despesa.selected) === -1;
        };

        despesa.editar = function (atividade) {
            despesa.selected = atividade;
            despesa.showLista = false;
        };

        despesa.add = function () {
            despesa.selected = { price: {} };
            despesa.showLista = false;
        };

        // (function () {
        //     for (var i = 0; i < 0; i++) {
        //         despesa.dia.lista.push({
        //             name: 'teste',
        //             price: 25,
        //             address: 'Rua 1, 432'
        //         });
        //     }
        // })();

    }

})();