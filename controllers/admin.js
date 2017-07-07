'use strict';
const periodic = require('periodicjs');
const utilities = require('../utilities');
const adminSettings = utilities.getSettings();
const admin_route_prefix = adminSettings.routing.admin_prefix;
const adminRoute = periodic.utilities.routing.route_prefix(admin_route_prefix);


function adminResLocals(req, res, next) {
  res.locals['adminExt'] = {
    adminRoute,
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

module.exports = {
  adminResLocals,
  dashboardView,
};