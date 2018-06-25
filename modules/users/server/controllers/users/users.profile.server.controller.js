'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Line = mongoose.model('Line'),
  jwt = require('jsonwebtoken'),
  validator = require('validator');

var whitelistedFields = ['firstName', 'lastName', 'email', 'username'];

var logController = require(path.resolve('./config/logController.js'));

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        logController.logError(req, 'ProfileUpdate', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var existingImageUrl;

  // Filtering to upload only images
  var multerConfig = config.uploads.profile.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(function () {
        res.json(user);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateUser() {
    return new Promise(function (resolve, reject) {
      user.profileImageURL = config.uploads.profile.image.dest + req.file.filename;
      user.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
        fs.unlink(existingImageUrl, function (unlinkError) {
          if (unlinkError) {
            // console.log(unlinkError);
            reject({
              message: 'Error occurred while deleting old profile picture'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  function login() {
    return new Promise(function (resolve, reject) {
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      newUser: req.user.newUser,
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};

exports.newUser = function (req, res) {
  // console.log(req.body.checkskip);
  // console.log(req.user);
  var checkskip = req.body.checkskip;
  if (checkskip === undefined || checkskip === false || checkskip === 'undefined' || checkskip === 'false') {
    User.findOne({
      username: req.user.username.toLowerCase()
    }).exec(function (err, _user) {
      if (err) {
        logController.logError(req, 'ProfileCreate', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
        res.status(400).send({
          success: false,
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        _user.newUser = true;
        _user.save(function (err, _user) {
          if (err) {
            logController.logError(req, 'ProfileCreatSeave', 'false',
            JSON.stringify({ success: false, error: err.message }),
            res, function (err, result) {

            });
            res.status(400).send({
              success: false,
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp({ success: true, user: _user });
          }
        });
      }
    });
  } else if (checkskip === true || checkskip === 'true') {
    User.findOne({
      username: req.user.username.toLowerCase()
    }).exec(function (err, _user) {
      if (err) {
        logController.logError(req, 'ProfileCreate', 'false',
        JSON.stringify({ success: false, error: err.message }),
        res, function (err, result) {

        });
        res.status(400).send({
          success: false,
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        _user.newUser = false;
        _user.save(function (err, _user) {
          if (err) {
            res.status(400).send({
              success: false,
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp({ success: true, user: _user });
          }
        });
      }
    });
  } else {
    res.jsonp({ success: false, res: req.body.checkskip });
  }
};

exports.getUserByToken = function (req, res, next) {
  if (req.headers['x-access-token'] === undefined) {
    next();
  } else {
    jwt.verify(req.headers['x-access-token'], config.sessionSecret, function (err, userId) {
      if (err) {
        next();
      } else {
        User.find({ _id: userId }).exec(function (err, user) {
          if (err) {
            next();
          } else if (user) {
            req.user = user;
          } else {
            req.user = null;
          }
        });
      }

    });
  }
};

exports.updateLineAcc = function (req, res) {
  // console.log('updateLineAcc');
  var data = {};
  var user;
  if (!req.user) {
    return res.json({ success: false, message: 'กรูณาเข้าสู่ระบบ' });
  }
  // console.log('user', user);
  User.getUserById(req.user._id)
    .then(function (_user) {
      data.user = _user;
      user = _user;
      return Line.geTokenByCode(req.body.lineCode);
    })
    .then(function (objToken) {
      data.objToken = objToken;
      return Line.getUserByToken(objToken.access_token);
    })
    .then(function (lineUser) {
      var lineUserId = lineUser.userId;
      user.lineId = lineUserId;
      user.save(function (err) {
        if (err) {
          logController.logError(req, 'ProfileUpdateLine', 'false',
          JSON.stringify({ success: false, error: err.message }),
          res, function (err, result) {

          });
          res.json({ success: false, message: errorHandler.getErrorMessage(err) });
        } else {
          res.json({ success: true });
        }
      });
    })
    .catch(function (err) {
      res.json({ succcess: false, message: errorHandler.getErrorMessage(err) });
    });
};
