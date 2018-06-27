'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://52.74.30.1:24816/iot-v2',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://172.17.0.8:27017/magellen',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-v2',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://103.20.205.104:27017/magellen',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://10.1.1.22:27019/magellen',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost:27018/admin/myfarm',
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://103.20.204.176:27018/admin/myfarm',
    options: {
      user: 'admin',
      pass: 'ais.co.th'
      // user: 'iot',
      // pass: 'mimo'
      // pass: 'P@ssw0rd_IOT_MIMO'
      // user: '',
      // pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1949012908677310',
    clientSecret: process.env.FACEBOOK_SECRET || 'c2772ef02aacbf4c64193668812badaf',
    callbackURL: '/api/auth/facebook/callback'
    // callbackURL: 'http//:localhost:3000/auth/facebook/callback'
  },
  twitter: {
    username: '@TWITTER_USERNAME',
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'magellan@magellan.io',
    options: {
      Port: 25,
      secure: true,
      service: process.env.MAILER_SERVICE_PROVIDER || 'mail.aismagellan.io',
      host: process.env.MAILER_SERVICE_PROVIDER || 'mail.aismagellan.io',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'magellan@magellan.io',
        pass: process.env.MAILER_PASSWORD || 'magellan'
      }
    }
  },
  // livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'seeduser',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'seedadmin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
