(function () {
  'use strict';

  angular
    .module('userguides')
    .controller('OverviewController', OverviewController);

  OverviewController.$inject = ['$window', '$interval', '$scope', '$state', 'Authentication'];

  function OverviewController($window, $interval, $scope, $state, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
      };
    }

  }
}());
