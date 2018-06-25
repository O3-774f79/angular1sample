'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// /**
//  * Widget Schema
//  */
// var WidgetSchema = new Schema({
//   order: Number,
//   name: String,
//   type: String,
//   thingToken: String, // Now using sendToken
//   thingID: String,
//   dataKey: String,
//   selectedGroup: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Group'
//   },
//   settings: {
//     unit: String,
//     minValue: Number,
//     maxValue: Number,
//     offText: String,
//     onText: String
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   }
// });

/**
 * Dashboard Schema
 */
var DashboardSchema = new Schema({
  dashboardName: { type: String, index: true },
  dashboardDesc: { type: String, index: true },
  widgetId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget'
  }],
  // widgets: [WidgetSchema],
  created: {
    type: Date,
    default: Date.now,
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Dashboard', DashboardSchema);
