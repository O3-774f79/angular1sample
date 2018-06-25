'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var ThingDashboardSchema = new Schema({
  created: {
    type: Date,
    default: new Date(),
    index: true
  },
  thingsData: {
    type: String
  },
  sendToken: {
    type: String,
    index: {
      unique: true
    }
  },
  thingsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thing'
  }
});

ThingDashboardSchema.statics.getThingDashboardByTokenSend = function (uuid) {
  var ThingDashboard = mongoose.model('ThingDashboard');
  return new Promise(function (resolve, reject) {
    ThingDashboard.findOne({ sendToken: uuid }).exec(function (err, things) {
      if (err) {
        reject(err);
      } else if (things) {
        resolve(things);
      } else {
        resolve(null);
      }
    });
  });
};
mongoose.model('ThingDashboard', ThingDashboardSchema);
