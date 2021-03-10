'use strict';

const COMMON = require('../common');

const HELPERS = require('../insight_routing_engine/helpers');
const TESTDATA = require('../test-data');

const VOWS = require('vows');
const ASSERT = require('assert');



VOWS.describe('Validate Request Headers and Body')
    .addBatch({
        'Header received': {
            'is valid': {
                topic: HELPERS.VALIDATEREQUEST.ValidateRequest(HELPERS.VALIDATEREQUEST.Schemas.HeaderSchema, TESTDATA.VALIDHEADERS, "headers"),
                'Test Success': function (topic) {
                    ASSERT.equal(topic.error, null);
                },
            },
            'is Invalid': {
                topic: HELPERS.VALIDATEREQUEST.ValidateRequest(HELPERS.VALIDATEREQUEST.Schemas.HeaderSchema, TESTDATA.INVALIDHEADERS, "headers"),
                'Test Success': function (topic) {
                    ASSERT.isNotNull(topic.error);
                },
            }
        },
        'Body received': {
            'is valid': {
                topic: HELPERS.VALIDATEREQUEST.ValidateRequest(HELPERS.VALIDATEREQUEST.Schemas.BodySchema, TESTDATA.VALIDBODY, "body"),
                'Test Success': function (topic) {
                    ASSERT.equal(topic.error, null);
                },
            },
            'is Invalid': {
                topic: HELPERS.VALIDATEREQUEST.ValidateRequest(HELPERS.VALIDATEREQUEST.Schemas.BodySchema, TESTDATA.INVALIDBODY, "body"),
                'Test Success': function (topic) {
                    ASSERT.isNotNull(topic.error);
                },
            }
        }
    })
    .export(module);



