'use strict';

var request = require('superagent'),
	contentEntryModule = require('./contententry'),
	contententry,
	doctypename,
	docnameform,
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
		.get('/p-admin/' + doctypename.value + '/' + docid.value + '/children')
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

window.updateContentTypesWithChildren = function (AjaxDataResponse) {
	// console.log("runing post update");
	window.updateContentTypes(AjaxDataResponse);
	if (docid) {
		getChildren();
	}
};

window.addEventListener('load', function () {
	docid = document.querySelector('input[name=docid]');
	doctypename = document.querySelector('input[name=doctypename]');
	doctypenamelink = document.querySelector('input[name=doctypenamelink]');
	if (doctypename) {
		docnameform = document.getElementById('edit-' + doctypename.value + '-form');
	}
	if (docnameform) {
		contententry = new contentEntryModule({
			ajaxFormToSubmit: docnameform
		});
	}
	if (document.querySelector('#padmin-parent')) {
		parent_lp = contententry.parent_lp({
			doctypename: doctypename.value,
			doctypenamelink: doctypenamelink.value,
		});
		parent_lp.init();
	}
	if (document.querySelector('#padmin-contenttypes')) {
		cnt_lp = contententry.cnt_lp({});
		cnt_lp.init();
	}
	if (typeof attributeparent === 'object') {
		parent_lp.setPreloadDataObject(window.attributeparent);
	}
	if (typeof attributecontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.attributecontenttypes);
	}
	window.ajaxFormEventListers('._pea-ajax-form');

	if (docid) {
		getChildren();
	}
});
