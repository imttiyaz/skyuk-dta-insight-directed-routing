'use strict';

// get the server config
const SERVER_CONFIG = require('./serverconfig');
const GCP_SECERT_ACCESSOR = require("./gcpSecertAccessor");


// export the various configuration
exports.SERVER_CONFIG = SERVER_CONFIG;
exports.GCP_SECERT_ACCESSOR = GCP_SECERT_ACCESSOR;
