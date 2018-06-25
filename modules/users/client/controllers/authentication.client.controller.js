(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController)
    .value('hashAccToken', '9574588FF273325CE16BCB4917E34')
    .factory('userToken', userToken);
  userToken.$inject = ['$window'];

  function userToken() {
    const data = {
      accToken: ''
    };
    console.log(data);
    return {
      getAccToken: function () {
        console.log(data);
        return data.accToken;
      },
      setAccToken: function (accToken) {
        data.accToken = accToken;
        console.log(data);
      }
    };
  }
  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification', '$document', '$http', '$rootScope'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification, $document, $http, $rootScope) {
    // get dom nav top
    var queryResult = $document[0].getElementById('navbar-top');
    var wrappedQueryResult = angular.element(queryResult);
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    if (!vm.authentication.user) {
      // hidden nav top
      document.getElementById('main').classList.remove('section-wrapper');
      document.getElementById('topbar').style.display = 'none';
      wrappedQueryResult.css('display', 'none');
    } else {
      document.getElementById('main').classList.add('section-wrapper');
      wrappedQueryResult.css('display', 'block');
    }

    // var mb = document.getElementById('warp-signin-mobile');
    // var lg = document.getElementById('warp-signin-lg');
    // if (lg || mb) {
    //   if (screen.width >= 1239) {
    //     mb.parentNode.removeChild(mb);
    //   } else if (screen.width <= 1239) {
    //     lg.parentNode.removeChild(lg);
    //   }
    // }

    // Get an eventual error defined in the URL query string:
    // if ($location.search().err) {
    //   Notification.error({ message: $location.search().err });
    // }
    var currentLocation = window.location.href;
    var err = currentLocation.substring(currentLocation.search('/exit-email') + 12);
    if (err === 'Email%20already%20exists') {
      Notification.error({ message: 'Email Already Exits' });
    }
    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        return false;
      }
      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }
      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      localStorage.setItem('accToken', response.token);
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
      // And redirect to the previous or home page
      $state.go($state.previous.state.name || 'home', $state.previous.params);
      $state.go('home', $state.previous.params);
      window.location.href = '/things';
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      // display nav top
      wrappedQueryResult.css('display', 'block');
      // If successful we assign the response to the global user model

      vm.authentication.user = response;
      // var encryptedData = CryptoJS.AES.encrypt(angular.toJson(value), secretKey).toString();
      localStorage.setItem('accToken', response.token);
      // accToken.value = JSON.stringify(response.token);
      // console.log(accToken.value);
      // userToken.setAccToken(response.token);
      // console.log(userToken);
      // And redirect to the previous or home page
      // $state.go($state.previous.state.name || 'home', $state.previous.params);
      // $state.go('home', $state.previous.params);
      window.location.href = '/things';
    }

    function onUserSigninError(response) {
      console.log(response);
      Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Signin Error!', delay: 6000 });
    }
  }
}());
