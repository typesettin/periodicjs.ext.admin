'use strict';
const periodic = require('periodicjs');

module.exports = {
  settings: {
    routing: {
      admin_prefix: 'b-admin',
    },
    encryption_key_path: periodic.settings.application.server.https.ssl.private_key,
  },
  databases: {},
};