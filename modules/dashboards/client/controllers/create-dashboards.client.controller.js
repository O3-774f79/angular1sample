(function () {
  'use strict';

  // Dashboards controller
  angular
    .module('dashboards')
    .controller('DashboardsCreateController', DashboardsCreateController);

  DashboardsCreateController.$inject = ['$http', '$scope', '$state', '$window', 'Authentication'];

  function DashboardsCreateController ($http, $scope, $state, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    // console.log('DashboardsCreateController');
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      $scope.groups = [];
      $scope.thingsobj = [];
      $scope.thingsjson = [];
      vm.settings = JSON.stringify();
      // $http.get('/api/things/group/viewwithcount/' + vm.authentication.user.username)
      //   .then(function (response) {
      //     $scope.groups = response.data.message;
      //   });
      // $scope.data = { model: null };
      // $scope.things = { select: null };
      // $scope.keys = { select: null };

      // $scope.groupListSelectValue = function(groupID) {
      //   $scope.datasource = false;
      //   $scope.widgetselect = false;
      //   $scope.widgetType = null;
      //   $scope.widgetgauge = false;
      //   $scope.widgetIndicatorLight = false;
      //   $scope.things = { select: null };
      //   if (!groupID) {
      //     // console.log(groupID);
      //     $scope.datasource = false;
      //     $scope.widgetselect = false;

      //   } else {
      //     $http.get('/api/things/list/' + groupID)
      //       .then(function (response) {
      //         $scope.thingsobj = response.data.message;
      //       });
      //   }
      // };
      // console.log(vm.authentication.user.username);
      $http.get('/api/things/list/')
      .then(function (response) {
        $scope.thingsobj = response.data.message;
      });
      $scope.thingsListSelectValue = function(thingsID) {
        $scope.widgetType = null;
        $scope.widgetgauge = false;
        $scope.widgetIndicatorLight = false;

        if (!thingsID) {
          // console.log(thingsID);
          $scope.datasource = false;
          $scope.widgetselect = false;
        } else {
          $http.get('/api/things/detail/' + thingsID)
            .then(function (response) {
              $scope.sendtoken = response.data.data.sendToken;
              // console.log('$scope.sendtoken : ' + $scope.sendtoken);
              $http.get('/api/things/pullWithStatus/' + $scope.sendtoken)
                .success(function (data, status, headers, config) {
                  if (data && data.data) {
                    $scope.datasource = true;
                    $scope.widgetselect = true;
                    $scope.thingsjson = angular.fromJson(data.data);
                    // console.log('$scope.thingsjson : ');
                    // console.log($scope.thingsjson);
                  } else {
                    $scope.datasource = false;
                    $scope.widgetselect = false;
                    $scope.thingsjson = '';
                    // console.log('$scope.thingsjson : ');
                    // console.log($scope.thingsjson);
                  }
                });

            }
         );
        }
      };

      $scope.widgetSelect = function(widgetType) {
        if (widgetType === 'gauge') {
          $scope.widgetgauge = true;
        } else if (widgetType === 'indicatorlight') {
          $scope.widgetIndicatorLight = true;
        } else {
          // console.log(widgetType);
          $scope.widgetgauge = false;
        }
      };

      $scope.addToDashboards = function (widgetName, thingsID, key, widgetType, settings) {
        if (widgetName && thingsID && key && widgetType) {
        // if (settings) {
          // console.log(settings);
          var settingsJson = JSON.stringify(settings);
          // console.log(settingsJson);
          $http.post('/api/dashboards/add',
            {
              username: vm.authentication.user.username,
              widgetName: widgetName,
              // groupName: document.getElementById('groupName').selectedOptions[0].text,
              thingsID: thingsID,
              thingsName: document.getElementById('thingsName').selectedOptions[0].text,
              datasourceKey: key,
              widgetType: widgetType,
              settings: settingsJson
            })
          .then(
            function (result) {
              // console.log(result);
              $state.go('dashboards.index');
            },
            function (result) {
              // console.log('ERROR Create Dashboards');
              // console.log(result);
            });
        } else {
          // console.log('groupID && thingsID && key && widgetType == null');
        }
      };
    }
  }
}());

