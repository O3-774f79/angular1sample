(function () {
  'use strict';

  // Dashboards controller
  angular
    .module('dashboards')
    .controller('DashboardsTestController', DashboardsTestController);

  DashboardsTestController.$inject = ['$timeout', '$compile', '$http', '$scope', '$state', '$window', 'Authentication'];

  function DashboardsTestController($timeout, $compile, $http, $scope, $state, $window, Authentication) {
    var vm = this;
    var key = '';
    var widgetDisplay = '';
    vm.authentication = Authentication;
    $scope.dashboardsObj = [];
    var reqThings = [];
    var keydatas = [];
    var reqThingsData = [];
    $scope.colors = ['#ffcc66']; // sparkline chart color
    // console.log('DashboardsTestController');
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      $scope.testdata = [];
      $scope.bosstest = [];

      //   $scope.intervalFunction = function () {
      //     $timeout(function () {
      //       $scope.getData();
      //       $scope.intervalFunction();
      //     }, 3000);
      //   };

      // console.log('dashboard');
      // console.log(vm.authentication.user.username);

      $scope.mapfunc = function (_id, datalocation) {
        if (datalocation) {
          var latt = datalocation[0];
          var longg = datalocation[1];
          var url = '<iframe frameborder="0" scrolling="true" zoom="true" style="border:0;width:100%;" src="https://www.google.com/maps/embed/v1/search?q=' + latt + '%2C%20' + longg + '&key=AIzaSyD-KsenClXL-nNTCdGM9gcCLlY08ZnUYy4" allowfullscreen></iframe>';
          document.getElementById(_id).innerHTML = url;
        } else {
          document.getElementById(_id).innerHTML = 'null';
        }
      };

      $http.get('/api/dashboards/list/' + vm.authentication.user.username)
        .then(function (response) {
          var resDashboards = response.data.message;

          for (var i = 0; i < resDashboards.length; i++) {
            //   // console.log($scope.getthingId(resDashboards[i]));
            // console.log($scope.getSendToken($scope.getthingId(resDashboards[i])));
            //   // console.log(resDashboards[i].sendtoken);
          }
          // Kick off the interval
          // $scope.intervalFunction();
        });

      // getthingId Function Start
      $scope.getthingId = function (resDashboards) {
        var keydata = resDashboards.datasourceKey;
        keydatas.push(keydata);
        if (resDashboards.settings) {
          resDashboards.settings = JSON.parse(resDashboards.settings);
          //   // console.log('setting : ' + resDashboards.settings);
        } else {
          //   // console.log('settings : null');
        }
        var OnlythingId = resDashboards.thingId;
        return OnlythingId;
        //   $scope.getSendToken(resDashboards, OnlythingId);
      };// getthingId Function End

      $scope.getSendToken = function (OnlythingId) {
        // reqThings.push($http.get('/api/things/detail/' + OnlythingId));
        return $http.get('/api/things/detail/' + OnlythingId)
          // Promise.all(reqThings)
          .then(function (results) {
            // // console.log(results);
            // for (var i = 0; i < results.length; i++) {
            // }// End for
          }).catch(function (err) { console.log(err); });
      };// getSendToken Function End

      $scope.getThingsData = function (resDashboards, sendtoken) {
        // // console.log(resDashboards);
        reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendtoken));
        Promise.all(reqThingsData)
          .then(function (results) {
            for (var i = 0; i < results.length; i++) {
              if (results[i].data.data) {
                //   // console.log(i + ' : ');
                //   // console.log(results[i].data.data);
                //   $scope.jsonthings = JSON.stringify(results[i].data.data);
                //   resDashboards.datavalue = [];
                //   $scope.dashboardsObj[i].datavalue = [];
                //   var datatest = [];
                if (results[i].data.data[keydatas[i]]) {
                  // // console.log(i + ' : ');
                  // console.log(results[i].data.data[keydatas[i]]);
                  //   // console.log(typeof(resDashboards.datavalue));
                  // return results[i].data.data[keydatas[i]];

                }
              } else {
                // // console.log('data = null');
              }
            }
            //   // console.log(typeof($scope.dashboardsObj));
            //   // console.log($scope.dashboardsObj);
            //   // console.log(typeof(resDashboards.datavalue));
            //   // console.log(resDashboards.datavalue);
            $scope.$apply();
          }).catch(function (err) { console.log(err); });
      };

    }// end else

    // setInterval(function() {
    //   $scope.testdata = Math.floor((Math.random() * 10) + 1);
    //   // console.log($scope.testdata);
    //   $scope.bosstest.push($scope.testdata);
    //   $scope.$apply();
    //   // console.log('bosstest : ' + $scope.bosstest);
    // }, 3000);
    // $scope.bosstest = [2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9, 2, 7, 8, 9];
    // $scope.bosstest = [2];

  }
}());

