'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Thing = mongoose.model('Thing'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  thing;

/**
 * Thing routes tests
 */
describe('Thing CRUD tests', function () {

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

    // Save a user to the test db and create new Thing
    user.save(function () {
      thing = {
        name: 'Thing name'
      };

      done();
    });
  });

  it('should be able to save a Thing if logged in', function (done) {
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

        // Save a new Thing
        agent.post('/api/things')
          .send(thing)
          .expect(200)
          .end(function (thingSaveErr, thingSaveRes) {
            // Handle Thing save error
            if (thingSaveErr) {
              return done(thingSaveErr);
            }

            // Get a list of Things
            agent.get('/api/things')
              .end(function (thingsGetErr, thingsGetRes) {
                // Handle Things save error
                if (thingsGetErr) {
                  return done(thingsGetErr);
                }

                // Get Things list
                var things = thingsGetRes.body;

                // Set assertions
                (things[0].user._id).should.equal(userId);
                (things[0].name).should.match('Thing name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Thing if not logged in', function (done) {
    agent.post('/api/things')
      .send(thing)
      .expect(403)
      .end(function (thingSaveErr, thingSaveRes) {
        // Call the assertion callback
        done(thingSaveErr);
      });
  });

  it('should not be able to save an Thing if no name is provided', function (done) {
    // Invalidate name field
    thing.name = '';

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

        // Save a new Thing
        agent.post('/api/things')
          .send(thing)
          .expect(400)
          .end(function (thingSaveErr, thingSaveRes) {
            // Set message assertion
            (thingSaveRes.body.message).should.match('Please fill Thing name');

            // Handle Thing save error
            done(thingSaveErr);
          });
      });
  });

  it('should be able to update an Thing if signed in', function (done) {
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

        // Save a new Thing
        agent.post('/api/things')
          .send(thing)
          .expect(200)
          .end(function (thingSaveErr, thingSaveRes) {
            // Handle Thing save error
            if (thingSaveErr) {
              return done(thingSaveErr);
            }

            // Update Thing name
            thing.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Thing
            agent.put('/api/things/' + thingSaveRes.body._id)
              .send(thing)
              .expect(200)
              .end(function (thingUpdateErr, thingUpdateRes) {
                // Handle Thing update error
                if (thingUpdateErr) {
                  return done(thingUpdateErr);
                }

                // Set assertions
                (thingUpdateRes.body._id).should.equal(thingSaveRes.body._id);
                (thingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Things if not signed in', function (done) {
    // Create new Thing model instance
    var thingObj = new Thing(thing);

    // Save the thing
    thingObj.save(function () {
      // Request Things
      request(app).get('/api/things')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Thing if not signed in', function (done) {
    // Create new Thing model instance
    var thingObj = new Thing(thing);

    // Save the Thing
    thingObj.save(function () {
      request(app).get('/api/things/' + thingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', thing.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Thing with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/things/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Thing is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Thing which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Thing
    request(app).get('/api/things/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Thing with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Thing if signed in', function (done) {
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

        // Save a new Thing
        agent.post('/api/things')
          .send(thing)
          .expect(200)
          .end(function (thingSaveErr, thingSaveRes) {
            // Handle Thing save error
            if (thingSaveErr) {
              return done(thingSaveErr);
            }

            // Delete an existing Thing
            agent.delete('/api/things/' + thingSaveRes.body._id)
              .send(thing)
              .expect(200)
              .end(function (thingDeleteErr, thingDeleteRes) {
                // Handle thing error error
                if (thingDeleteErr) {
                  return done(thingDeleteErr);
                }

                // Set assertions
                (thingDeleteRes.body._id).should.equal(thingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Thing if not signed in', function (done) {
    // Set Thing user
    thing.user = user;

    // Create new Thing model instance
    var thingObj = new Thing(thing);

    // Save the Thing
    thingObj.save(function () {
      // Try deleting Thing
      request(app).delete('/api/things/' + thingObj._id)
        .expect(403)
        .end(function (thingDeleteErr, thingDeleteRes) {
          // Set message assertion
          (thingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Thing error error
          done(thingDeleteErr);
        });

    });
  });

  it('should be able to get a single Thing that has an orphaned user reference', function (done) {
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

          // Save a new Thing
          agent.post('/api/things')
            .send(thing)
            .expect(200)
            .end(function (thingSaveErr, thingSaveRes) {
              // Handle Thing save error
              if (thingSaveErr) {
                return done(thingSaveErr);
              }

              // Set assertions on new Thing
              (thingSaveRes.body.name).should.equal(thing.name);
              should.exist(thingSaveRes.body.user);
              should.equal(thingSaveRes.body.user._id, orphanId);

              // force the Thing to have an orphaned user reference
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

                    // Get the Thing
                    agent.get('/api/things/' + thingSaveRes.body._id)
                      .expect(200)
                      .end(function (thingInfoErr, thingInfoRes) {
                        // Handle Thing error
                        if (thingInfoErr) {
                          return done(thingInfoErr);
                        }

                        // Set assertions
                        (thingInfoRes.body._id).should.equal(thingSaveRes.body._id);
                        (thingInfoRes.body.name).should.equal(thing.name);
                        should.equal(thingInfoRes.body.user, undefined);

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
      Thing.remove().exec(done);
    });
  });
});
