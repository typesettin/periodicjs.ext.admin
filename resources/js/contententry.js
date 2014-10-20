'use strict';

var request = require('superagent'),
	updatemedia = require('./updatemedia'),
	letterpress = require('letterpressjs'),
	uploadmediaCallback,
	wysihtml5Editor,
	ajaxFormToSubmit,
	mediafileinput,
	mediafilesresult;

var contententry = function (options) {
	this.init(options);
};

contententry.prototype.init = function (options) {
	uploadmediaCallback = options.uploadmediaCallback;
	ajaxFormToSubmit = options.ajaxFormToSubmit;
	mediafileinput = options.mediafileinput;
	mediafilesresult = options.mediafilesresult;
	if (mediafileinput) {
		mediafileinput.addEventListener('change', this.uploadMediaFiles, false);
	}
	if (mediafilesresult) {
		mediafilesresult.addEventListener('click', updatemedia.handleMediaButtonClick, false);
	}
	if (document.querySelector('#wysihtml5-textarea')) {
		wysihtml5Editor = new window.wysihtml5.Editor('wysihtml5-textarea', {
			// id of textarea element
			toolbar: 'wysihtml5-toolbar', // id of toolbar element
			parserRules: window.wysihtml5ParserRules // defined in parser rules set 
		});
	}
};

contententry.prototype.autoSaveItem = function (options) {
	var autosaveval = options.autosave,
		t;
	t = setTimeout(function () {
		if (autosaveval && ajaxFormToSubmit) {
			window.ajaxFormSubmit(null, ajaxFormToSubmit);
		}
		clearTimeout(t);
	}, 500);
};

contententry.prototype.createPeriodicTag = function (id, val, callback, url, type) {
	if ((id === 'NEWTAG' || id === 'SELECT') && val) {
		request
			.post(url)
			.send({
				title: val,
				_csrf: document.querySelector('input[name=_csrf]').value
			})
			.set('Accept', 'application/json')
			.end(function (error, res) {
				if (res.error) {
					error = res.error;
				}
				if (error) {
					window.ribbonNotification.showRibbon(error.message, 4000, 'error');
				}
				else {
					if (res.body.result === 'error') {
						window.ribbonNotification.showRibbon(res.body.data.error, 4000, 'error');
					}
					else if (typeof res.body.data.doc._id === 'string') {
						callback(
							res.body.data.doc._id,
							res.body.data.doc.title,
							error);
					}
				}
			});
	}
	else if (id !== 'SELECT' || id !== 'NEWTAG') {
		callback(id, val);
	}
	// console.log('autosaveval', autosaveval, 'type', type, 'window.adminSettings', window.adminSettings,'ajaxFormToSubmit',ajaxFormToSubmit);

	var autosaveval = true,
		autouploadsettings = window.adminSettings || {};
	switch (type) {
	case 'tag':
		autosaveval = (autouploadsettings.autosave_compose_tags) || true;
		break;
	case 'contenttype':
		autosaveval = (autouploadsettings.autosave_compose_contenttypes) || true;
		break;
	case 'category':
		autosaveval = (autouploadsettings.autosave_compose_categories) || true;
		break;
	}

	contententry.prototype.autoSaveItem({
		autosave: autosaveval
	});
};

contententry.prototype.parent_lp = function (configoptions) {
	var options = configoptions || {},
		idSelector = options.idSelector || '#padmin-parent',
		sourcedata = '/' + options.doctypename + '/search.json',
		sourcearrayname = options.doctypenamelink,
		returnlp = new letterpress({
			idSelector: idSelector,
			sourcedata: sourcedata,
			sourcearrayname: sourcearrayname,
			createTagFunc: function (id, val, callback) {
				if (id === 'NEWTAG' || id === 'SELECT') {
					window.ribbonNotification.showRibbon(options.doctypename + ' does not exist', 4000, 'error');
				}
				else if (id !== 'SELECT' || id !== 'NEWTAG') {
					callback(id, val);
					this.autoSaveItem({
						autosave: true
					});
				}
			}.bind(this)
		});

	return returnlp;
};


contententry.prototype.athr_lp = function (configoptions) {
	var options = configoptions || {},
		idSelector = options.idSelector || '#padmin-authors',
		sourcedata = options.sourcedata || '/user/search.json',
		sourcearrayname = options.sourcearrayname || 'users',
		returnlp = new letterpress({
			idSelector: idSelector,
			sourcedata: sourcedata,
			sourcearrayname: sourcearrayname,
			valueLabel: 'username',
			disablenewtags: true,
			createTagFunc: function (id, val, callback) {
				if (id === 'NEWTAG' || id === 'SELECT') {
					window.ribbonNotification.showRibbon('user does not exist', 4000, 'error');
				}
				else if (id !== 'SELECT' || id !== 'NEWTAG') {
					callback(id, val);
					this.autoSaveItem({
						autosave: true
					});
				}

			}.bind(this)
		});

	return returnlp;
};

contententry.prototype.cnt_lp = function (configoptions) {
	var options = configoptions || {},
		idSelector = options.idSelector || '#padmin-contenttypes',
		sourcedata = options.sourcedata || '/contenttype/search.json',
		sourcearrayname = options.sourcearrayname || 'contenttypes',
		tagposturl = options.tagposturl || '/contenttype/new/' + window.makeNiceName(document.querySelector('#padmin-contenttypes').value) + '/?format=json&limit=200',
		type = options.type || 'contenttype',
		returnlp = new letterpress({
			idSelector: idSelector,
			sourcedata: sourcedata,
			sourcearrayname: sourcearrayname,
			createTagFunc: function (id, val, callback) {
				this.createPeriodicTag(id, val, callback, tagposturl, type);
			}.bind(this)
		});

	return returnlp;
};

contententry.prototype.cat_lp = function (configoptions) {
	var options = configoptions || {},
		idSelector = options.idSelector || '#padmin-categories',
		sourcedata = options.sourcedata || '/category/search.json',
		sourcearrayname = options.sourcearrayname || 'categories',
		categoryposturl = options.categoryposturl || '/category/new/' + window.makeNiceName(document.querySelector('#padmin-categories').value) + '/?format=json&limit=200',
		type = options.type || 'category',
		returnlp = new letterpress({
			idSelector: idSelector,
			sourcedata: sourcedata,
			sourcearrayname: sourcearrayname,
			createTagFunc: function (id, val, callback) {
				this.createPeriodicTag(id, val, callback, categoryposturl, type);
			}.bind(this)
		});

	return returnlp;
};

contententry.prototype.tag_lp = function (configoptions) {
	var options = configoptions || {},
		idSelector = options.idSelector || '#padmin-tags',
		sourcedata = options.sourcedata || '/tag/search.json',
		sourcearrayname = options.sourcearrayname || 'tags',
		tagposturl = options.tagposturl || '/tag/new/' + window.makeNiceName(document.querySelector('#padmin-tags').value) + '/?format=json&limit=200',
		type = options.type || 'tag',
		returnlp = new letterpress({
			idSelector: idSelector,
			sourcedata: sourcedata,
			sourcearrayname: sourcearrayname,
			createTagFunc: function (id, val, callback) {
				this.createPeriodicTag(id, val, callback, tagposturl, type);
			}.bind(this)
		});

	return returnlp;
};

contententry.prototype.uploadMediaFiles = function (e) {
	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files,
		autouploadsettings = window.adminSettings || {},
		f,
		uploadmediafilecallback = uploadmediaCallback || function (mediadoc) {
			// console.log(mediadoc);
			updatemedia(mediafilesresult, mediadoc);
			contententry.prototype.autoSaveItem({
				autosave: (autouploadsettings.autosave_compose_assets) || true
			});
		};

	// process all File objects
	for (var i = 0; i < files.length; i++) {
		f = files[i];
		// ParseFile(f);
		// uploadFile(f);
		updatemedia.uploadFile(mediafilesresult, f, {
			callback: uploadmediafilecallback
		});
	}
};


module.exports = contententry;
