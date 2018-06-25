(function () {
  'use strict';

  // Dashboards controller
  angular
    .module('dashboards')
    .filter('convertmapdata', function () {
      return function (datalocation) {
        if (datalocation) {
          if (datalocation.length === 1) {
            return datalocation.join();
          } else {
            // // console.log(datalocation.slice(datalocation.length - 2, datalocation.length - 1).join());
            return datalocation.slice(datalocation.length - 2, datalocation.length - 1).join();
          }
        } else {
          // console.log('!datalocation : ' + datalocation);
          return '0,0';
        }
      };
    })
    .controller('DashboardsIndexController', DashboardsIndexController);

  DashboardsIndexController.$inject = ['NgMap', '$interval', '$timeout', '$compile', '$http', '$scope', '$state', '$window', 'Authentication'];

  function DashboardsIndexController(NgMap, $interval, $timeout, $compile, $http, $scope, $state, $window, Authentication) {
    var vm = this;
    var key = '';
    var widgetDisplay = '';

    vm.authentication = Authentication;
    $scope.dashboardsObj = [];
    var keydatas = [];
    var reqThings = [];
    var dateV = [];
    // $scope.datavalue = [];
    // console.log('DashboardsIndexController');
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      $scope.testdata = 0;
      // NgMap.getMap().then(function(map) {
      //   // console.log(map.getCenter());
      //   // console.log('markers', map.markers);
      //   // console.log('shapes', map.shapes);
      // });
      // $scope.intervalFunction = function () {
      //           $timeout(function () {
      //             $scope.getData();
      //             $scope.intervalFunction();
      //           }, 3000);
      // };

      $scope.createWidget = function () {
        $http.post('/api/dashboards/' + $scope.dashboardsObj[0]._id + '/widgets/add', {
          x: 1,
          y: 2,
          width: 3,
          height: 4,
          name: 'a',
          type: 'b',
          thingToken: 'c',
          dataKey: 'd',
          selectedGroup: '',
          unit: 'X',
          minValue: 0,
          maxValue: 100
        }).then(function (result) {
          // console.log(result);
          $window.alert(result);
        }, function (result) {
          // console.log('ERROR Create Widget');
          // console.log(result);
          $window.alert(result);
        });
      };

      // console.log('dashboard');
      // console.log(vm.authentication.user.username);
      $http.get('/api/dashboards/list/')
        .then(function (response) {
          // console.log(response.data.message);
          $scope.dashboardsObj = response.data.message;

          for (var i = 0; i < 0; i++) {
            // for (var i = 0; i < $scope.dashboardsObj.length; i++) {
            $scope.dashboardsObj[i].datavalue = [];
            $scope.dashboardsObj[i].datalabel = [];
            var keydata = $scope.dashboardsObj[i].datasourceKey;
            keydatas.push(keydata);
            if ($scope.dashboardsObj[i].settings) {
              $scope.dashboardsObj[i].settings = JSON.parse($scope.dashboardsObj[i].settings);
            } else {
              // console.log('settings : null');

            }
            var OnlythingId = $scope.dashboardsObj[i].thingId;
            reqThings.push($http.get('/api/things/detail/' + OnlythingId));

          }// end for

          // $scope.mapfunc = function(_id, datalocation) {
          //   if (datalocation) {
          //     var latt = datalocation[0];
          //     var longg = datalocation[1];
          //     var url = '<iframe frameborder="0" scrolling="true" zoom="true" style="border:0;width:100%;" src="https://www.google.com/maps/embed/v1/search?q=' + latt + '%2C%20' + longg + '&key=AIzaSyD-KsenClXL-nNTCdGM9gcCLlY08ZnUYy4" allowfullscreen></iframe>';
          //     document.getElementById(_id).innerHTML = url;
          //   } else {
          //     document.getElementById(_id).innerHTML = 'null';
          //   }
          // };
          var reqThingsData = [];
          Promise.all(reqThings)
            .then(function (results) {
              for (var i = 0; i < results.length; i++) {
                var sendtoken = results[i].data.data.sendToken;

                // // console.log(date);
                reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendtoken));
              }// End for

              Promise.all(reqThingsData)
                .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                    // // console.log(results[i]);
                    if (results[i].data.data) {
                      dateV[results[i].data.sendToken] = results[i].data.date;
                      // console.log(dateV[results[i].data.sendToken]);
                      $scope.jsonthings = JSON.stringify(results[i].data.data);
                      // console.log('results[i].data.data[keydatas[i]] : ' + results[i].data.data[keydatas[i]]);
                      $scope.dashboardsObj[i].datavalue.push(results[i].data.data[keydatas[i]]);
                      // $scope.dashboardsObj[i].datavalue = $scope.dashboardsObj[i].datavalue.concat([120, 140, 100, 150]);
                      $scope.dashboardsObj[i].datalabel.push('');
                      // $scope.dashboardsObj[i].datalabel = $scope.dashboardsObj[i].datalabel.concat(['', '', '']);

                    } else {
                      // // console.log('data = null');
                    }
                  }
                  $scope.$apply();
                  $interval($scope.updateData, 5000, 0, false);
                }).catch(function (err) { console.log(err); });

            }).catch(function (err) { console.log(err); });
        });

    }

    $scope.updateData = function () {
      // // console.log('updateData');
      var reqThingsData = [];
      Promise.all(reqThings)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            var sendtoken = results[i].data.data.sendToken;
            var date = dateV[sendtoken];
            // // console.log(date);
            reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendtoken + '/' + date));
          }// End for

          Promise.all(reqThingsData)
            .then(function (results) {
              // // console.log('results : : ' + results);
              // // console.log(results[1].data.data);

              for (var i = 0; i < results.length; i++) {
                // // console.log(results[i]);
                if (results[i].data.data) {
                  // $scope.jsonthings = JSON.stringify(results[i].data.data);
                  dateV[results[i].data.sendToken] = results[i].data.date;
                  // console.log('results[i].data.data[keydatas[i]] : ' + results[i].data.data[keydatas[i]]);
                  $scope.dashboardsObj[i].datavalue.push(results[i].data.data[keydatas[i]]);
                  // $scope.dashboardsObj[i].datavalue = $scope.dashboardsObj[i].datavalue.concat([120, 140, 100, 150]);
                  $scope.dashboardsObj[i].datalabel.push('');
                  // $scope.dashboardsObj[i].datalabel = $scope.dashboardsObj[i].datalabel.concat(['', '', '']);

                } else {
                  // // console.log('data = null');
                }
              }
              $scope.$apply();
            }).catch(function (err) { console.log(err); });

        }).catch(function (err) { console.log(err); });

    };

    $scope.colors = ['#ffcc66']; // sparkline chart color

    $scope.WidgetDelete = function (widgetID) {

      var retVal = $window.confirm('Do you want to Delete This Widget?');
      if (retVal === true) {
        // console.log('widgetID : ' + widgetID);
        // console.log('DELETE Widget BTN CLICK');
        $http.post('/api/dashboards/widget/delete',
          {
            widgetID: widgetID
          })
          .then(
          function (result) {
            // console.log(result);
            // $state.go($state.current, {}, { reload: true });
            location.reload;
          },
          function (result) {
            // console.log('ERROR DELETE widgetID');
            // console.log(result);
          });
      } else {
        // console.log('cancel');
      }
    };

    $scope.WidgetEdit = function (widgetID) {
      $window.sessionStorage.setItem('widgetID', widgetID);
      $state.go('dashboards.edit');
      // console.log('WidgetEdit : ' + widgetID);
    };
    // Kick off the interval
    // $scope.intervalFunction();
    $scope.testdata = [];
    $scope.bosstest = [];

    // setInterval(function() {
    //   $scope.testdata = Math.floor((Math.random() * 10) + 1);
    //   // console.log($scope.testdata);
    //   $scope.bosstest.push($scope.testdata);
    //   $scope.$apply();
    //   // console.log($scope.testdata);
    // }, 3000);
    // $scope.bosstest = [2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9];
    // $scope.bosstest = [2];

  }
}());

