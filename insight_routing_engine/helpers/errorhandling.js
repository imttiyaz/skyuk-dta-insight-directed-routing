'use strict';

const _ = require('underscore');
const COMMON = require('../../common');
const CONSOLELOGS = require('./consolelogs');


//export the module
module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    switch (true) {
        // case _.has(err,"authFailed") && err.authFailed :
        // res.send("Failed")

        // error 401 Auth header missing.
        case _.isObject(err) && !_.isEmpty(err) && _.has(err, "401") && err.type == 'headers':
            var response = createResJson(COMMON.CONSTANTS.HTTP_UNAUTHORIZATION_CODE, COMMON.CONSTANTS.HTTP_UNAUTHORIZATION_CODE, COMMON.CONSTANTS.MESSAGE_FOR_HEADER_MISSING, COMMON.CONSTANTS.DESCRIPTION_AUTHORIZATION_HEADER);
            CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
            return res.status(COMMON.CONSTANTS.HTTP_UNAUTHORIZATION_CODE).json(response);

        // error 401 Auth Credentials are Invalid.
        case _.isObject(err) && !_.isEmpty(err) && _.has(err, "401"):
            var response = createResJson(COMMON.CONSTANTS.HTTP_UNAUTHORIZATION_CODE, COMMON.CONSTANTS.HTTP_UNAUTHORIZATION_CODE, COMMON.CONSTANTS.MESSAGE_FOR_UNAUTHORIZATION_HEADER, COMMON.CONSTANTS.DESCRIPTION_FOR_UNAUTHORIZATION_HEADER);
            CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
            return res.status(COMMON.CONSTANTS.HTTP_UNAUTHORIZATION_CODE).json(response);

        // error 400 Bad Request for headers Missing
        case _.isObject(err) && !_.isEmpty(err) && err.validation && err.reqtype == 'headers':
            var response = createResJson(COMMON.CONSTANTS.HTTP_BAD_REQUEST_CODE, COMMON.CONSTANTS.HTTP_BAD_REQUEST_CUSTOM_CODE, COMMON.CONSTANTS.MESSAGE_FOR_HEADER_MISSING, err.details.map(x => x.message).join(', '));
            CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
            return res.status(COMMON.CONSTANTS.HTTP_BAD_REQUEST_CODE).json(response);
            

        // error 400 Bad Request for body Missing
        case _.isObject(err) && !_.isEmpty(err) && err.validation && err.reqtype == 'body':
            var response = createResJson(COMMON.CONSTANTS.HTTP_BAD_REQUEST_CODE, COMMON.CONSTANTS.HTTP_BAD_REQUEST_CUSTOM_CODE, COMMON.CONSTANTS.MESSAGE_FOR_REQUEST_BODY_MISSING, err.details.map(x => x.message).join(', '));
            CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
            return res.status(COMMON.CONSTANTS.HTTP_BAD_REQUEST_CODE).json(response);

        // error 404 resource not found.
        case _.isObject(err) && !_.isEmpty(err) && _.has(err, "404"):
            var response = createResJson(COMMON.CONSTANTS.HTTP_RESOURCE_NOT_FOUND_CODE, COMMON.CONSTANTS.HTTP_RESOURCE_NOT_FOUND_CUSTOM_CODE, COMMON.CONSTANTS.MESSAGE_FOR_BAD_REQUEST, COMMON.CONSTANTS.DESCRIPTION_FOR_BAD_REQUEST);
            CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
            return res.status(COMMON.CONSTANTS.HTTP_RESOURCE_NOT_FOUND_CODE).json(response);

        // error 500 DB exceptions
        case _.isObject(err) && !_.isEmpty(err) && _.has(err, "500"):
            var response = createResJson(COMMON.CONSTANTS.HTTP_UNEXPECTED_ERROR_CODE, COMMON.CONSTANTS.HTTP_UNEXPECTED_ERROR_CUSTOM_CODE, COMMON.CONSTANTS.MESSAGE_FOR_UNEXPECTED_ERROR, COMMON.CONSTANTS.DESCRIPTION_FOR_UNEXPECTED_ERROR);
            CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
            return res.status(COMMON.CONSTANTS.HTTP_UNEXPECTED_ERROR_CODE).json(response);

        default:
            var response = createResJson(COMMON.CONSTANTS.HTTP_UNEXPECTED_ERROR_CODE, COMMON.CONSTANTS.HTTP_UNEXPECTED_ERROR_CUSTOM_CODE, COMMON.CONSTANTS.MESSAGE_FOR_UNEXPECTED_ERROR, COMMON.CONSTANTS.DESCRIPTION_FOR_UNEXPECTED_ERROR);
            CONSOLELOGS.logData(`${req.uniqueID} Response : ${JSON.stringify(response)}`);
            return res.status(COMMON.CONSTANTS.HTTP_UNEXPECTED_ERROR_CODE).json(response);
    }
}

//Generating error response
var createResJson = (httpStatusCode, customCode, message, description) => {
    return {
        "httpStatusCode": httpStatusCode,
        "customCode": customCode,
        "message": message,
        "description": description

    }
}