(function () {
  'use strict';

  angular
    .module('things')
    .run(menuConfig);
  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Things',
      state: 'things.index',
      // type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'things', {
    //   title: 'Group Overview',
    //   state: 'things.group'
    // });

    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'things', {
    //   title: 'Things List',
    //   state: 'things.list'
    // });
  }
}());
