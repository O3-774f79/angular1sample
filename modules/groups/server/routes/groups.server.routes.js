'use strict';

/**
 * Module dependencies
 */
var groupsPolicy = require('../policies/groups.server.policy'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  groups = require('../controllers/groups.server.controller');

module.exports = function (app) {
  // Groups Routes
  app.post('/api/groups', User.getUserByToken, groups.create);
  app.get('/api/groups', User.getUserByToken, groups.list);
  app.get('/api/groupsWithThings', User.getUserByToken, groups.listWithThing);
  app.get('/api/groups/:groupId', User.getUserByToken, groups.read);
  app.get('/api/groups/choosething/:thingsId', User.getUserByToken, groups.choosething);
  app.post('/api/groups/:groupId/update', User.getUserByToken, groups.update);
  app.post('/api/groups/:groupId/delete', User.getUserByToken, groups.delete);

};
