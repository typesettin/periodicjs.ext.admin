'use strict';

var request = require('superagent'),
	letterpress = require('letterpressjs'),
	updatemedia = require('./updatemedia'),
	ajaxFormToSubmit,
	autoSaveItem = function (options) {
		var autosaveval = options.autosave;

		if (autosaveval && ajaxFormToSubmit) {
			window.ajaxFormSubmit(null, ajaxFormToSubmit);
		}
	},
	createPeriodicTag = function (id, val, callback, url, type) {
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

		var autosaveval = true;
		switch (type) {
		case 'tag':
			autosaveval = window.adminSettings.autosave_compose_tags;
			break;
		case 'contenttype':
			autosaveval = window.adminSettings.autosave_compose_contenttypes;
			break;
		case 'category':
			autosaveval = window.adminSettings.autosave_compose_categories;
			break;
		}
		autoSaveItem({
			autosave: autosaveval
		});
	},
	wysihtml5Editor,
	tag_lp = new letterpress({
		idSelector: '#padmin-tags',
		sourcedata: '/tag/search.json',
		sourcearrayname: 'tags',
		createTagFunc: function (id, val, callback) {
			createPeriodicTag(id, val, callback, '/tag/new/' + window.makeNiceName(document.querySelector('#padmin-tags').value) + '/?format=json&limit=200', 'tag');
		}
	}),
	cat_lp = new letterpress({
		idSelector: '#padmin-categories',
		sourcedata: '/category/search.json',
		sourcearrayname: 'categories',
		createTagFunc: function (id, val, callback) {
			createPeriodicTag(id, val, callback, '/category/new/' + window.makeNiceName(document.querySelector('#padmin-tags').value) + '/?format=json&limit=200', 'category');
		}
	}),
	athr_lp = new letterpress({
		idSelector: '#padmin-authors',
		sourcedata: '/user/search.json',
		sourcearrayname: 'users',
		valueLabel: 'username',
		disablenewtags: true,
		createTagFunc: function (id, val, callback) {
			if (id === 'NEWTAG' || id === 'SELECT') {
				window.ribbonNotification.showRibbon('user does not exist', 4000, 'error');
			}
			else if (id !== 'SELECT' || id !== 'NEWTAG') {
				callback(id, val);
				autoSaveItem({
					autosave: true
				});
			}
		}
	}),
	cnt_lp = new letterpress({
		idSelector: '#padmin-contenttypes',
		sourcedata: '/contenttype/search.json',
		sourcearrayname: 'contenttypes',
		createTagFunc: function (id, val, callback) {
			createPeriodicTag(id, val, callback, '/contenttype/new/' + window.makeNiceName(document.querySelector('#padmin-contenttypes').value) + '/?format=json&limit=200', 'contenttype');
		}
	}),
	mediafileinput,
	mediafilesresult;

var uploadMediaFiles = function (e) {
	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files,
		f,
		updateitemimage = function (mediadoc) {
			// console.log(mediadoc);
			updatemedia(mediafilesresult, mediadoc);
			autoSaveItem({
				autosave: window.adminSettings.autosave_compose_assets
			});
		};

	// process all File objects
	for (var i = 0; i < files.length; i++) {
		f = files[i];
		// ParseFile(f);
		// uploadFile(f);
		updatemedia.uploadFile(mediafilesresult, f, {
			callback: updateitemimage
		});
	}
};

window.backToItemLanding = function () {
	window.location = '/p-admin/items';
};

window.addEventListener('load', function () {
	tag_lp.init();
	cat_lp.init();
	athr_lp.init();
	cnt_lp.init();
	ajaxFormToSubmit = document.getElementById('edit-item-form');
	if (typeof itemtags === 'object') {
		tag_lp.setPreloadDataObject(window.itemtags);
	}
	if (typeof itemcategories === 'object') {
		cat_lp.setPreloadDataObject(window.itemcategories);
	}
	if (typeof itemauthors === 'object') {
		athr_lp.setPreloadDataObject(window.itemauthors);
	}
	if (typeof itemcontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.itemcontenttypes);
	}

	window.ajaxFormEventListers('._pea-ajax-form');
	wysihtml5Editor = new window.wysihtml5.Editor('wysihtml5-textarea', {
		// id of textarea element
		toolbar: 'wysihtml5-toolbar', // id of toolbar element
		parserRules: window.wysihtml5ParserRules // defined in parser rules set 
	});
	mediafileinput = document.getElementById('padmin-mediafiles');
	mediafilesresult = document.getElementById('media-files-result');
	mediafileinput.addEventListener('change', uploadMediaFiles, false);
	mediafilesresult.addEventListener('click', updatemedia.handleMediaButtonClick, false);
});
