'use strict';

var path = require('path'),
	// request = require('superagent'),
	async = require('async'),
	fs = require('fs-extra'),
	str2json = require('string-to-json'),
	merge = require('utils-merge'),
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
	mailoptions.cc = user.email; //options.cc;
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
	settingemailoptions.subject = (options.subject) ? options.subject : appSettings.name + ' -Admin Email Notification';
	settingemailoptions.generatetextemail = true;
	settingemailoptions.html = ejs.render(options.emailtemplate, settingemailoptions);
	// console.log('settingemailoptions',settingemailoptions);
	sendEmail(settingemailoptions, callback);
};

var restart_app = function (req, res) {
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
	if (changedemailtemplate && emailtransport) {
		var d = new Date();
		fs.readFile(changedemailtemplate, 'utf8', function (err, templatestring) {
			if (err) {
				logger.err(err);
			}
			else if (templatestring) {
				sendSettingEmail({
					subject: appSettings.name + '[env:' + appSettings.application.environment + '] Application Restart Notification',
					user: req.user,
					hostname: req.headers.host,
					appname: appSettings.name,
					appenvironment: appSettings.application.environment,
					appport: appSettings.application.port,
					settingmessage: 'Your application was restarted from the admin interface - ' + d,
					emailtemplate: templatestring,
					mailtransport: emailtransport
				}, function (err, status) {
					if (err) {
						logger.error(err);
					}
					else {
						console.info('email status', status);
					}
				});
			}
		});
	}
};

var update_app = function (req, res) {
	CoreController.handleDocumentQueryRender({
		req: req,
		res: res,
		redirecturl: '/p-admin/settings',
		responseData: {
			result: 'success',
			data: 'restarted'
		}
	});
};

/**
 * load the extensions configuration files from the installed config folder in content/config/extensions/[extension]/[config files]
 * @param  {object}   req
 * @param  {object}   res
 * @param  {Function} next
 */
var load_extension_settings = function (req, res, next) {
	var extname = req.params.id,
		ext_default_config_file_path = path.resolve(process.cwd(), 'node_modules/', extname, 'config'),
		ext_installed_config_file_path = path.resolve(process.cwd(), 'content/config/extensions/', extname),
		missing_conf_files = [],
		installed_conf_files = [];

	/**
	 * get both installed files, and the default files in ext conf directory, if missin files, add them to missing conf files array
	 * @param  {Function} callback async.parallel callback
	 * @return {Array}            array of missing conf files
	 */
	var getextensionconfigfiles = function (callback) {
		async.parallel({
				defaultExtConfFiles: function (cb) {
					fs.readdir(ext_default_config_file_path, function (err, file) {
						cb(null, file);
					});
				},
				installedExtConfFiles: function (cb) {
					fs.readdir(ext_installed_config_file_path, function (err, file) {
						cb(null, file);
					});
				}
			},
			function (err, result) {
				console.log('err', err, 'result', result);
				try {
					if (result.defaultExtConfFiles && result.defaultExtConfFiles.length > 0) {
						missing_conf_files = result.defaultExtConfFiles;
						if (result.installedExtConfFiles && result.installedExtConfFiles.length > 0) {
							for (var c in missing_conf_files) {
								for (var d in result.installedExtConfFiles) {
									if (missing_conf_files[c] === result.installedExtConfFiles[d]) {
										installed_conf_files.push(missing_conf_files.splice(c, 1)[0]);
									}
								}
							}
						}
					}
					callback(null, missing_conf_files);
				}
				catch (e) {
					callback(e, null);
				}
			});
	};

	/**
	 * copy missing files if any are missing
	 * @param  {array}   missingExtConfFiles array of missing files
	 * @param  {Function} callback            async callback
	 */
	var copymissingconfigfiles = function (missingExtConfFiles, callback) {
		if (missingExtConfFiles && missingExtConfFiles.length > 0) {
			async.each(missingExtConfFiles, function (file, cb) {
				fs.copy(path.resolve(ext_default_config_file_path, file), path.resolve(ext_installed_config_file_path, file), cb);
			}, function (err) {
				callback(err);
			});
		}
		else {
			callback(null);
		}
	};

	/**
	 * load config files into array of filejson
	 * @param  {Function} callback async callbackk
	 * @return {array}            array of file data objects
	 */
	var loadconfigfiles = function (callback) {
		var configfilesJSON = [];
		fs.readdir(ext_installed_config_file_path, function (err, configfiles) {
			if (err) {
				callback(err);
			}
			else {
				if (configfiles && configfiles.length > 0) {
					async.each(configfiles, function (configFile, cb) {
						if (path.extname(configFile) === '.json') {
							fs.readJson(path.resolve(ext_installed_config_file_path, configFile), function (err, data) {
								if (err) {
									cb(err);
								}
								else {
									configfilesJSON.push({
										name: configFile,
										filedata: data
									});
									cb(null);
								}
							});
						}
						else {
							fs.readFile(path.resolve(ext_installed_config_file_path, configFile), 'utf8', function (err, data) {
								if (err) {
									cb(err);
								}
								else {
									configfilesJSON.push({
										name: configFile,
										filedata: data
									});
									cb(null);
								}
							});
						}
					}, function (err) {
						if (err) {
							callback(err);
						}
						else {
							callback(null, configfilesJSON);
						}
					});
				}
				else {
					callback(null, configfilesJSON);
				}
			}
		});
	};

	req.controllerData = (req.controllerData) ? req.controllerData : {};


	async.waterfall([
			getextensionconfigfiles,
			copymissingconfigfiles,
			loadconfigfiles
		],
		function (err, result) {
			if (err) {
				CoreController.handleDocumentQueryErrorResponse({
					err: err,
					res: res,
					req: req
				});
			}
			else {
				// console.log('err', err, 'result', result);
				req.controllerData.extconfigfiles = result;
				next();
			}
		});

};

var load_app_settings = function (req, res, next) {
	var appsettings = {
		readonly: {
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
		configuration: {
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


var load_theme_settings = function (req, res, next) {
	var themesettings = {
		readonly: {
			name: appSettings.themeSettings.name,
			periodicCompatibility: appSettings.themeSettings.periodicCompatibility,
			author: appSettings.themeSettings.author,
			url: appSettings.themeSettings.url,
			templatefileextension: appSettings.templatefileextension,
			templateengine: appSettings.templateengine,
			themepath: appSettings.themepath
		},
		configuration: {
			settings: appSettings.themeSettings.settings,
		}
	};

	req.controllerData = (req.controllerData) ? req.controllerData : {};
	req.controllerData.themesettings = themesettings;
	next();
};

var update_app_settings = function (req, res) {
	var updatedAppSettings = CoreUtilities.removeEmptyObjectValues(req.body),
		appsettingsfile = path.join(process.cwd(), 'content/config/config.json');

	updatedAppSettings = CoreUtilities.replaceBooleanStringObjectValues(updatedAppSettings);
	delete updatedAppSettings._csrf;

	fs.readJson(appsettingsfile, function (err, appconfig) {
		if (err) {
			CoreController.handleDocumentQueryErrorResponse({
				err: err,
				res: res,
				req: req
			});
		}
		else {
			updatedAppSettings = str2json.convert(updatedAppSettings);
			var originalconfig = appconfig,
				mergedconfig = merge(originalconfig, updatedAppSettings);

			fs.writeJson(appsettingsfile, mergedconfig, function (err) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					CoreController.handleDocumentQueryRender({
						req: req,
						res: res,
						redirecturl: '/p-admin/settings',
						responseData: {
							result: 'success',
							data: 'app config updated'
						},
						callback: function () {
							CoreUtilities.restart_app({
								restartfile: restartfile
							});
						}
					});

					if (changedemailtemplate && emailtransport) {
						var d = new Date();
						fs.readFile(changedemailtemplate, 'utf8', function (err, templatestring) {
							if (err) {
								logger.err(err);
							}
							else if (templatestring) {
								sendSettingEmail({
									subject: appSettings.name + '[env:' + appSettings.application.environment + '] Application Configuration Change Notification',
									user: req.user,
									hostname: req.headers.host,
									appname: appSettings.name,
									appenvironment: appSettings.application.environment,
									appport: appSettings.application.port,
									settingmessage: '<p>Your application was configuration was changed from the admin interface - ' + d + '</p><p><pre>' + JSON.stringify(mergedconfig, null, '\t') + '</pre></p>',
									emailtemplate: templatestring,
									mailtransport: emailtransport
								}, function (err, status) {
									if (err) {
										logger.error(err);
									}
									else {
										console.info('email status', status);
									}
								});
							}
						});
					}
				}
			});
		}
	});
};

var update_theme_settings = function (req, res) {
	var updatedThemeSettings = CoreUtilities.removeEmptyObjectValues(req.body),
		themesettingsfile = path.join(process.cwd(), 'content/themes', appSettings.theme, 'periodicjs.theme.json');

	updatedThemeSettings = CoreUtilities.replaceBooleanStringObjectValues(updatedThemeSettings);
	delete updatedThemeSettings._csrf;

	fs.readJson(themesettingsfile, function (err, themeconfig) {
		if (err) {
			CoreController.handleDocumentQueryErrorResponse({
				err: err,
				res: res,
				req: req
			});
		}
		else {
			updatedThemeSettings = str2json.convert(updatedThemeSettings);
			var originalsettings = themeconfig.settings,
				mergedsettings = merge(originalsettings, updatedThemeSettings.settings),
				newthemeconfig = themeconfig;
			newthemeconfig.settings = mergedsettings;

			fs.writeJson(themesettingsfile, newthemeconfig, function (err) {
				if (err) {
					CoreController.handleDocumentQueryErrorResponse({
						err: err,
						res: res,
						req: req
					});
				}
				else {
					CoreController.handleDocumentQueryRender({
						req: req,
						res: res,
						redirecturl: '/p-admin/settings',
						responseData: {
							result: 'success',
							data: 'theme config updated'
						},
						callback: function () {
							CoreUtilities.restart_app({
								restartfile: restartfile
							});
						}
					});
					if (changedemailtemplate && emailtransport) {
						var d = new Date();
						fs.readFile(changedemailtemplate, 'utf8', function (err, templatestring) {
							if (err) {
								logger.err(err);
							}
							else if (templatestring) {
								sendSettingEmail({
									subject: appSettings.name + '[env:' + appSettings.application.environment + '] Application Theme Setting Change Notification',
									user: req.user,
									hostname: req.headers.host,
									appname: appSettings.name,
									appenvironment: appSettings.application.environment,
									appport: appSettings.application.port,
									settingmessage: '<p>Your theme configuration was changed from the admin interface - ' + d + '</p><p><pre>' + JSON.stringify(newthemeconfig, null, '\t') + '</pre></p>',
									emailtemplate: templatestring,
									mailtransport: emailtransport
								}, function (err, status) {
									if (err) {
										logger.error(err);
									}
									else {
										console.info('email status', status);
									}
								});
							}
						});
					}
				}
			});
		}
	});
};

var controller = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	dbSettings = resources.db;
	CoreController = new ControllerHelper(resources);
	CoreUtilities = new Utilities(resources);
	AppDBSetting = mongoose.model('Setting');

	CoreController.getPluginViewDefaultTemplate({
			viewname: 'p-admin/email/settings/notification',
			themefileext: appSettings.templatefileextension
		},
		function (err, templatepath) {
			if (templatepath === 'p-admin/email/settings/notification') {
				templatepath = path.resolve(process.cwd(), 'node_modules/periodicjs.ext.admin/views', templatepath + '.' + appSettings.templatefileextension);
			}
			changedemailtemplate = templatepath;
		}
	);
	CoreMailer.getTransport({
		appenvironment: appSettings.application.environment
	}, function (err, transport) {
		if (err) {
			console.error(err);
		}
		else {
			emailtransport = transport;
		}
	});

	return {
		load_extension_settings: load_extension_settings,
		load_app_settings: load_app_settings,
		load_theme_settings: load_theme_settings,
		restart_app: restart_app,
		update_app: update_app,
		update_theme_settings: update_theme_settings,
		update_app_settings: update_app_settings
	};
};

module.exports = controller;
