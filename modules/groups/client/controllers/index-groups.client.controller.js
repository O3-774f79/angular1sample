(function () {
  'use strict';

  angular
    .module('groups')
    .controller('GroupsIndexController', GroupsIndexController);

  GroupsIndexController.$inject = ['$uibModal', '$document', '$log', '$http', '$scope', '$state', '$window', 'Authentication', '$location'];

  function GroupsIndexController($uibModal, $document, $log, $http, $scope, $state, $window, Authentication, $location) {
    var vm = this;
    $scope.groups = [];
    $scope.amounts = [];
    $scope.groupthings = [];
    vm.authentication = Authentication;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      // Start Sort
      $scope.sort = 'GroupName A - Z';
      $scope.xOrderBy = 'groupName';
      $scope.sortData = function (sortby) {
        if (sortby === 'groupNameaz') {
          $scope.xOrderBy = 'groupName';
          $scope.sort = 'GroupName A - Z';
        } else if (sortby === 'groupNameza') {
          $scope.xOrderBy = '-groupName';
          $scope.sort = 'GroupName Z - A';
        } else if (sortby === 'amountless') {
          $scope.xOrderBy = 'things.length';
          $scope.sort = 'Amount Thing - less';
        } else if (sortby === 'amountmore') {
          $scope.xOrderBy = '-things.length';
          $scope.sort = 'Amount Thing - more';
        } else { console.log('Sort thing Wrong : ' + sortby); }
      };
      // End Sort
      var code = $location.search().code;
      var userId = $location.search().state;
      // // console.log('code : ', code);
      // // console.log('userId : ', userId);

      // Start Create Group Modal
      $scope.animationsEnabled = true;
      $scope.openCreateGroup = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'createGroupModalContent.html',
          controller: 'CreateGroupModalInstanceCtrl',
          size: size,
          appendTo: parentElem
        });
        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      $scope.openComponentModal = function () {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          component: 'modalComponent'
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('modal-component dismissed at: ' + new Date());
        });
      };
      // End Create Group Modal
      // Start Edit Group Function

      $scope.GroupEdit = function (group) {
        $window.sessionStorage.setItem('group', JSON.stringify(group));
        $scope.openEdit();
      };
      $scope.openEdit = function (size, parentSelector) {
        var parentElem = parentSelector;
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'editGroupModalContent.html',
          controller: 'EditGroupModalInstanceCtrl',
          size: size,
          appendTo: parentElem
        });
      };
      // End Edit Group Function

      if (code !== undefined) {
        $http.post('/api/user/update/line',
          {
            lineCode: code
          })
          .then(function (response) {
            if (response.success === true) {
              // console.log('update success');
            } else {
              // console.log('update unsuccess');
            }
          })
          .catch(function (err) {

          });
      }

      $http.get('/api/groupsWithThings')
        .then(function (response) {
          $scope.groups = response.data;
          // // console.log(response);
        });

      $scope.testCreate = function () {
        $http.post('/api/dashboards/add', {
          // Params
        }).then(function (result) {
          // console.log(result);
          $window.alert(result);
        }, function (result) {
          // console.log('ERROR Create Group');
          // console.log(result);
          $window.alert(result);
        });
      };

      $scope.ViewGroup = function (groupId) {
        // var selectedGroup = $scope.groups.filter(group => group._id === groupId)[0];
        var selectedGroup = _.filter($scope.groups, function (group) { return group._id === groupId; })[0];
        $window.sessionStorage.setItem('selectedGroup', JSON.stringify(selectedGroup));
        $state.go('groups.view');
      };

      $scope.GroupDelete = function (group) {

        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'deleteGroup.html',
          controller: 'deleteGroupModal',
          resolve: {
            group: function() {
              return group;
            }
          }
        });
      };

    }
  }
}());
angular.module('groups').controller('CreateGroupModalInstanceCtrl', function ($http, $state, $scope, $uibModalInstance, Authentication) {
  $scope.createpermission = 'Public';
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

  $scope.CreatGroup = function () {

    $http.post('/api/groups', {
      groupName: $scope.createGroupName,
      groupDesc: $scope.createGroupDes
    }).then(function (result) {
      $uibModalInstance.close();
      // $state.go($state.current, {}, { reload: true });
      location.reload();
      // console.log(result);
    }, function (result) {
      // console.log('ERROR Create Group');
      // console.log(result);
    });

  };

  $scope.cancelCreatGroup = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('groups').controller('EditGroupModalInstanceCtrl', function ($state, $window, $http, $scope, $uibModalInstance) {

  $scope.group = JSON.parse($window.sessionStorage.getItem('group'));
  // // console.log(group);
  // $http.get('/api/groups/' + groupId)
  //       .then(function (response) {
  //         var data = response.data;
  //         // console.log(response);
  //         $scope.editGroupName = data.groupName;
  //         $scope.editGroupDes = data.groupDesc;
  //       });
  $scope.editGroupName = $scope.group.groupName;
  $scope.editGroupDes = $scope.group.groupDesc;
  $scope.saveGroup = function () {

    var retVal = $window.confirm('Do you want to Change This Group?');
    if (retVal === true) {
      // console.log('groupId : ' + $scope.group._id);
      // console.log('SAVE BTN CLICK');
      $http.post('/api/groups/' + $scope.group._id + '/update',
        {
          groupName: $scope.editGroupName,
          groupDesc: $scope.editGroupDes
        })
        .then(
        function (result) {
          // console.log(result);
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
    $state.go($state.current, {}, { reload: true });
  };

  $scope.cancelSaveGroup = function () {
    $uibModalInstance.dismiss('cancelSaveGroup');
  };
});

angular.module('groups').controller('deleteGroupModal', function(group, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
  // console.log(group);
  $scope.nameOfGroup = group.groupName;
  $scope.confirmDeleteGroup = function() {
    $http.post('/api/groups/' + group._id + '/delete', {})
    .then(
    function (result) {
      // console.log(result);
      location.reload();
    },
    function (result) {
      // console.log('ERROR DELETE groupID');
      // console.log(result);
    });

  };
  $scope.cancelConfirmDeleteGroup = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

