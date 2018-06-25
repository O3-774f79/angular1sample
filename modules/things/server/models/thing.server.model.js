'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var ThingSchema = new Schema({
  thingsName: { type: String, index: true },
  thingsDesc: { type: String, index: true },
  thingsPermission: { type: String, default: 'Public' },
  refresh: {
    type: Number,
    default: 20
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sendToken: {
    type: String,
    index: {
      unique: true
    }
  },
  sendTokenActive: Boolean,
  receiveToken: String,
  receiveTokenActive: Boolean,
  // thingId: String,
  created: {
    type: Date,
    default: Date.now,
    index: true
  },
  thingsData: {
    type: String
  },
  thingsDataUpdate: {
    type: Date
  }

});


ThingSchema.statics.getThingsByTokenSend = function (uuid) {
  var Thing = mongoose.model('Thing');
  return new Promise(function (resolve, reject) {
    Thing.findOne({ sendToken: uuid }).exec(function (err, things) {
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

ThingSchema.statics.getThingsByTokenReceive = function (uuid) {
  var Thing = mongoose.model('Thing');
  return new Promise(function (resolve, reject) {
    Thing.findOne({ receiveToken: uuid }).exec(function (err, things) {
      if (err) {
        reject(err);
      } else if (things !== null && things !== undefined) {
        resolve(things);
      } else {
        resolve(null);
      }
    });
  });
};

ThingSchema.statics.findByID = function (id) {
  var Thing = mongoose.model('Thing');
  return new Promise(function (resolve, reject) {
    Thing.findOne({ _id: id }).exec(function (err, things) {
      if (err) {
        reject(err);
      } else if (things !== null && things !== undefined) {
        resolve(things);
      } else {
        resolve(null);
      }
    });
  });
};

ThingSchema.statics.updateActive = function (id, type) {
  var Thing = mongoose.model('Thing');
  return new Promise(function (resolve, reject) {
    Thing.findByID(id)
      .then(function (things) {
        if (things !== null) {
          reject(new Error('id invalid'));
        } else {
          if (type === 'send') {
            things.sendTokenActive = true;
          } else if (type === 'receive') {
            things.receiveTokenActive = true;
          } else {
            reject(new Error('type invalid'));
          }

          things.save(function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

ThingSchema.statics.findByIDWithStatus = function (id) {
  var Thing = mongoose.model('Thing');
  var ThingsData = mongoose.model('ThingsData');
  var data = {};
  return new Promise(function (resolve, reject) {
    Thing.findByID(id)
      .then(function (things) {
        data.things = things;
        return ThingsData.getLastData(things._id);
      })
      .then(function (thingsData) {
        var _data = data.things.toJSON();
        if (thingsData !== null) {
          data.thingsData = thingsData;

          var refresh = 100;
          if (data.things.refresh) {
            refresh = data.things.refresh;
          }
          var nowDate = new Date();
          var diffDate = nowDate - thingsData.created;
          var Seconds_from_T1_to_T2 = diffDate / 1000;
          var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
          var thingsStatus = true;
          if (refresh < Seconds_Between_Dates) {
            thingsStatus = false;
          }
          var _thingsData = JSON.parse(thingsData.data);
          _data.status = thingsStatus;
          _data.thingsData = _thingsData;
          _data.thingDataUpdateDate = thingsData.created;
          resolve(_data);
        } else {
          _data.status = false;
          _data.thingsData = null;
          resolve(_data);
        }

      })
      .catch(function (err) {
        reject(err);
      });
  });
};


mongoose.model('Thing', ThingSchema);
