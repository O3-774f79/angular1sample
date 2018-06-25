(function () {
  'use strict';

  angular
    .module('groups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Groups',
      state: 'groups.index',
      // type: 'dropdown',
      roles: ['*'],
      position: 2
    });

    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'groups', {
    //   title: 'List Groups',
    //   state: 'groups.list'
    // });

    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'groups', {
    //   title: 'Create Group',
    //   state: 'groups.create',
    //   roles: ['user']
    // });
  }
}());
