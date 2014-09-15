'use strict';

var request = require('superagent'),
	// updatemedia = require('./updatemedia'),
	wysihtml5Editor,
	request = require('superagent'),
	letterpress = require('letterpressjs'),
	updatemedia = require('./updatemedia'),
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
							// console.log("type",type);
						}
					}
				});
		}
		else if (id !== 'SELECT' || id !== 'NEWTAG') {
			callback(id, val);
			// console.log('type', type);
		}
	},
	cnt_lp,
	assetTable,
	mediafileinput,
	mediafilesresult;

var uploadMediaFiles = function (e) {
	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files,
		f,
		updateitemimage = function (mediadoc) {
			console.log(mediadoc);
			// updatemedia(mediafilesresult, mediadoc);
			window.location.reload();
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

var removeTableRow = function (element) {
	element.parentElement.removeChild(element);
};

window.backToAssetLanding = function () {
	window.location = '/p-admin/assets';
};

var assetTableClick = function (e) {
	var eTarget = e.target;
	if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('delete-asset-button')) {
		request
			.post(eTarget.getAttribute('data-href'))
			.set('Accept', 'application/json')
			.send({
				_csrf: document.querySelector('input[name=_csrf]').value
			})
			.query({
				format: 'json'
			})
			.end(function (error, res) {
				if (res.error) {
					error = res.error;
				}
				if (error || res.status === 500) {
					window.ribbonNotification.showRibbon(error.message, 4000, 'error');
				}
				else {
					if (res.body.result === 'error') {
						window.ribbonNotification.showRibbon(res.body.data.error, 4000, 'error');
					}
					else {
						window.ribbonNotification.showRibbon(res.body.data, 4000, 'warn');
						var assetid = eTarget.getAttribute('assetid');
						var assettr = document.querySelector('[data-tr-assetid="' + assetid + '"]');
						removeTableRow(assettr);
					}
				}
			});
	}
};

window.removeAssetRow = function (deleteData) {
	var rowElement = document.getElementById('asset-tr-' + deleteData._id);
	rowElement.parentElement.removeChild(rowElement);
};

window.addEventListener('load', function () {
	window.ajaxFormEventListers('._pea-ajax-form');
	assetTable = document.getElementById('pea-asset-admin');
	mediafileinput = document.getElementById('padmin-mediafiles');
	mediafilesresult = document.getElementById('media-files-result');
	if (mediafileinput) {
		mediafileinput.addEventListener('change', uploadMediaFiles, false);
	}
	if (mediafilesresult) {
		mediafilesresult.addEventListener('click', updatemedia.handleMediaButtonClick, false);
	}
	if (assetTable) {
		assetTable.addEventListener('click', assetTableClick, false);
	}
	if (document.querySelector('#padmin-contenttypes')) {
		cnt_lp = new letterpress({
			idSelector: '#padmin-contenttypes',
			sourcedata: '/contenttype/search.json',
			sourcearrayname: 'contenttypes',
			createTagFunc: function (id, val, callback) {
				createPeriodicTag(id, val, callback, '/contenttype/new/' + window.makeNiceName(document.querySelector('#padmin-contenttypes').value) + '/?format=json&limit=200', 'contenttype');
			}
		});
		cnt_lp.init();
	}
	if (typeof assetcontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.assetcontenttypes);
	}
	if (document.querySelector('#wysihtml5-textarea')) {
		wysihtml5Editor = new window.wysihtml5.Editor('wysihtml5-textarea', {
			// id of textarea element
			toolbar: 'wysihtml5-toolbar', // id of toolbar element
			parserRules: window.wysihtml5ParserRules // defined in parser rules set 
		});
	}
});
