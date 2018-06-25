(function () {
  'use strict';

  angular
    .module('searches')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('search', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
       .state('search.index', {
         url: '/search:searchkey',
         templateUrl: 'modules/searches/client/views/index-search.client.view.html',
         controller: 'SearchIndexController',
         controllerAs: 'vm',
         params: {
           obj: null
         }
       });
  }

  getSearch.$inject = ['$stateParams', 'SearchesService'];

  function getSearch($stateParams, SearchesService) {
    return SearchesService.get({
      searchId: $stateParams.searchId
    }).$promise;
  }

  newSearch.$inject = ['SearchesService'];

  function newSearch(SearchesService) {
    return new SearchesService();
  }
}());
