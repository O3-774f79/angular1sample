'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Group = mongoose.model('Group'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  group;

/**
 * Group routes tests
 */
describe('Group CRUD tests', function () {

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

    // Save a user to the test db and create new Group
    user.save(function () {
      group = {
        name: 'Group name'
      };

      done();
    });
  });

  it('should be able to save a Group if logged in', function (done) {
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

        // Save a new Group
        agent.post('/api/groups')
          .send(group)
          .expect(200)
          .end(function (groupSaveErr, groupSaveRes) {
            // Handle Group save error
            if (groupSaveErr) {
              return done(groupSaveErr);
            }

            // Get a list of Groups
            agent.get('/api/groups')
              .end(function (groupsGetErr, groupsGetRes) {
                // Handle Groups save error
                if (groupsGetErr) {
                  return done(groupsGetErr);
                }

                // Get Groups list
                var groups = groupsGetRes.body;

                // Set assertions
                (groups[0].user._id).should.equal(userId);
                (groups[0].name).should.match('Group name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Group if not logged in', function (done) {
    agent.post('/api/groups')
      .send(group)
      .expect(403)
      .end(function (groupSaveErr, groupSaveRes) {
        // Call the assertion callback
        done(groupSaveErr);
      });
  });

  it('should not be able to save an Group if no name is provided', function (done) {
    // Invalidate name field
    group.name = '';

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

        // Save a new Group
        agent.post('/api/groups')
          .send(group)
          .expect(400)
          .end(function (groupSaveErr, groupSaveRes) {
            // Set message assertion
            (groupSaveRes.body.message).should.match('Please fill Group name');

            // Handle Group save error
            done(groupSaveErr);
          });
      });
  });

  it('should be able to update an Group if signed in', function (done) {
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

        // Save a new Group
        agent.post('/api/groups')
          .send(group)
          .expect(200)
          .end(function (groupSaveErr, groupSaveRes) {
            // Handle Group save error
            if (groupSaveErr) {
              return done(groupSaveErr);
            }

            // Update Group name
            group.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Group
            agent.put('/api/groups/' + groupSaveRes.body._id)
              .send(group)
              .expect(200)
              .end(function (groupUpdateErr, groupUpdateRes) {
                // Handle Group update error
                if (groupUpdateErr) {
                  return done(groupUpdateErr);
                }

                // Set assertions
                (groupUpdateRes.body._id).should.equal(groupSaveRes.body._id);
                (groupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Groups if not signed in', function (done) {
    // Create new Group model instance
    var groupObj = new Group(group);

    // Save the group
    groupObj.save(function () {
      // Request Groups
      request(app).get('/api/groups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Group if not signed in', function (done) {
    // Create new Group model instance
    var groupObj = new Group(group);

    // Save the Group
    groupObj.save(function () {
      request(app).get('/api/groups/' + groupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', group.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Group with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/groups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Group is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Group which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Group
    request(app).get('/api/groups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Group with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Group if signed in', function (done) {
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

        // Save a new Group
        agent.post('/api/groups')
          .send(group)
          .expect(200)
          .end(function (groupSaveErr, groupSaveRes) {
            // Handle Group save error
            if (groupSaveErr) {
              return done(groupSaveErr);
            }

            // Delete an existing Group
            agent.delete('/api/groups/' + groupSaveRes.body._id)
              .send(group)
              .expect(200)
              .end(function (groupDeleteErr, groupDeleteRes) {
                // Handle group error error
                if (groupDeleteErr) {
                  return done(groupDeleteErr);
                }

                // Set assertions
                (groupDeleteRes.body._id).should.equal(groupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Group if not signed in', function (done) {
    // Set Group user
    group.user = user;

    // Create new Group model instance
    var groupObj = new Group(group);

    // Save the Group
    groupObj.save(function () {
      // Try deleting Group
      request(app).delete('/api/groups/' + groupObj._id)
        .expect(403)
        .end(function (groupDeleteErr, groupDeleteRes) {
          // Set message assertion
          (groupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Group error error
          done(groupDeleteErr);
        });

    });
  });

  it('should be able to get a single Group that has an orphaned user reference', function (done) {
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

          // Save a new Group
          agent.post('/api/groups')
            .send(group)
            .expect(200)
            .end(function (groupSaveErr, groupSaveRes) {
              // Handle Group save error
              if (groupSaveErr) {
                return done(groupSaveErr);
              }

              // Set assertions on new Group
              (groupSaveRes.body.name).should.equal(group.name);
              should.exist(groupSaveRes.body.user);
              should.equal(groupSaveRes.body.user._id, orphanId);

              // force the Group to have an orphaned user reference
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

                    // Get the Group
                    agent.get('/api/groups/' + groupSaveRes.body._id)
                      .expect(200)
                      .end(function (groupInfoErr, groupInfoRes) {
                        // Handle Group error
                        if (groupInfoErr) {
                          return done(groupInfoErr);
                        }

                        // Set assertions
                        (groupInfoRes.body._id).should.equal(groupSaveRes.body._id);
                        (groupInfoRes.body.name).should.equal(group.name);
                        should.equal(groupInfoRes.body.user, undefined);

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
      Group.remove().exec(done);
    });
  });
});
