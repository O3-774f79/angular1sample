(function () {
  'use strict';

  // Things controller
  angular
    .module('groups')
    .controller('GroupsCreateController', GroupsCreateController);

  GroupsCreateController.$inject = ['$http', '$scope', '$state', '$window', 'Authentication'];

  function GroupsCreateController($http, $scope, $state, $window, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    // console.log('GroupsCreateController');

    $scope.createGroup = function () {

      $http.post('/api/groups', {
        groupName: $scope.groupname,
        groupDesc: $scope.groupdesc
      }).then(function (result) {
        // console.log(result);
        $state.go('groups.index');
      }, function (result) {
        // console.log('ERROR Create Group');
        // console.log(result);
      });

    };

  }
}());
