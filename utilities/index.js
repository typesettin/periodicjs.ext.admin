'use strict';
const periodic = require('periodicjs');
const data = require('./data');
const extArray = Array.from(periodic.extensions.values());
const extensionMenu = extArray.map(getAdminMenuFromExtension).filter(filterAdminExtensionMenus);
let dataModels = {};

function getDataModelData() {
  dataModels = Array.from(periodic.models.keys()).reduce(getModelObjectReducer, {});;
  return dataModels;
}

function getDataModels() {
  return (Object.keys(dataModels).length) ? dataModels : getDataModelData();
}

function schemeLabelFilter(schemelabel) {
  return ['id', 'random'].indexOf(schemelabel) === -1
}

function getModelObjectReducer(result, key) {
  const modelScheme = periodic.models.get(key);
  result[key] = modelScheme;
  result[key].schemeModel = Object.keys(modelScheme.scheme).filter(schemeLabelFilter).reduce((result, key) => {
    const schemeLabel = modelScheme.scheme[key];
    if (Array.isArray(schemeLabel)) {
      result[key] = [];
    } else {
      result[key] = '';
    }
    return result;
  }, {});
  return result;
}

function getAdminMenuFromExtension(ext) {
  return {
    name: ext.name,
    menu: (ext.periodic_config && ext.periodic_config.periodicjs_ext_admin) ? ext.periodic_config.periodicjs_ext_admin : false,
  };
}

function filterAdminExtensionMenus(ext) {
  return ext.menu !== false;
}

function getSettings() {
  return periodic.settings.extensions['periodicjs.ext.admin'];
}

module.exports = {
  extArray,
  getAdminMenuFromExtension,
  filterAdminExtensionMenus,
  extensionMenu,
  dataModels,
  getDataModelData,
  getDataModels,
  getSettings,
  data,
};