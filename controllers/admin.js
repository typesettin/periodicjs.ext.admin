'use strict';
const periodic = require('periodicjs');
const utilities = require('../utilities');
const Promisie = require('promisie');
const adminSettings = utilities.getSettings();
const admin_route_prefix = adminSettings.routing.admin_prefix;
const adminRoute = periodic.utilities.routing.route_prefix(admin_route_prefix);


function adminResLocals(req, res, next) {
  res.locals['adminExt'] = {
    adminRoute,
  };
  res.locals.passportUser = req.user;
  next();
}

function dashboardView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/dashboard',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = Object.assign({
    passportUser: req.user,
  }, req.controllerData);
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
}

function accountView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/account',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = {
    passportUser: req.user,
  };
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
}

function fixCodeMirrorSubmit(req, res, next) {
  try {
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
    next();
  } catch (e) {
    next(e);
  }
}

function getAppSettings(req, res, next) {
  req.controllerData = Object.assign({}, req.controllerData);
  req.controllerData.appSettings = periodic.settings;
  next();
}

function appSettingsView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/settings',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = Object.assign({
    passportUser: req.user,
  }, req.controllerData);
  periodic.core.controller.render(req, res, viewtemplate, viewdata);
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
      data.search({ limit: 5, paginate: true, })
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

function getDBStats(req, res, next) {
  const datas = Array.from(periodic.datas.entries());
  const datasList = datas.map(getDatasFromMap);
  const dataDocs = [];
  const countData = [];
  req.controllerData = Object.assign({}, req.controllerData);

  Promisie.map(datasList, 5, getRecentData)
    .then(result => {
      // result.forEach(addDataToReturnArray.bind(dataDocs));
      result.forEach(recentData => {
        dataDocs.push(...recentData.docs);
        countData.push(recentData.modelData);
      });
      dataDocs.map(dataDoc => {
        if (dataDoc.source && dataDoc.periodic_compatibility && dataDoc.periodic_config && !dataDoc.entitytype) {
          dataDoc.entitytype = 'extension';
        }
        if (dataDoc.filepath && dataDoc.config && !dataDoc.entitytype) {
          dataDoc.entitytype = 'configuration';
          dataDoc.name = dataDoc.filepath;
        }
        return dataDoc;
      });
      req.controllerData.dataDocs = dataDocs.sort(periodic.core.utilities.sortObject('desc', 'updatedat'));
      req.controllerData.countData = countData;
      next();
    })
    .catch(next);
}

module.exports = {
  adminResLocals,
  dashboardView,
  fixCodeMirrorSubmit,
  getAppSettings,
  appSettingsView,
  accountView,
  getDBStats,
  getDatasFromMap,
  getRecentData,
};