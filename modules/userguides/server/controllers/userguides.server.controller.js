'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  mongoose = require('mongoose'),
  Userguide = mongoose.model('Userguide'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  smtpTransport = nodemailer.createTransport(config.mailer.options),
  _ = require('lodash');
var logController = require(path.resolve('./config/logController.js'));

exports.contact = function (req, res, next) {
  async.waterfall([
    function (done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      res.render(path.resolve('modules/userguides/server/templates/contact'), {
        name: req.body.email,
        appName: config.app.title,
        subject: req.body.subject,
        message: req.body.message
      }, function (err, emailHTML) {
        done(err, emailHTML);
      });
    },
    function (emailHTML, done) {
      var mailOptions = {
        to: config.mailer.from,
        from: config.mailer.from,
        subject: 'Contact Form :' + req.user.email,
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          logController.logError(req, 'smtpTransport.sendMail ', 'false',
          JSON.stringify({ mailOp: mailOptions, SMTP: config.mailer.options }),
          res, function (err, result) {
          });
          res.send({
            message: 'ส่งการติดต่อสำเร็จ.'
          });
        } else {
          logController.logError(req, 'smtpTransport.sendMail ', 'false',
            JSON.stringify({ mailOp: mailOptions, SMTP: config.mailer.options }),
            res, function (err, result) {

            });
          console.log(err);
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }
        done(err);
      });
    }
  ], function (err) {
    if (err) {
      logController.logError(req, 'function (err', 'false',
        JSON.stringify({ success: false, message: err.message }),
        res, function (err, result) {

        });
      // console.log(err);
      return next(err);
    }
  });
};
