'use strict';
const periodic = require('periodicjs');
const path = require('path');
const CoreControllerModule = require('periodicjs.core.controller');
// const periodicRoutingUtil = periodic.utilities.routing;

function getDataCoreController() {
  try {
    const dataCoreControllers = new Map();
    for (let [dataName, datum] of periodic.datas) {
      // console.log({ datum });
      const CoreController = new CoreControllerModule(periodic, {
        compatibility: false,
        skip_responder: true,
        skip_db: true,
        skip_protocol: true,
      });
      CoreController.initialize_responder({
        adapter: 'json',
      });
      CoreController.initialize_protocol({
        adapter: 'http',
        api: 'rest',
      });
      CoreController.db[dataName] = datum;
      dataCoreControllers.set(dataName, {
        controller: CoreController,
        router: CoreController.protocol.api.implement({
          model_name: dataName,
          dirname: path.join(periodic.config.app_root, '/node_modules/periodicjs.ext.admin/views'),
        }).router,
      });
    }
    return (dataCoreControllers);
  } catch (e) {
    periodic.logger.error(e);
  }
}

function getDatasFromMap(dataMapArray) {
  return {
    modelName: dataMapArray[0],
    data: dataMapArray[1],
  };
}

function getRecentData(options) {
  const { data, modelName, } = options;
  return new Promise((resolve, reject) => {
    try {
      data.search({ limit: 5, paginate: true, query: {}, })
        .then(resultData => {
          const returnData = resultData[0].documents.map(resultDoc => {
            resultDoc.modelName = modelName;
            resultDoc.collectionCount = resultData.collection_count;
            return resultDoc;
          });
          resolve({
            docs: returnData || [],
            modelData: {
              modelName,
              collectionCount: resultData.collection_count,
            },
          });
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  getDataCoreController,
  getDatasFromMap,
  getRecentData,
};