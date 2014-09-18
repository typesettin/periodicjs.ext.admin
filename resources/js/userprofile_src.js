'use strict';

var letterpress = require('letterpressjs'),
	updatemedia = require('./updatemedia'),
	roles_lp = new letterpress({
		idSelector: '#padmin-userroles',
		sourcedata: '/userroles/search.json',
		sourcearrayname: 'userroles',
		valueLabel: 'name',
		disablenewtags: true,
		createTagFunc: function (id, val, callback) {
			if (id === 'NEWTAG' || id === 'SELECT') {
				window.ribbonNotification.showRibbon('role does not exist', 4000, 'error');
			}
			else if (id !== 'SELECT' || id !== 'NEWTAG') {
				callback(id, val);
			}
		}
	}),
	mediafileinput,
	mediafilesresult;

var uploadMediaFiles = function (e) {
	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files,
		f,
		updateuserpic = function (mediadoc) {
			console.log(mediadoc);
			updatemedia(mediafilesresult, mediadoc);
		};

	// process all File objects
	for (var i = 0; i < files.length; i++) {
		f = files[i];
		// ParseFile(f);
		// uploadFile(f);
		updatemedia.uploadFile(mediafilesresult, f, {
			callback: updateuserpic
		});
	}
};

window.backToUsersLanding = function () {
	window.location = '/p-admin/users';
};

window.addEventListener('load', function () {
	if (document.querySelector('#padmin-userroles')) {
		roles_lp.init();
		if (typeof window.userprofileuseroles === 'object') {
			roles_lp.setPreloadDataObject(window.userprofileuseroles);
		}
	}
	window.ajaxFormEventListers('._pea-ajax-form');

	mediafileinput = document.getElementById('padmin-mediafiles');
	mediafilesresult = document.getElementById('media-files-result');
	mediafileinput.addEventListener('change', uploadMediaFiles, false);
	mediafilesresult.addEventListener('click', updatemedia.handleMediaButtonClick, false);
});
