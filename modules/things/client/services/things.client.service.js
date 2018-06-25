// Things service used to communicate Things REST endpoints
(function () {
  'use strict';

  angular
    .module('things')
    .factory('ThingsService', ThingsService);

  ThingsService.$inject = ['$resource'];

  function ThingsService($resource) {
    return $resource('api/things/:thingId', {
      thingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
