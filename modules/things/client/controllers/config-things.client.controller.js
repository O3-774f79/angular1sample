/* global someFunction qrcode:true*/

(function () {
  'use strict';

  // Things controller
  angular
    .module('things')
    .config(['MQTTProvider', function(MQTTProvider) {
      var option = {
        username: 'admin',
        password: 'admin'
      };
      var websocket_protocol = 'ws';
      if (window.location.protocol === 'https:') {
        websocket_protocol = 'wss';
      }
      MQTTProvider.setHref(websocket_protocol + '://104.125.191.117:15675/ws');
      MQTTProvider.setOption(option);
    }])
    .controller('ThingsConfigController', ThingsConfigController);

  ThingsConfigController.$inject = ['$interval', '$uibModal', '$document', '$log', '$http', '$stateParams', '$scope', '$state', '$window', 'Authentication'];

  function ThingsConfigController($interval, $uibModal, $document, $log, $http, $stateParams, $scope, $state, $window, Authentication) {
    var vm = this;
    $scope.thingsobj = [];
    $scope.tmpListData = [];
    $scope.toggle = true;
    $scope.thingTokenA = 'asds';
    // $scope.selectedOption = $scope.options[0];
    vm.authentication = Authentication;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      document.getElementById('main').classList.add('section-wrapper');
      $scope.animationsEnabled = true;
      $scope.createCondition = function () {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'manageCondition.html',
          controller: 'manageCondition as ctrl',
          resolve: {
            titleModal: function () {
              return 'Create Condition';
            },
            widgetData: function () {
              return null;
            }
          }
        });
      };
      $scope.editCondition = function (data) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'manageCondition.html',
          controller: 'manageCondition as ctrl',
          resolve: {
            titleModal: function () {
              return 'Edit Condition';
            },
            widgetData: function () {
              return data;
            }
          }
        });
      };
      $scope.deleteCondition = function (data) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'deleteCondition.html',
          controller: 'manageCondition',
          resolve: {
            titleModal: function () {
              return 'Delete Condition';
            },
            widgetData: function () {
              return data;
            }
          }
        });
      };
      $http.get('/api/thingconfig/list/')
      .then(function (response) {
        if (response.data.message.length > 0) {
          $scope.conditionlist = response.data.message;
        }
      });
      $scope.getDataSourceByThing = function (thingId) {
        console.log(thingId);
        $scope.allowDatasource = true;
        // document.getElementById(thingId).removeAttr('disabled');
        console.log(document.getElementById(thingId));
        $scope.dataSources = [];
        $http.get('/api/things/detail/' + thingId).then(function (response) {
          if (response.data.thingData) {
            $scope.dataSources = Object.keys(response.data.thingData);
          }
          setSelectedDataSource();
        }, function (err) {
          // console.log(err);
        });
      };

      function setSelectedDataSource() {
        if ($scope.dataSources.length > 0) {
          $scope.dataSource = $scope.dataSources[0];
          if ($scope.widgetEdit) {
            if ($scope.widgetEdit.datavalue[0] === undefined) {
              $scope.dataSource = 'notfound';
            } else {
              $scope.dataSource = $scope.widgetEdit.dataKey;
            }
          }
        } else {
          $scope.dataSource = 'notfound';
        }
      }
      $scope.getDataSourceByThingAction = function (thingIdAction) {
        $scope.dataSourcesAction = [];
        $http.get('/api/things/detail/' + thingIdAction).then(function (response) {
          if (response.data.thingData) {
            $scope.dataSourcesAction = Object.keys(response.data.thingData);
          }
          setSelectedDataSource();
        }, function (err) {
          // console.log(err);
        });
      };

      function setSelectedDataSourceAction() {
        if ($scope.dataSourcesAction.length > 0) {
          $scope.dataSourcesAction = $scope.dataSourcesAction[0];
          if ($scope.widgetEdit) {
            if ($scope.widgetEdit.datavalue[0] === undefined) {
              $scope.dataSourcesAction = 'notfound';
            } else {
              $scope.dataSourcesAction = $scope.widgetEdit.dataKey;
            }
          }
        } else {
          $scope.dataSourceAction = 'notfound';
        }
      }
      $scope.allow = true;
      $scope.toggleEdit = function () {
        if ($scope.allow === true) {
          $scope.allow = false;
          return true;
        } else {
          $scope.allow = true;
          return false;
        }
      };
    }
  }
}());
angular.module('dashboards').controller('manageCondition', function (MQTTService, $http, $scope, $uibModalInstance, titleModal, widgetData) {

  var ctrl = this;
  ctrl.title = titleModal;
  ctrl.thingsTemp = [];
  ctrl.errMsg = '';
  ctrl.widgetEdit = widgetData;
  ctrl.active = true;
  if (ctrl.widgetEdit) {
    ctrl.dataSourceA = ctrl.widgetEdit.DatasourceA;
    ctrl.dataSourceB = ctrl.widgetEdit.DatasourceB;
    ctrl.operation = ctrl.widgetEdit.Operator;
    ctrl.number = ctrl.widgetEdit.Number;
    ctrl.active = ctrl.widgetEdit.Active;
  } else {
    ctrl.widget = ctrl.widgetType;
  }
  $http.get('/api/things/list/').then(function (result) {
    if (result.data) {
      ctrl.things = result.data.message;
      ctrl.thingList = result.data.message;
      if (ctrl.things.length > 0) {
        ctrl.thingA = ctrl.things[0]._id;
        ctrl.thingB = ctrl.things[0]._id;
        ctrl.getDataSourceByThingA(ctrl.thingA);
        ctrl.getDataSourceByThingB(ctrl.thingB);
      }
      if (ctrl.widgetEdit) {
        ctrl.thingA = ctrl.widgetEdit.thingsIdA;
        ctrl.thingB = ctrl.widgetEdit.thingsIdB;
        ctrl.getDataSourceByThingA(ctrl.thingA);
        ctrl.getDataSourceByThingB(ctrl.thingB);
      }
    }
  }, function (err) {
    // console.log(err);
  });

  ctrl.getDataSourceByThingA = function (thingId) {
    ctrl.dataSourcesA = [];
    $http.get('/api/things/detail/' + thingId).then(function (response) {
      if (response.data.thingData) {
        ctrl.dataSourcesA = Object.keys(response.data.thingData);
      }
      setSelectedDataSourceA();
    }, function (err) {
      // console.log(err);
    });
  };
  ctrl.getDataSourceByThingB = function (thingId) {
    ctrl.dataSourcesB = [];
    $http.get('/api/things/detail/' + thingId).then(function (response) {
      if (response.data.thingData) {
        ctrl.dataSourcesB = Object.keys(response.data.thingData);
      }
      setSelectedDataSourceB();
    }, function (err) {
      // console.log(err);
    });
  };
  ctrl.dismiss = function () {
    $uibModalInstance.dismiss();
  };

  function setSelectedDataSourceA() {
    if (ctrl.dataSourcesA.length > 0) {
      if (ctrl.widgetEdit) {
        ctrl.dataSourceA = ctrl.widgetEdit.DatasourceA;
      } else {
        ctrl.dataSourceA = ctrl.dataSourcesA[0];
      }
    } else {
      ctrl.dataSourceA = 'notfound';
    }
  }
  function setSelectedDataSourceB() {
    if (ctrl.dataSourcesB.length > 0) {
      if (ctrl.widgetEdit) {
        ctrl.dataSourceB = ctrl.widgetEdit.DatasourceB;
      } else {
        ctrl.dataSourceB = ctrl.dataSourcesB[0];
      }
    } else {
      ctrl.dataSourceB = 'notfound';
    }
  }
  function findTokenByThingId(thingId) {
    var sendToken = '';
    for (var i = 0; i < ctrl.thingList.length; i++) {
      if (ctrl.thingList[i]._id === thingId) {
        sendToken = ctrl.thingList[i].sendToken;
      }
    }

    return sendToken;
  }

  $scope.confirmDeleteCon = function () {
    $http.post('/api/thingconfig/delete',
      {
        conId: ctrl.widgetEdit._id
      })
      .then(
      function (result) {
        var topic = 'devices/data/26541900-9a10-11e8-a640-21f45c789e66';
        var json = '{ "EditTime": ' + new Date(Date.now()).toLocaleString().replace(',', '') + '}';
        MQTTService.send(topic, json);
        location.reload();
      },
      function (err) {
      });
  };
  $scope.cancelConfirmDeleteCon = function () {
    $uibModalInstance.dismiss('cancel');
  };

  ctrl.save = function () {
    if (ctrl.thingA !== 'notfound' && ctrl.thingB !== 'notfound'
    && ctrl.dataSourceA !== 'notfound' && ctrl.dataSourceB !== 'notfound'
    && ctrl.operation !== '' && ctrl.operation !== undefined
    && ctrl.number !== '' && ctrl.number !== undefined) {
      ctrl.errMsg = '';
      var param = {};
      param.sendTokenA = findTokenByThingId(ctrl.thingA, ctrl.thingsA);
      param.sendTokenB = findTokenByThingId(ctrl.thingB, ctrl.thingsB);
      param.DatasourceA = ctrl.dataSourceA;
      param.DatasourceB = ctrl.dataSourceB;
      param.Operator = ctrl.operation;
      param.Number = ctrl.number;
      param.active = ctrl.active;
      if (ctrl.widgetEdit) {
        param.conId = ctrl.widgetEdit._id;
        $http.post('/api/thingconfig/edit',
        { param })
        .then(function(result) {
          var topic = 'devices/data/26541900-9a10-11e8-a640-21f45c789e66';
          var json = '{ "EditTime": ' + new Date(Date.now()).toLocaleString().replace(',', '') + '}';
          MQTTService.send(topic, json);
          location.reload();
        });
      } else {
        $http.post('/api/thingconfig/save',
        { param })
        .then(function(result) {
          var topic = 'devices/data/26541900-9a10-11e8-a640-21f45c789e66';
          var json = '{ "EditTime": ' + new Date(Date.now()).toLocaleString().replace(',', '') + '}';
          MQTTService.send(topic, json);
          location.reload();
        });
      }
    } else {
      ctrl.errMsg = 'Please fill in the specific field';
    }

  };
});
