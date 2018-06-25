'use strict';

var fs = require('fs');

module.exports = {
  secure: {
    ssl: false,
    privateKey: './config/cert/privkey1.pem',
    certificate: './config/cert/cert1.pem'
    // caBundle: './config/sslcerts/cabundle.crt'
  },
  port: process.env.PORT || 3000,
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://52.74.30.1:24816/iot-v2',
    // // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27019/iot',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-v2',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost:27019/iot',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://172.17.0.2:27017/magellen',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://103.20.205.104:27019/magellen',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://172.17.0.8:27017/magellen',
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://10.1.1.21:27017/magellen',

    options: {
      // user: 'iot',
      // pass: 'P@ssw0rd_IOT_MIMO'
      user: 'magellenUser',
      pass: 'M4ge11eN'
      // user: '',
      // pass: ''
      /**
        * Uncomment to enable ssl certificate based authentication to mongodb
        * servers. Adjust the settings below for your specific certificate
        * setup.
        * for connect to a replicaset, rename server:{...} to replset:{...}
      server: {
        ssl: true,
        sslValidate: false,
        checkServerIdentity: false,
        sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
        sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
        sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
        sslPass: '1234'
      }
      */
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1949012908677310',
    clientSecret: process.env.FACEBOOK_SECRET || 'c2772ef02aacbf4c64193668812badaf',
    callbackURL: '/api/auth/facebook/callback'
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
    sandbox: false
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
