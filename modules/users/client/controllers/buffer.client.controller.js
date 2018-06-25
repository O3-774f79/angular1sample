(function () {
  'use strict';

  angular
      .module('users')
      .controller('BufferController', BufferController);

  BufferController.$inject = ['$state', '$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'Notification'];

  function BufferController($state, $scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, Notification) {
    var vm = this;
    var currentLocation = window.location.href;
    var accToken = currentLocation.substring(currentLocation.search('buffer') + 7);
    localStorage.setItem('accToken', accToken);
    $state.go('things.index');
  }
}());

