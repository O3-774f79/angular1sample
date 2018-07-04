(function () {
  'use strict';

  angular
      .module('core')
      .controller('TopbarController', TopbarController);

  TopbarController.$inject = ['$scope', '$http', '$location', '$state', '$document', 'Authentication', 'menuService', 'UsersService', 'Notification', '$uibModal', '$rootScope'];

  function TopbarController($scope, $http, $location, $state, $document, Authentication, menuService, UsersService, Notification, $uibModal, $rootScope) {
    var vm = this;
    var service = false;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.sidebarFlag = true;
    if (!vm.authentication.user) {
      if (document.getElementById('mySidebar') != null) {
        document.getElementById('mySidebar').style.display = 'none';
      }
      if (document.getElementById('topbar') != null) {
        document.getElementById('topbar').style.display = 'none';
      }
    } else {
      $scope.objectSelected = function ($item) {
        if ($item.description === 'Things') {
          window.location.href = '/things-detail' + $item.originalObject.id;
        } else if ($item.description === 'Group') {
          window.location.href = '/groups-detail' + $item.originalObject.id;
        } else if ($item.description === 'Widget') {
          window.location.href = '/dashboards' + $item.originalObject.id;
        } else if (!$item.description) {
            // console.log('null');
        } else {
            // console.log('null');
        }
      };
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
      $scope.signout = function() {
        localStorage.clear();
        window.location.href = '/api/auth/signout';
      };
      $scope.w3_open = function() {
        if (screen.width >= 768) {
          if (document.getElementById('mySidebar').style.transform === 'translate3d(-100%, 0px, 0px)') {
            document.getElementById('main').style.width = 'calc(100% - 254px)';
            document.getElementById('main').style.transform = 'translate3d(250px, 0, 0)';
            document.getElementById('main').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
            document.getElementById('mySidebar').style.transform = 'translate3d(0, 0, 0)';
            document.getElementById('mySidebar').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
          } else {
            document.getElementById('main').style.width = '100%';
            document.getElementById('main').style.transform = 'translate3d(0, 0, 0)';
            document.getElementById('main').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
            document.getElementById('mySidebar').style.transform = 'translate3d(-100%,0,0)';
            document.getElementById('mySidebar').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
          }
        } else {
          if (document.getElementById('mySidebar').style.transform === 'translate3d(-100%, 0px, 0px)') {
            document.getElementById('mySidebar').style.transform = 'translate3d(0, 0, 0)';
            document.getElementById('mySidebar').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
          } else {
            document.getElementById('mySidebar').style.transform = 'translate3d(-100%,0,0)';
            document.getElementById('mySidebar').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
            document.getElementById('main').style.width = '100%';
            document.getElementById('main').style.transform = 'translate3d(0, 0, 0)';
            document.getElementById('main').style.transition = 'transform .5s ease,-webkit-transform .5s ease';
          }
        }
      };

    }
  }
}());

