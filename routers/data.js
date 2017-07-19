'use strict';

const fs = require('fs-extra');
const periodic = require('periodicjs');
const utilities = require('../utilities');
const controllers = require('../controllers');
const dataRouter = periodic.express.Router();
const dataRouters = utilities.data.getDataCoreController();
const adminSettings = utilities.getSettings();
const encryption_key = fs.readFileSync(adminSettings.encryption_key_path).toString();

dataRouter.post('/standard_assets/encrypted_files', periodic.core.files.uploadMiddlewareHandler({
  periodic,
  encrypted_client_side: true, 
  encryption_key,
}));
dataRouter.get('/standard_assets/decrypt_asset/:id/:filename', periodic.core.files.decryptAssetMiddlewareHandler({
  periodic,
  encryption_key,
}));
// console.log({ encryptionKey });
Array.from(dataRouters.values()).forEach(drouter => {
  dataRouter.use(drouter.router);
});

// console.log(utilities.data.getDataCoreController());
// dataRouter.get('/', controllers.extensions.getExtensions, controllers.extensions.extensionView);
// dataRouter.get('/dashboard', controllers.admin.dashboardView);

module.exports = dataRouter;