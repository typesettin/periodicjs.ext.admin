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
	compilationDocs,
	compilationDocsResults,
	compilationDocsItemTable;


var generateCompilationDoc = function (documentstoadd) {
	documentstoadd.style.display = 'none';
	var aelementofcompilationdoc = documentstoadd.firstChild.firstChild;
	var docid = aelementofcompilationdoc.getAttribute('data-docid');
	var docentitytype = aelementofcompilationdoc.getAttribute('data-entitytype');
	var removecolumn = document.createElement('td');
	removecolumn.setAttribute('class', '_pea-col-span3 _pea-text-right');
	removecolumn.innerHTML = '<a data-docid="' + docid + '" class="_pea-button remove-doc-to-compilation _pea-color-error">x</a>';
	// console.log("removecolumn",removecolumn);
	documentstoadd.removeChild(documentstoadd.firstChild);
	documentstoadd.appendChild(removecolumn);
	documentstoadd.firstChild.setAttribute('class', '_pea-col-span9');
	var docidinput = document.createElement('input');
	docidinput.type = 'checkbox';
	docidinput.style.display = 'none';
	docidinput.name = 'content_entities';
	docidinput.checked = 'checked';
	if (docentitytype === 'item') {
		docidinput.value = '{"order":10,"entitytype":"item","entity_item":"' + docid + '"}';
	}
	else if (docentitytype === 'collection') {
		docidinput.value = '{"order":10,"entitytype":"collection","entity_collection":"' + docid + '"}';
	}
	documentstoadd.firstChild.appendChild(docidinput);
	// console.log('docidinput', docidinput);
	// console.log('documentstoadd', documentstoadd.firstChild);
	compilationDocsItemTable.appendChild(documentstoadd);
	documentstoadd.style.display = 'table-row';
	documentstoadd.style.width = '100%';
};

var compilationDocsCLick = function (e) {
	var eTarget = e.target;
	if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('add-doc-to-compilation')) {
		if (document.querySelector('input[name=docid]')) {
			var entityTypeToAdd = eTarget.getAttribute('data-entitytype'),
				contentEntityData = {
					order: 10,
					entitytype: entityTypeToAdd
				};
			if (entityTypeToAdd === 'item') {
				contentEntityData.entity_item = eTarget.getAttribute('data-docid');
			}
			else if (entityTypeToAdd === 'collection') {
				contentEntityData.entity_collection = eTarget.getAttribute('data-docid');
			}

			request
				.post('/compilation/append/' + document.querySelector('input[name=docid]').value)
				.send({
					_csrf: document.querySelector('input[name=_csrf]').value,
					content_entities: contentEntityData
				})
				.set('Accept', 'application/json')
				.query({
					limit: '25',
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
							generateCompilationDoc(eTarget.parentElement.parentElement, eTarget.getAttribute('data-docid'));
						}
					}
				});
		}
		else {
			window.ribbonNotification.showRibbon('You have to save and create a compilation before adding items to it', 4000, 'error');
		}
	}
	else if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('remove-doc-to-compilation')) {
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
		docresulthtml += '<td><a data-docid="' + docresult._id + '" data-entitytype="' + docresult.entitytype + '" class="_pea-button add-doc-to-compilation _pea-color-success">+</a></td>';
		docresulthtml += '<td>' + docresult.title + ' <small class="_pea-color-inverse">' + docresult.entitytype + '</small>';
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
		.get('/p-admin/compilation/search_content')
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
					generateSearchResult(res.body.content_entities);
				}
			}
		});
};

window.cnt_lp = cnt_lp;

window.backToCompilationLanding = function () {
	window.location = '/p-admin/compilations';
};

window.addEventListener('load', function () {
	contententry = new contentEntryModule({
		ajaxFormToSubmit: document.getElementById('edit-compilation-form'),
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
	if (window.compilationtags && typeof window.compilationtags === 'object') {
		tag_lp.setPreloadDataObject(window.compilationtags);
	}
	if (window.compilationcategories && typeof window.compilationcategories === 'object') {
		cat_lp.setPreloadDataObject(window.compilationcategories);
	}
	if (window.compilationauthors && typeof window.compilationauthors === 'object') {
		athr_lp.setPreloadDataObject(window.compilationauthors);
	}
	if (window.compilationcontenttypes && typeof window.compilationcontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.compilationcontenttypes);
	}
	window.ajaxFormEventListers('._pea-ajax-form');
	searchDocButton = document.getElementById('searchdocumentsbutton');
	searchDocInputText = document.getElementById('searchdocumentstext');
	searchDocResults = document.getElementById('compilation-item-searchresult');
	compilationDocs = document.getElementById('compilation-content_entities');
	compilationDocsResults = document.getElementById('compilation-item-documents');
	compilationDocsItemTable = document.getElementById('compilation-table-content_entities');
	searchDocButton.addEventListener('click', searchDocs, false);
	compilationDocs.addEventListener('click', compilationDocsCLick, false);
});
