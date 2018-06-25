(function () {
  'use strict';

  // Things controller
  angular
    .module('things')
    .controller('ThingsCreateController', ThingsCreateController);

  ThingsCreateController.$inject = ['$stateParams', '$http', '$scope', '$state', '$window', 'Authentication'];

  function ThingsCreateController ($stateParams, $http, $scope, $state, $window, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    // console.log('ThingsCreateController');
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {

    // START ADD Things
      $scope.add = function () {
        // console.log('name + des : ' + $scope.thingName + $scope.thingDesc);
        // console.log('add Things CLICK');
        $http.post('/api/things/add',
          {
            thingName: $scope.thingName,
            thingDesc: $scope.thingDesc,
            username: vm.authentication.user.username
          })
        .then(
        function (result) {
          // console.log(result);
          $state.go('things.index');
        },
        function (result) {
          // console.log('ERROR add Things');
          // console.log(result);
        });
      };
      $scope.ThingsIndex = function() {
      // $state.go('things.list');
        $state.go('things.index');
      };
    }
  }
}());
