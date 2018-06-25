'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  Schema = mongoose.Schema,
  _ = require('lodash');
/**
 * Thing Group Schema
 */
var ThingGroupSchema = new Schema({
  thingsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thing'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  created: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

ThingGroupSchema.statics.findByGroups = function (groups) {
  var ThingGroup = mongoose.model('ThingGroup');
  var Thing = mongoose.model('Thing');
  return new Promise(function (resolve, reject) {
    var result = [];
    var thingsdata = [];
    async.forEach(groups, function (item, callback) {
      ThingGroup.find({ group: item._id }).populate('thingsId').exec(function (err, thingGroup) {
        if (err) {
          callback(err);
        } else {
          try {
            item = item.toJSON();
          } catch (err) {
            // console.log(err);
          }
          // item.things = _.map(thingGroup, function (e) { return e.thingToken; });
          // item.things = _.map(thingGroup, function (e) { return e.thingsId === undefined ? null : e.thingsId.thingsName; });
          item.things = _.map(thingGroup, function (e) { return e.thingsId === undefined ? null : e.thingsId; });
          result.push(item);
          callback();
        }
      });
    }, function (err) {
      if (err) {
        // console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

ThingGroupSchema.statics.findThingIdInGroupId = function (thingsId, groupId) {
  var ThingGroup = mongoose.model('ThingGroup');
  return new Promise(function (resolve, reject) {
    // console.log('thingsId: ', thingsId);
    // console.log('groupId: ', groupId);
    ThingGroup.findOne({ thingsId: thingsId, group: groupId })
      .exec(function (err, thingGroup) {
        if (err) {
          reject(err);
        } else {
          // console.log('result: ', thingGroup);
          resolve(thingGroup);
        }
      });
  });
};

mongoose.model('ThingGroup', ThingGroupSchema);
