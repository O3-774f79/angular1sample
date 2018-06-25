(function () {
  'use strict';

  angular
    .module('histories')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Histories',
      state: 'histories.index',
      roles: ['*']
    });

  }
}());
