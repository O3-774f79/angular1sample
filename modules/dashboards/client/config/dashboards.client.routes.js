(function () {
  'use strict';

  angular
    .module('dashboards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboards', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('dashboards.first', {
        url: '/first-dashboard',
        templateUrl: '/modules/dashboards/client/views/first-dashboards.client.view.html',
        controller: 'DashboardsFirstController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'First Dashboard'
        }
      })
      .state('dashboards.dnm', {
        url: '/dashboards:id',
        templateUrl: '/modules/dashboards/client/views/dnm-dashboards.client.view.html',
        controller: 'DashboardsDnmController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dashboard'
        }
      })
      .state('dashboards.index', {
        url: '/Dashboards',
        templateUrl: '/modules/dashboards/client/views/index-dashboards.client.view.html',
        controller: 'DashboardsIndexController',
        controllerAs: 'vm'
      })
      .state('dashboards.create', {
        url: '/CreateDashboards',
        templateUrl: '/modules/dashboards/client/views/create-dashboards.client.view.html',
        controller: 'DashboardsCreateController',
        controllerAs: 'vm'
      })
      .state('dashboards.edit', {
        url: '/EditWidget',
        templateUrl: '/modules/dashboards/client/views/edit-dashboards.client.view.html',
        controller: 'DashboardsEditController',
        controllerAs: 'vm'
      })
      .state('dashboards.tutorial', {
        url: '/tutorial-dashboards:id',
        templateUrl: '/modules/dashboards/client/views/tutorial-dashboards.client.view.html',
        controller: 'DashboardsTutorialController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dashboard Tutorial'
        }
      })
      .state('dashboards.test', {
        url: '/TestWidget',
        templateUrl: '/modules/dashboards/client/views/test-dashboards.client.view.html',
        controller: 'DashboardsTestController',
        controllerAs: 'vm'
      });
  }

  getDashboard.$inject = ['$stateParams', 'DashboardsService'];

  function getDashboard($stateParams, DashboardsService) {
    return DashboardsService.get({
      dashboardId: $stateParams.dashboardId
    }).$promise;
  }

  newDashboard.$inject = ['DashboardsService'];

  function newDashboard(DashboardsService) {
    return new DashboardsService();
  }
}());
