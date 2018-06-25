(function () {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$scope', 'Authentication'];

  function SettingsController($state, $scope, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
  }
}());
