'use strict';

// get the modules required
const EXPRESS = require('express');
const APP = EXPRESS();
const BODY_PARSER = require('body-parser');
const AUTH = require('../auth');
const CONFIG = require('../config');
const LOGGER = require('../logger')(__filename);
const INSIGHT_ROUTING_ENGINE = require("../insight_routing_engine");
const HELPERS = require('../insight_routing_engine/helpers');


// console.log(process.env);

// for parsing application/json
APP.use(BODY_PARSER.json());

APP.get("/test", (req, res) => {
    res.status(200).send("API running successfully")

})

// setup the middleware for the call routing recommendations api post method
APP.post(CONFIG.SERVER_CONFIG.server_config.api_path,
    AUTH.BASICAUTH,
    INSIGHT_ROUTING_ENGINE.InsightRoutingRecommendation
);

APP.all('*', (req, res, next) => { next({ "404": true }) });

// global error handler
APP.use(HELPERS.ERRORHANDLER);

// start the server
APP.listen(CONFIG.SERVER_CONFIG.server_config.port, () => {
    // log that it has started
    LOGGER.info('Server running on port: ' + CONFIG.SERVER_CONFIG.server_config.port);
});