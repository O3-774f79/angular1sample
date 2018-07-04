'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dashboard = mongoose.model('Dashboard'),
  Widget = mongoose.model('Widget'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ThingsData = mongoose.model('ThingsData'),
  Things = mongoose.model('Thing'),
  async = require('async'),
  _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var logController = require(path.resolve('./config/logController.js'));

// var redis = require('redis'),
//   client = redis.createClient();


// client.on('connect', function() {
//   // console.log('Redis Connect');
//   // redis.print;
// });
// exports.testRedis = function (req, res) {
//   var data = req.body.data;
//   client.set('toThing', [data, 'close']);
//   // console.log(data);
//   client.get('toThing', function(err, reply) {
//     // reply is null when the key is missing
//     // console.log(reply);
//   });
//   // client.set('KeyTest', 'ValTeset', redis.print);
// };
exports.add = function (req, res) {
  var dashboard = new Dashboard();
  dashboard.dashboardName = req.body.dbName;
  dashboard.dashboardDesc = req.body.dbDesc;
  // dashboard.widgets = [];
  dashboard.widgetId = [];
  dashboard.owner = req.user._id;
  dashboard.save(function (err) {
    if (err) {
      logController.logError(req, 'DashboardAdd', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dashboard);
    }
  });
};

exports.list = function (req, res) {
  if (!req.user || !req.user._id) {
    return res.json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
  }
  var userid = req.user._id;
  Dashboard.find({
    owner: userid
  }).exec(function (err, dashboards) {
    if (err) {
      logController.logError(req, 'DashboardList', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      res.json({ success: true, message: dashboards });
    }
  });
};

exports.getById = function (req, res) {
  Dashboard.findOne({
    _id: req.body.dashboardId
  }).exec(function (err, dashboards) {
    if (err) {
      logController.logError(req, 'DashboardGetById', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      var dbData = dashboards;
      Widget.find({
        dashboardId: req.body.dashboardId
      }).exec(function (err, widget) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          res.json({ success: true, message: widget, dbData: dbData });
        }
      });
    }
  });
};

exports.getBylastcreate = function (req, res) {
  var userid = req.user._id;
  Dashboard.find({
    owner: userid
  }).sort({ created: -1 }).limit(1)
    .exec(function (err, dashboards) {
      if (err) {
        logController.logError(req, 'DashboardGetByLastName', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        return res.jsonp({ success: false, message: err });
      } else {
        res.json({ success: true, message: dashboards });
      }
    });
};
exports.getByfirstcreate = function (req, res) {
  var userid = req.user._id;
  Dashboard.find({
    owner: userid
  }).sort({ created: 1 }).limit(1)
    .exec(function (err, dashboards) {
      if (err) {
        return res.jsonp({ success: false, message: err });
      } else {
        res.json({ success: true, message: dashboards });
      }
    });
};
exports.updateById = function (req, res) {
  var dashboard = {};
  if (req.body.dbName) {
    dashboard.dashboardName = req.body.dbName;
  }
  dashboard.dashboardDesc = req.body.dbDesc;
  Dashboard.findOneAndUpdate(
    { '_id': req.body.dashboardId },
    { $set: dashboard },
    { new: true }, function (err, doc) {
      if (err) {
        logController.logError(req, 'DashboardUpdateById', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        res.status(400).send({
          success: false,
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json({ success: true, message: doc });
      }
    }
  );
};

exports.removeById = function (req, res) {

  if (!req.body.dashboardId) {
    return res.jsonp({ success: false, message: 'No param dashboard ID' });
  }

  Widget.find({ dashboardId: req.body.dashboardId }, function (err, widget) {
    if (err) {
      return res.jsonp({ success: false, message: err });
    } else {
      async.each(widget, function (item, callback) {
        Widget.remove({ _id: item._id }, function (err, response) {
          if (err) {
            callback(err);
          } else {
            callback();
          }
        });
      }, function (err) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          Dashboard.remove({ _id: req.body.dashboardId }, function (err, response) {
            if (err) {
              logController.logError(req, 'DashboardRemoveById', 'false',
                JSON.stringify({ success: false, error: err.message }),
                res, function (err, result) {

                });
              return res.jsonp({ success: false, message: err });
            } else {
              res.json({ success: true, message: response });
            }
          });
        }
      });
    }
  });
  // Dashboard.remove({ _id: req.body.dashboardId }, function (err, response) {
  //   if (err) {
  //     logController.logError(req, 'DashboardRemoveById', 'false',
  //     JSON.stringify({ success: false, error: err.message }),
  //     res, function (err, result) {

  //     });
  //     return res.jsonp({ success: false, message: err });
  //   } else {
  //     res.json({ success: true, message: response });
  //   }
  // });
};

exports.addWidget = function (req, res) {
  var dashboardId = req.params.dashboard;

  // var widget = {
  //   order: req.body.order,
  //   name: req.body.name,
  //   type: req.body.type,
  //   thingToken: req.body.thingToken, // Now using sendToken
  //   thingID: req.body.thingID,
  //   dataKey: req.body.dataKey,
  //   selectedGroup: req.body.group,
  //   settings: {
  //     unit: req.body.unit,
  //     minValue: req.body.minValue,
  //     maxValue: req.body.maxValue,
  //     offText: req.body.offText,
  //     onText: req.body.onText
  //   }
  // };
  var widget = new Widget();
  widget.owner = req.user._id;
  widget.dashboardId = req.params.dashboard;
  widget.thingsId = req.body.thingID;
  widget.widgetName = req.body.name;
  widget.dataKey = req.body.dataKey;
  widget.type = req.body.type;
  widget.order = req.body.order;
  widget.selectedGroup = req.body.group;
  widget.settings = {
    url: req.body.url,
    unit: req.body.unit,
    minValue: req.body.minValue,
    maxValue: req.body.maxValue,
    offText: req.body.offText,
    onText: req.body.onText
  };
  widget.save(function (err, widget) {
    if (err) {
      logController.logError(req, 'DashboardSaveWidget', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Dashboard.findOneAndUpdate({ _id: req.params.dashboard }, { $push: { widgetId: widget._id } }, { new: true }, function (err, dashboard) {
        if (err) {
          logController.logError(req, 'DashboardSaveWidgetUpdate', 'false',
            JSON.stringify({ success: false, error: err.message }),
            res, function (err, result) {

            });
          return res.send(err);
        } else {
          res.jsonp(dashboard);
        }
      });
    }
  });

  // Dashboard.findOneAndUpdate({ _id: dashboardId }, { $push: { widgets: widget } }, { new: true }, function (err, dashboard) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   }

  //   res.jsonp(dashboard);
  // });

};

exports.moveWidget = function (req, res) {
  var dashboardId = req.params.dashboard;
  var reqwidget = req.body.widgets;
  async.each(req.body.widgets, function (widget, callback) {
    Widget.update({ _id: widget._id }, { order: widget.order }, function (err, widget) {
      if (err) {
        logController.logError(req, 'DashboardMoveWidget', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log('>>>>>>>>>>>>>>>>>>>>>');
        // console.log(widget);
        // console.log('>>>>>>>>>>>>>>>>>>>>>');
      }
    });
    callback();
  }, function (err, _widget) {
    // console.log('xxxxxxxxxxxx');
    // console.log(_widget);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({ success: true });
    }
  }
  );
  //   dashboard.widgets.sort(function (lhs, rhs) {
  //     if (lhs.created < rhs.created) {
  //       return -1;
  //     } else {
  //       return lhs.created > rhs.created ? 1 : 0;
  //     }
  //   });

  //   req.body.widgets.sort(function (lhs, rhs) {
  //     if (lhs.created < rhs.created) {
  //       return -1;
  //     } else {
  //       return lhs.created > rhs.created ? 1 : 0;
  //     }
  //   });


};

exports.editWidget = function (req, res) {
  var widgetId = req.params.widget;
  Widget.findOne({ _id: widgetId })
    .exec(function (err, _widget) {
      if (err) {
        logController.logError(req, 'DashboardEditWidget', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        res.status(400).send({
          success: false,
          message: errorHandler.getErrorMessage(err)
        });
      } else if (_widget !== undefined && _widget._id !== undefined) {
        _widget.type = req.body.type;
        _widget.dataKey = req.body.dataKey;
        _widget.widgetName = req.body.name;
        _widget.thingsId = req.body.thingID;
        _widget.dashboardId = req.params.dashboard;
        _widget.owner = req.user._id;
        _widget.settings = {
          url: req.body.url,
          unit: req.body.unit,
          minValue: req.body.minValue,
          maxValue: req.body.maxValue,
          offText: req.body.offText,
          onText: req.body.onText
        };
        _widget.save(function (err, _widget) {
          if (err) {
            logController.logError(req, 'DashboardEditSaveWidget', 'false',
              JSON.stringify({ success: false, error: err.message }),
              res, function (err, result) {

              });
            res.status(400).send({
              success: false,
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp({ success: true, widget: _widget });
          }
        });
      } else {
        res.send({ success: false, message: 'WIDGET is invalid' });
      }
    });
};

exports.deleteWidget = function (req, res) {
  var dashboardId = req.params.dashboard;
  var widgetId = req.params.widget;
  Widget.remove({ _id: widgetId }, function (err, response) {
    if (err) {
      logController.logError(req, 'DashboardDeleteWidget', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      
      Dashboard.findOneAndUpdate({ _id: dashboardId }, { $pull: { widgetId: widgetId } }, { new: true }, function (err, dashboard) {
        if (err) {
          logController.logError(req, 'DashboardDeleteUpdateWidget', 'false',
            JSON.stringify({ success: false, error: err.message }),
            res, function (err, result) {

            });
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(dashboard);
        }
      });
      res.json({ success: true, message: response });
    }
  });
};

exports.update = function (req, res) {
  Dashboard.findOne({ _id: req.body.widgetID })
    .exec(function (err, _widget) {
      if (err) {
        logController.logError(req, 'DashboardUpdateWidget', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        res.status(400).send({
          success: false,
          message: errorHandler.getErrorMessage(err)
        });
      } else if (_widget !== undefined && _widget._id !== undefined) {
        _widget.widgetName = req.body.widgetName;
        _widget.groupID = req.body.groupID;
        _widget.groupName = req.body.groupName;
        _widget.thingsID = req.body.thingsID;
        _widget.thingsName = req.body.thingsName;
        _widget.datasourceKey = req.body.datasourceKey;
        _widget.widgetType = req.body.widgetType;
        _widget.settings = req.body.settings;
        _widget.save(function (err, _widget) {
          if (err) {
            res.status(400).send({
              success: false,
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp({ success: true, sthings: _widget });
          }
        });
      } else {
        res.send({ success: false, message: 'WIDGET is invalid' });
      }
    });
};

exports.getWidget = function (req, res) {

  if (req.user === null || req.user === undefined) {
    return res.json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
  }
  // // console.log(req.params);
  if (req.params.dashboardId === null || req.params.dashboardId === undefined) {
    return res.json({ success: false, message: 'dashboardId is null' });
  }

  Dashboard
    .findById(req.params.dashboardId)
    .populate('widgetId')
    .exec(function (err, dashboard) {
      if (err) {
        logController.logError(req, 'DashboardGetWidget', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        res.json({ success: false, message: errorHandler.getErrorMessage(err) });
      } else {
        if (dashboard && dashboard.widgetId && dashboard.widgetId.length > 0) {
          var widgets = [];
          async.each(dashboard.widgetId, function (item, callback) {
            var widget = item.toJSON();
            // widgets.push(widget);
            // callback();
            // ThingsData.getLastData(widget.thingsId)
            // Things.findByIDWithStatus(widget.thingsId)
            Things.findByID(widget.thingsId)
              .then(function (things) {
                things = things.toJSON();
                if (things.thingsData === null || things.thingsData === undefined) {
                  things.thingsData = null;
                } else {
                  things.thingsData = JSON.parse(things.thingsData);
                }
                widget.things = things;
                widgets.push(widget);
                callback();
              })
              .catch(function (err) {
                console.log(err);
                callback(err);
              });
          }, function (err) {
            if (err) {
              console.log(err);
              return res.json({ success: false, message: errorHandler.getErrorMessage(err) });
            }
            dashboard = dashboard.toJSON();
            delete dashboard.widgetId;
            widgets.sort(function (a, b) {
              /* eslint-disable */
              return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);
            });
            dashboard.widgets = widgets;
            res.json({ success: true, data: dashboard });
          });
        } else {
          res.json({ success: true, data: dashboard });
        }
      }
    });

};
