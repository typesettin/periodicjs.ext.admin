'use strict';
// require('colors');
var jsdiff = require('diff'),
	request = require('superagent'),
	async = require('async'),
	compareDiffElements = [],
	categoryCheckboxes,
	tagCheckboxes,
	authorCheckboxes,
	contenttypeCheckboxes,
	contententities_itemCheckboxes,
	contententities_collectionCheckboxes,
	itemsCheckboxes,
	items = [],
	collections = [],
	categories = [],
	tags = [],
	authors = [],
	contenttypes = [],
	libraryitems = [],
	diffObjs = [];

var getNameFromAJAX = function (options, getNameFromAJAXcallback) {
	var url = options.url,
		data = options.data,
		elements = options.elements,
		attributestringreplace = options.attributestringreplace,
		htmltoreplace,
		idstringtoreplace,
		nametoreplaceidwith,
		dataobject = options.dataobject;
	data.format = 'json';
	request
		.get(url)
		.query(data)
		.set('Accept', 'application/json')
		.end(function (error, res) {
			if (res.error) {
				error = res.error;
			}
			if (error) {
				window.ribbonNotification.showRibbon(error.message, 4000, 'error');
			}
			else {
				for (var z = 0; z < elements.length; z++) {
					htmltoreplace = elements[z].innerHTML;
					idstringtoreplace = elements[z].getAttribute(attributestringreplace);
					for (var w = 0; w < res.body[dataobject].length; w++) {
						nametoreplaceidwith = res.body[dataobject][w].name;
						if (idstringtoreplace === res.body[dataobject][w]._id) {
							elements[z].innerHTML = htmltoreplace.replace(idstringtoreplace, nametoreplaceidwith);
						}
					}
				}
				// console.log('elements', elements, 'res.body[' + dataobject + ']', res.body[dataobject]);
			}
			getNameFromAJAXcallback(null, 'got name from url:' + url);
		});
};

var grabNamesFromIds = function () {
	async.series({
		categories: function (cb) {
			if (categories && categories.length > 0) {
				getNameFromAJAX({
					url: '/p-admin/categories/search',
					elements: document.querySelectorAll('[data-name="categories"]'),
					dataobject: 'categories',
					attributestringreplace: 'data-categories-id',
					data: {
						ids: categories
					}
				}, cb);
			}
			else {
				cb(null, 'no categories');
			}
		},
		tags: function (cb) {
			if (tags && tags.length > 0) {
				getNameFromAJAX({
					url: '/p-admin/tags/search',
					elements: document.querySelectorAll('[data-name="tags"]'),
					dataobject: 'tags',
					attributestringreplace: 'data-tags-id',
					data: {
						ids: tags
					}
				}, cb);
			}
			else {
				cb(null, 'no tags');
			}
		},
		contenttypes: function (cb) {
			if (contenttypes && contenttypes.length > 0) {
				getNameFromAJAX({
					url: '/p-admin/contenttypes/search',
					elements: document.querySelectorAll('[data-name="contenttypes"]'),
					dataobject: 'contenttypes',
					attributestringreplace: 'data-contenttypes-id',
					data: {
						ids: contenttypes
					}
				}, cb);
			}
			else {
				cb(null, 'no contenttypes');
			}
		},
		authors: function (cb) {
			if (authors && authors.length > 0) {
				getNameFromAJAX({
					url: '/p-admin/users/search',
					elements: document.querySelectorAll('[data-name="authors"]'),
					dataobject: 'authors',
					attributestringreplace: 'data-authors-id',
					data: {
						ids: authors
					}
				}, cb);
			}
			else {
				cb(null, 'no tags');
			}
		},
		items: function (cb) {
			if (items && items.length > 0) {
				getNameFromAJAX({
					url: '/p-admin/items/search',
					elements: document.querySelectorAll('[data-name="items"]'),
					dataobject: 'items',
					attributestringreplace: 'data-items-id',
					data: {
						ids: items
					}
				}, cb);
			}
			else {
				cb(null, 'no items');
			}
		},
		libraryitems: function (cb) {
			if (libraryitems && libraryitems.length > 0) {
				getNameFromAJAX({
					url: '/p-admin/items/search',
					elements: document.querySelectorAll('[data-name="content_entities"][data-entitytype="item"]'),
					dataobject: 'items',
					attributestringreplace: 'data-content_entities-id',
					data: {
						ids: libraryitems
					}
				}, cb);
			}
			else {
				cb(null, 'no libraryitems');
			}
		},
		collections: function (cb) {
			if (collections && collections.length > 0) {
				getNameFromAJAX({
					url: '/p-admin/collections/search',
					elements: document.querySelectorAll('[data-name="content_entities"][data-entitytype="collection"]'),
					dataobject: 'collections',
					attributestringreplace: 'data-content_entities-id',
					data: {
						ids: collections
					}
				}, cb);
			}
			else {
				cb(null, 'no collections');
			}
		}
	}, function (err, status) {
		if (err) {
			window.ribbonNotification.showRibbon(err.message, 4000, 'error');
		}
		else {
			console.log('status', status);
		}
	});
};

var initDiffs = function () {
	var originalText,
		compareText,
		compareElement,
		revisionAttribute,
		displayElements = document.querySelectorAll('[data-diff-element="result"]');

	var generateDiffHtml = function (part) {
		// green for additions, red for deletions
		// grey for common parts
		var color = part.added ? 'green' :
			part.removed ? 'red' : '#ccc';
		var span = document.createElement('span');
		span.style.color = color;
		span.appendChild(document
			.createTextNode(part.value));
		displayElements[y].appendChild(span);
	};

	for (var x = 0; x < compareDiffElements.length; x++) {
		originalText = compareDiffElements[x].innerHTML;
		revisionAttribute = compareDiffElements[x].getAttribute('data-diff-attribute');
		compareElement = document.querySelector('[data-diff-element="revision"][data-diff-attribute="' + revisionAttribute + '"]');
		compareText = compareElement.innerHTML;
		// console.log(originalText, compareText);diffLines;diffWords;diffChars;
		if (revisionAttribute === 'contenttypeattributes') {
			diffObjs.push(jsdiff.diffLines(originalText, compareText));
		}
		else {
			diffObjs.push(jsdiff.diffWords(originalText, compareText));
		}
	}
	for (var y = 0; y < diffObjs.length; y++) {
		diffObjs[y].forEach(generateDiffHtml);
	}
};

var getIdsFromElements = function (options) {
	var returnArray = [],
		elements = options.elements;
	for (var u = 0; u < elements.length; u++) {
		if (options.attribute) {
			returnArray.push(elements[u].getAttribute(options.attribute));
		}
		else {
			returnArray.push(elements[u].value);
		}
	}
	return returnArray;
};

var replaceIdsWithNames = function () {
	categories = getIdsFromElements({
		elements: categoryCheckboxes
	});
	tags = getIdsFromElements({
		elements: tagCheckboxes
	});
	authors = getIdsFromElements({
		elements: authorCheckboxes
	});
	contenttypes = getIdsFromElements({
		elements: contenttypeCheckboxes
	});
	items = getIdsFromElements({
		elements: itemsCheckboxes,
		attribute: 'data-docid'
	});
	libraryitems = getIdsFromElements({
		elements: contententities_itemCheckboxes,
		attribute: 'data-docid'
	});
	collections = getIdsFromElements({
		elements: contententities_collectionCheckboxes,
		attribute: 'data-docid'
	});

	console.log('categories', categories);
	console.log('tags', tags);
	console.log('authors', authors);
	console.log('contenttypes', contenttypes);
	console.log('items', items);
	console.log('libraryitems', libraryitems);
	console.log('collections', collections);
	grabNamesFromIds();
};

// window.backToItemLanding = function () {
// 	window.location = '/p-admin/items';
// };

window.addEventListener('load', function () {
	compareDiffElements = document.querySelectorAll('[data-diff-element="current"]');
	categoryCheckboxes = document.querySelectorAll('[name="categories"]');
	tagCheckboxes = document.querySelectorAll('[name="tags"]');
	authorCheckboxes = document.querySelectorAll('[name="authors"]');
	contenttypeCheckboxes = document.querySelectorAll('[name="contenttypes"]');
	itemsCheckboxes = document.querySelectorAll('[name="items"]');
	contententities_itemCheckboxes = document.querySelectorAll('[name="content_entities"][data-entitytype="item"]');
	contententities_collectionCheckboxes = document.querySelectorAll('[name="content_entities"][data-entitytype="collection"]');
	initDiffs();
	replaceIdsWithNames();
	window.ajaxFormEventListers('._pea-ajax-form');
});
