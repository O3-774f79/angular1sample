(function () {
  'use strict';

  angular
    .module('histories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('histories', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('histories.index', {
        url: '/histories',
        templateUrl: '/modules/histories/client/views/index-histories.client.view.html',
        controller: 'HistoriesController',
        controllerAs: 'vm'
      })
      .state('histories.test', {
        url: '/historiestest',
        templateUrl: '/modules/histories/client/views/test-histories.client.view.html',
        controller: 'HistoriesTestController',
        controllerAs: 'vm'
      });
  }

  getHistory.$inject = ['$stateParams', 'HistoriesService'];

  function getHistory($stateParams, HistoriesService) {
    return HistoriesService.get({
      historyId: $stateParams.historyId
    }).$promise;
  }

  newHistory.$inject = ['HistoriesService'];

  function newHistory(HistoriesService) {
    return new HistoriesService();
  }
}());
