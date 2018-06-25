// /* global someFunction qrcode:true*/

// (function () {
//   'use strict';

//     // Things controller
//   angular
//       .module('things')
//       .controller('ThingsTutorialController', ThingsTutorialController);

//   ThingsTutorialController.$inject = ['$interval', '$uibModal', '$document', '$log', '$http', '$stateParams', '$scope', '$state', '$window', 'Authentication'];

//   function ThingsTutorialController($interval, $uibModal, $document, $log, $http, $stateParams, $scope, $state, $window, Authentication) {
//     var vm = this;
//     var reqThingsData = [];
//     $scope.thingsobj = [];
//     $scope.tmpListData = [];
//     var refreshTime = 10000;
//     vm.authentication = Authentication;
//     if (!vm.authentication.user) {
//       $state.go('authentication.signin');
//     } else {
//       // console.log('ThingsTutorialController');
//       if (!vm.authentication.user.newUser) {
//         window.location.href = '/things';
//       } else {
//         $http.get('/api/things/list/')
//         .then(function (response) {
//           if (response.data.message.length > 0) {
//             // console.log('Go DBBBB');
//             $scope.startDbTutorial();
//           } else {
//             // $scope.$on('$viewContentLoaded', function() {
//             //   // console.log('startTutorial');
//             $scope.startTutorial();
//             // });
//           }
//         }).catch(function(err) {
//           // console.log(err);
//         });

//         $scope.startTutorial = function () {
//           // console.log('startTutorial startTutorial');
//           var modalInstance = $uibModal.open({
//             animation: $scope.animationsEnabled,
//             templateUrl: 'StartTutorial.html',
//             controller: 'StartTutorial'
//           });
//         };

//         $scope.startDbTutorial = function () {
//           // console.log('start DB Tutorial');
//           var modalInstance = $uibModal.open({
//             animation: $scope.animationsEnabled,
//             templateUrl: 'StartDbTutorial.html',
//             controller: 'StartDbTutorial',
//             backdrop: 'static'
//           });
//         };

//         $scope.openCreateThingsTu = function (size, parentSelector) {
//         //   $uibModalInstance.dismiss('cancel');
//           var parentElem = parentSelector;
//           angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
//           var modalInstance = $uibModal.open({
//             animation: $scope.animationsEnabled,
//             ariaLabelledBy: 'modal-title',
//             ariaDescribedBy: 'modal-body',
//             templateUrl: 'createModalContentTutor.html',
//             controller: 'CreateModalInstanceCtrlTutor',
//             size: size,
//             appendTo: parentElem
//           });
//         };
//         $scope.$on('$destroy', function() {
//           $interval.cancel($scope.interval);
//         });
//         // Start Sort
//         $scope.sort = 'ThingName A - Z';
//         $scope.xOrderBy = 'thingName';
//         $scope.sortData = function (sortby) {
//           if (sortby === 'thingNameaz') {
//             $scope.xOrderBy = 'thingsName';
//             $scope.sort = 'ThingName A - Z';
//           } else if (sortby === 'thingNameza') {
//             $scope.xOrderBy = '-thingsName';
//             $scope.sort = 'ThingName Z - A';
//           } else if (sortby === 'datecreateaz') {
//             $scope.xOrderBy = '-created';
//             $scope.sort = 'DateCreate - Newest';
//           } else if (sortby === 'datecreateza') {
//             $scope.xOrderBy = 'created';
//             $scope.sort = 'DateCreate - The oldest';
//           } else { console.log('Sort thing Wrong : ' + sortby); }
//         };
//         // End Sort
//         $scope.animationsEnabled = true;
//         $http.get('/api/things/list/')
//           .then(function (response) {
//             if (response.data.message.length === 0) {
//               $scope.firstThingShow = true;
//             } else {
//               // console.log(response);
//               $scope.firstThingShow = false;
//             }
//             $scope.thingsobj = response.data.message;
//             $scope.amountStatus = 0;
//             for (var i = 0; i < $scope.thingsobj.length; i++) {
//               var sendToken = $scope.thingsobj[i].sendToken;
//               // // console.log(sendToken);
//               reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendToken));
//             } // end for
//             Promise.all(reqThingsData)
//             .then(function(results) {
//               $scope.thingsstatus = results;
//               // // console.log(results);
//               for (var i = 0; i < results.length; i++) {
//                 $scope.tmpListData[i] = results[i].data.status;

//                 if (results[i].data.status === true) {
//                   $scope.amountStatus++;
//                 } else {
//                   // // console.log('null');
//                 }
//               }
//               $scope.arrayG = [$scope.thingsobj, $scope.tmpListData];
//               $scope.$apply();
//               $scope.interval = $interval($scope.updateThings, refreshTime, 0, false);
//             }).catch(function(err) {
//               // console.log(err);
//             });
//           });
//         $scope.updateThings = function() {
//           $scope.amountStatus = 0;
//           var reqThingsData = [];
//           for (var i = 0; i < $scope.thingsobj.length; i++) {
//             var sendToken = $scope.thingsobj[i].sendToken;
//             reqThingsData.push($http.get('/api/things/pullWithStatus/' + sendToken));
//           } // end
//           Promise.all(reqThingsData)
//               .then(function(results) {
//                 $scope.thingsstatus = results;
//                 for (var i = 0; i < results.length; i++) {
//                   $scope.tmpListData[i] = results[i].data.status;
//                   if (results[i].data.status === true) {
//                     $scope.amountStatus++;
//                   } else {
//                     // // console.log('null');
//                   }
//                 }
//                 $scope.arrayG = [$scope.thingsobj, $scope.tmpListData];
//                 $scope.$apply();
//               }).catch(function(err) {
//                 // console.log(err);
//               });
//         };
//         // Start Edit Thing Function
//         $scope.ThingsEdit = function (thingData) {
//           $window.sessionStorage.setItem('thingData', JSON.stringify(thingData));
//           // // console.log(thingId);
//           $scope.openEdit();
//         };
//         $scope.openEdit = function (size, parentSelector) {
//           var parentElem = parentSelector;
//           angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
//           var modalInstance = $uibModal.open({
//             animation: $scope.animationsEnabled,
//             ariaLabelledBy: 'modal-title',
//             ariaDescribedBy: 'modal-body',
//             templateUrl: 'editModalContent.html',
//             controller: 'EditModalInstanceCtrl',
//             size: size,
//             appendTo: parentElem
//           });
//         };
//         // End Edit Thing Function

//         $scope.ThingsDelete = function (thing) {
//           var modalInstance = $uibModal.open({
//             animation: $scope.animationsEnabled,
//             templateUrl: 'deleteThing.html',
//             controller: 'deleteThingModal',
//             resolve: {
//               thing: function() {
//                 return thing;
//               }
//             }
//           });
//         };

//         $scope.ThingsToGroup = function (thingId) {
//           $window.sessionStorage.setItem('thingId', thingId);
//           // // console.log(thingId);
//           $scope.openThingsToGroup();
//         };
//         $scope.openThingsToGroup = function (size, parentSelector) {
//           var parentElem = parentSelector;
//           angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
//           var modalInstance = $uibModal.open({
//             animation: $scope.animationsEnabled,
//             ariaLabelledBy: 'modal-title',
//             ariaDescribedBy: 'modal-body',
//             templateUrl: 'openThingsToGroupModalContent.html',
//             controller: 'openThingsToGroupModalInstanceCtrl',
//             size: size,
//             appendTo: parentElem
//           });
//         };

//       }
//     }
//   }
// }());

// angular.module('things').controller('EditModalInstanceCtrl', function ($state, $window, $http, $scope, $uibModalInstance) {

//   var thingData = JSON.parse($window.sessionStorage.getItem('thingData'));
//     // // console.log(thingId);
//   $scope.editThingName = thingData.thingsName;
//   $scope.editThingDes = thingData.thingsDesc;
//   $scope.permission = thingData.thingsPermission;
//   var strrefresh = thingData.refresh;
//   strrefresh = strrefresh.toString();
//   $scope.timerefresh = strrefresh;
//     // Start Loop Refresh Data number
//   $scope.range = function (min, max, step) {
//     step = step || 1;
//     var input = [];
//     for (var i = min; i <= max; i += step) {
//       input.push(i);
//     }
//     return input;
//   };
//     // End Loop Refresh Data number

//   $scope.saveThings = function () {

//     var retVal = $window.confirm('Do you want to Change This Things?');
//     if (retVal === true) {
//       // console.log('thingId : ' + thingData._id);
//       // console.log('SAVE BTN CLICK');
//       $http.post('/api/things/update',
//         {
//           thingId: thingData._id,
//           thingName: $scope.editThingName,
//           thingDes: $scope.editThingDes,
//           thingPermission: $scope.permission,
//           refresh: $scope.timerefresh
//         })
//           .then(
//           function (result) {
//             // console.log(result);
//           },
//           function (result) {
//             // console.log('ERROR Update Things');
//             // console.log(result);
//           });
//     } else {
//       // console.log('cancel');
//     }
//     // console.log('saveThings');
//     $uibModalInstance.close();
//     $state.go($state.current, {}, { reload: true });
//   };

//   $scope.cancelSaveThings = function () {
//     $uibModalInstance.dismiss('cancelSaveThings');
//   };
// });
// angular.module('things').controller('openThingsToGroupModalInstanceCtrl', function (Notification, $state, $window, $http, $scope, $uibModalInstance) {

//   var thingId = $window.sessionStorage.getItem('thingId');
//   // console.log(thingId);

//   $scope.getAvailableGroup = function () {
//     $http.get('/api/things/' + thingId + '/group/available')
//         .then(function (response) {
//           $scope.groups = response.data;
//           // console.log($scope.groups);
//         });
//   };

//   $scope.getAvailableGroup();

//   $scope.chooseGroup = function (groupID) {
//     var btnchoose = document.getElementById(groupID);
//     btnchoose.classList.add('display-none');
//     // console.log(groupID);
//     // console.log(thingId);
//     $scope.success = false;
//     $scope.fail = false;
//     $http.post('/api/things/group/oneadd',
//       {
//         thingsId: thingId,
//         groupId: groupID
//       })
//         .then(
//         function (result) {
//           // console.log(result);
//           Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>Add Thing to Group successful!' });
//           $scope.getAvailableGroup();
//         },
//         function (result) {
//           Notification.error({ message: '<i class="ic-close"></i>Add Thing to Group failed!' });
//           // console.log('ERROR Add Things to Group');
//           // console.log(result);
//         });
//   };


//   $scope.cancelSaveThings = function () {
//     $uibModalInstance.dismiss('cancelSaveThings');
//   };
// });

// angular.module('things').controller('openScanQRmodalCtrl', function (Authentication, Notification, $state, $window, $http, $scope, $uibModalInstance) {

//   var vm = this;
//   vm.authentication = Authentication;
//   var thingId = $window.sessionStorage.getItem('thingId');
//   // console.log(thingId);
//   $scope.onSuccess = function(data) {
//     // console.log(data);
//     if (data) {
//       $window.localMediaStream.getVideoTracks()[0].stop();
//       $scope.checkqrdata = true;
//       $scope.qrcodedata = data;
//     } else {
//       $scope.checkqrdata = false;
//     }
//   };
//   $scope.onError = function(error) {
//     // console.log(error);
//   };
//   $scope.onVideoError = function(error) {
//     // console.log(error);
//   };
//   $scope.createThingWithQR = function() {
//     $http.post('/api/things/add',
//       {
//         thingsName: 'Default Thing',
//         thingsDes: 'Default Description Thing',
//         permission: 'Public',
//         timerefresh: '20',
//         username: vm.authentication.user.username,
//         sendToken: $scope.qrcodedata
//       })
//         .then(
//         function (result) {
//           // console.log(result);
//           if (result.data.success === false) {
//             $scope.tokenused = true;
//           } else {
//             $http.post('/api/things/lastcreated', {})
//             .then(
//             function(result) {
//               // // console.log();
//               if (result.data.message[0]) {
//                 // console.log(result);
//                 $scope.thingID = result.data.message[0]._id;
//                 // console.log($scope.thingID);
//                 window.location.href = '/things-detail' + $scope.thingID;
//               } else {
//                 window.location.href = '/things';
//               }
//             },
//             function(result) {
//               // console.log(result);
//             });
//           }
//         },
//         function (err) {
//           // console.log('ERROR add Things');
//           // console.log(err);
//         });
//   };
//   $scope.cancelScanQR = function () {
//       // window.location.href = '/things';
//     $uibModalInstance.dismiss('cancelScanQR');
//   };
// });

// angular.module('things').controller('deleteThingModal', function(thing, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
//   // console.log(thing);
//   $scope.nameOfThing = thing.thingsName;
//   $scope.confirmDeleteThing = function() {

//     $http.post('/api/things/delete',
//       {
//         thingId: thing._id
//       })
//         .then(
//         function (result) {
//           // console.log(result);
//           location.reload();
//         },
//         function (result) {
//           // console.log('ERROR DELETE Things');
//           // console.log(result);
//         });
//   };
//   $scope.cancelConfirmDeleteThing = function() {
//     $uibModalInstance.dismiss('cancel');
//   };
// });

// angular.module('things').controller('StartTutorial', function($document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
//   $scope.startbtn = function() {
//     angular.element($document[0].querySelector('.modal-demo '));
//     var modalInstance = $uibModal.open({
//       animation: $scope.animationsEnabled,
//       ariaLabelledBy: 'modal-title',
//       ariaDescribedBy: 'modal-body',
//       templateUrl: 'createThingsTutorial.html',
//       controller: 'createThingsTutorialCtrl',
//       backdrop: 'static'
//     });
//     $uibModalInstance.dismiss('cancel');
//   };
//   $scope.skip = function() {
//     // var checkskip = document.getElementById('checkskip');
//     // console.log($scope.checkskip);
//     if ($scope.checkskip === undefined || $scope.checkskip === false) {
//       $http.post('/api/user/newuser', { checkskip: $scope.checkskip })
//       .then(function (response) {
//         // console.log(response);
//       });
//     } else {
//       $http.post('/api/user/newuser', { checkskip: $scope.checkskip })
//       .then(function (response) {
//         // console.log(response);
//       });
//     }
//     $uibModalInstance.dismiss('cancel');
//   };

// });
// angular.module('things').controller('StartDbTutorial', function($document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
//   $scope.authentication = Authentication;
//   $scope.tudb = function() {
//     $http.get('/api/dashboards/list/' + $scope.authentication.user.username)
//     .then(function (response) {
//       if (response.data.message.length === 0) {
//         angular.element($document[0].querySelector('.modal-demo '));
//         var modalInstance = $uibModal.open({
//           animation: $scope.animationsEnabled,
//           ariaLabelledBy: 'modal-title',
//           ariaDescribedBy: 'modal-body',
//           templateUrl: 'dbFirstTutorial.html',
//           controller: 'dbFirstTutorial',
//           backdrop: 'static'
//         });
//         $uibModalInstance.dismiss('cancel');
//       } else {
//         window.location.href = '/things';
//       }
//     }).catch(function(err) {
//       // console.log(err);
//     });
//   };
// });
// angular.module('things').controller('dbFirstTutorial', function($document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
//   $scope.toAddDbTutor = function() {
//     angular.element($document[0].querySelector('.modal-demo '));
//     var modalInstance = $uibModal.open({
//       animation: $scope.animationsEnabled,
//       ariaLabelledBy: 'modal-title',
//       ariaDescribedBy: 'modal-body',
//       templateUrl: 'addDbTutor.html',
//       controller: 'addDbTutor',
//       backdrop: 'static'
//     });
//     $uibModalInstance.dismiss('cancel');
//   };
// });
// angular.module('things').controller('addDbTutor', function($document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
//   $scope.openCreateDbTutor = function() {
//     angular.element($document[0].querySelector('.modal-demo '));
//     var modalInstance = $uibModal.open({
//       animation: $scope.animationsEnabled,
//       ariaLabelledBy: 'modal-title',
//       ariaDescribedBy: 'modal-body',
//       templateUrl: 'openCreateDbTutor.html',
//       controller: 'addDbTuopenCreateDbTutortor',
//       backdrop: 'static'
//     });
//     $uibModalInstance.dismiss('cancel');
//   };
// });
// angular.module('things').controller('addDbTuopenCreateDbTutortor', function($document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
//   $scope.idnewDB = '';
//   $scope.creDb = function() {
//     $http.post('/api/dashboards/add', {
//       dbName: $scope.creDashboardName,
//       dbDesc: $scope.creDashboardDes
//     }).then(function(result) {
//       // console.log(result);
//       $scope.idnewDB = result.data._id;
//       window.location.href = '/tutorial-dashboards' + $scope.idnewDB;
//       // console.log($scope.idnewDB);
//     }, function(result) {
//       // console.log('ERROR Create DB');
//       // console.log(result);
//     });
//     $uibModalInstance.dismiss('cancel');
//   };
// });
// angular.module('things').controller('createThingsTutorialCtrl', function($timeout, $document, $uibModal, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
//   $scope.openCreateThingsTu = function (size, parentSelector) {
//     $uibModalInstance.dismiss('cancel');
//     $timeout(function () {
//       var parentElem = parentSelector;
//       angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
//       var modalInstance = $uibModal.open({
//         animation: $scope.animationsEnabled,
//         ariaLabelledBy: 'modal-title',
//         ariaDescribedBy: 'modal-body',
//         templateUrl: 'createModalContentTutor.html',
//         controller: 'CreateModalInstanceCtrlTutor',
//         size: size,
//         appendTo: parentElem
//       });
//     }, 300);
//   };
// });

// angular.module('things').controller('CreateModalInstanceCtrlTutor', function ($uibModal, $document, $http, $state, $scope, $uibModalInstance, Authentication) {
//   $scope.createpermission = 'Public';
//   $scope.createtimerefresh = '20';
//   $scope.scanqrcode = function (size, parentSelector) {
//     var parentElem = parentSelector;
//     angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
//     var modalInstance = $uibModal.open({
//       animation: $scope.animationsEnabled,
//       ariaLabelledBy: 'modal-title',
//       ariaDescribedBy: 'modal-body',
//       templateUrl: 'openScanQRmodal.html',
//       controller: 'openScanQRmodalCtrl',
//       size: size,
//       appendTo: parentElem
//     });
//   };
//       // Start Loop Refresh Data number
//   $scope.range = function (min, max, step) {
//     step = step || 1;
//     var input = [];
//     for (var i = min; i <= max; i += step) {
//       input.push(i);
//     }
//     return input;
//   };
// // End Loop Refresh Data number
//   $scope.saveThingsTu = function () {
//     // console.log('Create Things CLICK');
//     $http.post('/api/things/add',
//       {
//         thingsName: $scope.createThingName,
//         thingsDes: $scope.createThingDes,
//         permission: $scope.createpermission,
//         timerefresh: $scope.createtimerefresh
//       })
//       .then(
//       function (result) {
//         // console.log(result);
//         $uibModalInstance.close();
//         $state.go($state.current, {}, { reload: true });
//       },
//           function (result) {
//             // console.log('ERROR add Things');
//             // console.log(result);
//           });
//   };
//   $scope.cancelCreateThings = function () {
//     // $uibModalInstance.dismiss('cancel');
//   };
// });
