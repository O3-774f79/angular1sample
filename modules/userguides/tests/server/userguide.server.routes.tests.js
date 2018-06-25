'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userguide = mongoose.model('Userguide'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userguide;

/**
 * Userguide routes tests
 */
describe('Userguide CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Userguide
    user.save(function () {
      userguide = {
        name: 'Userguide name'
      };

      done();
    });
  });

  it('should be able to save a Userguide if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userguide
        agent.post('/api/userguides')
          .send(userguide)
          .expect(200)
          .end(function (userguideSaveErr, userguideSaveRes) {
            // Handle Userguide save error
            if (userguideSaveErr) {
              return done(userguideSaveErr);
            }

            // Get a list of Userguides
            agent.get('/api/userguides')
              .end(function (userguidesGetErr, userguidesGetRes) {
                // Handle Userguides save error
                if (userguidesGetErr) {
                  return done(userguidesGetErr);
                }

                // Get Userguides list
                var userguides = userguidesGetRes.body;

                // Set assertions
                (userguides[0].user._id).should.equal(userId);
                (userguides[0].name).should.match('Userguide name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userguide if not logged in', function (done) {
    agent.post('/api/userguides')
      .send(userguide)
      .expect(403)
      .end(function (userguideSaveErr, userguideSaveRes) {
        // Call the assertion callback
        done(userguideSaveErr);
      });
  });

  it('should not be able to save an Userguide if no name is provided', function (done) {
    // Invalidate name field
    userguide.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userguide
        agent.post('/api/userguides')
          .send(userguide)
          .expect(400)
          .end(function (userguideSaveErr, userguideSaveRes) {
            // Set message assertion
            (userguideSaveRes.body.message).should.match('Please fill Userguide name');

            // Handle Userguide save error
            done(userguideSaveErr);
          });
      });
  });

  it('should be able to update an Userguide if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userguide
        agent.post('/api/userguides')
          .send(userguide)
          .expect(200)
          .end(function (userguideSaveErr, userguideSaveRes) {
            // Handle Userguide save error
            if (userguideSaveErr) {
              return done(userguideSaveErr);
            }

            // Update Userguide name
            userguide.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userguide
            agent.put('/api/userguides/' + userguideSaveRes.body._id)
              .send(userguide)
              .expect(200)
              .end(function (userguideUpdateErr, userguideUpdateRes) {
                // Handle Userguide update error
                if (userguideUpdateErr) {
                  return done(userguideUpdateErr);
                }

                // Set assertions
                (userguideUpdateRes.body._id).should.equal(userguideSaveRes.body._id);
                (userguideUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userguides if not signed in', function (done) {
    // Create new Userguide model instance
    var userguideObj = new Userguide(userguide);

    // Save the userguide
    userguideObj.save(function () {
      // Request Userguides
      request(app).get('/api/userguides')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userguide if not signed in', function (done) {
    // Create new Userguide model instance
    var userguideObj = new Userguide(userguide);

    // Save the Userguide
    userguideObj.save(function () {
      request(app).get('/api/userguides/' + userguideObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userguide.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userguide with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userguides/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userguide is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userguide which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userguide
    request(app).get('/api/userguides/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userguide with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userguide if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userguide
        agent.post('/api/userguides')
          .send(userguide)
          .expect(200)
          .end(function (userguideSaveErr, userguideSaveRes) {
            // Handle Userguide save error
            if (userguideSaveErr) {
              return done(userguideSaveErr);
            }

            // Delete an existing Userguide
            agent.delete('/api/userguides/' + userguideSaveRes.body._id)
              .send(userguide)
              .expect(200)
              .end(function (userguideDeleteErr, userguideDeleteRes) {
                // Handle userguide error error
                if (userguideDeleteErr) {
                  return done(userguideDeleteErr);
                }

                // Set assertions
                (userguideDeleteRes.body._id).should.equal(userguideSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userguide if not signed in', function (done) {
    // Set Userguide user
    userguide.user = user;

    // Create new Userguide model instance
    var userguideObj = new Userguide(userguide);

    // Save the Userguide
    userguideObj.save(function () {
      // Try deleting Userguide
      request(app).delete('/api/userguides/' + userguideObj._id)
        .expect(403)
        .end(function (userguideDeleteErr, userguideDeleteRes) {
          // Set message assertion
          (userguideDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userguide error error
          done(userguideDeleteErr);
        });

    });
  });

  it('should be able to get a single Userguide that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Userguide
          agent.post('/api/userguides')
            .send(userguide)
            .expect(200)
            .end(function (userguideSaveErr, userguideSaveRes) {
              // Handle Userguide save error
              if (userguideSaveErr) {
                return done(userguideSaveErr);
              }

              // Set assertions on new Userguide
              (userguideSaveRes.body.name).should.equal(userguide.name);
              should.exist(userguideSaveRes.body.user);
              should.equal(userguideSaveRes.body.user._id, orphanId);

              // force the Userguide to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Userguide
                    agent.get('/api/userguides/' + userguideSaveRes.body._id)
                      .expect(200)
                      .end(function (userguideInfoErr, userguideInfoRes) {
                        // Handle Userguide error
                        if (userguideInfoErr) {
                          return done(userguideInfoErr);
                        }

                        // Set assertions
                        (userguideInfoRes.body._id).should.equal(userguideSaveRes.body._id);
                        (userguideInfoRes.body.name).should.equal(userguide.name);
                        should.equal(userguideInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Userguide.remove().exec(done);
    });
  });
});
