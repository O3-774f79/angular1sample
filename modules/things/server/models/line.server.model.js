'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  unirest = require('unirest'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  line = require('@line/bot-sdk'),
  Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var LineSchema = new Schema({

});

LineSchema.statics.getProfile = function (userId) {
  var Line = mongoose.model('Line');
  return new Promise(function (resolve, reject) {
    var client = Line.init();
    client.getProfile(userId)
      .then(function(profile) {
        // console.log(profile.displayName);
        // console.log(profile.userId);
        // console.log(profile.pictureUrl);
        // console.log(profile.statusMessage);
        resolve(profile);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

LineSchema.statics.replyMessage = function (replyToken, message) {
  var Line = mongoose.model('Line');
  return new Promise(function (resolve, reject) {
    var client = Line.init();

    client.replyMessage(replyToken, message)
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

LineSchema.statics.pushMessage = function (userId, message) {
  var Line = mongoose.model('Line');
  return new Promise(function (resolve, reject) {
    var client = Line.init();
    client.pushMessage(userId, message)
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

LineSchema.statics.getContentById = function (messageId) {
  var Line = mongoose.model('Line');
  return new Promise(function (resolve, reject) {
    var client = Line.init();
    const stream = client.getMessageContent(messageId);
    stream.on('data', function(chunk) {
      resolve(chunk);
    });
    stream.on('error', function(err) {
      reject(err);
    });
  });
};


LineSchema.statics.leaveGroup = function (groupId) {
  var Line = mongoose.model('Line');
  return new Promise(function (resolve, reject) {
    var client = Line.init();
    client.leaveGroup(groupId)
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

LineSchema.statics.leaveRoom = function (roomId) {
  var Line = mongoose.model('Line');
  return new Promise(function (resolve, reject) {
    var client = Line.init();
    client.leaveRoom(roomId)
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
};


LineSchema.statics.init = function () {
  return new line.Client({
    channelAccessToken: config.line.token
  });
};

LineSchema.statics.getMessageTypeText = function (msg) {
  return {
    type: 'text',
    text: msg
  };
};

LineSchema.statics.getMessageTypeImage = function (imgUrl, imgPreviewUrl) {
  return {
    type: 'image',
    originalContentUrl: imgUrl,
    previewImageUrl: imgPreviewUrl
  };
};

LineSchema.statics.getMessageTypeVDO = function (vdoUrl, imgPreviewUrl) {
  return {
    type: 'video',
    originalContentUrl: vdoUrl,
    previewImageUrl: imgPreviewUrl
  };
};

LineSchema.statics.getMessageTypeAudio = function (audioUrl, duration) {
  return {
    type: 'audio',
    originalContentUrl: audioUrl,
    duration: duration
  };
};

LineSchema.statics.getMessageTypeLocation = function (title, address, latitude, longitude) {
  return {
    type: 'location',
    address: address,
    latitude: latitude,
    longitude: longitude
  };
};

LineSchema.statics.getMessageTypeSticker = function (packageId, stickerId) {
  return {
    type: 'sticker',
    packageId: packageId,
    stickerId: stickerId
  };
};


LineSchema.statics.geTokenByCode = function (code) {
  return new Promise(function (resolve, reject) {
    var data = {
      grant_type: 'authorization_code',
      client_id: config.line.client_id,
      client_secret: config.line.client_secret,
      code: code,
      redirect_uri: config.line.redirect_uri
    };
    unirest.post('https://api.line.me/v2/oauth/accessToken')
      .headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
      .send(data)
      .end(function (response) {
        // console.log('get accessToken response', response.body);
        if (response.body.error) {
          reject(new Error(response.body.error_description));
        } else {
          resolve(response.body);
        }
      });
  });
};

LineSchema.statics.getUserByToken = function (token) {
  var Line = mongoose.model('Line');
  return new Promise(function (resolve, reject) {
    unirest.get('https://api.line.me/v2/profile')
      .headers({ 'Authorization': 'Bearer' + ' ' + token })
      .end(function (response) {
        // console.log('get Line User response', response.body);
        if (response.body.userId) {
          resolve(response.body);
        } else {
          reject(new Error('Token invalid'));
        }
      });
  });
};

mongoose.model('Line', LineSchema);
