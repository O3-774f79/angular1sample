(function () {
  'use strict';

  angular
    .module('userguides')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userguides', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('userguides.platform', {
        url: '/userguide-platform',
        templateUrl: 'modules/userguides/client/views/userguide-platform.client.view.html',
        controller: 'UserguidesController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userguide Create Things'
        }
      })
      .state('userguides.overview', {
        url: '/overview',
        templateUrl: 'modules/userguides/client/views/overview.client.view.html',
        controller: 'OverviewController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Overview'
        }
      })
      .state('userguides.faqs', {
        url: '/faqs',
        templateUrl: 'modules/userguides/client/views/faqs.client.view.html',
        controller: 'FaqsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'FAQs'
        }
      })
      .state('userguides.contact', {
        url: '/contact',
        templateUrl: 'modules/userguides/client/views/contact.client.view.html',
        controller: 'ContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contact'
        }
      });
  }

  getUserguide.$inject = ['$stateParams', 'UserguidesService'];

  function getUserguide($stateParams, UserguidesService) {
    return UserguidesService.get({
      userguideId: $stateParams.userguideId
    }).$promise;
  }

  newUserguide.$inject = ['UserguidesService'];

  function newUserguide(UserguidesService) {
    return new UserguidesService();
  }
}());
