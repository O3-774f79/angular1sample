'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Thing = mongoose.model('Thing'),
  Group = mongoose.model('Group'),
  Widget = mongoose.model('Widget'),
  jwt = require('jsonwebtoken'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ThingsData = mongoose.model('ThingsData'),
  ThingGroup = mongoose.model('ThingGroup'),
  async = require('async'),
  uuidV1 = require('uuid/v1'),
  _ = require('lodash');
var DweetClient = require('node-dweetio');

var logController = require(path.resolve('./config/logController.js'));
/**
 * Create a Thing
 */

exports.update = function (req, res) {
  Thing.findOne({ _id: req.body.thingId })
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
        _things.thingsName = req.body.thingName;
        _things.thingsDesc = req.body.thingDes;
        _things.refresh = req.body.refresh;
        _things.thingsPermission = req.body.thingPermission;
        _things.save(function (err, _things) {
          if (err) {
            res.status(400).send({
              success: false,
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp({ success: true, sthings: _things });
          }
        });
      } else {
        res.send({ success: false, message: 'packageId is invalid' });
      }
    });
};


exports.add = function (req, res) {
  var things = new Thing();
  things.thingsName = req.body.thingsName;
  things.thingsDesc = req.body.thingsDes;
  things.thingsPermission = req.body.permission;
  things.refresh = req.body.timerefresh;
  things.owner = req.user._id;
  if (!req.body.sendToken) {
    things.sendToken = uuidV1();
    things.sendTokenActive = true;
    things.receiveToken = uuidV1();
    things.receiveTokenActive = true;
  } else {
    things.sendToken = req.body.sendToken;
    things.sendTokenActive = true;
    things.receiveToken = uuidV1();
    things.receiveTokenActive = true;
  }
  things.save(function (err) {
    if (err) {
      logController.logError(req, 'ThingSave', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      if (err.code === 11000) {
        // // console.log('>>>>>>>>>>>>' + err);
        return res.jsonp({ success: false, message: 'Already Use SendToken' });
      } else {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    } else {
      res.jsonp(things);
    }
  });
};

exports.list = function (req, res) {
  var userid = req.user._id;
  Thing.find({
    owner: userid
  }).exec(function (err, Things) {
    if (err) {
      logController.logError(req, 'ThingList', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      res.json({ success: true, message: Things });
    }
  });
};
exports.getBylastcreate = function (req, res) {
  var userid = req.user._id;
  Thing.find({
    onwer: userid
  }).sort({ created: -1 }).limit(1)
    .exec(function (err, thing) {
      if (err) {
        logController.logError(req, 'ThingGetLastUpdate', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        return res.jsonp({ success: false, message: err });
      } else {
        res.json({ success: true, message: thing });
      }
    });
};
exports.delete = function (req, res) {

  Thing.remove({
    _id: req.body.thingId
  }, function (err, things) {
    if (err) {
      logController.logError(req, 'ThingDelete', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.send(err);
    } else {
      ThingGroup.remove({
        thingsId: req.body.thingId
      }, function (err, thinggroup) {
        if (err) {
          return res.send(err);
        }
        Widget.remove({
          thingsId: req.body.thingId
        }, function (err, thinggroup) {
          if (err) {
            return res.send(err);
          }
        });
        res.json({ message: 'things Deleted' });
      });
    }
  });
};

// send post token,thingId
exports.activateSend = function (req, res) {
  Thing.findOne({ sendToken: req.body.token })
    .exec(function (err, things) {
      if (err) {
        logController.logError(req, 'ThingActiveSend', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        res.json({ success: false, message: errorHandler.getErrorMessage(err) });
      } else if (things) {
        things.sendTokenActive = true;
        things.thingId = req.body.thingId;
        things.save(function (err) {
          if (err) {
            logController.logError(req, 'ThingActiveSend', 'false',
              JSON.stringify({ success: false, error: err.message }),
              res, function (err, result) {

              });
            res.json({ success: false });
          } else {
            res.json({ success: true });
          }
        });
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'things not found' });
      }
    });
};

exports.activateReceive = function (req, res) {
  Thing.findOne({ receiveToken: req.body.token })
    .exec(function (err, things) {
      if (err) {
        logController.logError(req, 'ThingActiveReceive', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
        res.json({ success: false, message: errorHandler.getErrorMessage(err) });
      } else if (things) {
        things.receiveTokenActive = true;
        things.thingId = req.body.thingId;
        things.save(function (err) {
          if (err) {
            logController.logError(req, 'ThingReceiveUpdate', 'false',
              JSON.stringify({ success: false, error: err.message }),
              res, function (err, result) {

              });
            res.json({ success: false });
          } else {
            res.json({ success: true });
          }
        });
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'things not found' });
      }
    });
};

exports._detail = function (req, res) {
  var reqthingId = req.params.thingId;
  Thing.findOne({
    _id: reqthingId
  }).exec(function (err, things) {
    if (err) {
      logController.logError(req, 'ThingDetail', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      var _things = things.toJSON();
      var thingsObj = { thingId: things._id };
      _things.token = jwt.sign(thingsObj, config.sessionSecret);
      ThingsData.findOne({ thingsId: things._id })
        .sort({ created: -1 })
        .limit(1)
        .exec(function (err, data) {
          if (err) {
            logController.logError(req, 'ThingDetailFind', 'false',
              JSON.stringify({ success: false, error: err.message }),
              res, function (err, result) {

              });
            res.status(404).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            if (data && data.data) {
              var refresh = 20;
              if (things.refresh) {
                refresh = things.refresh;
              }
              var nowDate = new Date();
              var diffDate = nowDate - data.created;
              var Seconds_from_T1_to_T2 = diffDate / 1000;
              var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
              var thingsStatus = true;
              if (refresh < Seconds_Between_Dates) {
                thingsStatus = false;
              }
              var thingsData = JSON.parse(data.data);
              res.json({ success: true, data: _things, thingData: thingsData, status: thingsStatus });
            } else {
              return res.json({ success: true, data: _things, status: false });
            }
          }
        });
    }
  });
};

exports.detail = function (req, res) {
  var reqthingId = req.params.thingId;
  Thing.findOne({
    _id: reqthingId
  }).exec(function (err, things) {
    if (err) {
      console.log('Thing.findOne: ', err);
      logController.logError(req, 'ThingDetail', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      var _things = things.toJSON();
      var thingsObj = { thingId: things._id };
      _things.token = jwt.sign(thingsObj, config.sessionSecret);
      if (_things.thingsData !== null && _things.thingsDataUpdate !== null && _things.thingsData !== undefined && _things.thingsDataUpdate !== undefined) {
        var refresh = 20;
        if (things.refresh) {
          refresh = things.refresh;
        }
        var nowDate = new Date();
        var diffDate = nowDate - _things.thingsDataUpdate;
        var Seconds_from_T1_to_T2 = diffDate / 1000;
        var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
        var thingsStatus = true;
        if (refresh < Seconds_Between_Dates) {
          thingsStatus = false;
        }
        var thingsData = null;
        try {
          thingsData = JSON.parse(_things.thingsData);
        } catch (error) {
          res.json({ error: true, data: _things, status: false });
          // console.log('Thing.findOne: ', err);
          logController.logError(req, 'ThingDetail parse json', 'false',
            JSON.stringify(error),
            res, function (err, result) {
            });
        }
        res.json({ success: true, data: _things, thingData: thingsData, status: thingsStatus });
      } else {
        res.json({ success: true, data: things, status: false });
      }
    }
  });
};


exports._detailWithToken = function (req, res) {
  var reqthingId = req.params.thingId;
  Thing.findOne({
    sendToken: reqthingId
  }).exec(function (err, things) {
    if (err) {
      logController.logError(req, 'ThingDetailWithToken', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      var _things = things.toJSON();
      var thingsObj = { thingId: things._id };
      _things.token = jwt.sign(thingsObj, config.sessionSecret);
      ThingsData.findOne({ thingsId: things._id })
        .sort({ created: -1 })
        .limit(1)
        .exec(function (err, data) {
          if (err) {
            logController.logError(req, 'ThingDetailWithTokenFind', 'false',
              JSON.stringify({ success: false, error: err.message }),
              res, function (err, result) {

              });
            res.status(404).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            if (data && data.data) {
              var refresh = 20;
              if (things.refresh) {
                refresh = things.refresh;
              }
              var nowDate = new Date();
              var diffDate = nowDate - data.created;
              var Seconds_from_T1_to_T2 = diffDate / 1000;
              var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
              var thingsStatus = true;
              if (refresh < Seconds_Between_Dates) {
                thingsStatus = false;
              }
              var thingsData = JSON.parse(data.data);
              res.json({ success: true, data: _things, thingData: thingsData, status: thingsStatus });
            } else {
              return res.json({ success: true, data: _things, status: false });
            }
          }
        });
    }
  });
};

exports.detailWithToken = function (req, res) {
  var reqthingId = req.params.thingId;
  Thing.findOne({
    sendToken: reqthingId
  }).exec(function (err, things) {
    if (err) {
      logController.logError(req, 'ThingDetailWithToken', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      var _things = things.toJSON();
      var thingsObj = { thingId: things._id };
      _things.token = jwt.sign(thingsObj, config.sessionSecret);
      if (_things.thingsData !== null && _things.thingsDataUpdate !== null) {
        var refresh = 20;
        if (things.refresh) {
          refresh = things.refresh;
        }
        var nowDate = new Date();
        var diffDate = nowDate - _things.thingsDataUpdate;
        var Seconds_from_T1_to_T2 = diffDate / 1000;
        var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
        var thingsStatus = true;
        if (refresh < Seconds_Between_Dates) {
          thingsStatus = false;
        }
        var thingsData = JSON.parse(_things.thingsData);
        res.json({ success: true, data: _things, thingData: thingsData, status: thingsStatus });
      } else {
        return res.json({ success: true, data: _things, status: false });
      }
    }
  });
};
function pushDataToDweet(req, res) {
  var dweetio = new DweetClient();
  dweetio.dweet_for(req.body.token, req.body.playload, function (err, dweet) {
    if (err) {
      // console.log('>>>>>' + err + '<<<<<');
    } else {
      // console.log('>>>>>Dweet : success<<<<<');
    }
  });
}


// send POST token,playload
exports.pushData = function (req, res) {
  Thing.getThingsByTokenSend(req.body.token)
    .then(function (things) {
      if (things !== null) {
        var thingsData = new ThingsData();
        thingsData.thingsId = things._id;
        thingsData.sendToken = things.sendToken;
        thingsData.created = new Date();
        thingsData.data = JSON.stringify(req.body.playload);
        thingsData.save(function (err) {
          if (err) {
            logController.logError(req, 'ThingPushData', 'false',
              JSON.stringify({ success: false, error: err.message }),
              res, function (err, result) {

              });
            res.json({ successa: false, message: errorHandler.getErrorMessage(err) });
          } else {
            // res.json({ succcess: true, id: thingsData._id });
            // update Things
            things.thingsData = thingsData.data;
            things.thingsDataUpdate = thingsData.created;
            things.save(function (err, _things) {
              if (err) {
                res.json({ successa: false, message: errorHandler.getErrorMessage(err) });
              } else {
                res.json({ succcess: true, id: thingsData._id });
              }
            });
          }
        });
      } else {
        res.json({ success: false, message: 'token invalid' });
      }
      pushDataToDweet(req, res);
    })
    .catch(function (err) {
      res.json({ successb: false, message: errorHandler.getErrorMessage(err) });
    });

};

exports.pullData = function (req, res) {
  var token = req.params.token;
  Thing.getThingsByTokenSend(token)
    .then(function (things) {
      if (things !== null) {
        if (things.thingsData !== null) {
          var thingsData = JSON.parse(things.thingsData);
          res.json(thingsData);
        } else {
          return res.json({});
        }
      } else {
        res.json({ success: false, message: 'token invalid' });
      }
    })
    .catch(function (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    });

};

exports._pullDataWithStaus = function (req, res) {
  var token = req.params.token;
  var date = null;
  // // console.log('req.params.date : ', req.params.date);
  if (req.params.date !== null && req.params.date !== undefined) {
    date = req.params.date;
  }
  Thing.getThingsByTokenSend(token)
    .then(function (things) {
      if (things !== null) {
        var q = {};
        q.thingsId = things._id;
        if (date !== null) {
          q.created = { $gt: date };
        }
        // console.log('query : ', q);
        ThingsData.findOne(q)
          .sort({ created: -1 })
          .limit(1)
          .exec(function (err, data) {
            if (err) {
              logController.logError(req, 'ThingPullDataStatus', 'false',
                JSON.stringify({ success: false, error: err.message }),
                res, function (err, result) {

                });
              res.status(404).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              if (data && data.data) {
                var refresh = 20;
                if (things.refresh) {
                  refresh = things.refresh;
                }
                var nowDate = new Date();
                var diffDate = nowDate - data.created;
                var Seconds_from_T1_to_T2 = diffDate / 1000;
                var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
                var thingsStatus = true;
                // console.log('refresh : ', refresh);
                // console.log('Seconds_Between_Dates : ', Seconds_Between_Dates);
                if (refresh < Seconds_Between_Dates) {
                  thingsStatus = false;
                }
                var thingsData = JSON.parse(data.data);
                res.json({ success: true, data: thingsData, status: thingsStatus, date: new Date().toISOString(), sendToken: token, thingsDataId: data._id });
              } else {
                return res.json({ success: true, data: null, status: false });
              }
            }
          });
      } else {
        res.json({ success: false, message: 'token invalid' });
      }
    })
    .catch(function (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    });
};

exports.pullDataWithStaus = function (req, res) {
  var token = req.params.token;
  var date = null;
  // // console.log('req.params.date : ', req.params.date);
  if (req.params.date !== null && req.params.date !== undefined) {
    date = req.params.date;
  }
  Thing.getThingsByTokenSend(token)
    .then(function (things) {
      if (things !== null) {
        var thingsData = null;
        var thingsStatus = false;
        if (things.thingsData !== null && things.thingsDataUpdate !== null) {
          thingsData = JSON.parse(things.thingsData);
          var refresh = 5;
          // if (things.refresh) {
          //   refresh = things.refresh;
          // }
          var nowDate = new Date();
          var diffDate = nowDate - things.thingsDataUpdate;
          var Seconds_from_T1_to_T2 = diffDate / 1000;
          var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
          // console.log('>>>>>>>>>>>>>>>>>>>>>');
          // console.log(Seconds_Between_Dates);
          // console.log('>>>>>>>>>>>>>>>>>>>>>');
          thingsStatus = true;
          if (refresh < Seconds_Between_Dates) {
            thingsStatus = false;
            // console.log(refresh);
          }
          if (date !== null) {
            var reqDate = new Date(date);
            if (reqDate >= things.thingsDataUpdate) {
              thingsData = null;
            }
          }
        }
        res.json({ success: true, data: thingsData, status: thingsStatus, date: new Date().toISOString(), sendToken: token });

      } else {
        res.json({ success: false, message: 'token invalid' });
      }
    })
    .catch(function (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    });
};

exports.things = function (req, res) {
  // console.log('user', req.user);
  if (req.user === null || req.user === undefined) {
    return res.json({ success: false, message: 'กรุณาเข้าสู่ระบบ' });
  }

  Thing.find({ own: req.user._id }).exec(function (err, thingsAll) {
    if (err) {
      logController.logError(req, 'Things', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    } else {
      var data = '';
      async.forEachSeries(thingsAll, function (item, cb) {
        Thing.findByIDWithStatus(item._id)
          .then(function (_data) {
            var status = _data.status === true ? 'online' : 'offline';
            data += ' name: ' + _data.thingName + '\n' +
              'description: ' + _data.thingDesc + '\n' +
              'status: ' + status + '\n';
            if (_data.thingsData !== null) {
              for (var key in _data.thingsData) {
                if (_data.thingsData.hasOwnProperty(key)) {
                  data += key + ': ' + _data.thingsData[key] + '\n';
                }
              }
            }
            data += '\n\n';
            cb();
          })
          .catch(function (err) {
            cb(err);
          });
      }, function (err) {
        if (err) {
          res.json({ success: false, message: errorHandler.getErrorMessage(err) });
        } else {
          res.json({ success: true, data: data });
        }
      });
      // res.json({ success: true, data: thingsAll });
    }
  });
};

exports.getData = function (req, res) {

  if (req.body.token === null || req.body.token === undefined) {
    res.json({ success: false, message: 'token undefined' });
  }

  if (req.body.startDate === null || req.body.startDate === undefined) {
    res.json({ success: false, message: 'startDate undefined' });
  }

  if (req.body.endDate === null || req.body.endDate === undefined) {
    res.json({ success: false, message: 'endDate undefined' });
  }


  var thingId = null;
  try {
    Thing.getThingsByTokenSend(req.body.token)
      .then(function (things) {
        if (things === null) {
          return res.json({ success: false, message: 'token invalid' });
        } else {
          return ThingsData.getData(things._id, req.body.startDate, req.body.endDate);
        }
      })
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json({ success: false, message: err });
      });

  } catch (err) {

    // err
    // console.log(err);
    res.json({ success: false, message: 'token invalid' });
  }
};

exports.encode = function (req, res) {
  var token = jwt.sign(req.body.token, config.sessionSecret);
  res.json({ token: token });
};

exports.decode = function (req, res) {
  try {
    var thingId = jwt.verify(req.body.token, config.sessionSecret);
    res.json(thingId);
  } catch (err) {
    // err
    // console.log(err);
    res.json(err);
  }
};

// ไม่ใช้งาน
exports.addOneGroup = function (req, res) {
  var thingGroup = new ThingGroup();
  // console.log(req.body.thingsIdarr);
  thingGroup.thingsId = req.body.thingsId;
  thingGroup.group = req.body.groupId;
  thingGroup.owner = req.user._id;
  thingGroup.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(thingGroup);
    }
  });
};

exports.addThingsToGroup = function (req, res) {
  if (req.user === null || req.user === undefined) {
    return res.json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' });
  }
  if (req.body.groupId === null || req.body.groupId === undefined) {
    return res.json({ success: false, message: 'groupId is null' });
  }
  if (req.body.thingsId === null || req.body.thingsId === undefined || req.body.thingsId.isArray === false) {
    return res.json({ success: false, message: 'thingsId is null' });
  }


  var thingsObjs = [];
  async.forEachSeries(req.body.thingsId, function (item, callback) {
    Thing.findByID(item)
      .then(function (things) {
        if (things === null) {
          callback('ThingsId: ' + item + ' is null');
        } else {
          thingsObjs.push(things);
          return ThingGroup.findThingIdInGroupId(things._id, req.body.groupId);
        }
      })
      .then(function (thingGroup) {
        if (thingGroup !== null && thingGroup !== undefined) {
          callback(new Error('มี things อยู่ในกลุ่มแล้ว'));
        } else {
          callback();
        }
      })
      .catch(function (err) {
        callback(err);
      });
  }, function (err) {
    if (err) {
      logController.logError(req, 'ThingAddToGroup', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    }
    async.forEachSeries(thingsObjs, function (item, callback) {
      var thingGroup = new ThingGroup();
      thingGroup.thingsId = item._id;
      thingGroup.group = req.body.groupId;
      thingGroup.owner = req.user._id;
      thingGroup.save(function (err) {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
    }, function (err) {
      if (err) {
        res.json({ success: false, message: errorHandler.getErrorMessage(err) });
      } else {
        res.json({ success: true });
      }
    });
  });
};

exports.deleteGroup = function (req, res) {
  ThingGroup.remove({
    thingsId: req.body.thingId,
    group: req.body.groupId
  }, function (err, thingGroup) {
    if (err) {
      logController.logError(req, 'ThingDeleteGroup', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.send(err);
    }
    res.json({ message: 'ThingGroup Deleted' });
  });
};

exports.getThingInGroup = function (req, res) {
  var groupId = req.params.groupId;
  ThingGroup.find({
    group: groupId
  }).exec(function (err, thingGroup) {
    if (err) {
      logController.logError(req, 'ThingInGroup', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      res.json(thingGroup);
    }
  });
};

exports.getGroupInThing = function (req, res) {
  var thingId = req.params.thingId;
  ThingGroup.find({
    thingId: thingId
  }).populate('Group').exec(function (err, thingGroup) {
    if (err) {
      logController.logError(req, 'ThingGetGroupIn', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      res.json(thingGroup);
    }
  });
};

exports.getAvailableGroupForThing = function (req, res) {
  var thingId = req.params.thingId;
  ThingGroup.find({
    thingsId: thingId
  }).exec(function (err, thingGroup) {
    if (err) {
      logController.logError(req, 'ThingAvailableGroup', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      Group.find({
        _id: { '$nin': _.map(thingGroup, function (e) { return e.group; }) },
        owner: req.user._id
      }).exec(function (err, groups) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          // console.log(groups);
          res.json(groups);
        }
      });
    }
  });
};

exports.getAvailableThingForGroup = function (req, res) {
  var groupId = req.params.groupId;
  ThingGroup.find({
    group: groupId
  }).exec(function (err, thingGroup) {
    if (err) {
      logController.logError(req, 'ThingAvailabledGroup', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
      return res.jsonp({ success: false, message: err });
    } else {
      Thing.find({
        _id: { '$nin': _.map(thingGroup, function (e) { return e.thingsId; }) },
        owner: req.user._id
      }).exec(function (err, groups) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          res.json(groups);
        }
      });
    }
  });
};

exports.search = function (req, res) {
  var search = req.body.search;
  var userid = req.user._id;
  var result = {};
  async.waterfall([
    function (callback) {
      Thing.find({ thingsName: new RegExp('.*' + search + '.*', 'i'), owner: userid }, function (err, doc) {
        if (err) {
          logController.logError(req, 'ThingSearch', 'false',
            JSON.stringify({ success: false, error: err.message }),
            res, function (err, result) {

            });
          return res.jsonp({ success: false, message: err });
        } else {
          result.things = doc;
          callback();
        }
      });
    },
    function (callback) {
      Group.find({ groupName: new RegExp('.*' + search + '.*', 'i'), owner: userid }, function (err, doc) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          result.groups = doc;
          callback();
        }
      });
    },
    function (callback) {
      Widget.find({ widgetName: new RegExp('.*' + search + '.*', 'i'), owner: userid }, function (err, doc) {
        if (err) {
          return res.jsonp({ success: false, message: err });
        } else {
          result.widgets = doc;
          callback();
        }
      });
    }
  ], function (err) {
    res.json({ success: true, data: result });
  });

};
