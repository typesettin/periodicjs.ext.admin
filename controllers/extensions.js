'use strict';
const periodic = require('periodicjs');
// const utilities = require('../utilities');
// const adminSettings = utilities.getSettings();

function getExtensions(req, res, next) {
  req.controllerData = Object.assign({}, req.controllerData);
  req.controllerData.extensions = Array.from(periodic.extensions.values());
  next();
}

function extensionView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'extension/index',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = Object.assign({
    passportUser: req.user,
  }, req.controllerData);
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
}

module.exports = {
  getExtensions,
  extensionView,
};