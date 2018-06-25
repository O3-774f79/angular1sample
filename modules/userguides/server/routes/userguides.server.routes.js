'use strict';

/**
 * Module dependencies
 */
var userguidesPolicy = require('../policies/userguides.server.policy'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  userguides = require('../controllers/userguides.server.controller');

module.exports = function(app) {
  app.post('/api/userguides/contact', User.getUserByToken, userguides.contact);
};
