'use strict';

// Import the Winston and path modules (note the winston constants have to be of this name and casing)
const { createLogger, format, transports } = require('winston');
const PATH = require('path');


// Create a logger and define the format
const LOGGER = caller => {
  return createLogger({
    level: process.env.LOG_LEVEL != null ? process.env.LOG_LEVEL.toLowerCase() : 'error',
    format: format.combine(
      format.label({ label: PATH.dirname(caller) + '/' + PATH.basename(caller) }),
      format.timestamp({ format: 'YYYY-MM-dd HH:mm:ss.SSS' }),
      format.printf(
        info =>
          process.env.GOOGLE_CLOUD_PROJECT +
          '-' +
          process.env.GAE_SERVICE +
          ' ' +
          `${info.level}`.toUpperCase() +
          ' ' +
          `${info.timestamp}` +
          ' info="' +
          `${info.message}` + 
          '", app.name="' +
          process.env.GAE_SERVICE +
          '", app.version="' +
          process.env.GAE_VERSION +
          '", method.area="' +
          `${info.label}` +
          '"'
      )
    ),
    transports: [new transports.Console()],
    exitOnError: false,
  });
};

// Export the module
module.exports = LOGGER;
