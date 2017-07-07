'use strict';

var request = require('superagent'),
	contentEntryModule = require('./contententry'),
	updatemedia = require('./updatemedia'),
	contententry,
	request = require('superagent'),
	cnt_lp,
	tag_lp,
	cat_lp,
	athr_lp,
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
	contententry = new contentEntryModule({
		ajaxFormToSubmit: document.getElementById('edit-asset-form'),
		// mediafileinput: document.getElementById('padmin-mediafiles'),
		// mediafilesresult: document.getElementById('media-files-result')
	});
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
		cnt_lp = contententry.cnt_lp({});
		cnt_lp.init();
	}
	if (document.querySelector('#padmin-categories')) {
		cat_lp = contententry.cat_lp({});
		cat_lp.init();
	}
	if (document.querySelector('#padmin-tags')) {
		tag_lp = contententry.tag_lp({});
		tag_lp.init();
	}
	if (document.querySelector('#padmin-authors')) {
		athr_lp = contententry.athr_lp({});
		athr_lp.init();
	}
	if (typeof assetcontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.assetcontenttypes);
	}
	if (window.assettags && typeof window.assettags === 'object') {
		tag_lp.setPreloadDataObject(window.assettags);
	}
	if (window.assetcategories && typeof window.assetcategories === 'object') {
		cat_lp.setPreloadDataObject(window.assetcategories);
	}
	if (window.assetauthors && typeof window.assetauthors === 'object') {
		athr_lp.setPreloadDataObject(window.assetauthors);
	}
});
