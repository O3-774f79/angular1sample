'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Widget Schema
 */
var WidgetSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dashboardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard'
  },
  selectedGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  // thingsId: String,
  thingsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thing'
  },
  widgetName: { type: String, index: true },
  dataKey: String,
  type: String,
  order: { type: Number, index: true },
  settings: {
    url: String,
    unit: String,
    minValue: Number,
    maxValue: Number,
    offText: String,
    onText: String
  },
  created: {
    type: Date,
    default: Date.now,
    index: true
  }
});

mongoose.model('Widget', WidgetSchema);
