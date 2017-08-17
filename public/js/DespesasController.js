(function () {
    'use strict';

    angular.module('trip-planner').controller('DespesasController', DespesasController);

    DespesasController.inject = ['$mdDialog', '$mdBottomSheet'];

    function DespesasController($mdDialog, $mdBottomSheet) {

        var despesa = this;

        despesa.selected = {};
        despesa.showLista = true;

        despesa.cancel = function () {
            $mdDialog.cancel();
        };

        despesa.ok = function () {
            $mdDialog.hide(despesa.dia);
        };

        despesa.voltar = function () {
            despesa.showLista = true;
        };

        despesa.add = function () {
            if (despesa.showLista) {
                despesa.showLista = false;
            } else {
                despesa.dia.lista = despesa.dia.lista || [];
                despesa.dia.lista.push(despesa.selected);
                despesa.dia.total += despesa.selected.price;
                despesa.selected = {};
                despesa.showLista = true;
            }
        };

        (function () {
            for (var i = 0; i < 0; i++) {
                despesa.dia.lista.push({
                    name: 'teste',
                    price: 25,
                    address: 'Rua 1, 432'
                });
            }
        })();

    }

})();