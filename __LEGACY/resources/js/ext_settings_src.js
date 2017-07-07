'use strict';

var tabelement,
	componentTab1,
	codeMirrorJSEditorsElements,
	codeMirrors = {},
	ComponentTabs = require('periodicjs.component.tabs'),
	CodeMirror = require('codemirror'),
	classie = require('classie'),
	jsonFormElements = require('./jsonformelements');

require('../../node_modules/codemirror/addon/edit/matchbrackets');
require('../../node_modules/codemirror/addon/comment/comment');
require('../../node_modules/codemirror/addon/comment/continuecomment');
require('../../node_modules/codemirror/addon/fold/foldcode');
require('../../node_modules/codemirror/addon/fold/comment-fold');
require('../../node_modules/codemirror/addon/fold/indent-fold');
require('../../node_modules/codemirror/addon/fold/brace-fold');
require('../../node_modules/codemirror/addon/fold/foldgutter');
require('../../node_modules/codemirror/mode/css/css');
require('../../node_modules/codemirror/mode/htmlembedded/htmlembedded');
require('../../node_modules/codemirror/mode/javascript/javascript');

/**
 * resize codemirror on window resize
 */
var styleWindowResizeEventHandler = function () {
	if (codeMirrorJSEditorsElements) {
		for (var y in codeMirrors) {
			codeMirrors[y].refresh();
			// codeMirrorJSEditors[y].setSize('auto', '80%');
		}
	}
};

var codemirrortab = function (tabindex) {
	// console.log('tabindex', tabindex, codeMirrorJSEditorsElements);
	if (!codeMirrors[tabindex]) {
		// console.log('coolr', tabindex);
		// console.log('codeMirrorJSEditorsElements[tabindex]', codeMirrorJSEditorsElements[tabindex]);
		if (classie.has(codeMirrorJSEditorsElements[tabindex], 'jsonEditor')) {
			codeMirrors[tabindex] = CodeMirror.fromTextArea(codeMirrorJSEditorsElements[tabindex], {
				lineNumbers: true,
				lineWrapping: true,
				matchBrackets: true,
				autoCloseBrackets: true,
				mode: 'application/json',
				indentUnit: 4,
				indentWithTabs: true,
				// lint: true,
				gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
				foldGutter: true
			});
		}
		else {
			codeMirrors[tabindex] = CodeMirror.fromTextArea(codeMirrorJSEditorsElements[tabindex], {
				lineNumbers: true,
				lineWrapping: true,
				matchBrackets: true,
				autoCloseBrackets: true,
				mode: 'application/json',
				indentUnit: 4,
				indentWithTabs: true,
				// lint: true,
				gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
				foldGutter: true
			});
		}
	}
};

var tabEvents = function () {
	componentTab1.on('tabsShowIndex', function (index) {
		codemirrortab(index);
	});
};

/**
 * window load listeners
 */
window.addEventListener('load', function () {
	tabelement = document.getElementById('tabs');
	if (tabelement) {
		componentTab1 = new ComponentTabs(tabelement);
	}
	window.ajaxFormEventListers('._pea-ajax-form');
	codeMirrorJSEditorsElements = document.querySelectorAll('.codemirroreditor');
	tabEvents();
	codemirrortab(0);
	// setupCodeMirrorEditors();
});

window.addEventListener('resize', styleWindowResizeEventHandler, false);

window.getCMValue = function (e) {
	var submittingForm = e.target;
	var cmformindex = submittingForm.getAttribute('data-form-index');
	document.querySelector('#edittextform-' + cmformindex).innerHTML = codeMirrors[cmformindex].getValue();

	console.log(document.querySelector('#edittextform-' + cmformindex));
	//console.log(submittingForm.document.querySelector('textarea'));
};
