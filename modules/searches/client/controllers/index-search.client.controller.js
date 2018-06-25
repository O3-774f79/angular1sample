(function () {
  'use strict';

  angular
    .module('searches')
    .directive('myEnter', function () {
      return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
          if (event.which === 13) {
            scope.$apply(function () {
              scope.$eval(attrs.myEnter);
            });

            event.preventDefault();
          }
        });
      };
    })
    .controller('SearchIndexController', SearchIndexController);

  SearchIndexController.$inject = ['$http', '$state', '$scope', 'Authentication'];

  function SearchIndexController($http, $state, $scope, Authentication) {
    var vm = this;
    $scope.groups = [];
    $scope.amounts = [];
    $scope.groupthings = [];
    vm.authentication = Authentication;
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
    }
  }
}());
