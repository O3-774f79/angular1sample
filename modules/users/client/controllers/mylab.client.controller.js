(function () {
  'use strict';

  angular
      .module('users')
      .controller('MylabController', MylabController);

  MylabController.$inject = ['$document', '$scope', '$stateParams', 'UsersService', '$location', 'Authentication'];

  function MylabController($document, $scope, $stateParams, UsersService, $location, Authentication) {
    var vm = this;
    var queryResult = $document[0].getElementById('navbar-top');
    var wrappedQueryResult = angular.element(queryResult);
    var username = $stateParams.username;
    var apisecret = $stateParams.apisecret;
    vm.authentication = Authentication;
    var credentials = {};
    credentials.usernameOrEmail = username;
    credentials.password = apisecret;
    UsersService.mylabAuth(credentials)
    .then(onUserSigninSuccess)
    .catch(onUserSigninError);
    function onUserSigninSuccess(response) {
    // display nav top
      wrappedQueryResult.css('display', 'block');
      vm.authentication.user = response;
      localStorage.setItem('accToken', response.token);
      window.location.href = '/things';
    }

    function onUserSigninError(response) {
      console.log(response);
    //   Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Signin Error!', delay: 6000 });
    }
  }
}());

