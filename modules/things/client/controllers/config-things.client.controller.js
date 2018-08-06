/* global someFunction qrcode:true*/

(function () {
  'use strict';

  // Things controller
  angular
    .module('things')
    .directive('qrScanner', ['$interval', '$window', function ($interval, $window) {
      return {
        restrict: 'E',
        scope: {
          ngSuccess: '&ngSuccess',
          ngError: '&ngError',
          ngVideoError: '&ngVideoError'
        },
        link: function (scope, element, attrs) {
          // var qrcode = {};
          window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
          navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
          var height = attrs.height || 300;
          var width = attrs.width || 250;
          var video = $window.document.createElement('video');
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          video.setAttribute('style', '-moz-transform:rotateY(-180deg);-webkit-transform:rotateY(-180deg);transform:rotateY(-180deg);');
          var canvas = $window.document.createElement('canvas');
          canvas.setAttribute('id', 'qr-canvas');
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          canvas.setAttribute('style', 'display:none;');
          angular.element(element).append(video);
          angular.element(element).append(canvas);
          var context = canvas.getContext('2d');
          var stopScan;
          var scan = function () {
            // // console.log(qrcode);
            if ($window.localMediaStream) {
              context.drawImage(video, 0, 0, 307, 250);
              try {
                qrcode.decode();
              } catch (e) {
                scope.ngError({ error: e });
              }
            }
          };
          var successCallback = function (stream) {
            video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            $window.localMediaStream = stream;

            scope.video = video;
            video.play();
            stopScan = $interval(scan, 500);
          };

          // Call the getUserMedia method with our callback functions
          if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true }, successCallback, function (e) {
              scope.ngVideoError({ error: e });
            });
          } else {
            scope.ngVideoError({ error: 'Native web camera streaming (getUserMedia) not supported in this browser.' });
          }

          qrcode.callback = function (data) {
            scope.ngSuccess({ data: data });
          };

          element.bind('$destroy', function () {
            if ($window.localMediaStream) {
              $window.localMediaStream.getVideoTracks()[0].stop();
            }
            if (stopScan) {
              $interval.cancel(stopScan);
            }
          });
        }
      };
    }])
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
    $scope.intervalthing = null;
    vm.authentication = Authentication;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      document.getElementById('main').classList.add('section-wrapper');
      // $http.get('/api/things/list/')
      //   .then(function (response) {
          // if (response.data.message.length > 0) {
          //   $http.post('/api/user/newuser', { checkskip: true })
          //     .then(function (newuser) {

          //     });
          // } else {
          //   $http.post('/api/user/newuser', { checkskip: false })
          //     .then(function (newuser) {
          //       window.location.href = '/things-tutorial';
          //     });
          // }
        // });
      $scope.$on('$destroy', function () {
        if (angular.isDefined($scope.intervalthing)) {
          $interval.cancel($scope.intervaldnm);
          $interval.cancel($scope.intervalthing);
        }
      });
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
      // End Create Thing Modal
      $http.get('/api/things/list/')
        .then(function (response) {
          if (response.data.message.length === 0) {
            $scope.firstThingShow = true;
          } else {
            $scope.firstThingShow = false;
          }
          $scope.thingsobj = response.data.message;
          $scope.amountStatus = 0;
          for (var i = 0; i < $scope.thingsobj.length; i++) {
            var sendToken = $scope.thingsobj[i].sendToken;
            reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendToken));
          } // end for
          Promise.all(reqThingsData)
            .then(function (results) {
              $scope.thingsstatus = results;
              for (var i = 0; i < results.length; i++) {
                $scope.tmpListData[i] = results[i].data.status;
                if (results[i].data !== undefined && results[i].data.date !== undefined && results[i].data.sendToken !== undefined) {
                  dateV[results[i].data.sendToken] = results[i].data.date;
                }
                if (results[i].data.status === true) {
                  $scope.amountStatus++;
                } else {
                  // // console.log('null');
                }
              }
              $scope.arrayG = [$scope.thingsobj, $scope.tmpListData];
              $scope.$apply();
              $scope.intervalthing = $interval($scope.updateThings, refreshTime);
            }).catch(function (err) {
              // console.log(err);
            });
        });
    }
  }
}());
angular.module('things').controller('addConditionCtrl', function ($uibModal, $document, $http, $state, $scope, $uibModalInstance, Authentication) {
  $scope.createpermission = 'Public';
  $scope.createtimerefresh = '20';
  $scope.authentication = Authentication;
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

  $http.get('/api/things/list/').then(function (result) {
    if (result.data) {
      $scope.things = result.data.message;
      $scope.thingsTemp = result.data.message;
      if ($scope.things.length > 0) {
        $scope.thing = $scope.things[0]._id;
        $scope.getDataSourceByThing($scope.thing);// update data source
      }
      if ($scope.widgetEdit) {
        $scope.thing = $scope.widgetEdit.thingsId;
        $scope.getDataSourceByThing($scope.thing);
      }
    }
  }, function (err) {
    // console.log(err);
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

  $scope.cancelCreateThings = function () {
    $uibModalInstance.dismiss('cancel');
  };
});