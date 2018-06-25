(function () {
  'use strict';

    // Histories controller
  angular
      .module('histories')
      .controller('HistoriesTestController', HistoriesTestController);

  HistoriesTestController.$inject = ['$http', '$uibModal', '$document', '$scope', '$state', '$window', 'Authentication'];

  function HistoriesTestController ($http, $uibModal, $document, $scope, $state, $window, Authentication, history) {
    var vm = this;
    vm.authentication = Authentication;
    $scope.timeframe = '1h';
    $scope.datanull = true;
    $scope.thingsendToken = '';
    $scope.selectName = 'กรุณาเลือก Things';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('oneday').classList.add('btn-his-active');
    $scope.disableBtn = false;
    if (!vm.authentication.user) {
      document.getElementById('mySidebar').style.display = 'none';
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      $http.get('/api/things/list/')
      .then(function (response) {
        if (response.data.message.length === 0) {
          $scope.thingsobj = null;
        } else {
          $scope.thingsobj = response.data.message;
        }
      });
      $scope.options = {
        tooltips: {
          mode: 'index',
          intersect: false
        }
      };
      $scope.selectThing = function (value) {
        $scope.disableBtn = true;
        document.getElementById('hour').classList.remove('btn-timeframe');
        document.getElementById('hour').classList.add('btn-his-disable');
        document.getElementById('threehour').classList.remove('btn-timeframe');
        document.getElementById('threehour').classList.add('btn-his-disable');
        document.getElementById('twelvehour').classList.remove('btn-timeframe');
        document.getElementById('twelvehour').classList.add('btn-his-disable');
        document.getElementById('oneday').classList.remove('btn-timeframe');
        document.getElementById('oneday').classList.add('btn-his-disable');
        document.getElementById('twoday').classList.remove('btn-timeframe');
        document.getElementById('twoday').classList.add('btn-his-disable');
        document.getElementById('loading').style.display = 'block';
        var today = new Date();
        var defaultDate = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
        $scope.selectName = value.thingsName;
        $scope.objThing = value;
        $http.post('/api/things/getData',
          {
            token: $scope.objThing.sendToken,
            startDate: defaultDate,
            endDate: today
          })
          .then(function (results) {
            $scope.keys = [];
            $scope.values = [];
            $scope.labels = [];
            if (results.data.length > 0) {
              $scope.datanull = false;
              $scope.keys = Object.keys(results.data[results.data.length - 1].data);
              for (var x = 0; x < $scope.keys.length; x++) {
                var arr = [];
                for (var i = 0; i < results.data.length; i++) {
                  arr.push(results.data[i].data[$scope.keys[x]]);
                }
                $scope.values.push(arr);
              }
              for (var z = 0; z < results.data.length; z++) {
                $scope.labels.push(new Date(results.data[z].created).toTimeString().split(' ')[0]);
              }
            } else {
              $scope.datanull = true;
            }
            document.getElementById('oneday').classList.add('btn-his-active');
            document.getElementById('hour').classList.remove('btn-his-active');
            document.getElementById('threehour').classList.remove('btn-his-active');
            document.getElementById('twelvehour').classList.remove('btn-his-active');
            document.getElementById('twoday').classList.remove('btn-his-active');
            document.getElementById('hour').classList.add('btn-timeframe');
            document.getElementById('hour').classList.remove('btn-his-disable');
            document.getElementById('threehour').classList.add('btn-timeframe');
            document.getElementById('threehour').classList.remove('btn-his-disable');
            document.getElementById('twelvehour').classList.add('btn-timeframe');
            document.getElementById('twelvehour').classList.remove('btn-his-disable');
            document.getElementById('oneday').classList.add('btn-timeframe');
            document.getElementById('oneday').classList.remove('btn-his-disable');
            document.getElementById('twoday').classList.add('btn-timeframe');
            document.getElementById('twoday').classList.remove('btn-his-disable');
            $scope.disableBtn = false;
            document.getElementById('loading').style.display = 'none';
          });
      };


      $scope.selectTimeframe = function (time) {
        document.getElementById('loading').style.display = 'block';
        var today = new Date();
        var yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
        $scope.endDate = new Date();
        $scope.startDate = '';
        if (time === '1h') {
          document.getElementById('hour').classList.add('btn-his-active');
          document.getElementById('threehour').classList.remove('btn-his-active');
          document.getElementById('twelvehour').classList.remove('btn-his-active');
          document.getElementById('oneday').classList.remove('btn-his-active');
          document.getElementById('twoday').classList.remove('btn-his-active');
          today.setHours(today.getHours() - 1);
          $scope.startDate = today.toISOString();
        } else if (time === '3h') {
          document.getElementById('threehour').classList.add('btn-his-active');
          document.getElementById('hour').classList.remove('btn-his-active');
          document.getElementById('twelvehour').classList.remove('btn-his-active');
          document.getElementById('oneday').classList.remove('btn-his-active');
          document.getElementById('twoday').classList.remove('btn-his-active');
          today.setHours(today.getHours() - 3);
          $scope.startDate = today.toISOString();
        } else if (time === '12h') {
          document.getElementById('twelvehour').classList.add('btn-his-active');
          document.getElementById('hour').classList.remove('btn-his-active');
          document.getElementById('threehour').classList.remove('btn-his-active');
          document.getElementById('oneday').classList.remove('btn-his-active');
          document.getElementById('twoday').classList.remove('btn-his-active');
          today.setHours(today.getHours() - 12);
          $scope.startDate = today.toISOString();
        } else if (time === '1d') {
          document.getElementById('oneday').classList.add('btn-his-active');
          document.getElementById('hour').classList.remove('btn-his-active');
          document.getElementById('threehour').classList.remove('btn-his-active');
          document.getElementById('twelvehour').classList.remove('btn-his-active');
          document.getElementById('twoday').classList.remove('btn-his-active');
          $scope.startDate = yesterday.toISOString();
        } else if (time === '2d') {
          document.getElementById('twoday').classList.add('btn-his-active');
          document.getElementById('hour').classList.remove('btn-his-active');
          document.getElementById('threehour').classList.remove('btn-his-active');
          document.getElementById('twelvehour').classList.remove('btn-his-active');
          document.getElementById('oneday').classList.remove('btn-his-active');
          var twoday = new Date((yesterday).valueOf() - 1000 * 60 * 60 * 24);
          $scope.startDate = twoday.toISOString();
        }
        $scope.timeframe = time;
        if ($scope.objThing === undefined || $scope.objThing === null) {
          $scope.datanull = true;
          document.getElementById('loading').style.display = 'none';
        } else {
          $scope.disableBtn = true;
          document.getElementById('hour').classList.remove('btn-timeframe');
          document.getElementById('hour').classList.add('btn-his-disable');
          document.getElementById('threehour').classList.remove('btn-timeframe');
          document.getElementById('threehour').classList.add('btn-his-disable');
          document.getElementById('twelvehour').classList.remove('btn-timeframe');
          document.getElementById('twelvehour').classList.add('btn-his-disable');
          document.getElementById('oneday').classList.remove('btn-timeframe');
          document.getElementById('oneday').classList.add('btn-his-disable');
          document.getElementById('twoday').classList.remove('btn-timeframe');
          document.getElementById('twoday').classList.add('btn-his-disable');
          $http.post('/api/things/getData',
            {
              token: $scope.objThing.sendToken,
              startDate: $scope.startDate,
              endDate: $scope.endDate
            })
        .then(function (results) {
          $scope.keys = [];
          $scope.values = [];
          $scope.labels = [];
          if (results.data.length > 0) {
            console.log(results);
            $scope.datanull = false;
            $scope.keys = Object.keys(results.data[results.data.length - 1].data);
            console.log($scope.keys);
            for (var x = 0; x < $scope.keys.length; x++) {
              var arr = [];
              for (var i = 0; i < results.data.length; i++) {
                arr.push(results.data[i].data[$scope.keys[x]]);
              }
              $scope.values.push(arr);
            }
            for (var z = 0; z < results.data.length; z++) {
              $scope.labels.push(new Date(results.data[z].created).toTimeString().split(' ')[0]);
            }
          } else {
            $scope.datanull = true;
          }
          $scope.disableBtn = false;
          document.getElementById('loading').style.display = 'none';
          document.getElementById('hour').classList.add('btn-timeframe');
          document.getElementById('hour').classList.remove('btn-his-disable');
          document.getElementById('threehour').classList.add('btn-timeframe');
          document.getElementById('threehour').classList.remove('btn-his-disable');
          document.getElementById('twelvehour').classList.add('btn-timeframe');
          document.getElementById('twelvehour').classList.remove('btn-his-disable');
          document.getElementById('oneday').classList.add('btn-timeframe');
          document.getElementById('oneday').classList.remove('btn-his-disable');
          document.getElementById('twoday').classList.add('btn-timeframe');
          document.getElementById('twoday').classList.remove('btn-his-disable');
        });
        }
      };
    }
  }
}());

