// Test script for /config/serverconfig

'use strict';

// get the vows framework
const VOWS = require('vows');
const ASSERT = require('assert');

// get the config we are testing in this test
const SERVER_CONFIG = require('../config/serverconfig');

// Create a Test Suite
VOWS.describe('Server Config')
  .addBatch({
    // Batch
    'Port Number': {
      // Context
      'is valid': {
        // Sub Context
        topic: SERVER_CONFIG.port, // Topic
        'does exist': function(topic) {
          // Vow
          ASSERT.isNotNull(topic);
        },
        'is of expected value': function(topic) {
          // Vow
          ASSERT.equal(topic, process.env.port);
        },
      },
    },
  })
  .export(module); // export so can be ran
