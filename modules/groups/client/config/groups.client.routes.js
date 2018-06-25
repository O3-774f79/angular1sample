(function () {
  'use strict';

  angular
    .module('groups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('groups', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('groups.index', {
        url: '/groups',
        templateUrl: 'modules/groups/client/views/index-group.client.view.html',
        controller: 'GroupsIndexController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groups'
        }
      })
      .state('groups.detail', {
        url: '/groups-detail:id',
        templateUrl: 'modules/groups/client/views/detail-group.client.view.html',
        controller: 'GroupsDetailController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groups Detail'
        }
      })
      .state('groups.create', {
        url: '/groups-create',
        templateUrl: 'modules/groups/client/views/create-group.client.view.html',
        controller: 'GroupsCreateController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groups Create'
        }
      })
      .state('groups.view', {
        url: '/groups-view',
        templateUrl: 'modules/groups/client/views/view-group.client.view.html',
        controller: 'GroupsViewController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groups View'
        }
      })
      .state('groups.add', {
        url: '/groups-add',
        templateUrl: 'modules/groups/client/views/add-group.client.view.html',
        controller: 'GroupsAddController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groups Add'
        }
      });
  }

  getGroup.$inject = ['$stateParams', 'GroupsService'];

  function getGroup($stateParams, GroupsService) {
    return GroupsService.get({
      groupId: $stateParams.groupId
    }).$promise;
  }

  newGroup.$inject = ['GroupsService'];

  function newGroup(GroupsService) {
    return new GroupsService();
  }
}());
