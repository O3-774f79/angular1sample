(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$state', 'PasswordValidator', '$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification', 'Upload', '$timeout'];

  function EditProfileController($state, PasswordValidator, $scope, $http, $location, UsersService, Authentication, Notification, Upload, $timeout) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;
    if (document.getElementById('topbar') !== null) {
      document.getElementById('topbar').style.display = 'block';
    }
    vm.upload = function (dataUrl) {
      loadImage.parseMetaData(dataUrl, function(data) { // eslint-disable-line
        if (data.exif) {
          console.log('data.exif');
          var options = {};
          options.orientation = data.exif.get('Orientation');
          options.maxWidth = 600;
          loadImage(dataUrl, function (img) {// eslint-disable-line
            if (img.tagName === 'IMG') {
              console.log('if');
              var canvas = document.createElement('canvas');
              var context = canvas.getContext('2d');
              context.drawImage(img, 0, 0);
              var dataurl = canvas.toDataURL();
              // var dataUris = img;
              // dataUris = dataUris.toDataURL();
              var blobs = dataURItoBlob(dataurl);
              var myfiles = blobToFile(blobs, 'image.png');
              $scope.upImg(myfiles);
              // vm.upload(myfiles);
            } else {
              console.log('else');
              var dataUri = img.toDataURL();
              var blob = dataURItoBlob(dataUri);
              var myfile = blobToFile(blob, 'image.png');
              $scope.upImg(myfile);
            }
          }, options);
        } else {
          console.log('else upImg');
          $scope.upImg(dataUrl);
        }
      });
    };
    $scope.upImg = function(img) {
      Upload.upload({
        url: '/api/users/picture',
        data: {
          newProfilePicture: img
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };
    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var arrayBuffer = new ArrayBuffer(byteString.length); // eslint-disable-line
      var _ia = new Uint8Array(arrayBuffer); // eslint-disable-line
      for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
      }

      var dataView = new DataView(arrayBuffer); // eslint-disable-line
      var blob = new Blob([dataView], { type: mimeString });
      return blob;
    }
    function blobToFile(theBlob, fileName) {
      // A Blob() is almost a File() - it's just missing the two properties below which we will add
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture' });

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }
    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      console.log(response);
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="ic-close"></i> Failed to change profile picture' });
    }
    // Update a user profile
    function updateUserProfile(isValid) {
      // console.log('updateUserProfile');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        console.log(isValid);
        return false;
      }

      var user = new UsersService(vm.user);
      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Authentication.user = response;
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Edit profile failed!' });
      });
    }

    vm.user = Authentication.user;
    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

        return false;
      }

      UsersService.changePassword(vm.passwordDetails)
            .then(onChangePasswordSuccess)
            .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
          // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Changed Successfully' });
      vm.passwordDetails = null;
      // $state.go($state.current, {}, { reload: true });
      location.reload();
    }

    function onChangePasswordError(response) {

      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

      //   return false;
      // }

      Notification.error({ message: response.data.message, title: '<i class="ic-close"></i> Password change failed!' });
    }
  }
}());
