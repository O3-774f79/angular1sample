'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Thing = mongoose.model('Thing'),
  ThingsConfig = mongoose.model('ThingsConfig'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
var logController = require(path.resolve('./config/logController.js'));

exports.save = function (req, res) {
  if (!req.user) {
    return res.jsonp({ success: false, message: ' User Not Found ' });
  } else {
    var param = req.body.param;
    if (!param.sendTokenA || !param.DatasourceA ||
      !param.Operator || !param.Number ||
      !param.sendTokenB || !param.DatasourceB) {
      return res.jsonp({ success: false, message: ' กรอกข้อมูล Condition ไม่ครบ ' });
    }
    async.waterfall([
      function (callback) {
        async.series([
          function (callback) {
            Thing.findOne({
              sendToken: param.sendTokenA
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
              sendToken: param.sendTokenB
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
        thingsConfig.ThingNameA = arg1[0].thingsName;
        thingsConfig.sendTokenA = param.sendTokenA;
        thingsConfig.DatasourceA = param.DatasourceA;
        thingsConfig.Operator = param.Operator;
        thingsConfig.Number = param.Number;
        thingsConfig.thingsIdB = arg1[1]._id;
        thingsConfig.ThingNameB = arg1[1].thingsName;
        thingsConfig.sendTokenB = param.sendTokenB;
        thingsConfig.DatasourceB = param.DatasourceB;
        thingsConfig.owner = req.user._id;
        thingsConfig.save(function (err) {
          if (err) {
            callback(null, err);
          } else {
            console.log(thingsConfig);
            callback(null, thingsConfig);
          }
        });
      }
    ], function (err, result) {
      if (err) {
        return res.jsonp({ success: false, message: err });
      } else {
        return res.jsonp({ success: true, message: result });
      }
    });
  }
};
exports.listall = function (req, res) {
  ThingsConfig.find({
    Active: true
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
    var param = req.body.param;
    if (!param.sendTokenA || !param.DatasourceA || !param.Operator || !param.Number || !param.sendTokenB || !param.DatasourceB) {
      return res.jsonp({ success: false, message: ' กรอกข้อมูล Condition ไม่ครบ ' });
    }
    async.waterfall([
      function (callback) {
        async.series([
          function (callback) {
            Thing.findOne({
              sendToken: param.sendTokenA
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
              sendToken: param.sendTokenB
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
        ThingsConfig.findOne({ _id: param.conId })
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
              _things.ThingNameA = arg1[0].thingsName;
              _things.sendTokenA = param.sendTokenA;
              _things.DatasourceA = param.DatasourceA;
              _things.Operator = param.Operator;
              _things.Number = param.Number;
              _things.thingsIdB = arg1[1]._id;
              _things.ThingNameB = arg1[1].thingsName;
              _things.sendTokenB = param.sendTokenB;
              _things.DatasourceB = param.DatasourceB;
              _things.Active = param.active;
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
      if (err) {
        return res.jsonp({ success: false, message: err });
      } else {
        return res.jsonp({ success: true, message: result });
      }
    });
  }
};

exports.delete = function (req, res) {
  ThingsConfig.remove({
    _id: req.body.conId
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
