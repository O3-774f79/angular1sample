'use strict';

module.exports = {
  secure: {
    ssl: false, // เปิดการใช้งาน ssl
    privateKey: './config/sslcerts/key.pem', // privateKey SSL
    certificate: './config/sslcerts/cert.pem' // certificate SSL
    // caBundle: './config/sslcerts/cabundle.crt'
  },
  app: {
    title: 'MAGELLAN',
    description: 'MAGELLAN NB-IOT Playground',
    keywords: 'MAGELLAN NB-IOT Playground',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'UA-76185197-2' // ID GOOGLE ANALYTICS
  },
  db: {
    promise: global.Promise
  },
  jwtAge: '1d', // user token expire
  // jwtAge: 30000,
  port: process.env.PORT || 3000, // port server
  host: process.env.HOST || '0.0.0.0', // ip server
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // maxAge: 30000,
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MIMOSANDDLD',
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  uploads: {
    profile: {
      image: {
        dest: './modules/users/client/uploads/',
        limits: {
          fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 6,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  },
  line: {
    token: 'VKi3DtX7DHRFM+njxhEgYTbh8oJtmimqwDzvFJiHNw97wgkwA96GEyenV0S5PpJJEOZqhvMh3mBrL4XVYaQWxqFfbLjoy86tWaFtX86klHneB59oAYj0LdtOsSGEey5L6MvUp/HyvKaVuicjvL2OvwdB04t89/1O/w1cDnyilFU=',
    client_id: '1517608764',
    client_secret: 'bf6772f98e690143bddc7a583f8bc4ee',
    redirect_uri: 'https://iot.dld-test.com'
  }
};
