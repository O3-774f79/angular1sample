(function () {
  'use strict';

  // Things controller
  angular
    .module('groups')
    .controller('GroupsDetailController', GroupsDetailController);

  GroupsDetailController.$inject = ['$interval', '$uibModal', '$document', '$timeout', '$location', '$http', '$stateParams', '$scope', '$state', '$window', 'Authentication'];

  function GroupsDetailController($interval, $uibModal, $document, $timeout, $location, $http, $stateParams, $scope, $state, $window, Authentication) {
    var vm = this;
    $scope.thingsblock = [];
    vm.authentication = Authentication;
    var refreshTime = 5000;
    $scope.intervalgroup = null;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      $scope.$on('$destroy', function () {
        $interval.cancel($scope.intervaldnm);
        $interval.cancel($scope.intervalthing);
        $interval.cancel($scope.intervalgroup);
      });
      // Callback Search Auto Complete
    // Start Sort
      $scope.sort = 'ThingName A - Z';
      $scope.xOrderBy = 'thingsName';
      $scope.sortData = function (sortby) {
        if (sortby === 'thingNameaz') {
          $scope.xOrderBy = 'thingsName';
          $scope.sort = 'ThingName A - Z';
        } else if (sortby === 'thingNameza') {
          $scope.xOrderBy = '-thingsName';
          $scope.sort = 'ThingName Z - A';
        } else if (sortby === 'datecreateaz') {
          $scope.xOrderBy = '-created';
          $scope.sort = 'DateCreate - Newest';
        } else if (sortby === 'datecreateza') {
          $scope.xOrderBy = 'created';
          $scope.sort = 'DateCreate - The oldest';
        } else { console.log('Sort thing Wrong : ' + sortby); }
      };
      // End Sort
      var currentLocation = window.location.href;
      var n = currentLocation.search('groups-detail');
      var res = currentLocation.substring(n + 13);
      $scope.groupId = res;
      vm.authentication = Authentication;
      $scope.thingIdArr = [];
      $scope.thingData = [];
      $scope.thingsObj = [];
      $scope.thingsstatus = [];
      var reqThings = [];
      $http.get('/api/groups/' + $scope.groupId)
        .then(function (response) {
          $scope.group = response.data;
          $scope.groupName = $scope.group.groupName;
        });

      $http.get('/api/group/' + $scope.groupId + '/things')
        .then(function (response) {
          $scope.data = response.data;
          for (var i = 0; i < $scope.data.length; i++) {
            $scope.thingIdArr.push($scope.data[i].thingsId);
          }
          for (var x = 0; x < $scope.thingIdArr.length; x++) {
            var thingId = $scope.thingIdArr[x];
            reqThings.push($http.get('/api/things/detail/' + thingId));
          }
          Promise.all(reqThings)
            .then(function(results) {
              for (var i = 0; i < results.length; i ++) {
                $scope.thingsstatus.push(results[i].data.status);
                $scope.thingsObj.push(results[i].data.data);
              }
              $scope.$apply();
              $scope.intervalgroup = $interval($scope.updateGroup, refreshTime);
            });

        });

      $scope.updateGroup = function () {
        $interval.cancel($scope.intervalgroup);
        var reqGroup = [];
        $scope.thingsstatus.splice(0, $scope.thingsstatus.length);
        for (var x = 0; x < $scope.thingIdArr.length; x++) {
          var thingId = $scope.thingIdArr[x];
          reqGroup.push($http.get('/api/things/detail/' + thingId));
        }
        Promise.all(reqGroup)
        .then(function(results) {
          for (var i = 0; i < results.length; i ++) {
            $scope.thingsstatus.push(results[i].data.status);
          }
          $scope.$apply();
          $scope.intervalgroup = $interval($scope.updateGroup, refreshTime);
        });
      };
      // Start Edit Group Function

      $scope.GroupDetailEdit = function () {
        // // console.log($scope.group);
        $window.sessionStorage.setItem('group', JSON.stringify($scope.group));
        $scope.openGroupDetailEdit();
      };
      $scope.openGroupDetailEdit = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editGroupDetailModalContent.html',
          controller: 'EditGroupDetailModalInstanceCtrl',
          size: size,
          appendTo: parentElem
        });
      };
      // End Edit Group Function
      // Start Remove Thing from Group
      $scope.ThingRemoveGroup = function (thingId) {

        $http.post('/api/things/group/delete',
          {
            thingId: thingId,
            groupId: $scope.groupId
          })
          .then(
          function (result) {
            // console.log(result);
            // $state.go($state.current, {}, { reload: true });
            location.reload();
          },
          function (result) {
            // console.log(result);
          });
      };
      // End Remove Thing from Group
      // Start Edit Thing Function
      $scope.ThingsEdit = function (thingData) {
        $window.sessionStorage.setItem('thingData', JSON.stringify(thingData));
        $scope.openEdit();
      };
      $scope.openEdit = function (parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editModalContent.html',
          controller: 'editThingGroupDetailCtrl',
          appendTo: parentElem
        });
      };
     // End Edit Thing Function
      // End Select ThingsToGroup Function
    //   $scope.SelectThingsToGroup = function () {
    //     // // console.log(thingId);
    //     $scope.openThingsToGroup($scope.groupId);
    //   };
      $scope.openSelectThingsToGroup = function (parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'openSelectThingsToGroupModalContent.html',
          controller: 'openSelectThingsToGroupCtrl',
          appendTo: parentElem,
          resolve: {
            groupId: function() { return $scope.groupId;}
          }
        });
      };
    }
  }
}());

angular.module('things').controller('editThingGroupDetailCtrl', function ($state, $window, $http, $scope, $uibModalInstance) {

  var thingData = JSON.parse($window.sessionStorage.getItem('thingData'));
  $scope.editThingName = thingData.thingsName;
  $scope.editThingDes = thingData.thingsDesc;
  $scope.permission = thingData.thingsPermission;
  var strrefresh = thingData.refresh;
  strrefresh = strrefresh.toString();
  $scope.timerefresh = strrefresh;

  // Start Loop Refresh Data number
  $scope.range = function(min, max, step) {
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
          // $state.go($state.current, {}, { reload: true });
          location.reload();
          // console.log('saveThings');
          $uibModalInstance.close();
        },
        function (result) {
          // console.log('ERROR Update Things');
          // console.log(result);
        });
    } else {
      // console.log('cancel');
    }
    location.reload();
    // $state.go($state.current, {}, { reload: true });
    // console.log('saveThings');
    $uibModalInstance.close();
  };


  $scope.cancelSaveThings = function () {
    $uibModalInstance.dismiss('cancelSaveThings');
  };
});
angular.module('groups').controller('openSelectThingsToGroupCtrl', function ($state, $window, $http, $scope, $uibModalInstance, groupId) {
  var thingsIdArr = [];
  var getthingsavailable = [];
  $scope.thingselect = [];
  $scope.getAvailableGroup = function () {
    $http.get('/api/group/' + groupId + '/things/available')
      .then(function (response) {
        $scope.things = response.data;
        if ($scope.things.length === 0) {
          $scope.noAvailableThing = true;
        } else {
          $scope.noAvailableThing = false;
        }
      });
  };
  $scope.getAvailableGroup();
  $scope.getChooseGroup = function () {
    $http.get('/api/group/' + groupId + '/things/available')
      .then(function (response) {
        $scope.getthingsavailable = response.data;
        if ($scope.getthingsavailable.length === 0) {
          $scope.noAvailableThing = true;
        } else {
          $scope.noAvailableThing = false;
        }
      });
  };
  $scope.getChooseGroup();
  $scope.removeThingAdd = function (things) {
    var index = thingsIdArr.indexOf(things);
    thingsIdArr.splice(index, 1);
    $scope.getthingsavailable.push(things);
  };
  $scope.chooseThing = function (thing) {
    var index = $scope.getthingsavailable.indexOf(thing);
    $scope.getthingsavailable.splice(index, 1);
    thingsIdArr.push(thing);
    for (var i = 0; i < thingsIdArr.length; i++) {
      $scope.thingselect = thingsIdArr;
    }
  };
  $scope.DoneAddThingToGroup = function () {
    $scope.doneThingArr = [];
    for (var i = 0; i < $scope.thingselect.length; i ++) {
      $scope.doneThingArr.push($scope.thingselect[i]._id);
    }
    $http.post('/api/things/group/add',
      {
        thingsId: $scope.doneThingArr,
        groupId: groupId
      })
      .then(
      function (result) {
        location.reload();
      },
      function (result) {
        // console.log('ERROR Add Things to Group');
        // console.log(result);
      });
  };
  $scope.cancelChooseThings = function () {
    $uibModalInstance.dismiss('cancelChooseThings');
  };
});

angular.module('groups').controller('EditGroupDetailModalInstanceCtrl', function ($state, $window, $http, $scope, $uibModalInstance) {

  $scope.group = JSON.parse($window.sessionStorage.getItem('group'));
  $scope.editGroupName = $scope.group.groupName;
  $scope.editGroupDes = $scope.group.groupDesc;
  $scope.saveGroup = function () {

    var retVal = $window.confirm('Do you want to Change This Group?');
    if (retVal === true) {
      $http.post('/api/groups/' + $scope.group._id + '/update',
        {
          groupName: $scope.editGroupName,
          groupDesc: $scope.editGroupDes
        })
        .then(
        function (result) {
          // console.log(result);
          // console.log('saveGroup');
          $uibModalInstance.close();
          // $state.go($state.current, {}, { reload: true });
          location.reload();
        },
        function (result) {
          // console.log('ERROR Update Group');
          // console.log(result);
        });
    } else {
      // console.log('cancel');
    }
    // console.log('saveGroup');
    $uibModalInstance.close();
    location.reload();
    // $state.go($state.current, {}, { reload: true });
  };

  $scope.cancelSaveGroup = function () {
    $uibModalInstance.dismiss('cancelSaveGroup');
  };
});
