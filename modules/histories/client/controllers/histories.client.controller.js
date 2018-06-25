(function () {
  'use strict';

  // Histories controller
  angular
    .module('histories')
    .controller('HistoriesController', HistoriesController);

  HistoriesController.$inject = ['$http', '$uibModal', '$document', '$scope', '$state', '$window', 'Authentication'];

  function HistoriesController ($http, $uibModal, $document, $scope, $state, $window, Authentication, history) {
    var vm = this;
    vm.authentication = Authentication;
    $scope.timeframe = '1h';
    $scope.datanull = true;
    $scope.dataselect = false;
    $scope.thingsendToken = '';
    $scope.selectName = 'กรุณาเลือก Things';
    $scope.selectDt = 'กรุณาเลือก Data';
    $scope.dataobj = null;
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
        },
        dataset: [{ showLine: true }]
      };
      $scope.showalldata = function () {
        for (var i = 0; i < $scope.tmpkeys.length; i++) {
          document.getElementById($scope.tmpkeys[i]).checked = true;
        }
        $scope.keys.length = 0;
        $scope.values.length = 0;
        $scope.labels.length = 0;
        $scope.tmpkeys.length = 0;
        $scope.tmpvalues.length = 0;
        var active = document.querySelector('.btn-his-active').id;
        var today = new Date();
        var yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
        $scope.endDate = new Date();
        var defaultDate = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
        if (active === 'hour') {
          today.setHours(today.getHours() - 1);
          $scope.startDate = today.toISOString();
        } else if (active === 'threehour') {
          today.setHours(today.getHours() - 3);
          $scope.startDate = today.toISOString();
        } else if (active === 'twelvehour') {
          today.setHours(today.getHours() - 12);
          $scope.startDate = today.toISOString();
        } else if (active === 'oneday') {
          $scope.startDate = yesterday.toISOString();
        } else if (active === 'twoday') {
          var twoday = new Date((yesterday).valueOf() - 1000 * 60 * 60 * 24);
          $scope.startDate = twoday.toISOString();
        }
        var endDate = new Date();
        $http.post('/api/things/getData',
          {
            token: $scope.objThing.sendToken,
            startDate: $scope.startDate,
            endDate: endDate
          })
          .then(function (results) {
            if (results.data.length > 0) {
              $scope.datanull = false;
              $scope.dataobj = true;
              $scope.keys = Object.keys(results.data[results.data.length - 1].data);
              $scope.tmpkeys = Object.keys(results.data[results.data.length - 1].data);
              for (const key of $scope.tmpkeys) {
                $scope.slkeys[key] = true;
              }
              for (var x = 0; x < $scope.keys.length; x++) {
                var arr = [];
                for (var i = 0; i < results.data.length; i++) {
                  arr.push(results.data[i].data[$scope.keys[x]]);
                }
                $scope.values.push(arr);
                $scope.tmpvalues.push(arr);
              }
              for (var z = 0; z < results.data.length; z++) {
                $scope.labels.push(new Date(results.data[z].created).toTimeString().split(' ')[0]);
              }
            } else {
              $scope.datanull = true;
            }
          });
      };
      $scope.keysdata = [];
      $scope.valuesdata = [];
      $scope.selectData = function (k, v) {
        var point = $scope.tmpkeys.indexOf(k);
        if (v === true) {
          if (point !== -1) {
            $scope.keys.push(k);
            $scope.values.push($scope.tmpvalues[point]);
          }
        } else {
          var pnt = $scope.keys.indexOf(k);
          $scope.keys = $scope.keys.filter(function(e) { return e !== k; });
          $scope.values.splice(pnt, 1);
        }
      };
      $scope.selectThing = function (value) {
        $scope.keys = [];
        $scope.values = [];
        $scope.labels = [];
        $scope.disableBtn = true;
        $scope.dataobj = false;
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
              $scope.tmpkeys = [];
              $scope.tmpvalues = [];
              $scope.labels = [];
              $scope.slkeys = {};
              if (results.data.length > 0) {
                $scope.datanull = false;
                $scope.dataobj = true;
                $scope.keys = Object.keys(results.data[results.data.length - 1].data);
                $scope.tmpkeys = Object.keys(results.data[results.data.length - 1].data);
                for (const key of $scope.tmpkeys) {
                  $scope.slkeys[key] = true;
                }
                for (var x = 0; x < $scope.keys.length; x++) {
                  var arr = [];
                  for (var i = 0; i < results.data.length; i++) {
                    arr.push(results.data[i].data[$scope.keys[x]]);
                  }
                  $scope.values.push(arr);
                  $scope.tmpvalues.push(arr);
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
        $scope.tmpvalues.length = 0;
        for (var i = 0; i < $scope.tmpkeys.length; i++) {
          document.getElementById($scope.tmpkeys[i]).checked = true;
        }
        $scope.keys.length = 0;
        $scope.values.length = 0;
        $scope.labels.length = 0;
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
              $scope.datanull = false;
              $scope.keys = Object.keys(results.data[results.data.length - 1].data);
              for (var x = 0; x < $scope.keys.length; x++) {
                var arr = [];
                for (var i = 0; i < results.data.length; i++) {
                  arr.push(results.data[i].data[$scope.keys[x]]);
                }
                $scope.values.push(arr);
                $scope.tmpvalues.push(arr);
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
