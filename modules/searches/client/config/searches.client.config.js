(function () {
  'use strict';

  angular
    .module('searches')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'Searches',
    //   state: 'searches',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'searches', {
    //   title: 'List Searches',
    //   state: 'searches.list'
    // });

    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'searches', {
    //   title: 'Create Search',
    //   state: 'searches.create',
    //   roles: ['user']
    // });
  }
}());
