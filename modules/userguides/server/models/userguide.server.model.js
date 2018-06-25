'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Userguide Schema
 */
var UserguideSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Userguide name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Userguide', UserguideSchema);
