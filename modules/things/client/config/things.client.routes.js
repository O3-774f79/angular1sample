(function () {
  'use strict';

  angular
    .module('things')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('things', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('things.create', {
        url: '/things-create',
        templateUrl: 'modules/things/client/views/create-things.client.view.html',
        controller: 'ThingsCreateController',
        controllerAs: 'vm'
      })
      .state('things.edit', {
        url: '/things-edit',
        templateUrl: 'modules/things/client/views/edit-things.client.view.html',
        controller: 'ThingsEditController',
        controllerAs: 'vm'
      })
      .state('things.tutorial', {
        url: '/things-tutorial',
        templateUrl: 'modules/things/client/views/tutorial-things.client.view.html',
        controller: 'ThingsTutorialController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Things Tutorial'
        }
      })
      .state('things.index', {
        url: '/things',
        templateUrl: 'modules/things/client/views/index-things.client.view.html',
        controller: 'ThingsIndexController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Things'
        }
      })
      .state('things.detail', {
        url: '/things-detail:id',
        templateUrl: 'modules/things/client/views/detail-things.client.view.html',
        controller: 'ThingsDetailController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Things Detail'
        }
      })
      .state('things.conf', {
        url: '/config',
        templateUrl: 'modules/things/client/views/config-things.client.view.html',
        controller: 'ThingsConfigController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Config'
        }
      });
  }

  getThing.$inject = ['$stateParams', 'ThingsService'];

  function getThing($stateParams, ThingsService) {
    return ThingsService.get({
      thingId: $stateParams.thingId
    }).$promise;
  }

  newThing.$inject = ['ThingsService'];

  function newThing(ThingsService) {
    return new ThingsService();
  }
}());
