'use strict';

// Rename this file to local-NODE_ENV.js (i.e. local-development.js, or local-test.js) for having a local configuration variables that
// will not get commited and pushed to remote repositories.
// Use it for your API keys, passwords, etc.

// WARNING: When using this example for multiple NODE_ENV's concurrently, make sure you update the 'db' settings appropriately.
// You do not want to accidentally overwrite/lose any data. For instance, if you create a file for 'test' and don't change the
// database name in the setting below, running the tests will drop all the data from the specified database.
//
// You may end up with a list of files, that will be used with their corresponding NODE_ENV:
//
// local-development.js
// local-test.js
// local-production.js
//

/* For example (Development):
*/
module.exports = {
  db: {
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://52.74.30.1:24816/iot-v2',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://172.17.0.12:27019/magellen',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-v2',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://103.20.205.104:27019/magellen',
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://103.20.204.176:27018/admin/myfarm',
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://localhost:27018/admin/myfarm',
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
  }
};

