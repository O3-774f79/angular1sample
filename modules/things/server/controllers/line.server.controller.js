'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Thing = mongoose.model('Thing'),
  Group = mongoose.model('Group'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  LineWebHooks = mongoose.model('LineWebhooks'),
  Line = mongoose.model('Line'),
  User = mongoose.model('User'),
  async = require('async'),
  _ = require('lodash');

function isObject(a) {
  return (!!a) && (a.constructor === Object);
}

exports.webhooks = function (req, res) {

  var event = req.body.events[0];
  // console.log('event', event);
  if (event.message.type !== null && event.message.type !== undefined) {
    event.message.messageType = event.message.type;
  }

  if (event.source.type !== null && event.source.type !== undefined) {
    event.source.sourceType = event.source.type;
  }


  var lineWebHooks = new LineWebHooks(event);
  // console.log('lineWebHooks', lineWebHooks);
  lineWebHooks.save(function (err) {
    if (err) {
      // console.log('error', err);
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    } else {
      // console.log('success');
      if (event.message.type !== null && event.message.type !== undefined && event.message.type === 'text') {
        if (event.message.text !== null && event.message.text !== undefined && event.message.text.toUpperCase() === 'STATUS' && event.source.userId !== null && event.source.userId !== undefined) {
          var userId = event.source.userId;
          User.getUserByLineId(userId)
            .then(function (user) {
              return getThingsListTxt(user._id);
            })
            .then(function (mgs) {
              var message = Line.getMessageTypeText(mgs);
              Line.pushMessage(userId, message)
                .then(function () {
                  res.json({ success: true });
                })
                .catch(function (err) {
                  res.json({ success: false, message: errorHandler.getErrorMessage(err) });
                });
            })
            .catch(function (err) {
              res.json({ success: false, message: errorHandler.getErrorMessage(err) });
            });
        }
      } else {
        res.json({ success: true });
      }
    }
  });
};


exports.getUserProfile = function (req, res) {
  // console.log('getUserProfile');
  var userId = req.body.userId;
  // console.log('userId', userId);
  Line.getProfile(userId)
    .then(function (profile) {
      res.json({ success: true, profile: profile });
    })
    .catch(function (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    });
};


exports.pushMessage = function (req, res) {
  var userId = req.body.userId;
  var message = Line.getMessageTypeText(req.body.message);
  Line.pushMessage(userId, message)
    .then(function () {
      res.json({ success: true });
    })
    .catch(function (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    });
};


exports.replyMessage = function (req, res) {
  var replyToken = req.body.replyToken;
  var message = Line.getMessageTypeText(req.body.message);
  Line.replyMessage(replyToken, message)
    .then(function () {
      res.json({ success: true });
    })
    .catch(function (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    });
};

exports.lindLogin = function (req, res) {
  // console.log(req.body);
};

function getThingsListTxt(userId) {
  return new Promise(function (resolve, reject) {
    Thing.find({ own: userId }).exec(function (err, thingsAll) {
      if (err) {
        reject(err);
      } else {
        var data = '';
        if (thingsAll.length > 0) {
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
              reject(err);
            } else {
              resolve(data);
            }
          });
        } else {
          resolve('ไม่พบ Things');
        }
      }
    });
  });
}
