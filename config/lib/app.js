'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./seed');

var path = require('path');
var fs = require('fs');
var http = require('http');
var https = require('https');
// var redisclient = require('./redisclient');


function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);

  });


};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {
    if (config.secure && config.secure.ssl === true) {
      var privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
      var certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
      var caBundle;

      try {
        caBundle = fs.readFileSync(path.resolve(config.secure.caBundle), 'utf8');
      } catch (err) {
        console.log('Warning: couldn\'t find or read caBundle file');
      }
      var options = {
        key: privateKey,
        cert: certificate,
        ca: caBundle,
        //  requestCert : true,
        //  rejectUnauthorized : true,
        secureProtocol: 'TLSv1_method',
        ciphers: [
          'ECDHE-RSA-AES128-GCM-SHA256',
          'ECDHE-ECDSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES256-GCM-SHA384',
          'ECDHE-ECDSA-AES256-GCM-SHA384',
          'DHE-RSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES128-SHA256',
          'DHE-RSA-AES128-SHA256',
          'ECDHE-RSA-AES256-SHA384',
          'DHE-RSA-AES256-SHA384',
          'ECDHE-RSA-AES256-SHA256',
          'DHE-RSA-AES256-SHA256',
          'HIGH',
          '!aNULL',
          '!eNULL',
          '!EXPORT',
          '!DES',
          '!RC4',
          '!MD5',
          '!PSK',
          '!SRP',
          '!CAMELLIA'
        ].join(':'),
        honorCipherOrder: true
      };

      var httpsServer = https.createServer(options, app);
      httpsServer.listen(config.port);
    } else {
      var httpServer = http.createServer(app);
      httpServer.listen(config.port);
    }
    // Start the app by listening on <port> at <host>
    // app.listen(config.port, config.host, function () {
    //   // Create server URL
    var server = ((config.secure && config.secure.ssl === true) ? 'https://' : 'http://') + config.host + ':' + config.port;
    // Logging initialization
    console.log('config secure ssl : ', config.secure.ssl);

    console.log('--');
    console.log(chalk.green(config.app.title));
    console.log();
    console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
    console.log(chalk.green('Server:          ' + server));
    console.log(chalk.green('Database:        ' + config.db.uri));
    console.log(chalk.green('App version:     ' + config.meanjs.version));
    if (config.meanjs['meanjs-version'])
      console.log(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version']));
    console.log('--');

    if (callback) callback(app, db, config);
    // });

  });

};
