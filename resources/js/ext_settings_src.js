'use strict';

var tabelement,
	componentTab1,
	ComponentTabs = require('periodicjs.component.tabs'),
	jsonFormElements = require('./jsonformelements');

window.addEventListener('load', function () {
	tabelement = document.getElementById('tabs');
	if (tabelement) {
		componentTab1 = new ComponentTabs(tabelement);
	}
	window.ajaxFormEventListers('._pea-ajax-form');
});
