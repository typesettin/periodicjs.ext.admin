'use strict';
const periodic = require('periodicjs');
const utilities = require('../utilities');
const Promisie = require('promisie');
const adminSettings = utilities.getSettings();
const admin_route_prefix = adminSettings.routing.admin_prefix;
const adminRoute = periodic.utilities.routing.route_prefix(admin_route_prefix);

function adminResLocals(req, res, next) {
  res.locals['adminExt'] = {
    adminRoute,
    extensionMenu: utilities.extensionMenu,
    models: utilities.getDataModels(),
  };
  res.locals.passportUser = req.user;
  next();
}

function dashboardView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/dashboard',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = Object.assign({
    passportUser: req.user,
  }, req.controllerData);
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
}

function accountView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/account',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = {
    passportUser: req.user,
  };
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
}

function fixCodeMirrorSubmit(req, res, next) {
  try {
    req = utilities.data.fixGenericReqBody(req);
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

function getDBStats(req, res, next) {
  const datas = Array.from(periodic.datas.entries());
  const datasList = datas.map(utilities.data.getDatasFromMap);
  const dataDocs = [];
  const countData = [];
  req.controllerData = Object.assign({}, req.controllerData);

  Promisie.map(datasList, 5, utilities.data.getRecentData)
    .then(result => {
      // result.forEach(addDataToReturnArray.bind(dataDocs));
      result.forEach(recentData => {
        dataDocs.push(...recentData.docs);
        countData.push(recentData.modelData);
      });
      dataDocs.map(dataDoc => {
        if (dataDoc.source && dataDoc.periodic_compatibility && dataDoc.periodic_config && !dataDoc.entitytype) {
          dataDoc.entitytype = 'extension';
        }
        if (dataDoc.filepath && dataDoc.config && !dataDoc.entitytype) {
          dataDoc.entitytype = 'configuration';
          dataDoc.name = dataDoc.filepath;
        }
        return dataDoc;
      });
      req.controllerData.dataDocs = dataDocs.sort(periodic.core.utilities.sortObject('desc', 'updatedat'));
      req.controllerData.countData = countData;
      next();
    })
    .catch(next);
}

function fileView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'files/index',
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
  accountView,
  getDBStats,
  fileView,
};