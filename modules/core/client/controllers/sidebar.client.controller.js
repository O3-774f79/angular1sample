(function () {
  'use strict';

  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', '$http', '$location', '$state', '$document', 'Authentication', 'menuService', 'UsersService', 'Notification', '$uibModal', '$rootScope'];

  function SidebarController($scope, $http, $location, $state, $document, Authentication, menuService, UsersService, Notification, $uibModal, $rootScope) {
    var vm = this;
    var service = false;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    $scope.getClass = function (path) {
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    };
    if (!vm.authentication.user) {
      document.getElementById('mySidebar').style.display = 'none';
    } else {
      vm.menu = menuService.getMenu('topbar');
      $http.get('/api/dashboards/list/' + vm.authentication.user.username)
      .then(function (response) {
        $scope.dashboards = response.data.message;
        if ($scope.dashboards.length === 0) {
          $scope.dashboardmenu = false;
        } else if ($scope.dashboards.length < 7) {
          $scope.dashboardseven = false;
          $scope.dashboardmenu = true;
        } else {
          $scope.dashboardseven = true;
          $scope.dashboardmenu = true;
        }
      });
      $scope.pushTo = function() {
        if (screen.width >= 768) {
          return;
        } else {
          document.getElementById('mySidebar').style.transform = 'translate3d(-100%,0,0)';
          document.getElementById('mySidebar').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
        }
      };
       // Start Create DashBoard Modal
      $scope.openCreateDb = function(size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'credbModal.html',
          controller: 'credbDnmModal',
          size: size,
          appendTo: parentElem
        });
      };
    }
  }
}());
