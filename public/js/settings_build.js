(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
