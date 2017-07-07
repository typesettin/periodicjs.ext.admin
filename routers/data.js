'use strict';

const periodic = require('periodicjs');
const utilities = require('../utilities');
const controllers = require('../controllers');
const dataRouter = periodic.express.Router();
const dataRouters = utilities.data.getDataCoreController();
// const adminSettings = utilities.getSettings();
Array.from(dataRouters.values()).forEach(drouter => {
  dataRouter.use(drouter.router);
})
// console.log(utilities.data.getDataCoreController());
// dataRouter.get('/', controllers.extensions.getExtensions, controllers.extensions.extensionView);
// dataRouter.get('/dashboard', controllers.admin.dashboardView);

module.exports = dataRouter;