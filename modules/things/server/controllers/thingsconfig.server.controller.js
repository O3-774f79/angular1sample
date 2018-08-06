'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Thing = mongoose.model('Thing'),
  ThingsConfig = mongoose.model('ThingsConfig'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
var logController = require(path.resolve('./config/logController.js'));

exports.Save = function (req, res) {
  if (!req.user) {
    return res.jsonp({ success: false, message: ' User Not Found ' });
  } else {
    var objId = [];
    async.forEach(req.body.thingsCondition, function (item, cb) {
      if (!item.sendTokenA || !item.DatasourceA || !item.Operator || !item.Number || !item.sendTokenB || !item.DatasourceB) {
        return res.jsonp({ success: false, message: ' กรอกข้อมูล Condition ไม่ครบ ' });
      }
      async.waterfall([
        function (callback) {
          async.series([
            function (callback) {
              Thing.findOne({
                sendToken: item.sendTokenA
              }).exec(function (err, thingsA) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, thingsA);
                }
              });
            },
            function (callback) {
              Thing.findOne({
                sendToken: item.sendTokenB
              }).exec(function (err, thingsB) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, thingsB);
                }
              });
            }
          ],
        function (err, result) {
          if (err) {
            callback(err);
          } else {
            callback(null, result);
          }
        });
        },
        function (arg1, callback) {
          var thingsConfig = new ThingsConfig();
          thingsConfig.thingsIdA = arg1[0]._id;
          thingsConfig.sendTokenA = item.sendTokenA;
          thingsConfig.DatasourceA = item.DatasourceA;
          thingsConfig.Operator = item.Operator;
          thingsConfig.Number = item.Number;
          thingsConfig.thingsIdB = arg1[1]._id;
          thingsConfig.sendTokenB = item.sendTokenB;
          thingsConfig.DatasourceB = item.DatasourceB;
          thingsConfig.owner = req.user._id;
          thingsConfig.save(function (err) {
            if (err) {
              callback(null, err);
            } else {
              callback(null, thingsConfig);
            }
          });
        }
      ], function (err, result) {
        console.log(result);
        objId.push(result.sendTokenA);
        cb();
      });
    }, function(err) {
      if (err) {
        return res.jsonp({ success: false, message: err });
      } else {
        return res.jsonp({ success: true, message: objId });
      }
    });


    // var thingsConfig = new ThingsConfig();
    // thingsConfig.thingsIdA = req.body.thingsIdA;
    // thingsConfig.sendTokenA = req.body.sendTokenA;
    // thingsConfig.DatasourceA = req.body.DatasourceA;
    // thingsConfig.Operator = req.body.Operator;
    // thingsConfig.Number = req.body.Number;
    // thingsConfig.thingsIdB = req.body.thingsIdB;
    // thingsConfig.sendTokenB = req.body.sendTokenB;
    // thingsConfig.DatasourceB = req.body.DatasourceB;
    // thingsConfig.owner = req.user._id;
    // thingsConfig.save(function (err) {
    //   if (err) {
    //     return res.jsonp({ success: false, message: err });
    //   } else {
    //     res.jsonp(thingsConfig);
    //   }
    // });
  }
};
