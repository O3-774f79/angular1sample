'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Search = mongoose.model('Search'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  Group = mongoose.model('Group'),
  Widget = mongoose.model('Widget'),
  async = require('async'),
  Dashboard = mongoose.model('Dashboard'),
  Thing = mongoose.model('Thing');

var logController = require(path.resolve('./config/logController.js'));
const escapeStringRegexp = require('escape-string-regexp');
/**
 * Create a Search
 */
exports.query = function(req, res) {
  var userid = req.user._id;
  Thing.find({
    owner: userid, thingsName: req.body.keyword
  }).exec(function (err, Things) {
    if (err) {
      logController.logError(req, 'SearchQuery', 'false',
      JSON.stringify({ success: false, error: err.message }),
      res, function (err, result) {

      });
      return res.jsonp({ success: false, message: err });
    } else {
      res.json({ success: true, message: Things });
    }
  });


};
exports.search = function (req, res) {
  var search = req.params.key;
  var userid = req.user._id;
  var result = [];
  const escapedString = escapeStringRegexp(search);
  async.waterfall([
    function (callback) {
      Thing.find({ thingsName: new RegExp('.*' + escapedString + '.*', 'i'), owner: userid }, function(err, doc) {
        if (err) {
          logController.logError(req, 'Searchfind', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
          return res.jsonp({ success: false, message: err });
        } else {
          doc.forEach(function(item) {
            var thing = {};
            thing.name = item.thingsName;
            thing.id = item._id;
            thing.type = 'Things';
            result.push(thing);
          });
          // result.things = doc;
          callback();
        }
      });
    },
    function (callback) {
      Group.find({ groupName: new RegExp('.*' + escapedString + '.*', 'i'), owner: userid }, function(err, doc) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          doc.forEach(function(item) {
            var group = {};
            group.name = item.groupName;
            group.id = item._id;
            group.type = 'Group';
            result.push(group);
          });
          // result.items.push(doc);
          callback();
        }
      });
    },
    function (callback) {
      Widget.find({ widgetName: new RegExp('.*' + escapedString + '.*', 'i'), owner: userid }, function(err, doc) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          async.each(doc,
            function(item, cb) {
              Dashboard.findOne({
                _id: item.dashboardId
              }).exec(function (err, dashboards) {
                if (err) {
                  cb(err);
                } else if (dashboards) {
                  var dbname = dashboards;
                  var widget = {};
                  widget.name = item.widgetName + ' - ' + dashboards.dashboardName;
                  widget.id = item.dashboardId;
                  widget.type = 'Widget';
                  result.push(widget);
                  cb();
                } else {
                  cb();
                }
              });
            },
            function(err) {
              if (err) {
                callback(err);
              } else {
                callback();
              }
            }
          );
        }
      });
    }
  ], function (err) {
    if (err) {
      return res.jsonp({ success: false, message: err });
    }
    res.json({ success: true, data: result });
  });

};
