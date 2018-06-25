'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Group = mongoose.model('Group'),
  Thing = mongoose.model('Thing'),
  ThingGroup = mongoose.model('ThingGroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var logController = require(path.resolve('./config/logController.js'));

/**
 * Create a Group
 */
exports.create = function (req, res) {
  var group = new Group();
  group.groupName = req.body.groupName;
  group.groupDesc = req.body.groupDesc;
  group.owner = req.user._id;
  group.save(function (err) {
    if (err) {
      logController.logError(req, 'GroupCreate', 'false',
      JSON.stringify({ success: false, error: err.message }),
      res, function (err, result) {

      });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(group);
    }
  });
};

// /**
//  * List of Groups
//  */
exports.list = function (req, res) {

  Group.find({ owner: req.user._id })
    .then(function (groups) {
      var groupIds = [];
      for (var i = 0; i < groups.length; i += 1) {
        var item = groups[i];
        groupIds.push(item);
      }
      // console.log(groupIds);
      return ThingGroup.findByGroups(groupIds);
    })
    .then(function (thingGroups) {
      res.json({ success: true, data: thingGroups });
    })
    .catch(function (err) {
      res.json({ success: false, message: err });
    });
};

/**
 * List of Groups with Things
 */
exports.listWithThing = function (req, res) {
  Group.find({ owner: req.user._id }).sort('-created').exec(function (err, groups) {
    if (err) {
      logController.logError(req, 'GroupListWithThing', 'false',
      JSON.stringify({ success: false, error: err.message }),
      res, function (err, result) {

      });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var thingGroupReqs = _.map(groups, function (e) {
        return ThingGroup.find({
          group: e._id
        });
      });

      Promise.all(thingGroupReqs).then(function (things) {
        var groupWithThing = [];

        for (var i = 0; i < groups.length; i++) {
          groupWithThing.push(_.extend({ 'things': _.map(things[i], function(e) { return e.thingToken; }) }, groups[i].toObject()));
        }

        res.json(groupWithThing);
      });
    }
  });
};
/**
 * Show a Choosething
 */
exports.choosething = function (req, res) {
  // console.log(req.params.thingsId);
  var testb = JSON.stringify(req.params.thingsId);
  // console.log(testb.length);
  // for (var i = 0; i < testb.length; i++) {
  //   // console.log("................");
  //   // console.log(testb[i]);
  // }
  Thing.find({ owner: req.user._id, _id: req.params.thingsId }).exec(function (err, thing) {
    if (err) {
      logController.logError(req, 'GroupChooseThing', 'false',
      JSON.stringify({ success: false, error: err.message }),
      res, function (err, result) {

      });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(thing);
    }
  });
};
/**
 * Show a Group
 */
exports.read = function (req, res) {
  Group.findOne({ owner: req.user._id, _id: req.params.groupId }).exec(function (err, groups) {
    if (err) {
      logController.logError(req, 'GroupRead', 'false',
      JSON.stringify({ success: false, error: err.message }),
      res, function (err, result) {

      });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groups);
    }
  });
};

/**
 * Update a Group
 */
exports.update = function (req, res) {
  Group.findOneAndUpdate({ owner: req.user._id, _id: req.params.groupId }, { $set: { groupName: req.body.groupName, groupDesc: req.body.groupDesc } }, { new: true }).exec(function (err, groups) {
    if (err) {
      logController.logError(req, 'GroupUpdate', 'false',
      JSON.stringify({ success: false, error: err.message }),
      res, function (err, result) {

      });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groups);
    }
  });
};

/**
 * Delete a Group
 */
exports.delete = function (req, res) {
  Group.findOneAndRemove({ owner: req.user._id, _id: req.params.groupId }).exec(function (err, groups) {
    if (err) {
      logController.logError(req, 'GroupDelete', 'false',
      JSON.stringify({ success: false, error: err.message }),
      res, function (err, result) {

      });
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      ThingGroup.remove({
        group: req.params.groupId
      }, function (err, thingGroup) {
        if (err) return res.send(err);
        // console.log('ThingGroup Deleted');
        res.jsonp(groups);
      });
    }
  });
};
