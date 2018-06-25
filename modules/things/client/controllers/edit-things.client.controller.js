(function () {
  'use strict';

  // Things controller
  angular
    .module('things')
    .controller('ThingsEditController', ThingsEditController);

  ThingsEditController.$inject = ['$document', '$timeout', '$location', '$http', '$stateParams', '$scope', '$state', '$window', 'Authentication'];

  function ThingsEditController($document, $timeout, $location, $http, $stateParams, $scope, $state, $window, Authentication) {
    var vm = this;
    $scope.thingsblock = [];
    vm.authentication = Authentication;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      var thingId = $window.sessionStorage.getItem('thingId');
      vm.authentication = Authentication;
      // console.log('ThingsEditController');
      $http.get('/api/things/detail/' + thingId)
        .then(function (response) {
          // console.log(response);
          var data = response.data.data;
          $scope.thingName = data.thingName;
          $scope.thingDesc = data.thingDesc;
          $scope.token = data.token;
          $scope.receivetoken = data.receiveToken;
          $scope.receivetokenactive = data.receiveTokenActive;
          $scope.sendtoken = data.sendToken;
          $scope.sendtokenactive = data.sendTokenActive;
          $scope.datasource = 'https://iot.dld-test.com/api/things/pull/' + data.sendToken;

          var url = '/api/things/pullDataforEditThings/' + data.sendToken;
          $scope.dweetUrl = 'https://dweet.io/follow/' + data.sendToken;
          $http.get(url)
            .success(function (data, status, headers, config) {
              if (data && data.data) {
                $scope.jsonthings = JSON.stringify(data.data);
                $scope.thingsblock = angular.fromJson(data.data);
                $scope.checkdweet = true;
              } else {
                $scope.jsonthings = '';
                $scope.checkdweet = null;
              }

              if (data.status === true) {
                $scope.statusThingsOnline = 'Online';
                $scope.statusThingsOffline = null;
                // console.log('data.status : ' + data.status);
              } else {
                $scope.statusThingsOnline = null;
                $scope.statusThingsOffline = 'Offline';
                // console.log('data.status : ' + data.status);
              }
            })
            .error(function (error, status, headers, config) {
              // console.log(status);
              // console.log('Error occured');
            });
          $scope.getData = function () {
            // // console.log('response.data.message.sendToken : ' + response.data.data.sendToken);
            // // console.log(response.data);
            var url = '/api/things/pullDataforEditThings/' + response.data.data.sendToken;

            $http.get(url)
              .success(function (data, status, headers, config) {
                if (data && data.data) {
                  $scope.jsonthings = JSON.stringify(data.data);
                  $scope.checkdweet = true;
                } else {
                  $scope.jsonthings = '';
                  $scope.checkdweet = null;
                }
                $scope.thingsblock = angular.fromJson(data.data);
                // console.log($scope.thingsblock);
              })
              .error(function (error, status, headers, config) {
                // console.log(status);
                // console.log('Error occured');
              });
          };
          // // console.log('$scope.receivetokenaction : ' + $scope.receivetokenactive);
          if ($scope.receivetokenactive === false) {
            $scope.receivetokenactive = null;
            $scope.receivetokennoactive = 'No Active';
          } else if ($scope.receivetokenactive === true) {
            $scope.receivetokennoactive = null;
            $scope.receivetokenactive = 'Active';
          }

          if ($scope.sendtokenactive === false) {
            $scope.sendtokenactive = null;
            $scope.sendtokennoactive = 'No Active';
          } else if ($scope.sendtokenactive === true) {
            $scope.sendtokennoactive = null;
            $scope.sendtokenactive = 'Active';
          }
          // // console.log('thingName : ' + $scope.thingName);
        });

      $scope.ThingsList = function () {
        // $state.go('things.list');
        $state.go('things.list');
      };
      $scope.ThingsDelete = function () {
        var retVal = $window.confirm('Do you want to Delete This Things?');
        if (retVal === true) {
          // console.log('thingId : ' + thingId);
          // console.log('DELETE BTN CLICK');
          $http.post('/api/things/delete',
            {
              thingId: thingId
            })
            .then(
            function (result) {
              // console.log(result);
              $state.go('things.list');
              // $state.go($state.current, {}, { reload: true });
            },
            function (result) {
              // console.log('ERROR DELETE Things');
              // console.log(result);
            });
        } else {
          // console.log('cancel');
        }
      };

      $scope.intervalFunction = function () {
        $timeout(function () {
          $scope.getData();
          $scope.intervalFunction();
        }, 3000);
      };

      $scope.save = function () {
        var retVal = $window.confirm('Do you want to Change This Things?');
        if (retVal === true) {
          // console.log('thingId : ' + thingId);
          // console.log('SAVE BTN CLICK');
          $http.post('/api/things/update',
            {
              thingId: thingId,
              thingName: $scope.thingName,
              thingDesc: $scope.thingDesc,
              refresh: $scope.timerefresh
            })
            .then(
            function (result) {
              // console.log(result);
              $state.go('things.list');
            },
            function (result) {
              // console.log('ERROR Update Things');
              // console.log(result);
            });
        } else {
          // console.log('cancel');
        }
      };

      // Kick off the interval
      $scope.intervalFunction();

    }
  }
}());
