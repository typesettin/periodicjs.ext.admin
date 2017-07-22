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
const uacControllers = periodic.controllers.extension.get('periodicjs.ext.user_access_control');
const preTransforms = periodic.utilities.middleware.preTransforms(periodic);
//	adminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);

extensionRouter.use(controllers.admin.adminResLocals);
extensionRouter.use(adminRoute, passportControllers.auth.ensureAuthenticated, uacControllers.uac.loadUserRoles /*, uacControllers.uac.check_user_access - now handled as transforms*/ );
extensionRouter.use(adminRoute, preTransforms, adminRouter);

module.exports = extensionRouter;