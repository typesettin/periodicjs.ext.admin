'use strict';

var formobj = require('./formtoobject'),
	request = require('superagent'),
	ribbon = require('ribbonjs'),
	silkscreen = require('silkscreenjs'),
	confirmDeleteYes;

var preventSubmitOnEnter = function (e) {
	// console.log('key press');
	if (e.which === 13 || e.keyCode === 13) {
		// console.log(e);
		// console.log('prevent submit');
		e.preventDefault();
		return false;
	}
};

var preventEnterSubmitListeners = function () {
	var noSubmitElements = document.querySelectorAll('.noFormSubmit');
	for (var x in noSubmitElements) {
		if (typeof noSubmitElements[x] === 'object') {
			noSubmitElements[x].addEventListener('keypress', preventSubmitOnEnter, false);
			noSubmitElements[x].addEventListener('keydown', preventSubmitOnEnter, false);
		}
	}
	document.addEventListener('keypress', preventSubmitOnEnter, false);
};

var ajaxFormSubmit = function (e) {
	var f = e.target;
	if (f.getAttribute('data-beforesubmitfunction')) {
		var beforesubmitFunctionString = f.getAttribute('data-beforesubmitfunction'),
			beforefn = window[beforesubmitFunctionString];
		// is object a function?
		if (typeof beforefn === 'function') {
			beforefn(e);
		}
	}
	var formData = new formobj(f);

	request
		.post(f.action)
		.set('x-csrf-token', document.querySelector('input[name=_csrf]').value)
		.set('Accept', 'application/json')
		.query({
			format: 'json'
		})
		.send(formData)
		.end(function (error, res) {
			if (res && res.body && res.body.result === 'error') {
				window.ribbonNotification.showRibbon(res.body.data.error, 4000, 'error');
			}
			else if (res && res.clientError) {
				window.ribbonNotification.showRibbon(res.status + ': ' + res.text, 4000, 'error');
			}
			else if (error) {
				window.ribbonNotification.showRibbon(error.message, 4000, 'error');
			}
			else {
				window.ribbonNotification.showRibbon('saved', 4000, 'success');
				if (f.getAttribute('data-successfunction')) {
					var successFunctionString = f.getAttribute('data-successfunction'),
						successfn = window[successFunctionString];
					// is object a function?
					if (typeof successfn === 'function') {
						successfn(res.body.data);
					}
				}
			}
		});
	e.preventDefault();
};

var deleteContentSubmit = function (e) {
	var eTarget = e.target,
		posturl = eTarget.getAttribute('data-href');

	request
		.post(posturl)
		.set('x-csrf-token', document.querySelector('input[name=_csrf]').value)
		.set('Accept', 'application/json')
		.query({
			format: 'json'
		})
		.end(function (error, res) {
			if (res && res.body && res.body.result === 'error') {
				window.ribbonNotification.showRibbon(res.body.data.error, 4000, 'error');
			}
			else if (res && res.clientError) {
				window.ribbonNotification.showRibbon(res.status + ': ' + res.text, 4000, 'error');
			}
			else if (error) {
				window.ribbonNotification.showRibbon(error.message, 4000, 'error');
			}
			else {
				window.ribbonNotification.showRibbon('deleted', 4000, 'warn');
				if (eTarget.getAttribute('data-successfunction')) {
					var successFunctionString = eTarget.getAttribute('data-successfunction'),
						successfn = window[successFunctionString];
					// is object a function?
					if (typeof successfn === 'function') {
						successfn(res.body.data);
					}
				}
			}
		});
};

var confirmDeleteDialog = function (e) {
	var eTarget = e.target,
		posturl = eTarget.getAttribute('data-href'),
		successfunction = eTarget.getAttribute('data-successfunction');
	confirmDeleteYes.setAttribute('data-href', '#');
	confirmDeleteYes.setAttribute('data-href', posturl);
	confirmDeleteYes.setAttribute('data-successfunction', successfunction);
	window.silkscreenModal.showSilkscreen('Delete Warning', document.getElementById('modal-confirm-delete'), 'default');
};

var ajaxDeleteButtonListeners = function () {
	var deleteButtons = document.querySelectorAll('._pea-dialog-delete');

	confirmDeleteYes.addEventListener('click', deleteContentSubmit, false);
	for (var x in deleteButtons) {
		if (typeof deleteButtons[x] === 'object') {
			deleteButtons[x].addEventListener('click', confirmDeleteDialog, false);
		}
	}
};

//'._pea-ajax-form' http://www.sitepoint.com/easier-ajax-html5-formdata-interface/
window.ajaxFormEventListers = function (selector) {
	var ajaxforms = document.querySelectorAll(selector);
	for (var x in ajaxforms) {
		if (typeof ajaxforms[x] === 'object') {
			// console.log(new FormData(ajaxforms[x]));
			ajaxforms[x].addEventListener('submit', ajaxFormSubmit, false);
		}
	}
};

window.makeNiceName = function (username) {
	if (username) {
		return username.replace(/[^a-z0-9]/gi, '-').toLowerCase();
	}
	else {
		return false;
	}
};

window.addEventListener('load', function () {
	confirmDeleteYes = document.getElementById('confirm-delete-yes');
	window.silkscreenModal = new silkscreen();
	window.ribbonNotification = new ribbon({
		type: 'info',
		idSelector: '#_pea_ribbon-element'
	});
	preventEnterSubmitListeners();
	ajaxDeleteButtonListeners();
}, false);
