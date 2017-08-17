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
        var fireObj = $firebaseObject(ref);

        fireObj.$loaded().then(function () {
            planner.viagem = fireObj;
            planner.viagem.destino = planner.viagem.destino || 'Nova York';
            planner.viagem.total = planner.viagem.total || 0;
            planner.viagem.dias = planner.viagem.dias || [];

            //planner.viagem.dataInicioISO = planner.viagem.dataInicioISO || new Date('2017-01-01').toISOString();
            //planner.viagem.dataFimISO = planner.viagem.dataFimISO || new Date('2017-01-10').toISOString();

            planner.viagem.dataInicio = new Date(planner.viagem.dataInicioISO || '2017-01-01');
            planner.viagem.dataFim = new Date(planner.viagem.dataFimISO || '2017-01-10');

            fireObj.$$save = function () {
                for (var key in fireObj) {
                    if (fireObj[key] instanceof Date) {
                        fireObj[key + 'ISO'] = fireObj[key].toISOString();
                    }
                }

                return fireObj.$save().then(function () {
                    for (var key in fireObj) {
                        if (key.indexOf('ISO') !== -1) {
                            fireObj[key.replace('ISO', '')] = new Date(fireObj[key]);
                        }
                    }
                });
            };

            planner.changeDate();
        });

        planner.salvarViagem = function () {
            return planner.viagem.$$save();
        };

        planner.changeDate = function () {
            if (!planner.viagem) {
                return;
            }

            if (planner.viagem.dias && planner.viagem.dias.length) {
                var inicioViagem = planner.viagem.dataInicio.toISOString().substring(0, 10);
                var fimViagem = planner.viagem.dataFim.toISOString().substring(0, 10);

                var dataPrimeiroDia = planner.viagem.dias[0].data.substring(0, 10);
                var dataUltimoDia = planner.viagem.dias[planner.viagem.dias.length - 1].data.substring(0, 10);

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
                    data: angular.copy(data.toISOString()),
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