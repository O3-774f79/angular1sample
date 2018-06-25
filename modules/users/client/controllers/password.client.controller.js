(function () {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$document', '$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'Notification'];

  function PasswordController($document, $scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, Notification) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    var queryResult = $document[0].getElementById('navbar-top');
    var wrappedQueryResult = angular.element(queryResult);
    // console.log('PasswordController');
    // If user is signed in then redirect back home
    // if (vm.authentication.user) {
    //   $location.path('/');
    // }
    if (!vm.authentication.user) {
      // hidden nav top
      document.getElementById('main').classList.remove('section-wrapper');
      document.getElementById('topbar').style.display = 'none';
      wrappedQueryResult.css('display', 'none');
    } else {
      document.getElementById('main').classList.add('section-wrapper');
      wrappedQueryResult.css('display', 'block');
    }
    // Submit forgotten password account id
    function askForPasswordReset(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }

      UsersService.requestPasswordReset(vm.credentials)
        .then(onRequestPasswordResetSuccess)
        .catch(onRequestPasswordResetError);
    }

    // Change user password
    function resetUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

    // Password Reset Callbacks

    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      if (response.user === false) {
        Notification.error({ message: response.message, title: '<i class="ic-close"></i> Username not found!' });
      } else if (response.user === 'local') {
        Notification.error({ message: response.message, title: '<i class="ic-close"></i> User Provider !' });
      } else {
        // console.log(response);
        vm.credentials = null;
        Notification.success({ message: response.message, title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!' });
      }
    }

    function onRequestPasswordResetError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Failed to send password reset email!', delay: 4000 });
    }

    function onResetPasswordSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password reset successful!' });
      // And redirect to the index page
      window.location.href = '/password/reset/success';
      // window.location.path('/password/reset/success');
    }

    function onResetPasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Password reset failed!', delay: 4000 });
    }
  }
}());
