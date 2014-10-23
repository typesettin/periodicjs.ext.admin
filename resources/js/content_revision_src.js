'use strict';
require('colors');
var jsdiff = require('diff'),
	compareDiffElements = [];



window.backToItemLanding = function () {
	window.location = '/p-admin/items';
};

window.addEventListener('load', function () {
	compareDiffElements = document.querySelectorAll('[data-diff-element="current"]');

	window.ajaxFormEventListers('._pea-ajax-form');
});
