'use strict';

// var request = require('superagent');
var updatestatus,
	themesettingsConfiguration,
	themesettingsReadOnly,
	appsettingsConfiguration,
	appsettingsReadOnly,
	tabelement,
	componentTab1,
	ComponentTabs = require('periodicjs.component.tabs');

var jsonFormElements = function (options) {
	var returnhtml = '',
		jsonobject = options.jsonobject,
		prependinputname = (options.prependinputname) ? options.prependinputname + '.' : '',
		readonly = (options.readonly) ? 'disabled=disabled' : '',
		idnameprepend = (options.idnameprepend) ? options.idnameprepend : 'jfe',
		prependhtml = (options.prependhtml) ? options.prependhtml : '<div class="_pea-row _pea-container-forminput">',
		appendhtml = (options.appendhtml) ? options.appendhtml : '</div>',
		jreoptionvalues = options.jreoptionvalues;

	for (var x in jsonobject) {
		if (x.match('jfe-options-')) {
			jreoptionvalues = jsonobject[x];
			jreoptionvalues.name = x.replace('jfe-options-', '');
		}
		else if (typeof jsonobject[x] === 'object') {
			returnhtml += jsonFormElements({
				jsonobject: jsonobject[x],
				prependinputname: x,
				readonly: readonly,
				idnameprepend: idnameprepend,
				prependhtml: prependhtml,
				appendhtml: appendhtml,
				jreoptionvalues: jreoptionvalues
			});
		}
		else {
			var elementid = idnameprepend + '-' + prependinputname + x;
			var elementname = prependinputname + x;
			var elementval = jsonobject[x];
			returnhtml += prependhtml;
			returnhtml += '<label class="_pea-col-span3 _pea-label" for="' + elementid + '">' + elementname + '</label>';
			if (typeof elementval === 'boolean') {
				var selectOptionsFromBooleanVal = [true, false];
				returnhtml += '<select class="_pea-col-span9 noFormSubmit" ';
				if (!options.readonly) {
					returnhtml += ' name="' + elementname + '" ';
				}
				returnhtml += '  >';
				for (var k in selectOptionsFromBooleanVal) {
					returnhtml += '<option ';
					if (selectOptionsFromBooleanVal[k] === elementval) {
						returnhtml += 'selected="selected"';
					}
					returnhtml += ' value="' + selectOptionsFromBooleanVal[k] + '">' + selectOptionsFromBooleanVal[k] + '</option>';
				}
				returnhtml += '</select>';
			}
			else if (jreoptionvalues && (jreoptionvalues.name === x) && jreoptionvalues.type === 'array' && jreoptionvalues.value) {
				var selectOptionsFromDefaultVal = jreoptionvalues.value.split(',');
				returnhtml += '<select class="_pea-col-span9 noFormSubmit" ';
				if (!options.readonly) {
					returnhtml += ' name="' + elementname + '" ';
				}
				returnhtml += '  >';
				for (var j in selectOptionsFromDefaultVal) {
					returnhtml += '<option ';
					if (selectOptionsFromDefaultVal[j] === elementval) {
						returnhtml += 'selected="selected"';
					}
					returnhtml += ' value="' + selectOptionsFromDefaultVal[j] + '">' + selectOptionsFromDefaultVal[j] + '</option>';
				}
				returnhtml += '</select>';
			}
			else {
				returnhtml += '<input class="_pea-col-span9" type="text" id="' + elementid + '" ';
				if (!options.readonly) {
					returnhtml += ' name="' + elementname + '" ';
				}
				returnhtml += ' value="' + elementval + '" ' + readonly + ' />';
			}
			returnhtml += appendhtml;
		}
	}
	return returnhtml;
};

var jumptotab = function () {
	var jumptosection = window.location.href.split('#')[1];
	if (tabelement) {
		switch (jumptosection) {
		case 'theme-settings':
			componentTab1.showTab(1);
			break;
		case 'restart-application':
			componentTab1.showTab(2);
			break;
		}
	}
};

window.addEventListener('load', function () {
	updatestatus = document.getElementById('update-status');
	tabelement = document.getElementById('tabs');
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
	appsettingsConfiguration.innerHTML = jsonFormElements({
		jsonobject: window.appsettings.configuration,
		idnameprepend: 'asc'
	});
	appsettingsReadOnly.innerHTML = jsonFormElements({
		jsonobject: window.appsettings.readonly,
		readonly: true,
		idnameprepend: 'asro'
	});
	themesettingsConfiguration.innerHTML = jsonFormElements({
		jsonobject: window.themesettings.configuration,
		idnameprepend: 'tsc'
	});
	themesettingsReadOnly.innerHTML = jsonFormElements({
		jsonobject: window.themesettings.readonly,
		readonly: true,
		idnameprepend: 'tsro'
	});
	jumptotab();
});

window.restartAppResponse = function () {
	window.ribbonNotification.showRibbon('Application restarted', 4000, 'info');
};

window.updateAppResponse = function () {
	window.ribbonNotification.showRibbon('This is coming soon', 4000, 'warn');
};
