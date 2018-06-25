(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$http', '$location', '$state', '$document', 'Authentication', 'menuService', 'UsersService', 'Notification', '$uibModal', '$rootScope'];

  function HeaderController($scope, $http, $location, $state, $document, Authentication, menuService, UsersService, Notification, $uibModal, $rootScope) {
    var vm = this;
    var service = false;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.menu = menuService.getMenu('topbar');
    // console.log('header client controller22');
    $scope.signout = function() {
      localStorage.clear();
      window.location.href = '/api/auth/signout';
    };
  }
}());
