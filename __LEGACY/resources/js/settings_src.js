'use strict';

// var request = require('superagent');
var updatestatus,
	themesettingsConfiguration,
	themesettingsReadOnly,
	appsettingsConfiguration,
	appsettingsReadOnly,
	tabelement,
	componentTab1,
	ComponentTabs = require('periodicjs.component.tabs'),
	jsonFormElements = require('./jsonformelements');

var jumptotab = function () {
	var jumptosection = window.location.href.split('#')[1];
	if (tabelement || window.settingspage === 'themes') {
		switch (jumptosection) {
		case 'theme-settings':
			if (window.settingspage === 'themes') {
				window.themespagetabs.showTab(2);
			}
			else {
				componentTab1.showTab(1);
			}
			break;
		case 'restart-application':
			componentTab1.showTab(2);
			break;
		}
	}
};

window.addEventListener('load', function () {
	updatestatus = document.getElementById('update-status');
	if (window.settingspage !== 'themes') {
		tabelement = document.getElementById('tabs');
	}
	window.checkPeriodicVersion(function (err, periodicversion) {
		if (periodicversion.status === 'needupdate') {
			updatestatus.style.display = 'block';
		}
	});
	window.ajaxFormEventListers('._pea-ajax-form');

	themesettingsConfiguration = document.getElementById('themesettings-config');
	themesettingsReadOnly = document.getElementById('themesettings-readonly');
	appsettingsConfiguration = document.getElementById('appsettings-config');
	appsettingsReadOnly = document.getElementById('appsettings-readonly');
	if (tabelement) {
		componentTab1 = new ComponentTabs(tabelement);
	}
	if (window.appsettings) {
		appsettingsConfiguration.innerHTML = jsonFormElements({
			jsonobject: window.appsettings.configuration,
			idnameprepend: 'asc'
		});
		appsettingsReadOnly.innerHTML = jsonFormElements({
			jsonobject: window.appsettings.readonly,
			readonly: true,
			idnameprepend: 'asro'
		});
	}
	if (window.themesettings) {
		themesettingsConfiguration.innerHTML = jsonFormElements({
			jsonobject: window.themesettings.configuration,
			idnameprepend: 'tsc'
		});
		themesettingsReadOnly.innerHTML = jsonFormElements({
			jsonobject: window.themesettings.readonly,
			readonly: true,
			idnameprepend: 'tsro'
		});
	}
	jumptotab();
});

window.restartAppResponse = function () {
	window.ribbonNotification.showRibbon('Application restarted', 4000, 'info');
};

window.updateAppResponse = function () {
	window.ribbonNotification.showRibbon('This is coming soon', 4000, 'warn');
};
