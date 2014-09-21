'use strict';

var request = require('superagent'),
	letterpress = require('letterpressjs'),
	updatemedia = require('./updatemedia'),
	createPeriodicTag = function (id, val, callback, url, type) {
		if ((id === 'NEWTAG' || id === 'SELECT') && val) {
			request
				.post(url)
				.send({
					title: val,
					_csrf: document.querySelector('input[name=_csrf]').value
				})
				.set('Accept', 'application/json')
				.end(function (error, res) {
					if (res.error) {
						error = res.error;
					}
					if (error) {
						window.ribbonNotification.showRibbon(error.message, 4000, 'error');
					}
					else {
						if (res.body.result === 'error') {
							window.ribbonNotification.showRibbon(res.body.data.error, 4000, 'error');
						}
						else if (typeof res.body.data.doc._id === 'string') {
							callback(
								res.body.data.doc._id,
								res.body.data.doc.title,
								error);
							// console.log('type', type);
						}
					}
				});
		}
		else if (id !== 'SELECT' || id !== 'NEWTAG') {
			callback(id, val);
		}
	},
	wysihtml5Editor,
	tag_lp = new letterpress({
		idSelector: '#padmin-tags',
		sourcedata: '/tag/search.json',
		sourcearrayname: 'tags',
		createTagFunc: function (id, val, callback) {
			createPeriodicTag(id, val, callback, '/tag/new/' + window.makeNiceName(document.querySelector('#padmin-tags').value) + '/?format=json&limit=200');
		}
	}),
	cat_lp = new letterpress({
		idSelector: '#padmin-categories',
		sourcedata: '/category/search.json',
		sourcearrayname: 'categories',
		createTagFunc: function (id, val, callback) {
			createPeriodicTag(id, val, callback, '/category/new/' + window.makeNiceName(document.querySelector('#padmin-tags').value) + '/?format=json&limit=200');
		}
	}),
	athr_lp = new letterpress({
		idSelector: '#padmin-authors',
		sourcedata: '/user/search.json',
		sourcearrayname: 'users',
		valueLabel: 'username',
		disablenewtags: true,
		createTagFunc: function (id, val, callback) {
			if (id === 'NEWTAG' || id === 'SELECT') {
				window.ribbonNotification.showRibbon('user does not exist', 4000, 'error');
			}
			else if (id !== 'SELECT' || id !== 'NEWTAG') {
				callback(id, val);
			}
		}
	}),
	cnt_lp = new letterpress({
		idSelector: '#padmin-contenttypes',
		sourcedata: '/contenttype/search.json',
		sourcearrayname: 'contenttypes',
		createTagFunc: function (id, val, callback) {
			createPeriodicTag(id, val, callback, '/contenttype/new/' + window.makeNiceName(document.querySelector('#padmin-contenttypes').value) + '/?format=json&limit=200', 'contenttype');
		}
	}),
	searchDocButton,
	searchDocInputText,
	searchDocResults,
	collectionDocs,
	collectionDocsResults,
	collectionDocsItemTable,
	mediafileinput,
	mediafilesresult;


var generateCollectionDoc = function (documentstoadd) {
	documentstoadd.style.display = 'none';
	var docid = documentstoadd.firstChild.firstChild.getAttribute('data-docid');
	var removecolumn = document.createElement('td');
	removecolumn.setAttribute('class', '_pea-col-span3 _pea-text-right');
	removecolumn.innerHTML = '<a data-docid="' + docid + '" class="_pea-button remove-doc-to-collection _pea-color-error">x</a>';
	// console.log("removecolumn",removecolumn);
	documentstoadd.removeChild(documentstoadd.firstChild);
	documentstoadd.appendChild(removecolumn);
	documentstoadd.firstChild.setAttribute('class', '_pea-col-span9');
	var docidinput = document.createElement('input');
	docidinput.type = 'checkbox';
	docidinput.style.display = 'none';
	docidinput.name = 'items';
	docidinput.checked = 'checked';
	docidinput.value = '{"order":10,"item":"' + docid + '"}';
	documentstoadd.firstChild.appendChild(docidinput);
	// console.log('docidinput', docidinput);
	// console.log('documentstoadd', documentstoadd.firstChild);
	collectionDocsItemTable.appendChild(documentstoadd);
	documentstoadd.style.display = 'table-row';
	documentstoadd.style.width = '100%';
};

var collectionDocsCLick = function (e) {
	var eTarget = e.target;
	if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('add-doc-to-collection')) {
		if (document.querySelector('input[name=docid]')) {
			request
				.post('/collection/append/' + document.querySelector('input[name=docid]').value)
				.send({
					_csrf: document.querySelector('input[name=_csrf]').value,
					items: {
						order: 10,
						item: eTarget.getAttribute('data-docid')
					}
				})
				.set('Accept', 'application/json')
				.query({
					format: 'json'
				})
				.end(function (error, res) {
					if (res.error) {
						error = res.error;
					}
					if (error) {
						window.ribbonNotification.showRibbon(error.message, 4000, 'error');
					}
					else {
						if (res.body.result === 'error') {
							window.ribbonNotification.showRibbon(res.body.data.error, 4000, 'error');
						}
						else {
							generateCollectionDoc(eTarget.parentElement.parentElement, eTarget.getAttribute('data-docid'));
						}
					}
				});
		}
		else {
			window.ribbonNotification.showRibbon('You have to save and create a collection before adding items to it', 4000, 'error');
		}
	}
	else if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('remove-doc-to-collection')) {
		// var elemtoremove = document.getElementById("tr-docid-"+eTarget.getAttribute("data-docid"));
		var elemtoremove = eTarget.parentElement.parentElement;
		elemtoremove.parentElement.removeChild(elemtoremove);
	}
};

var generateSearchResult = function (documents) {
	var docresulthtml = '<table class="_pea-table _pea-form">';
	for (var x in documents) {
		var docresult = documents[x];
		docresulthtml += '<tr>';
		docresulthtml += '<td><a data-docid="' + docresult._id + '" class="_pea-button add-doc-to-collection _pea-color-success">+</a></td>';
		docresulthtml += '<td>' + docresult.title;
		docresulthtml += '<div><small>';
		if (docresult.authors) {
			docresulthtml += '<strong>authors:</strong> ';
			for (var i in docresult.authors) {
				docresulthtml += docresult.authors[i].username + ', ';
			}
		}
		if (docresult.tags) {
			docresulthtml += '<strong>tags:</strong> ';
			for (var g in docresult.tags) {
				docresulthtml += docresult.tags[g].title + ', ';
			}
		}
		if (docresult.categories) {
			docresulthtml += '<strong>categories:</strong> ';
			for (var h in docresult.categories) {
				docresulthtml += docresult.categories[h].title + ', ';
			}
		}
		if (docresult.contenttypes) {
			docresulthtml += '<strong>contenttypes:</strong> ';
			for (var j in docresult.contenttypes) {
				docresulthtml += docresult.contenttypes[j].title + ', ';
			}
		}
		docresulthtml += '</small></div></td>';
		docresulthtml += '</tr>';
	}
	docresulthtml += '</table>';
	searchDocResults.innerHTML = docresulthtml;
};

var searchDocs = function (e) {
	var etarget = e.target;
	request
		.get('/item/search')
		.set('Accept', 'application/json')
		.query({
			format: 'json',
			search: searchDocInputText.value
		})
		.end(function (error, res) {
			if (res.error) {
				error = res.error;
			}
			if (error) {
				window.ribbonNotification.showRibbon(error.message, 4000, 'error');
			}
			else {
				if (res.body.result === 'error') {
					window.ribbonNotification.showRibbon(res.body.data.error, 4000, 'error');
				}
				else {
					generateSearchResult(res.body.items);
				}
			}
		});
};

var uploadMediaFiles = function (e) {
	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files,
		f,
		updateitemimage = function (mediadoc) {
			// console.log(mediadoc);
			updatemedia(mediafilesresult, mediadoc);
		};

	// process all File objects
	for (var i = 0; i < files.length; i++) {
		f = files[i];
		// ParseFile(f);
		// uploadFile(f);
		updatemedia.uploadFile(mediafilesresult, f, {
			callback: updateitemimage
		});
	}
};

window.cnt_lp = cnt_lp;

window.backToCollectionLanding = function () {
	window.location = '/p-admin/collections';
};

window.addEventListener('load', function () {
	tag_lp.init();
	cat_lp.init();
	athr_lp.init();
	cnt_lp.init();
	if (typeof collectiontags === 'object') {
		tag_lp.setPreloadDataObject(window.collectiontags);
	}
	if (typeof collectioncategories === 'object') {
		cat_lp.setPreloadDataObject(window.collectioncategories);
	}
	if (typeof collectionauthors === 'object') {
		athr_lp.setPreloadDataObject(window.collectionauthors);
	}
	if (typeof collectioncontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.collectioncontenttypes);
	}
	window.ajaxFormEventListers('._pea-ajax-form');
	wysihtml5Editor = new window.wysihtml5.Editor('wysihtml5-textarea', {
		// id of textarea element
		toolbar: 'wysihtml5-toolbar', // id of toolbar element
		parserRules: window.wysihtml5ParserRules // defined in parser rules set 
	});
	searchDocButton = document.getElementById('searchdocumentsbutton');
	searchDocInputText = document.getElementById('searchdocumentstext');
	searchDocResults = document.getElementById('collection-item-searchresult');
	collectionDocs = document.getElementById('collection-items');
	collectionDocsResults = document.getElementById('collection-item-documents');
	collectionDocsItemTable = document.getElementById('collection-table-items');

	mediafileinput = document.getElementById('padmin-mediafiles');
	mediafilesresult = document.getElementById('media-files-result');
	mediafileinput.addEventListener('change', uploadMediaFiles, false);
	mediafilesresult.addEventListener('click', updatemedia.handleMediaButtonClick, false);
	searchDocButton.addEventListener('click', searchDocs, false);
	collectionDocs.addEventListener('click', collectionDocsCLick, false);
});
