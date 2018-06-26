(function () {
  'use strict';

  // Things controller
  angular
    .module('things')
    .config(['MQTTProvider', function(MQTTProvider) {
      var accToken = localStorage.getItem('accToken');
      var option = {
        username: 'user-' + accToken,
        password: accToken
      };
      var websocket_protocol = 'ws';
      if (window.location.protocol === 'https:') {
        websocket_protocol = 'wss';
      }
      MQTTProvider.setHref(websocket_protocol + '://' + window.location.hostname + '/ws');
      // MQTTProvider.setHref(websocket_protocol + '://103.20.205.104/ws');
      MQTTProvider.setOption(option);
      // MQTTService.connect(websocket_protocol + '://103.20.205.104/ws', option);
    }])
    .controller('ThingsDetailController', ThingsDetailController);

  ThingsDetailController.$inject = ['MQTTService', '$interval', '$uibModal', '$document', '$timeout', '$location', '$http', '$stateParams', '$scope', '$state', '$window', 'Authentication'];

  function ThingsDetailController(MQTTService, $interval, $uibModal, $document, $timeout, $location, $http, $stateParams, $scope, $state, $window, Authentication) {
    var vm = this;
    $scope.thingsblock = [];
    vm.authentication = Authentication;
    $scope.thingMQTT = false;
    if (document.getElementById('topbar') !== null) {
      document.getElementById('topbar').style.display = 'block';
    }
    $scope.$on('$destroy', function () {
      if (angular.isDefined($scope.intervalthingdetail)) {
        $interval.cancel($scope.intervaldnm);
        $interval.cancel($scope.intervalthing);
        $interval.cancel($scope.intervalthingdetail);
      }
    });
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      var currentLocation = window.location.href;
      var n = currentLocation.search('things-detail');
      var res = currentLocation.substring(n + 13);
      var thingId = res;
      vm.authentication = Authentication;
      var refreshTime = 5000;
      $scope.copyToClip = function (myTextArea) {
        var textareaValue = document.getElementById(myTextArea).value;
        var textareaCopy = document.getElementById(myTextArea).select();
        document.execCommand('copy');
      };
      $http.get('/api/things/detail/' + thingId)
        .then(function (response) {
          $scope.data = response.data.data;
          $scope.thingName = $scope.data.thingsName;
          $scope.thingDesc = $scope.data.thingsDesc;
          $scope.permission = $scope.data.thingsPermission;
          $scope.refresh = $scope.data.refresh;
          $scope.token = $scope.data.token;
          $scope.receivetoken = $scope.data.receiveToken;
          $scope.receivetokenactive = $scope.data.receiveTokenActive;
          $scope.sendtoken = response.data.data.sendToken;
          $scope.sendtokenactive = $scope.data.sendTokenActive;
          $scope.datasource = 'https://www.aismagellan.io/api/things/pull/' + $scope.data.sendToken;
          $scope.lastEdit = $scope.data.created;

          var url = '/api/things/pullWithStatus/' + $scope.data.sendToken;
          $scope.dweetUrl = 'https://dweet.io/follow/' + $scope.data.sendToken;
          $http.get(url).then(function (data) {
            if (!data.data.success || !data.data.data.succes) {
              $scope.jsonthings = '';
              $scope.thingsblock = null;
              $scope.checkdweet = null;
            }
            if (data.data.success === true && data && data.data.data !== undefined && data.data.data !== null) {
              if (typeof(data.data.data) === 'object') {
                $scope.thingsblock = angular.fromJson(data.data.data);
              } else if (typeof(data.data.data) === 'string') {
                data.data = data.data.data.replace('{', '');
                data.data = data.data.data.replace('}', '');
                var propertiesa = data.data.data.split(', ');
                var strobja = {};
                propertiesa.forEach(function(property) {
                  var tup = property.split(':');
                  strobja[tup[0]] = tup[1];
                });
                $scope.thingsblock = angular.fromJson(strobja);
              } else {
                $scope.thingsblock = angular.fromJson(data.data.data);
              }
              $scope.jsonthings = JSON.stringify(data.data.data);
              $scope.checkdweet = true;
            } else if (data.data.success === true && data && data.data !== undefined && data.data !== null) {
              if (typeof(data.data) === 'object') {
                $scope.thingsblock = angular.fromJson(data.data.data);
              } else if (typeof(data.data) === 'string') {
                data.data = data.data.replace('{', '');
                data.data = data.data.replace('}', '');
                var properties = data.data.split(', ');
                var strobj = {};
                properties.forEach(function(property) {
                  var tup = property.split(':');
                  strobj[tup[0]] = tup[1];
                });
                $scope.thingsblock = angular.fromJson(strobj);
              } else {
                $scope.thingsblock = angular.fromJson(data.data.data);
              }

              $scope.jsonthings = JSON.stringify(data.data.data);
              $scope.checkdweet = true;
            } else {
              $scope.jsonthings = '';
              $scope.checkdweet = null;
            }

            if (data.status === true) {
              $scope.statusThingsOnline = 'Connected';
              $scope.statusThingsOffline = null;
            } else if (data.data.status === true) {
              $scope.statusThingsOnline = 'Connected';
              $scope.statusThingsOffline = null;
            } else {
              $scope.statusThingsOnline = null;
              $scope.statusThingsOffline = 'Disconnect';
            }
            $scope.intervalthingdetail = $interval($scope.getData, refreshTime);
          });
          MQTTService.on('things/connection/' + $scope.sendtoken, function (results) {
            $scope.thingMQTT = true;
            if (results.online === true) {
              $scope.statusThingsOnline = 'Connected';
              $scope.statusThingsOffline = null;
              $interval.cancel($scope.intervalthingdetail);
              $scope.intervalthingdetail = $interval($scope.getData, refreshTime);
            } else {
              $scope.statusThingsOnline = null;
              $scope.statusThingsOffline = 'Disconnect';
            }
          });
          MQTTService.on('things/data/' + $scope.sendtoken, function (results) {
            $scope.statusThingsOnline = 'Connected';
            $scope.statusThingsOffline = null;
            $scope.jsonthings = JSON.stringify(results);
            $scope.checkdweet = true;
            if (typeof(results) === 'object') {
              $scope.thingsblock = angular.fromJson(results);
            } else if (typeof(results) === 'string') {
              results = results.replace('{', '');
              results = results.replace('}', '');
              var properties = results.split(', ');
              var strobj = {};
              properties.forEach(function(property) {
                var tup = property.split(':');
                strobj[tup[0]] = tup[1];
              });
              $scope.thingsblock = angular.fromJson(strobj);
            } else {
              $scope.thingsblock = angular.fromJson(results);
            }
          });
          $scope.getData = function () {
            $interval.cancel($scope.intervalthingdetail);
            var url = '/api/things/pullWithStatus/' + $scope.data.sendToken;
            $http.get(url)
              .success(function (data, status, headers, config) {
                if (!data.success || !data.data.success || !data.data.data.succes) {
                  $scope.jsonthings = '';
                  $scope.thingsblock = null;
                  $scope.checkdweet = null;
                }
                if (data.success === true && data && data.data.data !== undefined && data.data.data !== null) {
                  if (typeof(data.data.data) === 'object') {
                    $scope.thingsblock = angular.fromJson(data.data.data);
                  } else if (typeof(data.data.data) === 'string') {
                    data.data = data.data.data.replace('{', '');
                    data.data = data.data.data.replace('}', '');
                    var propertiesa = data.data.data.split(', ');
                    var strobja = {};
                    propertiesa.forEach(function(property) {
                      var tup = property.split(':');
                      strobja[tup[0]] = tup[1];
                    });
                    $scope.thingsblock = angular.fromJson(strobja);
                  } else {
                    $scope.thingsblock = angular.fromJson(data.data.data);
                  }
                  $scope.jsonthings = JSON.stringify(data.data);
                  $scope.checkdweet = true;
                } else if (data.success === true && data && data.data) {
                  if (typeof(data.data) === 'object') {
                    $scope.thingsblock = angular.fromJson(data.data);
                  } else if (typeof(data.data) === 'string') {
                    data.data = data.data.replace('{', '');
                    data.data = data.data.replace('}', '');
                    var properties = data.data.split(', ');
                    var strobj = {};
                    properties.forEach(function(property) {
                      var tup = property.split(':');
                      strobj[tup[0]] = tup[1];
                    });
                    $scope.thingsblock = angular.fromJson(strobj);
                  } else {
                    $scope.thingsblock = angular.fromJson(data.data);
                  }
                  $scope.jsonthings = JSON.stringify(data.data);
                  $scope.checkdweet = true;
                } else {
                  $scope.jsonthings = '';
                  $scope.checkdweet = null;
                }
                if (data.status === true) {
                  $scope.statusThingsOnline = 'Connected';
                  $scope.statusThingsOffline = null;
                } else {
                  $scope.statusThingsOnline = null;
                  $scope.statusThingsOffline = 'Disconnect';
                }

                // $scope.thingsblock = angular.fromJson(data.data);
                $scope.intervalthingdetail = $interval($scope.getData, refreshTime);
              })
              .error(function (error, status, headers, config) {
                $scope.intervalthingdetail = $interval($scope.getData, refreshTime);
              });
          };
          if ($scope.receivetokenactive === false) {
            $scope.receivetokenactive = null;
            $scope.receivetokennoactive = 'Not Active';
          } else if ($scope.receivetokenactive === true) {
            $scope.receivetokennoactive = null;
            $scope.receivetokenactive = 'Active';
          }

          if ($scope.sendtokenactive === false) {
            $scope.sendtokenactive = null;
            $scope.sendtokennoactive = 'Not Active';
          } else if ($scope.sendtokenactive === true) {
            $scope.sendtokennoactive = null;
            $scope.sendtokenactive = 'Active';
          }
        });
      // Start Edit Thing Function
      $scope.ThingsEdit = function () {
        $window.sessionStorage.setItem('thingData', JSON.stringify($scope.data));
        $scope.openEdit();
      };
      $scope.openEdit = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editModalContent.html',
          controller: 'editThingDetailCtrl',
          size: size,
          appendTo: parentElem
        });
      };
      // End Edit Thing Function
    }
  }
}());

angular.module('things').controller('editThingDetailCtrl', function ($uibModal, $state, $window, $http, $scope, $uibModalInstance) {
  var thingData = JSON.parse($window.sessionStorage.getItem('thingData'));
  $scope.editThingName = thingData.thingsName;
  $scope.editThingDes = thingData.thingsDesc;
  $scope.permission = thingData.thingsPermission;
  var strrefresh = thingData.refresh;
  strrefresh = strrefresh.toString();
  $scope.timerefresh = strrefresh;

  // Start Loop Refresh Data number
  $scope.range = function (min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  };
  // End Loop Refresh Data number

  $scope.saveThings = function () {

    var retVal = $window.confirm('Do you want to Change This Things?');
    if (retVal === true) {
      // console.log('thingId : ' + thingData._id);
      // console.log('SAVE BTN CLICK');
      $http.post('/api/things/update',
        {
          thingId: thingData._id,
          thingName: $scope.editThingName,
          thingDes: $scope.editThingDes,
          thingPermission: $scope.permission,
          refresh: $scope.timerefresh
        })
        .then(
        function (result) {
          // console.log(result);
          $uibModalInstance.close();
          // $state.go($state.current, {}, { reload: true });
          location.reload();
        },
        function (result) {
          // console.log('ERROR Update Things');
          // console.log(result);
        });
    } else {
      // console.log('cancel');
    }
    // console.log('saveThings');
    $uibModalInstance.close();
    $state.go($state.current, {}, { reload: true });
  };
  $scope.deleteThings = function () {

    var retVal = $window.confirm('Do you want to Delete This Things?');
    if (retVal === true) {
      // console.log('thingId : ' + thingData._id);
      $http.post('/api/things/delete',
        {
          thingId: thingData._id
        })
        .then(
        function (result) {
          // console.log(result);
        },
        function (result) {
          // console.log('ERROR DELETE Things');
          // console.log(result);
        });
    } else {
      // console.log('cancel');
    }
    // console.log('saveThings');
    $uibModalInstance.close();
    $state.go('things.index');
  };
  $scope.ThingsDelete = function (thing) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'deletedetailThing.html',
      controller: 'deleteThingdetailModal',
      resolve: {
        thing: function () {
          return thing;
        }
      }
    });
  };
  $scope.cancelSaveThings = function () {
    $uibModalInstance.dismiss('cancelSaveThings');
  };
});

angular.module('things').controller('deleteThingdetailModal', function ($window, $http, $state, $scope, $uibModalInstance, Authentication) {
  var thing = JSON.parse($window.sessionStorage.getItem('thingData'));
  // console.log(thing);
  $scope.nameOfThing = thing.thingsName;
  $scope.confirmDeleteThing = function () {

    $http.post('/api/things/delete',
      {
        thingId: thing._id
      })
      .then(
      function (result) {
        // console.log(result);
        $uibModalInstance.close();
        $uibModalInstance.dismiss('cancel');
        window.location.href = '/things';
      },
      function (result) {
        // console.log('ERROR DELETE Things');
        // console.log(result);
      });
  };
  $scope.cancelConfirmDeleteThing = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
