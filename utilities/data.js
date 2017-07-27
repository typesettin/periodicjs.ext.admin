'use strict';
const periodic = require('periodicjs');
const path = require('path');
const CoreControllerModule = require('periodicjs.core.controller');
// const periodicRoutingUtil = periodic.utilities.routing;

function getDataCoreController() {
  try {
    const dataCoreControllers = new Map();
    for (let [dataName, datum, ] of periodic.datas) {
      const override = (dataName === 'standard_asset') ? {
          create: periodic.core.files.uploadMiddlewareHandler({
            periodic,
          }),
          remove: periodic.core.files.removeMiddlewareHandler({ periodic, }),
        } :
        false;
      // console.log({dataName,override})
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
          override,
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

function fixGenericReqBody(req) {
  if (req.body.genericdocjson) {
    // req.controllerData = Object.assign({}, req.controllerData);
    // req.controllerData.skip_xss = true;
    // req.controllerData.encryptFields = true;
    req.redirectpath = req.headers.referer;
    const jsonbody = JSON.parse(req.body.genericdocjson);
    delete req.body.genericdocjson;
    if (req.method === 'PUT') {
      req.body.updatedoc = jsonbody; //Object.assign({}, req.body, jsonbody);
    } else {
      req.body = Object.assign({}, req.body, jsonbody); //Object.assign({}, req.body, jsonbody);
    }
    if (req.method === 'POST') {
      req.redirectpath = req.headers.referer.replace('/new', '');
    }
    // if (!req.body.docid) {
    //   req.body.docid = req.body._id;
    // }
    delete req.body._id;
    delete req.body.__v;
    // delete req.body.format;
  } else if (req.method === 'DELETE') {
    req.redirectpath = req.headers.referer;
  }
  return req;
}

module.exports = {
  getDataCoreController,
  getDatasFromMap,
  getRecentData,
  fixGenericReqBody,
};