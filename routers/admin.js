'use strict';

const periodic = require('periodicjs');
// const utilities = require('../utilities');
const controllers = require('../controllers');
const adminRouter = periodic.express.Router();
// const adminSettings = utilities.getSettings();
const extensionsRouter = require('./extensions');
const dataRouter = require('./data');

adminRouter.get('/', controllers.admin.getDBStats, controllers.admin.dashboardView);
adminRouter.get('/dashboard', controllers.admin.getDBStats, controllers.admin.dashboardView);
adminRouter.use('/extensions', extensionsRouter);
adminRouter.use('/settings', controllers.admin.getAppSettings, controllers.admin.appSettingsView);
adminRouter.use('/account', controllers.admin.accountView);
adminRouter.use('/data', controllers.admin.fixCodeMirrorSubmit, dataRouter);

module.exports = adminRouter;