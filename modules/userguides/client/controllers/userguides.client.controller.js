(function () {
  'use strict';

  // Userguides controller
  angular
    .module('userguides')
    .controller('UserguidesController', UserguidesController);

  UserguidesController.$inject = ['$anchorScroll', '$location', '$scope', '$state', '$window', 'Authentication'];

  function UserguidesController($anchorScroll, $location, $scope, $state, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      document.getElementById('btntotop').onclick = function() {
        $anchorScroll();
      };
      document.getElementById('btntotop').innerHTML = '<a href="#" class="usg-backtotop"><i class="glyphicon glyphicon glyphicon-menu-up"></i></a>';
      $scope.$on('$destroy', function() {
        document.getElementById('btntotop').removeChild(document.getElementById('btntotop').childNodes[0]);
      });
    }

  }
}());
