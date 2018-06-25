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
var LineWebhooksSchema = new Schema({
  replyToken: String,
  type: String,
  timestamp: Number,
  source: {
    sourceType: String,
    userId: String,
    groupId: String,
    roomId: String
  },
  message: {
    id: String,
    messageType: String,
    text: String,
    fileName: String,
    fileSize: String,
    title: String,
    address: String,
    latitude: Number,
    longitude: Number,
    packageId: String,
    stickerId: String
  },
  postback: {
    data: String
  },
  beacon: {
    hwid: String,
    type: String
  }
});

mongoose.model('LineWebhooks', LineWebhooksSchema);
