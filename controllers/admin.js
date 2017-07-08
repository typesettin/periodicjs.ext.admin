'use strict';
const periodic = require('periodicjs');
const utilities = require('../utilities');
const adminSettings = utilities.getSettings();
const admin_route_prefix = adminSettings.routing.admin_prefix;
const adminRoute = periodic.utilities.routing.route_prefix(admin_route_prefix);


function adminResLocals(req, res, next) {
  res.locals['adminExt'] = {
    adminRoute,
    passportUser: req.user,
  };
  next();
}

function dashboardView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/dashboard',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = {
    user: req.user,
    passportUser: req.user,
  };
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
}

function fixCodeMirrorSubmit(req, res, next) {
  try {
    if (req.body.genericdocjson) {
      req.controllerData = req.controllerData || {};
      // req.controllerData.skip_xss = true;
      // req.controllerData.encryptFields = true;
      req.redirectpath = req.headers.referer;
      const jsonbody = JSON.parse(req.body.genericdocjson);
      delete req.body.genericdocjson;
      if (req.method === 'PUT') {
        req.body.updatedoc = jsonbody; //Object.assign({}, req.body, jsonbody);
      } else {
        req.body = Object.assign({}, req.body, jsonbody); //Object.assign({}, req.body, jsonbody);
      }
      // if (!req.body.docid) {
      //   req.body.docid = req.body._id;
      // }
      delete req.body._id;
      delete req.body.__v;
      // delete req.body.format;
    } else if (req.method === 'DELETE') {
      req.redirectpath = req.headers.referer;
    }
    next();
  } catch (e) {
    next(e);
  }
}

function getAppSettings(req, res, next) {
  req.controllerData = Object.assign({}, req.controllerData);
  req.controllerData.appSettings = periodic.settings;
  next();
}

function appSettingsView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/settings',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = Object.assign({
    passportUser: req.user,
  }, req.controllerData);
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
}

module.exports = {
  adminResLocals,
  dashboardView,
  fixCodeMirrorSubmit,
  getAppSettings,
  appSettingsView,
};