(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$location', '$scope', '$state', 'Authentication', '$window'];

  function HomeController($location, $scope, $state, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;

    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      document.getElementById('main').classList.add('section-wrapper');
      // $state.go('things.index');
      window.location.href = '/things';
      // $state.go('things.index');
    }
  }
}());
