/* global someFunction qrcode:true*/

(function () {
  'use strict';

  // Things controller
  angular
    .module('things')
    .controller('ThingsConfigController', ThingsConfigController);

  ThingsConfigController.$inject = ['$interval', '$uibModal', '$document', '$log', '$http', '$stateParams', '$scope', '$state', '$window', 'Authentication'];

  function ThingsConfigController($interval, $uibModal, $document, $log, $http, $stateParams, $scope, $state, $window, Authentication) {
    var vm = this;
    var reqThingsDataa = [];
    var reqThingsData = [];
    $scope.thingsobj = [];
    $scope.tmpListData = [];
    var dateV = [];
    var refreshTime = 5000;
    $scope.toggle = true;
    $scope.intervalthing = null;
    vm.authentication = Authentication;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      document.getElementById('main').classList.add('section-wrapper');
      // Start Sort
      // var up = '&#x25B2;';
      // var down = '&#x25BC;';
      // End Sort
      // Start Create Thing Modal
      $scope.animationsEnabled = true;
      $scope.openCreate = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'addCondition.html',
          controller: 'addConditionCtrl',
          size: size,
          appendTo: parentElem
        });
      };
      $scope.addField = function () {
        $scope.thinglist.
      };
      $scope.deleteField = function (key) {
        $scope.thinglist.splice(key, 1);
      };
      // End Create Thing Modal
      $http.get('/api/thingconfig/list/')
        .then(function (response) {
          $scope.thinglist = response.data.message;
          console.log(response.data.message);
        });
      $http.get('/api/things/list/')
        .then(function (response) {
          $scope.thingsobj = response.data.message;
          if (response.data) {
            $scope.things = response.data.message;
            $scope.thingsTemp = response.data.message;
            if ($scope.things.length > 0) {
              $scope.thing = $scope.things[0]._id;
              $scope.getDataSourceByThing($scope.thing); // update data source
            }
            if ($scope.widgetEdit) {
              $scope.thing = $scope.widgetEdit.thingsId;
              $scope.getDataSourceByThing($scope.thing);
            }
          }
        });
      $scope.getDataSourceByThing = function (thingId) {
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
      }
    }
  }
}());
