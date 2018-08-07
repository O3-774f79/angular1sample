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

exports.save = function (req, res) {
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
  }
};

exports.list = function (req, res) {
  if (!req.user) {
    return res.jsonp({ success: false, message: ' User Not Found ' });
  } else {
    var userid = req.user._id;
    ThingsConfig.find({
      owner: userid
    }).exec(function (err, ThingsCon) {
      if (err) {
        logController.logError(req, 'ThingsConfig', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {
          });
        return res.jsonp({ success: false, message: err });
      } else {
        res.json({ success: true, message: ThingsCon });
      }
    });
  }
};

exports.update = function (req, res) {
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
          ThingsConfig.findOne({ _id: item.thingId })
            .exec(function (err, _things) {
              if (err) {
                logController.logError(req, 'ThingUpdate', 'false',
                    JSON.stringify({ success: false, error: err.message }),
                    res, function (err, result) {

                    });
                res.status(400).send({
                  success: false,
                  message: errorHandler.getErrorMessage(err)
                });
              } else if (_things !== undefined && _things._id !== undefined) {
                _things.thingsIdA = arg1[0]._id;
                _things.sendTokenA = item.sendTokenA;
                _things.DatasourceA = item.DatasourceA;
                _things.Operator = item.Operator;
                _things.Number = item.Number;
                _things.thingsIdB = arg1[1]._id;
                _things.sendTokenB = item.sendTokenB;
                _things.DatasourceB = item.DatasourceB;
                _things.Active = item.active;
                _things.save(function (err, _things) {
                  if (err) {
                    callback(null, err);
                  } else {
                    callback(null, _things);
                  }
                });
              } else {
                res.send({ success: false, message: '_things is invalid' });
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
  }
};

exports.delete = function (req, res) {
  ThingsConfig.remove({
    _id: req.body.thingId
  }, function (err, things) {
    if (err) {
      logController.logError(req, 'ThingsConfig Delete', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {
          });
      return res.send(err);
    } else {
      res.json({ success: true, message: 'Condition Deleted' });
    }
  });
};
