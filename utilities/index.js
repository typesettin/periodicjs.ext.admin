'use strict';
const periodic = require('periodicjs');
// const periodicRoutingUtil = periodic.utilities.routing;

function getSettings() {
  return periodic.settings.extensions['periodicjs.ext.admin'];
}

module.exports = {
  getSettings,
};