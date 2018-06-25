'use strict';

/**
 * Module dependencies
 */
var dashboardsPolicy = require('../policies/dashboards.server.policy'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dashboard = mongoose.model('Dashboard'),
  dashboards = require('../controllers/dashboards.server.controller');

module.exports = function (app) {
  // Dashboards Routes
  app.post('/api/dashboards/add', User.getUserByToken, dashboards.add);
  app.get('/api/dashboards/list/:username', User.getUserByToken, dashboards.list);
  app.post('/api/dashboards/id', User.getUserByToken, dashboards.getById);
  app.post('/api/dashboards/lastcreated', User.getUserByToken, dashboards.getBylastcreate);
  app.post('/api/dashboards/firstcreated', User.getUserByToken, dashboards.getByfirstcreate);
  app.post('/api/dashboards/update', User.getUserByToken, dashboards.updateById);
  app.post('/api/dashboards/remove', User.getUserByToken, dashboards.removeById);
  app.get('/api/dashboards/:dashboardId/widgets', User.getUserByToken, dashboards.getWidget);
  // app.post('/api/testredis', User.getUserByToken, dashboards.testRedis);
  // Widgets Routes
  app.post('/api/dashboards/:dashboard/widgets/add', User.getUserByToken, dashboards.addWidget);
  app.post('/api/dashboards/:dashboard/widgets/move', User.getUserByToken, dashboards.moveWidget);
  app.post('/api/dashboards/:dashboard/widgets/:widget/edit', User.getUserByToken, dashboards.editWidget);
  app.post('/api/dashboards/:dashboard/widgets/:widget/delete', User.getUserByToken, dashboards.deleteWidget);
};
