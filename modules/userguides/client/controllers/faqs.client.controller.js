(function () {
  'use strict';

  angular
      .module('userguides')
      .controller('FaqsController', FaqsController);

  FaqsController.$inject = ['$window', '$interval', '$scope', '$state', 'Authentication'];

  function FaqsController($window, $interval, $scope, $state, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
    }

  }
}());

