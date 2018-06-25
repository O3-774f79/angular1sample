(function () {
  'use strict';

  // Things controller
  angular
    .module('groups')
    .controller('GroupsViewController', GroupsViewController);

  GroupsViewController.$inject = ['$http', '$scope', '$state', '$window', 'Authentication'];

  function GroupsViewController ($http, $scope, $state, $window, Authentication) {
    var vm = this;

    var selectedGroup = JSON.parse($window.sessionStorage.getItem('selectedGroup'));

    vm.authentication = Authentication;
    // console.log('GroupsViewController');

    $scope.groupName = selectedGroup.groupName;

  }
}());
