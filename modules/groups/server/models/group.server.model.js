'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  unirest = require('unirest'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
  groupName: { type: String, index: true },
  groupDesc: { type: String, index: true },
  created: {
    type: Date,
    default: Date.now,
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

GroupSchema.statics.findByUsername = function (username) {
  var Group = mongoose.model('Group');
  return new Promise(function (resolve, reject) {
    Group.find({ ownerUsername: username }).exec(function (err, groups) {
      if (err) {
        reject(err);
      } else {
        resolve(groups);
      }
    });
  });
};

mongoose.model('Group', GroupSchema);
