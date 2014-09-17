'use strict';

var wysihtml5Editor,
	request = require('superagent'),
	letterpress = require('letterpressjs'),
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
							// console.log("type",type);
						}
					}
				});
		}
		else if (id !== 'SELECT' || id !== 'NEWTAG') {
			callback(id, val);
			// console.log('type', type);
		}
	},
	doctypename,
	doctypenamelink,
	docid,
	parent_lp,
	cnt_lp;


var getAttributeChildHtml = function (attribute, makelink) {
	var returnHtml = '<li>';
	if (makelink) {
		returnHtml += '<a href="/p-admin/' + doctypename.value + '/' + attribute.name + '">' + attribute.title + '</a>';
	}
	else {
		returnHtml += attribute.title;
	}
	if (attribute.childDocs) {
		for (var x in attribute.childDocs) {
			returnHtml += '<ul>' + getAttributeChildHtml(attribute.childDocs[x], true) + '</ul>';
		}
	}
	returnHtml += '</li>';
	return returnHtml;
};

var getChildrenHtml = function (attributes) {
	var returnHtml = '<ul>';
	returnHtml += getAttributeChildHtml(attributes, false);
	returnHtml += '</ul>';

	return returnHtml;
};

var getChildren = function () {
	var childHtmlContainer = document.getElementById('child-attributes');
	request
		.get('/' + doctypename.value + '/' + docid.value + '/children')
		.query({
			format: 'json'
		})
		.set('Accept', 'application/json')
		.end(function (error, res) {
			if (res.error) {
				error = res.error;
			}
			if (error) {
				console.error(error);
			}
			else {
				if (res.body.children) {
					childHtmlContainer.innerHTML = getChildrenHtml(res.body.children);
				}
				else {
					childHtmlContainer.innerHTML = 'no child ' + doctypenamelink;
				}
			}
		});
};

window.removeTagRow = function (deleteData) {
	var rowElement = document.getElementById('tag-tr-' + deleteData._id);
	rowElement.parentElement.removeChild(rowElement);
};

window.backToTagLanding = function () {
	window.location = '/p-admin/tags';
};

window.removeCategoryRow = function (deleteData) {
	var rowElement = document.getElementById('category-tr-' + deleteData._id);
	rowElement.parentElement.removeChild(rowElement);
};

window.backToTagCategory = function () {
	window.location = '/p-admin/categories';
};

window.updateContentTypes = function (AjaxDataResponse) {
	// console.log("runing post update");
	var contenttypeContainer = document.getElementById('doc-ct-attr'),
		updatedDoc = AjaxDataResponse.doc,
		contentTypeHtml = '';
	for (var x in updatedDoc.contenttypes) {
		var contentTypeData = updatedDoc.contenttypes[x];
		contentTypeHtml += '<div>';
		contentTypeHtml += '<h3 style="margin-top:0;">' + contentTypeData.title + '<small> <a href="/p-admin/contenttype/' + contentTypeData.name + '">(edit)</a></small></h3>';
		if (contentTypeData.attributes) {
			for (var y in contentTypeData.attributes) {
				var attr = contentTypeData.attributes[y],
					defaultVal = attr.defaultvalue || '';
				if (updatedDoc.contenttypeattributes && updatedDoc.contenttypeattributes[contentTypeData.name] && updatedDoc.contenttypeattributes[contentTypeData.name][attr.name]) {
					defaultVal = updatedDoc.contenttypeattributes[contentTypeData.name][attr.name];
				}
				contentTypeHtml += '<div class="_pea-row _pea-container-forminput">';
				contentTypeHtml += '<label class="_pea-label _pea-col-span3"> ' + attr.title + ' </label>';
				contentTypeHtml += '<input class="_pea-col-span9 noFormSubmit" type="text" placeholder="' + attr.title + '" value="' + defaultVal + '" name="contenttypeattributes.' + contentTypeData.name + '.' + attr.name + '">';
				contentTypeHtml += '</div>';
			}
		}
		contentTypeHtml += '</div>';
	}
	contenttypeContainer.innerHTML = contentTypeHtml;
	if (docid) {
		getChildren();
	}
};

window.addEventListener('load', function () {
	docid = document.querySelector('input[name=docid]');
	doctypename = document.querySelector('input[name=doctypename]');
	doctypenamelink = document.querySelector('input[name=doctypenamelink]');
	if (document.querySelector('#padmin-parent')) {
		parent_lp = new letterpress({
			idSelector: '#padmin-parent',
			sourcedata: '/' + doctypename.value + '/search.json',
			sourcearrayname: doctypenamelink.value,
			valueLabel: 'name',
			disablenewtags: true,
			createTagFunc: function (id, val, callback) {
				if (id === 'NEWTAG' || id === 'SELECT') {
					window.ribbonNotification.showRibbon('tag does not exist', 4000, 'error');
				}
				else if (id !== 'SELECT' || id !== 'NEWTAG') {
					callback(id, val);
				}
			}
		});
		parent_lp.init();
	}
	if (document.querySelector('#padmin-contenttypes')) {
		cnt_lp = new letterpress({
			idSelector: '#padmin-contenttypes',
			sourcedata: '/contenttype/search.json',
			sourcearrayname: 'contenttypes',
			createTagFunc: function (id, val, callback) {
				createPeriodicTag(id, val, callback, '/contenttype/new/' + window.makeNiceName(document.querySelector('#padmin-contenttypes').value) + '/?format=json&limit=200', 'contenttype');
			}
		});
		cnt_lp.init();
	}
	if (typeof attributeparent === 'object') {
		parent_lp.setPreloadDataObject(window.attributeparent);
	}
	if (typeof attributecontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.attributecontenttypes);
	}
	window.ajaxFormEventListers('._pea-ajax-form');
	if (document.querySelector('#wysihtml5-textarea')) {
		wysihtml5Editor = new window.wysihtml5.Editor('wysihtml5-textarea', {
			// id of textarea element
			toolbar: 'wysihtml5-toolbar', // id of toolbar element
			parserRules: window.wysihtml5ParserRules // defined in parser rules set 
		});
	}

	if (docid) {
		getChildren();
	}
});
