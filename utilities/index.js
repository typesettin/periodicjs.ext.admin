'use strict';
const periodic = require('periodicjs');
const data = require('./data');
const extArray = Array.from(periodic.extensions.values());
const extensionMenu = extArray.map(getAdminMenuFromExtension).filter(filterAdminExtensionMenus);

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
  getSettings,
  data,
};