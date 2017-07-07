'use strict';

const periodic = require('periodicjs');
// const utilities = require('../utilities');
const controllers = require('../controllers');
const adminRouter = periodic.express.Router();
// const adminSettings = utilities.getSettings();

adminRouter.get('/', controllers.admin.dashboardView);
adminRouter.get('/dashboard', controllers.admin.dashboardView);

module.exports = adminRouter;