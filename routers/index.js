'use strict';

const periodic = require('periodicjs');
const adminRouter = require('./admin');
const utilities = require('../utilities');
const controllers = require('../controllers');
const adminSettings = utilities.getSettings();
const extensionRouter = periodic.express.Router();
const admin_route_prefix = adminSettings.routing.admin_prefix;
const adminRoute = periodic.utilities.routing.route_prefix(admin_route_prefix);
const passportControllers = periodic.controllers.extension.get('periodicjs.ext.passport');
extensionRouter.use(passportControllers.auth.ensureAuthenticated);
extensionRouter.use(controllers.admin.adminResLocals);
extensionRouter.use(adminRoute, adminRouter);

module.exports = extensionRouter;