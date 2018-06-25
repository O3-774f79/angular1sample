// Userguides service used to communicate Userguides REST endpoints
(function () {
  'use strict';

  angular
    .module('userguides')
    .factory('UserguidesService', UserguidesService);

  UserguidesService.$inject = ['$resource'];

  function UserguidesService($resource) {
    return $resource('api/userguides/:userguideId', {
      userguideId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
