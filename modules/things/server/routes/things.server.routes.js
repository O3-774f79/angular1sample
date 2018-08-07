'use strict';

/**
 * Module dependencies
 */
var thingsPolicy = require('../policies/things.server.policy'),
  things = require('../controllers/things.server.controller'),
  thingdashboard = require('../controllers/thingdashboard.server.controller'),
  thingconfig = require('../controllers/thingsconfig.server.controller'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  line = require('../controllers/line.server.controller');
module.exports = function (app) {
  // Thing Create, Read, Upadte, Delete
  app.get('/api/things/list/', User.getUserByToken, things.list);
  app.route('/api/things/delete').post(things.delete);
  app.route('/api/things/update').post(things.update);
  app.post('/api/things/add', User.getUserByToken, things.add);
  app.post('/api/things/lastcreated', User.getUserByToken, things.getBylastcreate); // For SCANQR go to last create thing
  // Thing Manage Data From Hardware
  app.post('/api/things/send/activate', things.activateSend);
  app.post('/api/things/receive/activate', things.activateReceive);
  app.post('/api/things/push', things.pushData);
  app.post('/api/things/getData', things.getData);
  // Thing Manage
  app.get('/api/things/detail/:thingId', things.detail);
  app.route('/api/things/detailWithToken/:thingToken').get(things.detailWithToken);
  app.get('/api/things/pull/:token', things.pullData);
  // Widget
  app.get('/api/things/pullWithStatus/:token/:date', things.pullDataWithStaus);
  app.get('/api/things/pullWithStatus/:token', things.pullDataWithStaus);
  app.get('/api/things', User.getUserByToken, things.things);
  // Thing - Group
  app.get('/api/group/:groupId/things', User.getUserByToken, things.getThingInGroup);
  app.get('/api/things/:thingToken/group', User.getUserByToken, things.getGroupInThing);
  app.get('/api/things/:thingId/group/available', User.getUserByToken, things.getAvailableGroupForThing);
  // app.post('/api/things/group/add', User.getUserByToken, things.addGroup);
  app.post('/api/things/group/delete', User.getUserByToken, things.deleteGroup);
  app.get('/api/group/:groupId/things/available', User.getUserByToken, things.getAvailableThingForGroup);
  app.post('/api/things/group/oneadd', User.getUserByToken, things.addOneGroup);
  app.post('/api/things/group/add', User.getUserByToken, things.addThingsToGroup);
  app.post('/api/things/search', User.getUserByToken, things.search);
  // Line
  app.post('/line/webhooks', line.webhooks);
  app.post('/api/line/getProfile', line.getUserProfile);
  app.post('/api/line/pushMessage', line.pushMessage);
  app.post('/api/line/replyMessage', line.replyMessage);
  app.post('/api/sign', things.encode);
  app.post('/api/decode', things.decode);
  // ThingDashboard
  app.post('/api/thingdashboard/push', thingdashboard.pushData);
  app.get('/api/thingdashboard/pull/:token', thingdashboard.pullData);
  // ThingConfig
  app.post('/api/thingconfig/save', User.getUserByToken, thingconfig.save);
  app.get('/api/thingconfig/list', User.getUserByToken, thingconfig.list);
  app.get('/api/thingconfig/listall', User.getUserByToken, thingconfig.listall);
  app.post('/api/thingconfig/edit', User.getUserByToken, thingconfig.update);
  app.route('/api/thingconfig/delete').post(thingconfig.delete);
};
