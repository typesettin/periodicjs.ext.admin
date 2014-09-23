'use strict';

// var request = require('superagent');

window.addEventListener('load', function () {
	window.checkPeriodicVersion();
});

window.restartAppResponse = function () {
	window.ribbonNotification.showRibbon('Application restarted', 4000, 'info');
};
