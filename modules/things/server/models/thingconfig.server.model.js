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
var ThingsConfigSchema = new Schema({
  thingsIdA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thing'
  },
  sendTokenA: String,
  DatasourceA: String,
  Operator: String,
  Number: Number,
  thingsIdB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thing'
  },
  sendTokenB: String,
  DatasourceB: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: new Date(),
    index: true
  }
});

ThingsConfigSchema.statics.getLastData = function (thingId) {
  var ThingsData = mongoose.model('ThingsData');
  return new Promise(function (resolve, reject) {
    ThingsData.findOne({ thingsId: thingId })
      .sort({ created: -1 })
      .limit(1)
      .exec(function (err, data) {
        if (err) {
          reject(err);
        } else if (data) {
          if (data.sendToken === undefined || data.sendToken === null || !data.sendToken) {
            var Thing = mongoose.model('Thing');
            Thing.findByID(thingId).then(function (things) {
              data.sendToken = things.sendToken;
              data.save(function (err, cb) {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              });
            }).catch(function (err) {
              reject(err);
            });
          } else {
            resolve(data);
          }
        } else {
          resolve(null);
        }
      });
  });
};

ThingsConfigSchema.statics.getData = function (thingId, startDate, endDate) {
  var ThingsData = mongoose.model('ThingsData');
  return new Promise(function (resolve, reject) {
    var q = {};
    if (thingId !== null && thingId !== undefined) {
      q.thingsId = thingId;
    } else {
      return reject(new Error('thingId is null'));
    }

    if (startDate !== null && startDate !== undefined && endDate !== null && endDate !== undefined) {
      q.created = { $gte: startDate, $lt: endDate };
    } else {
      return reject(new Error('startDate or enDate is null'));
    }

    ThingsData.find(q).exec(function (err, data) {
      if (err) {
        reject(err);
      } else {
        if (data.length > 0) {
          var _data = [];
          for (var i = 0; i < data.length; i++) {
            var item = {};
            item.data = JSON.parse(data[i].data);
            item.created = data[i].created;
            _data.push(item);
          }
          resolve(_data);
        } else {
          resolve([]);
        }
      }
    });
  });
};

mongoose.model('ThingsConfig', ThingsConfigSchema);
