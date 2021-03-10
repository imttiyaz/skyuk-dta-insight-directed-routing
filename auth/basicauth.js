'use strict';

const LOGGER = require('../logger')(__filename);
const CONSTANTS = require('../common/constants');
const CONFIG = require('../config');
const HELPERS = require('../insight_routing_engine/helpers');

const RANDOMNUMBER = Math.floor(Math.random()*(999-100+1)+100);
var requestNumber = 0;


let Process_NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : null;

var basicAuthToken;

if (Process_NODE_ENV != null && Process_NODE_ENV === CONSTANTS.DEVELOPMENT_ENVIRONMENT) {
    var baseAuthObj = { username: process.env.AUTH_USERNAME, password: process.env.AUTH_PASSWORD };
    var combinedCredentials = baseAuthObj.username + ":" + baseAuthObj.password;
    basicAuthToken = Buffer.from(combinedCredentials).toString('base64')
}
else {
    (async () => {
        var userName = await CONFIG.GCP_SECERT_ACCESSOR(process.env.AUTH_USERNAME);
        var passWord = await CONFIG.GCP_SECERT_ACCESSOR(process.env.AUTH_PASSWORD);
        var combinedCredentials = userName + ":" + passWord;
        basicAuthToken = Buffer.from(combinedCredentials).toString('base64')
    })();
}


module.exports = basicAuth;


async function basicAuth(req, res, next) {
    requestNumber= requestNumber+1;

    
    console.log(req.headers['x-sky-diagnostic-correlationid']);
    var HEADERS = {};
    if(req.headers['x-sky-diagnostic-correlationid']){
        HEADERS['x-sky-diagnostic-correlationid'] = req.headers['x-sky-diagnostic-correlationid'];
    }
    if(req.headers['x-sky-diagnostics-clientid']){
        HEADERS['x-sky-diagnostics-clientid'] = req.headers['x-sky-diagnostics-clientid'];
    }
    if(req.headers['x-sky-timestamp']){
        HEADERS['x-sky-timestamp'] = req.headers['x-sky-timestamp'];
    }

    req.uniqueID = `${RANDOMNUMBER}-${requestNumber} Request-Headers : ${JSON.stringify(HEADERS)} Request-Body : ${JSON.stringify(req.body)}`;

    HELPERS.CONSOLELOGS.logData(`${req.uniqueID}`)


    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        let authError = { "401": true, "type": "headers" };
        next(authError);
        return;
    }

    // verify auth credentials
    var base64Credentials = req.headers.authorization.split(' ')[1];
    if (basicAuthToken) {
        validateCreds(basicAuthToken, base64Credentials, next);

    }
    else {

        (async () => {
            var userName = await CONFIG.GCP_SECERT_ACCESSOR(process.env.AUTH_USERNAME);
            var passWord = await CONFIG.GCP_SECERT_ACCESSOR(process.env.AUTH_PASSWORD);
            var combinedCredentials = userName + ":" + passWord;
            basicAuthToken = Buffer.from(combinedCredentials).toString('base64');
            validateCreds(basicAuthToken, base64Credentials, next);
        })();

    }

}

//Compare the tokens
const validateCreds = (basicAuthToken, base64Credentials, next) => {

    if (basicAuthToken === base64Credentials) {
        next();
    }
    else {
        if (Process_NODE_ENV != null && Process_NODE_ENV === CONSTANTS.DEVELOPMENT_ENVIRONMENT) {
            var baseAuthObj = { username: process.env.AUTH_USERNAME, password: process.env.AUTH_PASSWORD };
            var combinedCredentials = baseAuthObj.username + ":" + baseAuthObj.password;
            basicAuthToken = Buffer.from(combinedCredentials).toString('base64');
            retryValidateCreds(basicAuthToken, base64Credentials, next);

        }
        else {
            (async () => {
                var userName = await CONFIG.GCP_SECERT_ACCESSOR(process.env.AUTH_USERNAME);
                var passWord = await CONFIG.GCP_SECERT_ACCESSOR(process.env.AUTH_PASSWORD);
                var combinedCredentials = userName + ":" + passWord;
                basicAuthToken = Buffer.from(combinedCredentials).toString('base64');
                retryValidateCreds(basicAuthToken, base64Credentials, next);

            })();
        }
    }
}


const retryValidateCreds = (basicAuthToken, base64Credentials, next) => {
    if (basicAuthToken === base64Credentials) {
        next();
    }
    else {
        let authError = { "401": true };
        next(authError);
        return;
    }

}