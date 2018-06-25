(function () {
  'use strict';

  // Dashboards controller
  angular
    .module('dashboards')
    .controller('DashboardsFirstController', DashboardsFirstController);

  DashboardsFirstController.$inject = ['$uibModal', '$document', '$log', '$http', '$scope', '$state', '$window', 'Authentication'];

  function DashboardsFirstController ($uibModal, $document, $log, $http, $scope, $state, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    document.getElementById('topbar').style.display = 'none';
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      $scope.signout = function() {
        localStorage.clear();
        window.location.href = '/api/auth/signout';
      };
      // Callback Search Auto Complete
      $scope.objectSelected = function ($item) {
        if ($item.description === 'Things') {
          window.location.href = '/things-detail' + $item.originalObject.id;
          // console.log($item.originalObject.id);
          // console.log('Things');
        } else if ($item.description === 'Group') {
          window.location.href = '/groups-detail' + $item.originalObject.id;
          // console.log($item.originalObject.id);
          // console.log('Group');
        } else if ($item.description === 'Widget') {
          window.location.href = '/dashboards' + $item.originalObject.id;
          // console.log($item.originalObject.id);
          // console.log('Widget');
        } else if (!$item.description) {
          // console.log('null');
        } else {
          // console.log('null');
        }
      };
      $http.get('/api/dashboards/list/' + vm.authentication.user.username)
      .then(function (response) {
        $scope.dashboards = response.data.message;
        // console.log(response.data.message);
        if ($scope.dashboards.length === 0) {
          // console.log($scope.dashboards.length);
        } else {
          // console.log($scope.dashboards.length);
          // window.location.href = '/things';
          $http.post('/api/dashboards/firstcreated', {})
          .then(
          function(result) {
            // // console.log();
            if (result.data.message[0]) {
              // console.log(result);
              $scope.dbID = result.data.message[0]._id;
              // console.log($scope.dbID);
              window.location.href = '/dashboards' + $scope.dbID;
            } else {
              window.location.href = '/first-dashboard';
            }
          },
          function(result) {
            // console.log(result);
          });
        }
      });
      $http.get('/api/things/list/')
        .then(function (response) {
          $scope.thingsobj = response.data.message;
          // $scope.thingsobj.length = 0;
          if ($scope.thingsobj.length === 0) {
            $scope.amountthing = false;
          } else {
            $scope.amountthing = true;
          }
          // console.log($scope.thingsobj);
        });
      // Start Create Dashboard Modal
      $scope.animationsEnabled = true;
      $scope.openCredb = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'credbModal.html',
          controller: 'credbModal',
          size: size,
          appendTo: parentElem
        });
        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      $scope.openFisrtCredb = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'credbFirstModal.html',
          controller: 'credbModal',
          size: size,
          appendTo: parentElem
        });
        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      $scope.openComponentModal = function () {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          component: 'modalComponent'
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('modal-component dismissed at: ' + new Date());
        });
      };
      // End Create Dashboard Modal
    }
  }
}());

angular.module('dashboards').controller('credbModal', function ($http, $state, $scope, $uibModalInstance, Authentication) {
  var vm = this;
  vm.authentication = Authentication;
  $scope.crething = function () {
    $uibModalInstance.dismiss('cancel');
    $state.go('things.index', {}, { reload: true });
  };

  $scope.nothank = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.creDb = function () {
    $http.post('/api/dashboards/add', {
      username: vm.authentication.user.username,
      dbName: $scope.creDashboardName,
      dbDesc: $scope.creDashboardDes
    }).then(function (result) {
      // console.log(result);
      $http.post('/api/dashboards/lastcreated', {})
        .then(
        function(result) {
          // // console.log();
          if (result.data.message[0]) {
            // console.log(result);
            $scope.dbID = result.data.message[0]._id;
            // console.log($scope.dbID);
            window.location.href = '/dashboards' + $scope.dbID;
          } else {
            window.location.href = '/first-dashboard';
          }
        },
        function(result) {
          // console.log(result);
        });
    }, function (result) {
      // console.log('ERROR Create Group');
      // console.log(result);
    });
  };

  $scope.cancelCreDb = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
