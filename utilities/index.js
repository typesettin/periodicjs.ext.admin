'use strict';
const periodic = require('periodicjs');
const data = require('./data');
// const periodicRoutingUtil = periodic.utilities.routing;

function getSettings() {
  return periodic.settings.extensions['periodicjs.ext.admin'];
}

module.exports = {
  getSettings,
  data,
};