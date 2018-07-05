(function () {
  'use strict';

  angular
    .module('dashboards')
    .filter('trustUrl', ['$sce', function ($sce) {
      return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
      };
    }])
    .config(['MQTTProvider', function(MQTTProvider) {
      var accToken = localStorage.getItem('accToken');
      var option = {
        // username: 'user-' + accToken,
        // password: accToken
        username: 'admin',
        password: 'admin'
      };
      var websocket_protocol = 'ws';
      if (window.location.protocol === 'https:') {
        websocket_protocol = 'wss';
      }
      // MQTTProvider.setHref('ws://104.215.191.117:15674/ws');
      MQTTProvider.setHref(websocket_protocol + '://104.125.191.117:15675/ws');
      // MQTTProvider.setHref(websocket_protocol + '://' + window.location.hostname + '/ws');
      // MQTTProvider.setHref(websocket_protocol + '://103.20.205.104/ws');
      MQTTProvider.setOption(option);
      // MQTTService.connect(websocket_protocol + '://103.20.205.104/ws', option);
    }])
    .filter('convertmapdata', function () {
      return function (datalocation) {
        if (datalocation) {
          if (datalocation.length === 1) {
            return datalocation.join();
          } else {
            return datalocation.slice(datalocation.length - 2, datalocation.length - 1).join();
          }
        } else {
          return '0,0';
        }
      };
    })
    .controller('DashboardsDnmController', DashboardsDnmController);

  DashboardsDnmController.$inject = ['$location', 'MQTTService', '$log', '$uibModal', '$document', 'NgMap', '$interval', '$timeout', '$compile', '$http', '$scope', '$state', '$window', 'Authentication'];

  function DashboardsDnmController($location, MQTTService, $log, $uibModal, $document, NgMap, $interval, $timeout, $compile, $http, $scope, $state, $window, Authentication) {
    var vm = this;
    var accToken = localStorage.getItem('accToken');
    // if (accToken === undefined || accToken === null || accToken === '') {
    //   $state.go('authentication.signin');
    // }
    $scope.signout = function() {
      localStorage.clear();
      window.location.href = '/api/auth/signout';
    };
    vm.authentication = Authentication;
    var option = {
      username: 'user-' + accToken,
      password: accToken
    };
    var websocket_protocol = 'ws';
    if (window.location.protocol === 'https:') {
      websocket_protocol = 'wss';
    }
    // MQTTService.connect(websocket_protocol + '://103.20.205.104/ws', option);
    // MQTTService.connect('wws://www.aismagellan.io/ws', option);

    // MQTTService.connect(websocket_protocol + '://' + window.location.hostname + '/ws', option);


    var keydatas = [];
    var dateV = [];
    var tmpListData = [];
    $scope.datavalues = [];
    var currentLocation = window.location.href;
    var dashBoardId = currentLocation.substring(currentLocation.search('dashboards') + 10);
    vm.authentication = Authentication;
    $scope.bossdata = [65, -59, 80, 81, -56, 55, -40];
    $scope.dashboardsObj = [];
    $scope.dashboardShowList = [];
    $scope.colors = ['#b2d234']; // sparkline chart color
    $scope.hidedm = true;
    $scope.load = function () {
      $scope.hidedm = false;
      document.getElementById('loading').style.display = 'none';
    };

    if (!vm.authentication.user) {
      $state.go('authentication.signin');
      return true;
    }
    $scope.$on('$destroy', function () {
      $interval.cancel($scope.intervaldnm);
      $interval.cancel($scope.intervalthing);
    });
    // var userAgent = $window.navigator.userAgent;
    // $scope.videoIfram = false;
    // $scope.videoSrc = false;

    // var browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };
    // for (var key in browsers) {
    //   if (browsers[key].test(userAgent)) {
    //     if (key === 'chrome') {
    //       $scope.videoIfram = true;
    //     } else if (key === 'safari') {
    //       if ($scope.videoIfram) {
    //         $scope.videoSrc = false;
    //       } else {
    //         $scope.videoSrc = true;
    //       }
    //     }
    //   }
    // }
    // Callback Search Auto Complete
    $scope.options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            userCallback: function(label, index, labels) {
              if (Math.floor(label) === label) {
                return label;
              }
            }
          }
        }]
      },
      tooltips: {
        mode: 'index',
        intersect: false
      }
    };
    $scope.objectSelected = function ($item) {
      if ($item.description === 'Things') {
        window.location.href = '/things-detail' + $item.originalObject.id;
      } else if ($item.description === 'Group') {
        window.location.href = '/groups-detail' + $item.originalObject.id;
      } else if ($item.description === 'Widget') {
        window.location.href = '/dashboards' + $item.originalObject.id;
      } else if (!$item.description) {
        // console.log('null');
      } else {
        // console.log('null');
      }
    };
    $scope.sortableOptions = {
      update: function (e, ui) {
        var logEntry = tmpListData.map(function (i) {
          return i.value;
        }).join(', ');
      },
      stop: function (e, ui) {
        // this callback has the changed model
        var logEntry = tmpListData.map(function (i) {
          return i.value;
        }).join(', ');
        // send update order to server
        for (var i = 0; i < tmpListData.length; i++) {
          tmpListData[i].order = i;
        }
        $http.post('/api/dashboards/' + dashBoardId + '/widgets/move', {
          widgets: tmpListData
        }).then(function (result) {
          //   $scope.dashboardShowList.splice(index, 1);
          // console.log(result);
          // location.reload();
        }, function (err) {
          // console.log(err);
        });
      }
    };
    $scope.isHorizontal = true;
    $scope.sortableOptions['ui-floating'] = $scope.isHorizontal;
    // end angular ui sort
    $scope.animationsEnabled = true;

    $scope.testdata = 0;
    $scope.createWidget = function () {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'manageWidget.html',
        controller: 'manageWidget as ctrl',
        resolve: {
          titleModal: function () {
            return 'Create Widget';
          },
          dashboardId: function () {
            return dashBoardId;
          },
          widgetData: function () {
            return null;
          },
          orderIndex: function () {
            return $scope.dashboardShowList.length;
          }

        }
      });

    };

    $scope.deleteWidget = function (widgetdata) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'deleteWidget.html',
        controller: 'deleteWidgetModal',
        resolve: {
          widgetdata: function () {
            return widgetdata;
          }
        }
      });


    };

    $scope.editWidget = function (data) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'manageWidget.html',
        controller: 'manageWidget as ctrl',
        resolve: {
          titleModal: function () {
            return 'Edit Widget';
          },
          dashboardId: function () {
            return dashBoardId;
          },
          widgetData: function () {
            return data;
          },
          orderIndex: function () {
            return $scope.dashboardShowList.indexOf(data);
          }

        }
      });
    };


    $scope.openEditDb = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'editDb.html',
        controller: 'editDbCtrl'
      });
    };
    // End Edit DashBoard Modal
    $scope.optionnew = {
      username: 'user-' + accToken,
      password: accToken
    };

    $scope.checkType = function(obj) {
      return typeof obj;
    };

    $scope.toggleClick = function (data) {
      // $http.get('/api/thingdashboard/pull/' + data.things.sendToken)
      // .then(function (res) {
      // var values = res.data[data.dataKey];
      var values = data.selected;
      $scope.resdata = {};
      if (!values) {
        $scope.resdata[data.dataKey] = 0;
        var topic2 = 'dashboards/data/' + data.things.sendToken;
        $http.post('/api/thingdashboard/push/',
          {
            token: data.things.sendToken,
            playload: $scope.resdata
          }).then(function (result) {
            MQTTService.send(topic2, $scope.resdata);
          });
      } else if (values) {
        $scope.resdata[data.dataKey] = 1;
        var topic = 'dashboards/data/' + data.things.sendToken;
        $http.post('/api/thingdashboard/push/',
          {
            token: data.things.sendToken,
            playload: $scope.resdata
          }).then(function (result) {
            MQTTService.send(topic, $scope.resdata);
          });
      } else {
        $scope.resdata[data.dataKey] = 0;
        var topic3 = 'dashboards/data/' + data.things.sendToken;
        $http.post('/api/thingdashboard/push/',
          {
            token: data.things.sendToken,
            playload: $scope.resdata
          }).then(function (result) {
            MQTTService.send(topic3, $scope.resdata);
          });
      }
      // });
    };
    // new API Start
    $http.get('/api/dashboards/' + dashBoardId + '/widgets').then(function (response) {
      if (response.data.data.widgetId) {
        document.getElementById('loading').style.display = 'none';
      }
      $scope.dashboardData = response.data.data;
      $window.sessionStorage.setItem('dashboardData', JSON.stringify($scope.dashboardData));
      $scope.dashboardsObj = response.data.data.widgets;
      if (response.data.data.widgets) {
        for (var i = 0; i < $scope.dashboardsObj.length; i++) {
          $scope.dashboardsObj[i].datavalue = [];
          $scope.dashboardsObj[i].datalabel = [];
          if (response.data.data.widgets) {
            dateV[response.data.data.widgets[i].things.sendToken] = response.data.data.widgets[i].things.thingDataUpdateDate;
            var point = response.data.data.widgets[i];
            if (response.data.data.widgets[i].things.thingsData !== null) {
              $scope.dashboardsObj[i].datavalue.push(response.data.data.widgets[i].things.thingsData[response.data.data.widgets[i].dataKey]);
              $scope.dashboardsObj[i].datalabel.push('');
            } else {
              $scope.dashboardsObj[i].datavalue.push('');
              $scope.dashboardsObj[i].datalabel.push('');
            }
            $scope.datavalues.push($scope.dashboardsObj[i].datavalue);
            var keydata = $scope.dashboardsObj[i].dataKey;
            keydatas.push(keydata);
            tmpListData[i] = $scope.dashboardsObj[i];
          } else {
            return;
          }
        }
      }
      $scope.dashboardShowList = tmpListData;
      $scope.hidedm = false;
      // $scope.$apply();
      // $scope.intervaldnm = $interval($scope.updateDataWidget, refreshTime);
      // End Init Widget

      // START MQTT Subscriber

      if ($scope.dashboardsObj) {
        $scope.arrtoken = [];
        for (var x = 0; x < $scope.dashboardsObj.length; x++) {
          let sendToken = $scope.dashboardsObj[x].things.sendToken.slice(0);
          MQTTService.on('devices/data/' + sendToken, function(results) {
            for (var z = 0; z < $scope.dashboardsObj.length; z++) {
              if ($scope.dashboardsObj[z].datavalue[$scope.dashboardsObj[z].datavalue.length - 1] !== undefined && $scope.dashboardsObj[z].things.sendToken === sendToken) {
                if ($scope.dashboardsObj[z].datavalue.length > 20) {
                  if (results[$scope.dashboardsObj[z].dataKey] !== undefined || results[$scope.dashboardsObj[z].dataKey] !== null) {
                    $scope.dashboardsObj[z].datavalue.shift();
                    $scope.dashboardsObj[z].datalabel.shift();
                    $scope.dashboardsObj[z].datavalue.push(results[$scope.dashboardsObj[z].dataKey]);
                    $scope.dashboardsObj[z].datalabel.push('');
                    tmpListData[z] = $scope.dashboardsObj[z];
                    $scope.dashboardsObj[z].datavalue.splice(20, 1, results[$scope.dashboardsObj[z].dataKey]);
                    $scope.dashboardsObj[z].datalabel.splice(20, 1, '');
                  }
                } else {
                  if (results[$scope.dashboardsObj[z].dataKey] !== undefined || results[$scope.dashboardsObj[z].dataKey] !== null) {
                    $scope.dashboardsObj[z].datavalue.push(results[$scope.dashboardsObj[z].dataKey]);
                    $scope.dashboardsObj[z].datalabel.push('');
                  }
                  tmpListData[z] = $scope.dashboardsObj[z];
                }
              } else {
                //   console.log('else');
              }
            }
            $scope.dashboardShowList = tmpListData;
          });
        }
        var canvas = document.getElementsByClassName('chart-line');
        for (var cv = 0; cv < canvas.length; cv++) {
          canvas[cv].style.width = '100%';
          canvas[cv].style.height = '100px!important';
        }
      }
    });
    // new API End
  }

}());

angular.module('dashboards').controller('manageWidget', function ($state, $window, $http, $scope, $uibModalInstance, Authentication, titleModal, dashboardId, widgetData, orderIndex) {

  var ctrl = this;
  ctrl.title = titleModal;
  ctrl.dashboardId = dashboardId;
  ctrl.groups = [];
  ctrl.thingsTemp = [];
  ctrl.errMsg = '';
  ctrl.widgetEdit = widgetData;
  ctrl.group = 'all';
  if (ctrl.widgetEdit) {
    ctrl.widget = ctrl.widgetEdit.type;
    ctrl.widgetName = ctrl.widgetEdit.widgetName;
    if (ctrl.widgetEdit.settings) {
      ctrl.url = ctrl.widgetEdit.settings.url;
      ctrl.unit = ctrl.widgetEdit.settings.unit;
      ctrl.min = ctrl.widgetEdit.settings.minValue;
      ctrl.max = ctrl.widgetEdit.settings.maxValue;
      ctrl.ontext = ctrl.widgetEdit.settings.onText;
      ctrl.offtext = ctrl.widgetEdit.settings.offText;
    }
  } else {
    ctrl.widget = ctrl.widgetType;
  }

  $http.get('/api/groups').then(function (result) {
    if (result.data) {
      ctrl.groups = result.data.data;
      if (ctrl.widgetEdit) {
        for (var i = 0; i < ctrl.groups.length; i++) {
          if (ctrl.groups[i]._id === ctrl.widgetEdit.selectedGroup) {
            ctrl.group = JSON.stringify(ctrl.groups[i]);
          }
        }
      }
    } else {
      ctrl.group = 'notfound';
    }
  }, function (err) {
    // console.log(err);
  });
  $http.get('/api/things/list/').then(function (result) {
    if (result.data) {
      ctrl.things = result.data.message;
      ctrl.thingsTemp = result.data.message;
      if (ctrl.things.length > 0) {
        ctrl.thing = ctrl.things[0]._id;
        ctrl.getDataSourceByThing(ctrl.thing);// update data source
      }
      if (ctrl.widgetEdit) {
        ctrl.thing = ctrl.widgetEdit.thingsId;
        ctrl.getDataSourceByThing(ctrl.thing);
      }
    }
  }, function (err) {
    // console.log(err);
  });


  ctrl.getThingsByGroup = function () {
    // filter thing in local
    if (ctrl.group !== 'all') {
      var group = JSON.parse(ctrl.group);
      var thingsList = group.things;
      if (thingsList.length < 1) {
        ctrl.things = [];
      } else {
        ctrl.things = [];
        for (var i = 0; i < thingsList.length; i++) {
          ctrl.things.push(thingsList[i]);
        }
      }
    } else {
      ctrl.things = ctrl.thingsTemp;
      $scope.$apply();
    }
    setSelectedThing(ctrl.things);
  };

  ctrl.getDataSourceByThing = function (thingId) {
    ctrl.dataSources = [];
    $http.get('/api/things/detail/' + thingId).then(function (response) {
      if (response.data.thingData) {
        ctrl.dataSources = Object.keys(response.data.thingData);
      }
      setSelectedDataSource();
    }, function (err) {
      // console.log(err);
    });
  };

  ctrl.dismiss = function () {
    $uibModalInstance.dismiss();
  };

  function setSelectedThing(thingList) {
    if (thingList.length > 0) {
      ctrl.thing = thingList[0]._id;
      ctrl.getDataSourceByThing(ctrl.thing);// update data source
    } else {
      ctrl.thing = 'notfound';
      ctrl.dataSources = [];
      setSelectedDataSource();
    }
  }

  function setSelectedDataSource() {
    if (ctrl.dataSources.length > 0) {
      ctrl.dataSource = ctrl.dataSources[0];
      if (ctrl.widgetEdit) {
        if (ctrl.widgetEdit.datavalue[0] === undefined) {
          ctrl.dataSource = 'notfound';
        } else {
          ctrl.dataSource = ctrl.widgetEdit.dataKey;
        }
      }
    } else {
      ctrl.dataSource = 'notfound';
    }
  }

  function findTokenByThingId(thingId, thingList) {
    var sendToken = '';

    for (var i = 0; i < thingList.length; i++) {
      if (thingList[i]._id === thingId) {
        sendToken = thingList[i].sendToken;
      }
    }

    return sendToken;
  }

  ctrl.save = function () {
    if (ctrl.thing !== 'notfound' && ctrl.dataSource !== 'notfound' && ctrl.widgetName !== '' && ctrl.widgetName !== undefined && ctrl.widget !== undefined || ctrl.widget === 'video' && ctrl.widgetName !== '' && ctrl.widgetName) {
      ctrl.errMsg = '';
      var param = {};
      param.dashboard = ctrl.dashboardId;
      param.name = ctrl.widgetName;
      param.type = ctrl.widget.toLowerCase();
      if (ctrl.min === null) {
        ctrl.min = 0;
      }
      if (ctrl.max === null) {
        ctrl.max = 100;
      }
      param.url = ctrl.url;
      param.unit = ctrl.unit;
      param.minValue = ctrl.min;
      param.maxValue = ctrl.max;
      param.offText = ctrl.offtext;
      param.onText = ctrl.ontext;

      param.thingToken = findTokenByThingId(ctrl.thing, ctrl.things);
      param.thingID = ctrl.thing;
      param.dataKey = ctrl.dataSource;
      param.order = orderIndex;
      setIdGroup(param);
      var checkIssetting = setSettingObject(param, ctrl.widgetType);
      if (checkIssetting) {
        if (ctrl.widgetEdit) {
          $http.post('/api/dashboards/' + dashboardId + '/widgets/' + ctrl.widgetEdit._id + '/edit', JSON.stringify(param)).then(function (result) {
            if (param.type === 'toggle') {
              $http.get('/api/things/pullWithStatus/' + param.thingToken)
              .then(function (res) {
                $scope.datapullthing = res.data.data[param.dataKey];
                $scope.dataobj = res.data.data;
                if (res.data.data[param.dataKey] === 0 || res.data.data[param.dataKey] === 1) {
                  $http.get('/api/thingdashboard/pull/' + param.thingToken).then(function(resdb) {
                    if (resdb.data.success || resdb.status === 200) {
                      if (param.dataKey in resdb.data) {
                        location.reload();
                        return false;
                      } else {
                        $scope.objreplace = {};
                        if (resdb.data.message != null) {
                          $scope.objreplace = resdb.data;
                          $scope.objreplace[param.dataKey] = $scope.datapullthing;
                          for (var key in resdb.data) {
                            if (resdb.data.hasOwnProperty(key)) {
                              $scope.objreplace[key] = resdb.data[key];
                            }
                          }
                        } else {
                          $scope.objreplace[param.dataKey] = $scope.datapullthing;
                          for (var k in resdb.data) {
                            if (resdb.data.hasOwnProperty(k)) {
                              $scope.objreplace[k] = resdb.data[k];
                            }
                          }
                        }
                        var data = JSON.parse('{"' + param.dataKey + '": ' + $scope.objreplace[param.dataKey] + '}');
                        $http.post('/api/thingdashboard/push',
                          {
                            token: param.thingToken,
                            playload: data
                          }).then(function (result) {
                            location.reload();
                          });
                      }
                    } else {
                      $scope.objreplace = {};
                      $scope.objreplace[param.dataKey] = $scope.datapullthing;
                      $http.post('/api/thingdashboard/push',
                        {
                          token: param.thingToken,
                          playload: $scope.objreplace
                        }).then(function (result) {
                          location.reload();
                        });
                    }
                  });

                } else {
                  location.reload();
                  return false;
                }
              });
            } else {
              location.reload();
            }
          }, function (err) {
            // console.log(err);
          });
        } else {
          $http.post('/api/dashboards/' + dashboardId + '/widgets/add', JSON.stringify(param)).then(function (result) {
            if (param.type === 'toggle') {
              $http.get('/api/things/pullWithStatus/' + param.thingToken)
              .then(function (res) {
                $scope.datapullthing = res.data.data[param.dataKey];
                $scope.dataobj = res.data.data;
                if (res.data.data[param.dataKey] === 0 || res.data.data[param.dataKey] === 1) {
                  $http.get('/api/thingdashboard/pull/' + param.thingToken).then(function(resdb) {
                    if (resdb.data.success || resdb.status === 200) {
                      if (param.dataKey in resdb.data) {
                        location.reload();
                        return false;
                      } else {
                        $scope.objreplace = {};
                        if (resdb.data.message != null) {
                          $scope.objreplace = resdb.data;
                          $scope.objreplace[param.dataKey] = $scope.datapullthing;
                          for (var key in resdb.data) {
                            if (resdb.data.hasOwnProperty(key)) {
                              $scope.objreplace[key] = resdb.data[key];
                            }
                          }
                        } else {
                          $scope.objreplace[param.dataKey] = $scope.datapullthing;
                          for (var k in resdb.data) {
                            if (resdb.data.hasOwnProperty(k)) {
                              $scope.objreplace[k] = resdb.data[k];
                            }
                          }
                        }
                        var data = JSON.parse('{"' + param.dataKey + '": ' + $scope.objreplace[param.dataKey] + '}');
                        $http.post('/api/thingdashboard/push',
                          {
                            token: param.thingToken,
                            playload: data
                          }).then(function (result) {
                            location.reload();
                          });
                      }
                    } else {
                      $scope.objreplace = {};
                      $scope.objreplace[param.dataKey] = $scope.datapullthing;
                      $http.post('/api/thingdashboard/push',
                        {
                          token: param.thingToken,
                          playload: $scope.objreplace
                        }).then(function (result) {
                          // location.reload();
                        });
                    }
                  });

                } else {
                  location.reload();
                  return false;
                }
              });
            } else {
              location.reload();
            }
          }, function (err) {
            // console.log(err);
          });
        }
      }

    } else {
      ctrl.errMsg = 'Please fill in the specific field';
    }

  };

  function setIdGroup(param) {
    if (ctrl.group !== 'all') {
      var groupId = JSON.parse(ctrl.group)._id;
      param.group = groupId;
    }
  }

  function setSettingObject(param, widgetType) {
    if (widgetType === 'gauge') {
      if (!isEmpty(ctrl.unit) && !isEmpty(ctrl.min) && !isEmpty(ctrl.max)) {
        param.unit = ctrl.unit;
        param.minValue = ctrl.min;
        param.maxValue = ctrl.max;
      } else {
        ctrl.errMsg = 'Please fill in the specific field';
        return false;
      }

    } else if (widgetType === 'indicatorlight') {
      if (!isEmpty(ctrl.offtext) && !isEmpty(ctrl.ontext)) {
        param.offText = ctrl.offtext;
        param.onText = ctrl.ontext;
      } else {
        ctrl.errMsg = 'Please fill in the specific field';
        return false;
      }
    } else if (widgetType === 'toggle') {
      if (!isEmpty(ctrl.offtext) && !isEmpty(ctrl.ontext)) {
        param.offText = ctrl.offtext;
        param.onText = ctrl.ontext;
      } else {
        ctrl.errMsg = 'Please fill in the specific field';
        return false;
      }
    } else if (widgetType === 'video') {
      if (!isEmpty(ctrl.url)) {
        param.url = ctrl.url;
      } else {
        ctrl.errMsg = 'Please fill in the specific field';
        return false;
      }
    }
    return true;
  }

  function isEmpty(val) {
    if (val === '' || val === undefined || val === null) {
      return true;
    }
    return false;
  }

});


angular.module('dashboards').controller('editDbCtrl', function ($document, $uibModal, $state, $window, $http, $scope, $uibModalInstance) {
  var dashboardData = JSON.parse($window.sessionStorage.getItem('dashboardData'));
  $scope.editDashboardName = dashboardData.dashboardName;
  if (dashboardData.dashboardDesc === '' || dashboardData.dashboardDesc === ' ') {
    $scope.editDashboardDes === null;
  } else {
    $scope.editDashboardDes = dashboardData.dashboardDesc;
  }
  $scope.saveDb = function () {
    var retVal = $window.confirm('Do you want to Change This Dashboard ?');
    if (retVal === true) {
      $http.post('/api/dashboards/update/', {
        dashboardId: dashboardData._id,
        dbName: $scope.editDashboardName,
        dbDesc: $scope.editDashboardDes
      })
        .then(
        function (result) {
          // console.log(result);
        },
        function (result) {
          // console.log('ERROR Update Dashboard');
          // console.log(result);
        });
    } else {
      // console.log('cancel');
    }
    $uibModalInstance.close();
    location.reload();
  };

  $scope.deleteDb = function (size, parentSelector) {
    var parentElem = parentSelector;
    angular.element($document[0].querySelector('.modal-demo ' + parentSelector));
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'confirmDeleteDB.html',
      controller: 'confirmDeleteDB',
      size: size,
      appendTo: parentElem
    });
  };

  $scope.cancelEditDb = function () {
    $uibModalInstance.dismiss('cancelEditDb');
  };
});

angular.module('dashboards').controller('credbDnmModal', function ($http, $state, $scope, $uibModalInstance, Authentication) {
  var vm = this;
  vm.authentication = Authentication;
  $scope.idnewDB = '';
  $scope.creDb = function () {
    $http.post('/api/dashboards/add', {
      dbName: $scope.creDashboardName,
      dbDesc: $scope.creDashboardDes
    }).then(function (result) {
      $scope.idnewDB = result.data._id;
      window.location.href = '/dashboards' + $scope.idnewDB;
    }, function (result) {
      // console.log('ERROR Create DB');
      // console.log(result);
    });
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancelCreDb = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('dashboards').controller('confirmDeleteDB', function ($window, $http, $state, $scope, $uibModalInstance, Authentication) {
  var dashboardData = JSON.parse($window.sessionStorage.getItem('dashboardData'));

  $scope.confirmDelete = function () {
    $http.post('/api/dashboards/remove', {
      dashboardId: dashboardData._id
    }).then(
      function (result) {
        $http.post('/api/dashboards/lastcreated', {})
          .then(
          function (result) {
            if (result.data.message[0]) {
              $scope.dbID = result.data.message[0]._id;
              window.location.href = '/dashboards' + $scope.dbID;
            } else {
              window.location.href = '/first-dashboard';
            }
          },
          function (result) {
            // console.log(result);
          });
      },
      function (result) {
        // console.log('ERROR DELETE Dashboard');
        // console.log(result);
      });
  };
  $scope.cancelConfirmDelete = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('dashboards').controller('deleteWidgetModal', function (widgetdata, $window, $http, $state, $scope, $uibModalInstance, Authentication) {
  $scope.nameOfWidget = widgetdata.widgetName;
  var dashboardData = JSON.parse($window.sessionStorage.getItem('dashboardData'));

  $scope.confirmDeleteWidget = function () {

    var widgetId = widgetdata._id;

    $http.post('/api/dashboards/' + dashboardData._id + '/widgets/' + widgetId + '/delete', {
    }).then(function (result) {
      location.reload();
    }, function (err) {
      // console.log(err);
    });
  };
  $scope.cancelConfirmDeleteWidget = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
