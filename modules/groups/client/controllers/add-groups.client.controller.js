
(function () {
  'use strict';

  // Things controller
  angular
    .module('groups')
    .controller('GroupsAddController', GroupsAddController);

  GroupsAddController.$inject = ['$http', '$scope', '$state', '$window', 'Authentication'];

  function GroupsAddController($http, $scope, $state, $window, Authentication) {
    var vm = this;

    var selectedGroup = JSON.parse($window.sessionStorage.getItem('selectedGroup'));

    vm.authentication = Authentication;
    // console.log('GroupsAddController');

    $scope.groupName = selectedGroup.groupName;
    $scope.thingsobj = [];

    $http.get('/api/things/list/')
      .then(function (response) {
        $scope.thingsobj = response.data.message;
        // console.log($scope.thingsobj);
      });

    $scope.addSelectedThingToGroup = function () {
      // var selectedThings = $scope.thingsobj.filter(thing => thing.selected);
      var selectedThings = _.filter($scope.thingsobj, function (thing) { return thing.selected; });
      if (selectedThings.length === 0) {
        return;
      }

      // var selectedName = selectedThings.map(thing => thing.thingName).join(',');
      var selectedName = _.map(selectedThings, function (thing) { return thing.thingName; }).join(',');
      // _.map([1, 2, 3], function(num){ return num * 3; });
      if ($window.confirm('แน่ใจว่าจะเพิ่ม ' + selectedName + ' ลง Group ' + $scope.groupName)) {
        // var selectedId = selectedThings.map(thing => thing._id);
        var selectedId = _.map(selectedThings, function (thing) { return thing._id; });
        // // console.log(selectedGroup._id);
        // // console.log(selectedId);
        $http.post('/api/things/group/add',
          {
            thingId: selectedId,
            groupid: selectedGroup._id
          })
          .then(
          function (result) {
            // console.log(result);
            $state.go('groups.view');
          },
          function (result) {
            // console.log('ERROR Add Group');
            // console.log(result);
          });
      }
    };
  }
}());
