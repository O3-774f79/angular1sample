'use strict';
var mongoose = require('mongoose'),
  moment = require('moment');

exports.logError = function (req, strDesc, strStatus, strResult, res, next) {
  var dateLog = moment().format('YYYYMMDD');
  var logDate = 'TIMESTAMP|' + new Date().toISOString() + '|';
  var logLOGTYPE = 'LOGTYPE|DB|';
  var logNode = 'NODE|' + 'GreenSpot' + '|';
  var logACTION = 'ACTION|' + 'Authen' + '|';
  var logPATH = 'PATH|' + JSON.stringify(req.url) + '|';
  var logREQUESTID = 'REQUESTID|' + 'Authen' + '|';
  var logPARAMS = 'PARAMS|' + JSON.stringify(req.body) + '|';
  var logRESULT = 'RESULT|' + strResult + '|';
  var logSTATUS = 'STATUS|' + strStatus + '|';
  var logDESC = 'DESC|' + strDesc + '|';
  var logRESPTIME = 'RESPTIME|' + '0' + '|';
  var logMsg = logDate + logLOGTYPE + logNode + logACTION + logPATH + logREQUESTID + logPARAMS + logRESULT + logSTATUS + logDESC + logRESPTIME;

  var Log = require('log'),
    fs = require('fs'),
    stream = fs.createWriteStream('logs/log_' + dateLog + '.log', { flags: 'a' }),
    log = new Log('error', stream);

  log.error(logMsg);

  next(null, true);
};
