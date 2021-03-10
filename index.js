'use strict';

// Load the common module
const CONSTANTS = require('./common/constants');

let Process_NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : null;

if (Process_NODE_ENV != null && Process_NODE_ENV === CONSTANTS.DEVELOPMENT_ENVIRONMENT) {
    require('dotenv').config();
}

require('./server');