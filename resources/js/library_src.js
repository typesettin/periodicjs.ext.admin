'use strict';

var request = require('superagent'),
	contentEntryModule = require('./contententry'),
	contententry,
	tag_lp,
	cat_lp,
	athr_lp,
	cnt_lp,
	searchDocButton,
	searchDocInputText,
	searchDocResults,
	libraryDocs,
	libraryDocsResults,
	libraryDocsItemTable;


var generateLibraryDoc = function (documentstoadd) {
	documentstoadd.style.display = 'none';
	var docid = documentstoadd.firstChild.firstChild.getAttribute('data-docid');
	var removecolumn = document.createElement('td');
	removecolumn.setAttribute('class', '_pea-col-span3 _pea-text-right');
	removecolumn.innerHTML = '<a data-docid="' + docid + '" class="_pea-button remove-doc-to-library _pea-color-error">x</a>';
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
	libraryDocsItemTable.appendChild(documentstoadd);
	documentstoadd.style.display = 'table-row';
	documentstoadd.style.width = '100%';
};

var libraryDocsCLick = function (e) {
	var eTarget = e.target;
	if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('add-doc-to-library')) {
		if (document.querySelector('input[name=docid]')) {
			request
				.post('/library/append/' + document.querySelector('input[name=docid]').value)
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
							generateLibraryDoc(eTarget.parentElement.parentElement, eTarget.getAttribute('data-docid'));
						}
					}
				});
		}
		else {
			window.ribbonNotification.showRibbon('You have to save and create a library before adding items to it', 4000, 'error');
		}
	}
	else if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('remove-doc-to-library')) {
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
		docresulthtml += '<td><a data-docid="' + docresult._id + '" class="_pea-button add-doc-to-library _pea-color-success">+</a></td>';
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

var searchDocs = function () {
	// var etarget = e.target;
	request
		.get('/p-admin/item/search')
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

window.cnt_lp = cnt_lp;

window.backToLibraryLanding = function () {
	window.location = '/p-admin/libraries';
};

window.addEventListener('load', function () {
	contententry = new contentEntryModule({
		ajaxFormToSubmit: document.getElementById('edit-library-form'),
		mediafileinput: document.getElementById('padmin-mediafiles'),
		mediafilesresult: document.getElementById('media-files-result')
	});
	tag_lp = contententry.tag_lp({});
	cnt_lp = contententry.cnt_lp({});
	cat_lp = contententry.cat_lp({});
	athr_lp = contententry.athr_lp({});
	tag_lp.init();
	cat_lp.init();
	athr_lp.init();
	cnt_lp.init();
	if (window.librarytags && typeof window.librarytags === 'object') {
		tag_lp.setPreloadDataObject(window.librarytags);
	}
	if (window.librarycategories && typeof window.librarycategories === 'object') {
		cat_lp.setPreloadDataObject(window.librarycategories);
	}
	if (window.libraryauthors && typeof window.libraryauthors === 'object') {
		athr_lp.setPreloadDataObject(window.libraryauthors);
	}
	if (window.librarycontenttypes && typeof window.librarycontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.librarycontenttypes);
	}
	window.ajaxFormEventListers('._pea-ajax-form');
	searchDocButton = document.getElementById('searchdocumentsbutton');
	searchDocInputText = document.getElementById('searchdocumentstext');
	searchDocResults = document.getElementById('library-item-searchresult');
	libraryDocs = document.getElementById('library-items');
	libraryDocsResults = document.getElementById('library-item-documents');
	libraryDocsItemTable = document.getElementById('library-table-items');
	searchDocButton.addEventListener('click', searchDocs, false);
	libraryDocs.addEventListener('click', libraryDocsCLick, false);
});
