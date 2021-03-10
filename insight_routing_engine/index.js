'use strict';

const JOI = require('joi');
const HELPERS = require('./helpers');
const LOGGER = require('../logger')(__filename);
const COMMON = require("../common");
const MOMENT = require('moment');
const DATA = require("../data");
const _ = require('lodash');
var DBCONNECTION;

//creating a DBconnection when the server is started
(async () => {

    DBCONNECTION = await DATA.DBCONNECTION();

})();

//Entry for the API request after the Authentication is done
var InsightRoutingRecommendation = (req, res, next) => {

    //checking the DBConnection is created or not, If not creating the DBConnection
    if (DBCONNECTION) {
        GetInsightRoutingRecommendation(req, res, next);
    }
    else {
        (async () => {
            DBCONNECTION = await DATA.DBCONNECTION();
            GetInsightRoutingRecommendation(req, res, next);
        })();
    }
}



var GetInsightRoutingRecommendation = (req, res, next) => {
    try {

        // Validate the request's headers and body
        var reqHeadersValidationResult = HELPERS.VALIDATEREQUEST.ValidateRequest(HELPERS.VALIDATEREQUEST.Schemas.HeaderSchema, req.headers, "headers");
        if (reqHeadersValidationResult.error) {
            throw (reqHeadersValidationResult.error);
        }
        var reqBodyValidationResult = HELPERS.VALIDATEREQUEST.ValidateRequest(HELPERS.VALIDATEREQUEST.Schemas.BodySchema, req.body, "body");
        if (reqBodyValidationResult.error) {
            throw (reqBodyValidationResult.error);
        }

        (async () => {
            var { resData, errorInQuery } = await extractDataFromDatabase(req, false);
            if (errorInQuery) {
                if (errorInQuery.auth_failed && errorInQuery.auth_failed == true) {
                    (async () => {
                        DBCONNECTION = await DATA.DBCONNECTION();
                        var { resData, errorInQuery } = await extractDataFromDatabase(req, true);
                        if (errorInQuery) {
                            next(errorInQuery);
                        }
                        else {
                            res.status(200).send(resData);
                        }
                    })();
                }
                else {
                    next(errorInQuery);
                }
            }
            else {
                res.status(200).send(resData);
            }

        })();

    }
    catch (error) {
        // Log the error
        // LOGGER.error(error);
        throw error;
    }
}


var extractDataFromDatabase = async (req, retry) => {

    // Quering the Database
    var query = `select * from ${process.env.DATABASE_VIEW_NAME} where party_id='${req.body.partyId}'`;
    var resData;
    var errorInQuery;
    await DBCONNECTION.query(query)
        .then((data) => {
            var dataFromQuery = data[0];
            // console.log(dataFromQuery);
            var filteredData = _.filter(dataFromQuery, {apptag: req.body.appTag });
            if (filteredData.length > 0) {
                var dataForGDPR = _.filter(filteredData, { gdpr_flag: 0 });
                if (dataForGDPR.length > 0) {
                    resData = HELPERS.RESPONSEBUILDER(req,COMMON.CONSTANTS.RESPONSE_TYPE_SUCCESS, COMMON.CONSTANTS.RECOMMENDATION_fOUND, dataForGDPR[0]['routing'], process.env.DATABASE_MODEL_NAME)
                }
                else {
                    resData = HELPERS.RESPONSEBUILDER(req,COMMON.CONSTANTS.RESPONSE_TYPE_FAILURE, COMMON.CONSTANTS.RECOMMENDATION_OPT_OUT, undefined, process.env.DATABASE_MODEL_NAME);
                }
            }
            else {
                if (dataFromQuery.length == 0) {
                    resData = HELPERS.RESPONSEBUILDER(req,COMMON.CONSTANTS.RESPONSE_TYPE_FAILURE, COMMON.CONSTANTS.PARTYID_NOT_FOUND, undefined, process.env.DATABASE_MODEL_NAME);

                }
                else {
                    resData = HELPERS.RESPONSEBUILDER(req,COMMON.CONSTANTS.RESPONSE_TYPE_FAILURE, COMMON.CONSTANTS.APP_TAG_NOT_MODELLED, undefined, process.env.DATABASE_MODEL_NAME);
                }

            }

        })
        .catch((err) => {
            LOGGER.info(`Catch: GetInsightRoutingRecommendation Query done ${err}`);
            // console.log(err);

            //checking wheather the error is unauthorised
            if (retry == false && err.parent && err.parent.routine && err.parent['routine'] == "auth_failed") {
                let queryError = { "500": true, "auth_failed": true };
                LOGGER.error("Authentication to Database Failed Retrying.......");
                errorInQuery = queryError;

            }
            else {
                let queryError = { "500": true };
                LOGGER.error(err);
                errorInQuery = queryError;
            }
        });

    return { resData, errorInQuery };

}



module.exports = {
    GetInsightRoutingRecommendation,
    InsightRoutingRecommendation
};
