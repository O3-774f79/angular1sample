// Groups service used to communicate Groups REST endpoints
(function () {
  'use strict';

  angular
    .module('groups')
    .factory('GroupsService', GroupsService);

  GroupsService.$inject = ['$resource'];

  function GroupsService($resource) {
    return $resource('api/groups/:groupId', {
      groupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
