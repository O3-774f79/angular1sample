'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  History = mongoose.model('History'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a History
 */
exports.create = function(req, res) {
  var history = new History(req.body);
  history.user = req.user;

  history.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(history);
    }
  });
};

/**
 * Show the current History
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var history = req.history ? req.history.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  history.isCurrentUserOwner = req.user && history.user && history.user._id.toString() === req.user._id.toString();

  res.jsonp(history);
};

/**
 * Update a History
 */
exports.update = function(req, res) {
  var history = req.history;

  history = _.extend(history, req.body);

  history.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(history);
    }
  });
};

/**
 * Delete an History
 */
exports.delete = function(req, res) {
  var history = req.history;

  history.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(history);
    }
  });
};

/**
 * List of Histories
 */
exports.list = function(req, res) {
  History.find().sort('-created').populate('user', 'displayName').exec(function(err, histories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(histories);
    }
  });
};

/**
 * History middleware
 */
exports.historyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'History is invalid'
    });
  }

  History.findById(id).populate('user', 'displayName').exec(function (err, history) {
    if (err) {
      return next(err);
    } else if (!history) {
      return res.status(404).send({
        message: 'No History with that identifier has been found'
      });
    }
    req.history = history;
    next();
  });
};
