(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
     .state('test', {
       abstract: true,
       url: '/settings',
       templateUrl: '/modules/users/client/views/test.client.view.html',
       controllerAs: 'vm',
       data: {
         pageTitle: 'Settings'
       }

     })
     .state('mylab', {
       url: '/mylab/signin?&username&apisecret',
       templateUrl: '/modules/users/client/views/mylab.client.view.html',
       controllerAs: 'vm',
       controller: 'MylabController'
     })
     .state('mylab-document', {
       url: '/mylab/signin-document?&username&apisecret',
       templateUrl: '/modules/users/client/views/mylab.client.view.html',
       controllerAs: 'vm',
       controller: 'MylabDocumentController'
     })
      // .state('settings', {
      //   abstract: true,
      //   url: '',
      //   templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
      //   controller: 'SettingsController',
      //   controllerAs: 'vm',
      //   data: {
      //     roles: ['user', 'admin']
      //   }
      // })
      // .state('settings.profile', {
      //   url: '/profile',
      //   templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
      //   controller: 'EditProfileController',
      //   controllerAs: 'vm',
      //   data: {
      //     pageTitle: 'Settings'
      //   }
      // })
      .state('exit-email', {
        url: '/exit-email:err',
        templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('buffer', {
        url: '/buffer:accToken',
        templateUrl: '/modules/users/client/views/authentication/buffer.client.view.html',
        controller: 'BufferController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Buffer'
        }
      })
      .state('profile', {
        url: '/profile',
        templateUrl: '/modules/users/client/views/myprofile.client.view.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
        controller: 'SocialAccountsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      // .state('password.reset', {
      //   url: '/reset/:token',
      //   templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
      //   controller: 'PasswordController',
      //   controllerAs: 'vm',
      //   data: {
      //     pageTitle: 'Password Reset'
      //   }
      // });
      // .state('password.reset', {
      //   abstract: true,
      //   url: '/reset',
      //   controller: 'PasswordController',
      //   template: '<ui-view/>'
      // })
      .state('password.reset.invalid', {
        url: 'reset/invalid',
        templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/reset/success',
        templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset', {
        url: '/reset:token',
        templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      });
  }
}());
