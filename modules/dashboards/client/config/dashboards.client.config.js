(function () {
  'use strict';

  angular
    .module('dashboards')
    .run(menuConfig);
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Dashboard',
      state: 'dashboards.index',
      // type: 'dropdown',
      roles: ['*']
    });
  }
}());
