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
    .controller('ThingsIndexController', ThingsIndexController);

  ThingsIndexController.$inject = ['$interval', '$uibModal', '$document', '$log', '$http', '$stateParams', '$scope', '$state', '$window', 'Authentication'];

  function ThingsIndexController($interval, $uibModal, $document, $log, $http, $stateParams, $scope, $state, $window, Authentication) {
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
      $scope.encoded = '&#x25BC;';
      var REG_HEX = /&#x([a-fA-F0-9]+);/;
      var hex = $scope.encoded.replace(REG_HEX, '$1');
      var dec = parseInt(hex, 16);
      var char = String.fromCharCode(dec);
      $scope.symbol = char;
      $scope.sort = 'ThingName A';
      $scope.xOrderBy = 'thingsName';
      $scope.sortData = function (sortby) {
        if (sortby === 'thingNameaz') {
          $scope.xOrderBy = 'thingsName';
          $scope.sort = 'ThingName A';
          $scope.encoded = '&#x25BC;';
          hex = $scope.encoded.replace(REG_HEX, '$1');
          dec = parseInt(hex, 16);
          char = String.fromCharCode(dec);
          $scope.symbol = char;
        } else if (sortby === 'thingNameza') {
          $scope.xOrderBy = '-thingsName';
          $scope.sort = 'ThingName Z';
          $scope.encoded = '&#x25B2;';
          hex = $scope.encoded.replace(REG_HEX, '$1');
          dec = parseInt(hex, 16);
          char = String.fromCharCode(dec);
          $scope.symbol = char;
        } else if (sortby === 'datecreateaz') {
          $scope.xOrderBy = '-created';
          $scope.sort = 'DateCreate';
          $scope.encoded = '&#x25BC;';
          hex = $scope.encoded.replace(REG_HEX, '$1');
          dec = parseInt(hex, 16);
          char = String.fromCharCode(dec);
          $scope.symbol = char;
        } else if (sortby === 'datecreateza') {
          $scope.xOrderBy = 'created';
          $scope.sort = 'DateCreate';
          $scope.encoded = '&#x25B2;';
          hex = $scope.encoded.replace(REG_HEX, '$1');
          dec = parseInt(hex, 16);
          char = String.fromCharCode(dec);
          $scope.symbol = char;
        } else { console.log('Sort thing Wrong : ' + sortby); }
      };
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
          templateUrl: 'createModalContent.html',
          controller: 'CreateModalInstanceCtrl',
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
      $scope.updateThings = function () {
        $interval.cancel($scope.intervalthing);
        $scope.amountStatus = 0;
        var reqThingsData = [];
        for (var i = 0; i < $scope.thingsobj.length; i++) {
          var sendToken = $scope.thingsobj[i].sendToken;
          var date = dateV[sendToken];
          // console.log(dateV[sendToken]);
          if (date === undefined || date === null) {
            date = '';
          }
          reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendToken + '/' + date));
        } // end
        Promise.all(reqThingsData)
          .then(function (results) {
            // console.log(results);
            $scope.thingsstatus = results;
            for (var i = 0; i < results.length; i++) {
              $scope.tmpListData[i] = results[i].data.status;
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
            $scope.intervalthing = $interval($scope.updateThings, refreshTime);
            // console.log(err);
          });
      };

      $scope.ThingsCreate = function () {
        $state.go('things.create');
      };
      // Start Edit Thing Function
      $scope.ThingsEdit = function (thingData) {
        $window.sessionStorage.setItem('thingData', JSON.stringify(thingData));
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
          controller: 'EditModalInstanceCtrl',
          size: size,
          appendTo: parentElem
        });
      };
      // End Edit Thing Function

      $scope.ThingsDelete = function (thing) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'deleteThing.html',
          controller: 'deleteThingModal',
          resolve: {
            thing: function () {
              return thing;
            }
          }
        });
      };

      $scope.ThingsToGroup = function (thingId) {
        $window.sessionStorage.setItem('thingId', thingId);
        // // console.log(thingId);
        $scope.openThingsToGroup();
      };
      $scope.openThingsToGroup = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'openThingsToGroupModalContent.html',
          controller: 'openThingsToGroupModalInstanceCtrl',
          size: size,
          appendTo: parentElem
        });
      };

      // }
      // });
    }
  }
}());

angular.module('things').controller('CreateModalInstanceCtrl', function ($uibModal, $document, $http, $state, $scope, $uibModalInstance, Authentication) {
  $scope.createpermission = 'Public';
  $scope.createtimerefresh = '20';
  $scope.authentication = Authentication;
  $scope.scanqrcode = function (size, parentSelector) {
    var parentElem = parentSelector;
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'openScanQRmodal.html',
      controller: 'openScanQRmodalCtrl',
      size: size,
      appendTo: parentElem
    });
  };
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

  $scope.createThings = function () {

    // console.log('Create Things CLICK');
    $http.post('/api/things/add',
      {
        thingsName: $scope.createThingName,
        thingsDes: $scope.createThingDes,
        permission: $scope.createpermission,
        timerefresh: $scope.createtimerefresh
      })
      .then(
      function (result) {
        // console.log(result);
        $uibModalInstance.close();
        // $state.go($state.current, {}, { reload: true });
        location.reload();
      },
      function (result) {
        // console.log('ERROR add Things');
        // console.log(result);
      });
  };

  $scope.cancelCreateThings = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('things').controller('EditModalInstanceCtrl', function ($state, $window, $http, $scope, $uibModalInstance) {

  var thingData = JSON.parse($window.sessionStorage.getItem('thingData'));
  // // console.log(thingId);
  $scope.editThingName = thingData.thingsName;
  $scope.editThingDes = thingData.thingsDesc;
  $scope.permission = thingData.thingsPermission;
  var strrefresh = thingData.refresh;
  strrefresh = strrefresh.toString();
  $scope.timerefresh = strrefresh;
  // $http.get('/api/things/detail/' + thingId)
  //   .then(function (response) {
  //     var data = response.data.data;
  //     // console.log(data);
  //     $scope.editThingName = data.thingsName;
  //     $scope.editThingDes = data.thingsDesc;
  //     $scope.permission = data.thingsPermission;
  //     var strrefresh = data.refresh;
  //     strrefresh = strrefresh.toString();
  //     $scope.timerefresh = strrefresh;
  //   });
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
        $uibModalInstance.close();
        $state.go($state.current, {}, { reload: true });
      },
      function (result) {
        $uibModalInstance.close();
        $state.go($state.current, {}, { reload: true });
      });
  };

  $scope.cancelSaveThings = function () {
    $uibModalInstance.dismiss('cancelSaveThings');
  };
});
angular.module('things').controller('openThingsToGroupModalInstanceCtrl', function (Notification, $state, $window, $http, $scope, $uibModalInstance) {
  var thingId = $window.sessionStorage.getItem('thingId');

  $scope.getAvailableGroup = function () {
    $http.get('/api/things/' + thingId + '/group/available')
      .then(function (response) {
        $scope.groups = response.data;
      });
  };
  $scope.cancelGroup = function () {
    $uibModalInstance.dismiss('cancelGroup');
  };

  $scope.getAvailableGroup();

  $scope.chooseGroup = function (groupID) {
    var btnchoose = document.getElementById(groupID);
    btnchoose.classList.add('display-none');
    // console.log(groupID);
    // console.log(thingId);
    $scope.success = false;
    $scope.fail = false;
    $http.post('/api/things/group/oneadd',
      {
        thingsId: thingId,
        groupId: groupID
      })
      .then(
      function (result) {
        // console.log(result);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>Add Thing to Group successful!' });
        $scope.getAvailableGroup();
      },
      function (result) {
        Notification.error({ message: '<i class="ic-close"></i>Add Thing to Group failed!' });
        // console.log('ERROR Add Things to Group');
        // console.log(result);
      });
  };

});

angular.module('things').controller('openScanQRmodalCtrl', function (Authentication, Notification, $state, $window, $http, $scope, $uibModalInstance) {

  var vm = this;
  vm.authentication = Authentication;
  var thingId = $window.sessionStorage.getItem('thingId');
  // console.log(thingId);
  $scope.onSuccess = function (data) {
    // console.log(data);
    if (data) {
      $window.localMediaStream.getVideoTracks()[0].stop();
      $scope.checkqrdata = true;
      $scope.qrcodedata = data;
    } else {
      $scope.checkqrdata = false;
    }
  };
  $scope.onError = function (error) {
    // console.log(error);
  };
  $scope.onVideoError = function (error) {
    // console.log(error);
  };
  $scope.createThingWithQR = function () {
    $http.post('/api/things/add',
      {
        thingsName: 'Default Thing',
        thingsDes: 'Default Description Thing',
        permission: 'Public',
        timerefresh: '20',
        username: vm.authentication.user.username,
        sendToken: $scope.qrcodedata
      })
      .then(
      function (result) {
        // console.log(result);
        if (result.data.success === false) {
          $scope.tokenused = true;
        } else {
          $http.post('/api/things/lastcreated', {})
            .then(
            function (result) {
              // // console.log();
              if (result.data.message[0]) {
                // console.log(result);
                $scope.thingID = result.data.message[0]._id;
                // console.log($scope.thingID);
                window.location.href = '/things-detail' + $scope.thingID;
              } else {
                window.location.href = '/things';
              }
            },
            function (result) {
              // console.log(result);
            });
        }
      },
      function (err) {
        // console.log('ERROR add Things');
        // console.log(err);
      });
  };
  $scope.cancelScanQR = function () {
    // window.location.href = '/things';
    $uibModalInstance.dismiss('cancelScanQR');
  };
});

angular.module('things').controller('deleteThingModal', function (thing, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
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
        location.reload();
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
