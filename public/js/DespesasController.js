(function () {
    'use strict';

    angular.module('trip-planner').controller('DespesasController', DespesasController);

    DespesasController.inject = ['$mdDialog', '$mdBottomSheet'];

    function DespesasController($mdDialog, $mdBottomSheet) {

        var despesa = this;

        despesa.selected = null;
        despesa.showLista = true;

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
                despesa.dia.total += despesa.selected.price || 0;
                despesa.selected = null;
                despesa.showLista = true;
            }
        };

        despesa.voltar = function () {
            despesa.showLista = true;
        };

        despesa.excluir = function () {
            despesa.dia.lista.splice(despesa.dia.lista.indexOf(despesa.selected), 1);
            despesa.showLista = true;
        };

        despesa.hideExcluir = function () {
            return despesa.showLista || despesa.dia.lista.indexOf(despesa.selected) === -1;
        };

        despesa.editar = function (atividade) {
            despesa.selected = atividade;
            despesa.showLista = false;
        };

        despesa.add = function () {
            despesa.selected = {};
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