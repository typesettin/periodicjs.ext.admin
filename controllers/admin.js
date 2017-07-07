'use strict';
const periodic = require('periodicjs');

function dashboardView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'auth/test',
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
  dashboardView,
};