(function() {
  'use strict';

      // Dashboards controller
  angular
          .module('dashboards')
          .config(['ChartJsProvider', function (ChartJsProvider) {
            ChartJsProvider.setOptions({
              responsive: true
            });
            ChartJsProvider.setOptions('line', {
              showLines: true
            });
          }])
          .filter('convertmapdata', function() {
            return function(datalocation) {
              if (datalocation) {
                if (datalocation.length === 1) {
                  return datalocation.join();
                } else {
                  return datalocation.slice(datalocation.length - 2, datalocation.length - 1).join();
                }
              } else {
                // console.log('!datalocation : ' + datalocation);
                return '0,0';
              }
            };
          })
          .controller('DashboardsTutorialController', DashboardsTutorialController);

  DashboardsTutorialController.$inject = ['$log', '$uibModal', '$document', 'NgMap', '$interval', '$timeout', '$compile', '$http', '$scope', '$state', '$window', 'Authentication'];

  function DashboardsTutorialController($log, $uibModal, $document, NgMap, $interval, $timeout, $compile, $http, $scope, $state, $window, Authentication) {
    var vm = this;
    var key = '';
    var widgetDisplay = '';
    var keydatas = [];
    var reqThings = [];
    var dateV = [];
    var tmpListData = [];
    var currentLocation = window.location.href;
    var dashBoardId = currentLocation.substring(currentLocation.search('tutorial-dashboards') + 19);
    var refreshTime = 10000;
    vm.authentication = Authentication;
    $scope.bossdata = [65, -59, 80, 81, -56, 55, -40];
    $scope.dashboardsObj = [];
    $scope.dashboardShowList = [];
    $scope.colors = ['#b2d234'];
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
      return true;
    } else {
      console.log(dashBoardId);
      $http.get('/api/dashboards/list/' + vm.authentication.user.username)
        .then(function (response) {
          $scope.dashboards = response.data.message;
          if ($scope.dashboards.length === 0) {
            window.location.href = '/things-tutorial';
          } else if ($scope.dashboards.length > 1) {
            console.log(dashBoardId);
            // window.location.href = '/dashboards' + dashBoardId;
          } else {
            $http.post('/api/dashboards/id', { dashboardId: dashBoardId })
            .then(function(response) {
              // console.log(response.data.message);
              if (response.data.message.length > 0) {
                $scope.congrateTutor();
              } else {
                $scope.startDbWidgetTutorial();
              }
            });
          }
        }).catch(function(err) {
          // console.log(err);
        });

      $scope.congrateTutor = function () {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'congrateTutor.html',
          controller: 'congrateTutor',
          backdrop: 'static'
        });
      };
      $scope.startDbWidgetTutorial = function () {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'startDbWidgetTutorial.html',
          controller: 'startDbWidgetTutorial',
          backdrop: 'static'
        });
      };

      $scope.$on('$destroy', function() {
        // console.log('destroy');
        $interval.cancel($scope.interval);
      });
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
      $scope.sortableOptions = {
        update: function(e, ui) {
          var logEntry = tmpListData.map(function(i) {
            return i.value;
          }).join(', ');
          // console.log(logEntry);
        },
        stop: function(e, ui) {
                      // this callback has the changed model
          var logEntry = tmpListData.map(function(i) {
            return i.value;
          }).join(', ');
          // console.log(logEntry);
          // console.log(tmpListData);
          // send update order to server
          for (var i = 0; i < tmpListData.length; i++) {
            tmpListData[i].order = i;
          }
          // console.log(tmpListData);
          $http.post('/api/dashboards/' + dashBoardId + '/widgets/move', { widgets: tmpListData
          }).then(function(result) {
          //   $scope.dashboardShowList.splice(index, 1);
            // console.log(result);
            // location.reload();
          }, function(err) {
            // console.log(err);
          });
        }
      };
      $scope.isHorizontal = true;
      $scope.sortableOptions['ui-floating'] = $scope.isHorizontal;
              // end angular ui sort
      $scope.animationsEnabled = true;

      $scope.testdata = 0;
      $scope.createWidget = function() {

        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'manageWidget.html',
          controller: 'manageWidget as ctrl',
          resolve: {
            titleModal: function() {
              return 'Create Widget';
            },
            dashboardId: function() {
              return dashBoardId;
            },
            widgetData: function() {
              return null;
            },
            orderIndex: function() {
              return $scope.dashboardShowList.length;
            }

          }
        });

      };

      $scope.deleteWidget = function(widgetdata) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'deleteWidget.html',
          controller: 'deleteWidgetModal',
          resolve: {
            widgetdata: function() {
              return widgetdata;
            }
          }
        });


      };

      $scope.editWidget = function(data) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'manageWidget.html',
          controller: 'manageWidget as ctrl',
          resolve: {
            titleModal: function() {
              return 'Edit Widget';
            },
            dashboardId: function() {
              return dashBoardId;
            },
            widgetData: function() {
              return data;
            },
            orderIndex: function() {
              return $scope.dashboardShowList.indexOf(data);
            }

          }
        });
      };

      // Start Create DashBoard Modal
      // $scope.openCreateDb = function(size, parentSelector) {
      //   var parentElem = parentSelector;
      //   angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
      //   var modalInstance = $uibModal.open({
      //     animation: $scope.animationsEnabled,
      //     ariaLabelledBy: 'modal-title',
      //     ariaDescribedBy: 'modal-body',
      //     templateUrl: 'credbModal.html',
      //     controller: 'credbDnmModal',
      //     size: size,
      //     appendTo: parentElem
      //   });
      // };

      $scope.openEditDb = function(size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editDb.html',
          controller: 'editDbCtrl',
          size: size,
          appendTo: parentElem
        });
      };
      // End Edit DashBoard Modal

      $http.post('/api/dashboards/id', { dashboardId: dashBoardId })
          .then(function(response) {
            $scope.dashboardData = response.data.dbData;
            $window.sessionStorage.setItem('dashboardData', JSON.stringify($scope.dashboardData));
            $scope.dashboardsObj = response.data.message;
            for (var i = 0; i < $scope.dashboardsObj.length; i++) {
              $scope.dashboardsObj[i].datavalue = [];
              $scope.dashboardsObj[i].datalabel = [];
              var keydata = $scope.dashboardsObj[i].dataKey;
              keydatas.push(keydata);

              var OnlythingId = $scope.dashboardsObj[i].thingsId;
              reqThings.push($http.get('/api/things/detail/' + OnlythingId));

            } // end for

            var reqThingsData = [];
            Promise.all(reqThings)
              .then(function(results) {
                for (var i = 0; i < results.length; i++) {
                  var sendtoken = results[i].data.data.sendToken;
                  reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendtoken));
                }

                Promise.all(reqThingsData)
                  .then(function(results) {

                    for (var i = 0; i < results.length; i++) {
                      if (results[i].data.data) {
                        dateV[results[i].data.sendToken] = results[i].data.date;
                        // // console.log(dateV[results[i].data.sendToken]);
                        $scope.jsonthings = JSON.stringify(results[i].data.data);
                        // // console.log('results[i].data.data[keydatas[i]] : ' + results[i].data.data[keydatas[i]]);
                        $scope.dashboardsObj[i].datavalue.push(results[i].data.data[keydatas[i]]);
                        // $scope.dashboardsObj[i].datavalue = $scope.dashboardsObj[i].datavalue.concat([120, 140, 100, 150]);
                        $scope.dashboardsObj[i].datalabel.push('');
                         // $scope.dashboardsObj[i].datalabel = $scope.dashboardsObj[i].datalabel.concat(['', '', '']);
                        tmpListData[i] = $scope.dashboardsObj[i];
                      } else {
                         // // console.log('data = null');
                      }
                    }

                    $scope.dashboardShowList = tmpListData;
                    // console.log($scope.dashboardShowList);
                    $scope.$apply();

                    $scope.interval = $interval($scope.updateDataWidget, refreshTime, 0, false);

                  }).catch(function(err) {
                    // console.log(err);
                  });

              }).catch(function(err) {
                // console.log(err);
              });

          });

      $scope.updateDataWidget = function() {
        var reqThingsData = [];
        Promise.all(reqThings)
                  .then(function(results) {
                    for (var i = 0; i < results.length; i++) {
                      var sendtoken = results[i].data.data.sendToken;
                      var date = dateV[sendtoken];
                      // // console.log(date);
                      reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendtoken + '/' + date));
                    } // End for

                    Promise.all(reqThingsData)
                          .then(function(results) {
                            var isUpdate = false;
                            for (var i = 0; i < results.length; i++) {
                              if (results[i].data.data) {
                                isUpdate = true;
                                dateV[results[i].data.sendToken] = results[i].data.date;
                                // console.log('results[i].data.data[keydatas[i]] : ' + results[i].data.data[keydatas[i]]);
                                $scope.dashboardsObj[i].datavalue.push(results[i].data.data[keydatas[i]]);
                                $scope.dashboardsObj[i].datalabel.push('');
                                tmpListData[i] = $scope.dashboardsObj[i];
                              } else {
                                      // // console.log('data = null');
                              }
                            }

                            if (isUpdate) $scope.dashboardShowList = tmpListData;

                            $scope.$apply();
                          }).catch(function(err) {
                            // console.log(err);
                          });

                  }).catch(function(err) {
                    // console.log(err);
                  });
      };
    }
  }

}());


angular.module('dashboards').controller('startDbWidgetTutorial', function($timeout, $document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
  $scope.dashboardData = JSON.parse($window.sessionStorage.getItem('dashboardData'));
  $scope.NextToWidgetTutor = function() {
    // document.getElementById('namedashboard').style.display = 'none';
    $uibModalInstance.dismiss('cancel');
    $timeout(function () {
      angular.element($document[0].querySelector('.modal-demo '));
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'firstWidgetTutor.html',
        controller: 'firstWidgetTutor',
        backdrop: 'static'
      });
    }, 300);
  };

});
angular.module('dashboards').controller('congrateTutor', function($timeout, $document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
  var currentLocation = window.location.href;
  var dashBoardId = currentLocation.substring(currentLocation.search('tutorial-dashboards') + 19);
  $scope.done = function() {
    $uibModalInstance.dismiss('cancel');
    window.location.href = '/dashboards' + dashBoardId;
  };

});
angular.module('dashboards').controller('firstWidgetTutor', function($document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
  $scope.toCreateWidgetTutor = function() {
    angular.element($document[0].querySelector('.modal-demo '));
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'createWidgetTutor.html',
      controller: 'createWidgetTutor',
      backdrop: 'static'
    });
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancelModal = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
angular.module('dashboards').controller('createWidgetTutor', function($document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
  $scope.dashboardData = JSON.parse($window.sessionStorage.getItem('dashboardData'));
  var pushThing = [];
  $scope.createWidgetTutor = function() {
    // console.log($scope.dashboardData);
    $http.get('/api/things/list/')
    .then(function(result) {
      // console.log(result);
      $scope.thingData = result.data.message[0];
      // console.log($scope.thingData);
      $http.post('/api/things/push', {
        token: $scope.thingData.sendToken,
        playload: { 'temp': 28, 'light': 1, 'humid': 4, 'toggle': 1, 'battery': 100 }
      }).then(function() {
        var param = {};
        param.dashboard = $scope.dashboardData._id;
        param.name = 'Default';
        param.type = 'gauge';
        param.unit = 'celcius';
        param.minValue = '0';
        param.maxValue = '100';
        param.thingToken = $scope.thingData.sendToken;
        param.thingID = $scope.thingData._id;
        param.dataKey = 'temp';
        param.order = 1;
        // console.log($scope.thingData);
        $http.post('/api/dashboards/' + $scope.dashboardData._id + '/widgets/add', JSON.stringify(param)).then(function(result) {
          location.reload();
        }, function(err) {
          // console.log(err);
        });
      });
    });

  };

  $scope.cancelModal = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
