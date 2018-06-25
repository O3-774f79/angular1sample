'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Thing = mongoose.model('Thing'),
  ThingDashboard = mongoose.model('ThingDashboard');

exports.pushData = function (req, res) {
  Thing.findOne({ sendToken: req.body.token }).exec(function (err, thingsResult) {
    if (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    } else {
      var thingsDashboard = {
        sendToken: req.body.token,
        thingsData: JSON.stringify(req.body.playload),
        thingsId: thingsResult._id
      };
      ThingDashboard.update({ 'sendToken': req.body.token }, thingsDashboard, { upsert: true }).exec(function(err, _thingsdashboard) {
        if (err) {
          res.json({ success: false, message: errorHandler.getErrorMessage(err) });
        } else {
          res.json({ success: true, message: thingsDashboard.thingsId });
        }
      });
    }
  });
};

exports.pullData = function (req, res) {
  var token = req.params.token;
  ThingDashboard.getThingDashboardByTokenSend(token)
    .then(function (things) {
      if (things !== null) {
        if (things.thingsData !== null) {
          var thingsData = JSON.parse(things.thingsData);
          res.json(thingsData);
        } else {
          return res.json({ success: false, message: null });
        }
      } else {
        Thing.findOne({ sendToken: token }).exec(function (err, thingsResult) {
          if (err) {
            return res.json({ success: false, message: err });
          } else if (thingsResult) {
            console.log(thingsResult);
            res.json({ success: false, message: JSON.parse(thingsResult.thingsData) });
          }
        });
      }
    })
    .catch(function (err) {
      res.json({ success: false, message: errorHandler.getErrorMessage(err) });
    });
};
