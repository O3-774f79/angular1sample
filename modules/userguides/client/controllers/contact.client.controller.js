(function () {
  'use strict';

  angular
      .module('userguides')
      .controller('ContactController', ContactController);

  ContactController.$inject = ['Notification', '$http', '$window', '$interval', '$scope', '$state', 'Authentication'];

  function ContactController(Notification, $http, $window, $interval, $scope, $state, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    $scope.data = {};
    if (!vm.authentication.user) {
      $state.go('authentication.signin');
    } else {
      if (document.getElementById('topbar') !== null) {
        document.getElementById('topbar').style.display = 'block';
      }
      $scope.data.email = vm.user.email;
      vm.contactForm = function() {
        $http.post('/api/userguides/contact',
          {
            email: $scope.data.email,
            subject: $scope.data.subject,
            message: $scope.data.message
          })
          .then(
            function (result) {
              Notification.success({ message: result.data.message, title: '<i class="glyphicon glyphicon-ok"></i> ได้รับอีเมลแล้ว!' });
              // console.log(result);
            },
            function (err) {
              console.log(err);
            });
      };
    }

  }
}());

