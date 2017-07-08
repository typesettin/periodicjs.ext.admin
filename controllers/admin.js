'use strict';
const periodic = require('periodicjs');
const utilities = require('../utilities');
const adminSettings = utilities.getSettings();
const admin_route_prefix = adminSettings.routing.admin_prefix;
const adminRoute = periodic.utilities.routing.route_prefix(admin_route_prefix);


function adminResLocals(req, res, next) {
  res.locals['adminExt'] = {
    adminRoute,
    passportUser: req.user,
  };
  next();
}

function dashboardView(req, res) {
  const viewtemplate = {
    // themename,
    viewname: 'admin/dashboard',
    extname: 'periodicjs.ext.admin',
    // fileext,
  };
  const viewdata = {
    user: req.user,
    passportUser: req.user,
  };
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
      req.controllerData = req.controllerData || {};
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

function getDBStats(req, res, next) {
  let databaseCountData = [];
  let databaseFeedData = [];
  req.controllerData = (req.controllerData) ? req.controllerData : {};
  const DBModels = Object.keys(mongoose.models);
  Promisie.parallel({
      databaseFeed: () => {
        return Promise.all(DBModels.map(model => {
          return new Promise((resolve, reject) => {
            mongoose.model(model)
              .find({})
              .limit(5)
              .sort({ updatedat: 'desc', })
              .exec((err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve((results && results.length) ?
                    results.map(result => {
                      databaseFeedData.push(result);
                      return result;
                    }) :
                    []);
                }
              });
          });
        }));
      },
      databaseCount: () => {
        return Promise.all(DBModels.map(model => {
          return new Promise((resolve, reject) => {
            mongoose.model(model)
              .count({}, (err, count) => {
                if (err) {
                  reject(err);
                } else {
                  databaseCountData.push({
                    collection: model,
                    count: count,
                  });
                  resolve(count);
                }
              });
          });
        }));
      },
      extensions: () => {
        return new Promise((resolve, reject) => {
          CoreExtensions.getExtensions({
              periodicsettings: appSettings,
            },
            function(err, extensions) {
              if (err) {
                reject(err);
              } else {
                resolve(extensions);
              }
            });
        });
      },
    })
    .then(results => {
      const totalItems = databaseCountData.map(datam => datam.count).reduce((result, key) => result + key, 0);
      const data = databaseCountData.map((datum, i) => {
        return {
          name: capitalize(pluralize(datum.collection)),
          docs: datum.count,
          count: datum.count,
          percent: ((datum.count / totalItems) * 100).toFixed(2),
          fill: colors[i].HEX,
        }
      });
      const numeralFormat = '0.0a';
      databaseFeedData = databaseFeedData.sort(CoreUtilities.sortObject('desc', 'updatedat'));

      req.controllerData.contentcounts = {
        data,
        databaseFeedData,
        databaseCountData,
        totalItems: numeral(totalItems).format(numeralFormat),
        totalCollections: numeral(databaseCountData.length).format(numeralFormat),
        totalExtensions: numeral(results.extensions.length).format(numeralFormat),
        extensions: results.extensions,
        appname: appSettings.name,
      };
      next();
    })
    .catch(next);
};

module.exports = {
  adminResLocals,
  dashboardView,
  fixCodeMirrorSubmit,
  getAppSettings,
  appSettingsView,
  accountView,
  getDBStats,
};