'use strict';

// var request = require('superagent');
var updatestatus;

window.addEventListener('load', function () {
	updatestatus = document.getElementById('update-status');
	window.checkPeriodicVersion(function (err, periodicversion) {
		if (periodicversion.status === 'needupdate') {
			updatestatus.style.display = 'block';
		}
	});
});

window.restartAppResponse = function () {
	window.ribbonNotification.showRibbon('Application restarted', 4000, 'info');
};

window.updateAppResponse = function () {
	window.ribbonNotification.showRibbon('This is coming soon', 4000, 'warn');
};
