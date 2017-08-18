// document.addEventListener('DOMContentLoaded', function () {

// 	// The Firebase SDK is initialized and available here!

// 	///firebase.auth().onAuthStateChanged(user => { });
// 	// firebase.database().ref('/').on('data', snapshot => { });
// 	// firebase.messaging().requestPermission().then(() => { });
// 	// firebase.storage().ref('/').getDownloadURL().then(() => { });

// 	// try {
// 	// 	let app = firebase.app();
// 	// 	let features = ['auth', 'database', 'messaging', 'storage']
// 	// 		.filter(feature => typeof app[feature] === 'function');
// 	// 	document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
// 	// } catch (e) {
// 	// 	console.error(e);
// 	// 	document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
// 	// }
// });


angular.module('trip-planner', ['ngMaterial', 'md.data.table', 'firebase']);

(function () {
    'use strict';

    angular.module('trip-planner').controller('PlannerController', PlannerController);

    PlannerController.inject = ['$mdDialog', '$firebaseObject', '$scope'];

    function PlannerController($mdDialog, $firebaseObject, $scope) {
        var planner = this;
        var ref = firebase.database().ref().child("viagem");
        planner.viagem = $firebaseObject(ref);

        planner.salvarViagem = function () {
            return planner.viagem.$save();
        };

        planner.changeDate = function () {
            if (!planner.viagem) {
                return;
            }

            if (!planner.viagem.dataFim || !planner.viagem.dataInicio) {
                return;
            }

            if (planner.viagem.dias && planner.viagem.dias.length) {
                var inicioViagem = planner.viagem.dataInicio.toISOString().substring(0, 10);
                var fimViagem = planner.viagem.dataFim.toISOString().substring(0, 10);

                var dataPrimeiroDia = planner.viagem.dias[0].data.toISOString().substring(0, 10);
                var dataUltimoDia = planner.viagem.dias[planner.viagem.dias.length - 1].data.toISOString().substring(0, 10);

                if (dataPrimeiroDia === inicioViagem &&
                    dataUltimoDia === fimViagem) {
                    console.log('retornou');
                    return;
                }
            }

            planner.viagem.dias = [];

            var data = angular.copy(planner.viagem.dataInicio);
            var dataFimLocal = angular.copy(planner.viagem.dataFim);
            dataFimLocal.setDate(dataFimLocal.getDate() + 1);
            while (data < dataFimLocal) {
                planner.viagem.dias.push({
                    dia: data.getDate(),
                    data: angular.copy(data),
                    total: 0,
                    lista: []
                });
                data.setDate(data.getDate() + 1);
            }

            planner.viagem.$$save()
                .then(function () {
                    console.log('salvou');
                })
                .catch(function (erro) {
                    console.log('falhou', erro);
                });
        };

        planner.clickDia = function (ev, dia) {

            $mdDialog.show({
                controller: 'DespesasController',
                controllerAs: 'despesa',
                templateUrl: 'templates/despesas.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true,
                bindToController: true,
                locals: {
                    "dia": dia
                }
            }).then(planner.calculaTotal).catch(planner.calculaTotal);
        };

        planner.calculaTotal = function () {
            if (!planner.viagem) {
                return;
            }

            planner.viagem.total = 0;
            planner.viagem.total += planner.viagem.valorHotel || 0;
            planner.viagem.total += planner.viagem.valorPassagem || 0;
            planner.viagem.dias.forEach(function (dia) {
                planner.viagem.total += dia.total;
            });
        };

        planner.changeDate();
    }

})();