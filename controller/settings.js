'use strict';

var path = require('path'),
    // request = require('superagent'),
    // semver = require('semver'),
    fs = require('fs-extra'),
    ejs = require('ejs'),
    Utilities = require('periodicjs.core.utilities'),
    ControllerHelper = require('periodicjs.core.controllerhelper'),
    CoreUtilities,
    CoreController,
    appSettings,
    dbSettings,
    mongoose,
    AppDBSetting,
    logger,
    restartfile = path.join(process.cwd(), '/content/extensions/restart.json'),
    CoreMailer = require('periodicjs.core.mailer'),
    changedemailtemplate,
    emailtransport;

var sendEmail = function (options, callback) {
    var mailtransport = options.mailtransport,
        user = options.user,
        mailoptions = {};

    mailoptions.to = (options.to) ? options.to : appSettings.adminnotificationemail;
    mailoptions.cc = user.email;//options.cc;
    mailoptions.bcc = options.bcc;
    mailoptions.replyTo = options.replyTo;
    mailoptions.subject = options.subject;
    if (options.generatetextemail) {
        mailoptions.generateTextFromHTML = true;
    }
    mailoptions.html = options.html;
    mailoptions.text = options.text;
    mailtransport.sendMail(mailoptions, callback);
};
var sendSettingEmail = function (options, callback) {
    var settingemailoptions = options;
    settingemailoptions.subject = (options.subject) ? options.subject : appSettings.name+' -Admin Email Notification';
    settingemailoptions.generatetextemail = true;
    settingemailoptions.html = ejs.render(options.emailtemplate, settingemailoptions);
    // console.log('settingemailoptions',settingemailoptions);
    sendEmail(settingemailoptions, callback);
};


var restart_app = function(req,res){
    CoreUtilities.restart_app({
        restartfile: restartfile
    });
    CoreController.handleDocumentQueryRender({
        req: req,
        res: res,
        redirecturl: '/p-admin/settings',
        responseData: {
            result: 'success',
            data: 'restarted'
        }
    });
    if(changedemailtemplate && emailtransport){
        var d = new Date();
        fs.readFile(changedemailtemplate, 'utf8', function(err,templatestring){
            if(err){
                logger.err(err);
            }
            else if(templatestring){
                sendSettingEmail({
                subject: appSettings.name+'[env:'+appSettings.application.environment+'] Application Restart Notification',
                user:req.user,
                hostname:req.headers.host,
                appname:appSettings.name,
                appenvironment:appSettings.application.environment,
                appport:appSettings.application.port,
                settingmessage:'Your application was restarted from the admin interface - '+d,
                emailtemplate:templatestring,
                mailtransport:emailtransport
            },function(err,status){
                if(err){
                    logger.error(err);
                }
                else{
                    console.info('email status',status);
                }
            });
            }
        });
    }
};

var load_app_settings = function(req,res,next){
    var appsettings = {
        readonly:{
            application: appSettings.application,
            cookies: appSettings.cookies,
            crsf: appSettings.crsf,
            database: dbSettings.url,
            expressCompression: appSettings.expressCompression,
            theme: appSettings.theme,            
            templatefileextension: appSettings.templatefileextension,
            templateengine: appSettings.templateengine,
            sessions: appSettings.sessions,
            version: appSettings.version,
        },
        configuration:{
            adminnotificationemail: appSettings.adminnotificationemail,
            serverfromemail: appSettings.serverfromemail,
            debug: appSettings.debug,
            homepage: appSettings.homepage,
            name: appSettings.name,
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

    CoreController.getPluginViewDefaultTemplate(
        {
            viewname:'p-admin/email/settings/notification',
            themefileext:appSettings.templatefileextension
        },
        function(err,templatepath){
            if(templatepath ==='p-admin/email/settings/notification'){
                templatepath = path.resolve(process.cwd(),'node_modules/periodicjs.ext.admin/views',templatepath+'.'+appSettings.templatefileextension);
            }
            changedemailtemplate = templatepath;
        }
    );
    CoreMailer.getTransport({appenvironment : appSettings.application.environment},function(err,transport){
        if(err){
            console.error(err);
        }
        else{
            emailtransport = transport;                                 
        }
    });

    return{
        load_app_settings:load_app_settings,
        load_theme_settings:load_theme_settings,
        restart_app:restart_app
    };
};

module.exports = controller;