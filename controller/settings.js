'use strict';

var path = require('path'),
    request = require('superagent'),
    semver = require('semver'),
    fs = require('fs-extra'),
    Utilities = require('periodicjs.core.utilities'),
    ControllerHelper = require('periodicjs.core.controllerhelper'),
    CoreUtilities,
    CoreController,
    appSettings,
    dbSettings,
    mongoose,
    AppDBSetting,
    logger;

var load_app_settings = function(req,res,next){
    var appsettings = {
        readonly:{
            application: { port: '8786', environment: 'development' },
            cookies: { cookieParser: 'h944cmg52vs4ii4xman26xikq33di' },
            crsf: true,
            database: dbSettings.url,
            expressCompression: true,
            theme: 'periodicjs.theme.periodical',            
            templatefileextension: 'ejs',
            templateengine: 'ejs',
            sessions: { enabled: true, type: 'mongo' },
            version: '1.8.2',
        },
        configuration:{
            adminnotificationemail: 'accounts@promisefin.com',
            debug: true,
            homepage: 'local.getperiodic.com:8786',
            name: 'Periodicjs',
        }
    };

    req.controllerData = (req.controllerData) ? req.controllerData : {};
    req.controllerData.appsettings = appsettings;
    next();
};

var load_theme_settings = function(req,res,next){
    var themesettings = {
        readonly:{
            name: appSettings.themeSettings.name,
            periodicCompatibility: appSettings.themeSettings.periodicCompatibility,
            author: appSettings.themeSettings.author,
            url: appSettings.themeSettings.url,
            templatefileextension: appSettings.templatefileextension,
            templateengine: appSettings.templateengine,
            themepath: appSettings.themepath
        },
        configuration:{
            settings:  appSettings.themeSettings.settings,
        }
    };

    req.controllerData = (req.controllerData) ? req.controllerData : {};
    req.controllerData.themesettings = themesettings;
    next();
};

var controller = function(resources){
    logger = resources.logger;
    mongoose = resources.mongoose;
    appSettings = resources.settings;
    dbSettings = resources.db;
    CoreController = new ControllerHelper(resources);
    CoreUtilities = new Utilities(resources);
    AppDBSetting = mongoose.model('Setting');

    return{
        load_app_settings:load_app_settings,
        load_theme_settings:load_theme_settings
    };
};

module.exports = controller;