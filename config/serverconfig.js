'use strict';

const COMMON = require("../common");

// Create the server config
const SERVER_CONFIG = {
  server_config: {
    port: process.env.PORT || COMMON.CONSTANTS.API_PORT,
    api_path: process.env.API_PATH || COMMON.CONSTANTS.API_PATH,

  },
};

// Export the configuration
module.exports = SERVER_CONFIG;
