'use strict';

/**
 * Module dependencies
 */
var searches = require('../controllers/searches.server.controller'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Search = mongoose.model('Search'),
  search = require('../controllers/searches.server.controller');
module.exports = function(app) {
  app.post('/api/search/query', User.getUserByToken, search.query);
  app.get('/api/search/:key', User.getUserByToken, search.search);
};
