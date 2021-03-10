'use strict';


// Get joi module for validation
const JOI = require('joi');
const LOGGER = require('../../logger')(__filename);
const COMMON = require('../../common');
const CONSOLELOG = require("./consolelogs");


module.exports = {
  ValidateRequest: (schema, data, type) => {
    // abortEarly is set to false for reporting all validation problems so they can be fixed in one go
    // allowUnknown is set to true for allowing any unexpected property

    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true // remove unknown props
    };
    var result = schema.validate(data, options)
    if (result.error) {
      result.error.validation = true;
      result.error.reqtype = type;
    }
    return result;

  },

  Schemas: {
    // payload schema defined
    BodySchema: JOI.object().keys({
      [COMMON.CONSTANTS.REQUEST_BODY_PARTYID]: JOI.string().required(),
      [COMMON.CONSTANTS.REQUEST_BODY_APPTAG]: JOI.string().required()
    }),
    // header schema defined
    HeaderSchema: JOI.object().keys({
      [COMMON.CONSTANTS.REQUEST_HEADER_CORRELATION_ID]: JOI.string().required(),
      [COMMON.CONSTANTS.REQUEST_HEADER_CLIENTID]: JOI.string().required(),
      [COMMON.CONSTANTS.REQUEST_HEADER_TIMESTAMP]: JOI.date().required()
    }),
  },
};
