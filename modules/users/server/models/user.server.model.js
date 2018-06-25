'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  unirest = require('unirest'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  jwt = require('jsonwebtoken'),
  owasp = require('owasp-password-strength-test');

owasp.config(config.shared.owasp);


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * A Validation function for username
 * - at least 3 characters
 * - only a-z0-9_-.
 * - contain at least one alphanumeric character
 * - not in list of illegal usernames
 * - no consecutive dots: "." ok, ".." nope
 * - not begin or end with "."
 */

var validateUsername = function (username) {
  var usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
  return (
    this.provider !== 'local' ||
    (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)
  );
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  newUser: {
    type: Boolean,
    default: true
  },
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    validate: [validateUsername, 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  lineId: String
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
* Generates a random passphrase that passes the owasp test
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

UserSchema.statics.getTokenDoctor = function () {
  return new Promise(function (resolve, reject) {
    var Setting = mongoose.model('Setting');
    Setting.getDoctorAccount()
      .then(function (user) {
        if (user !== undefined) {
          var url = config.domainMHI + '/authen';
          var params = '{ email:' + user.user.toLowerCase() + ', password:' + user.password + '}';
          unirest.post(url)
            .headers({ 'Content-Type': 'application/json' })
            .send(params)
            .timeout(2000)
            .end(function (response) {
              if (response.body !== undefined && response.body.token !== undefined) {
                resolve(response.body.token);
              } else {
                reject(new Error('can not get Token'));
              }
            });
        } else {
          reject(new Error('Please Insert Setting Value USER_DOCTOR and PASSWORD_DOCTOR'));
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

UserSchema.statics.getUserByToken = function (req, res, next) {
  // next();
  var User = mongoose.model('User');
  // console.log('token: ' + req.headers['x-access-token']);
  if (req.headers['x-access-token'] === undefined) {
    next();
  } else {
    jwt.verify(req.headers['x-access-token'], config.sessionSecret, function (err, decoded) {
      if (err) {
        next();
      } else {
        // console.log('decode');
        // console.log('decoded: ', decoded._id);
        User.findOne({ _id: decoded._id }).exec(function (err, user) {
          if (err) {
            console.log('getUserByToken error');
            next();
          } else if (user) {
            req.user = user;
            next();
          } else {
            next();
          }
        });
      }

    });
  }
};

UserSchema.statics.getUserById = function (userId) {
  var User = mongoose.model('User');
  return new Promise(function (resolve, reject) {
    User.findOne({ _id: userId }).exec(function (err, user) {
      if (err) {
        reject(err);
      } else if (user) {
        resolve(user);
      } else {
        reject(new Error('userId invalid'));
      }
    });
  });
};

UserSchema.statics.getUserByLineId = function (lineId) {
  var User = mongoose.model('User');
  return new Promise(function (resolve, reject) {
    User.findOne({ lineId: lineId }).exec(function (err, user) {
      if (err) {
        reject(err);
      } else if (user) {
        resolve(user);
      } else {
        reject(new Error('lindId unregister'));
      }
    });
  });
};

mongoose.model('User', UserSchema);
