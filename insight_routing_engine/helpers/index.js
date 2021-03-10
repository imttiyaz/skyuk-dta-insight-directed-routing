'use strict';


// get the BasicAuth to be used across the app
const ERRORHANDLER = require('./errorhandling');
const VALIDATEREQUEST = require('./validaterequest');
const RESPONSEBUILDER = require('./responsebuilder');
const CONSOLELOGS = require('./consolelogs');

// Export the module
exports.ERRORHANDLER = ERRORHANDLER;
exports.VALIDATEREQUEST = VALIDATEREQUEST;
exports.RESPONSEBUILDER = RESPONSEBUILDER;
exports.CONSOLELOGS = CONSOLELOGS;
