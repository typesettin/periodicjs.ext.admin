'use strict';

var ctTableBody;

var tableClickHandler = function (e) {
	var eTarget = e.target,
		nameInputElement = document.getElementById('remove-item-name');
	if (eTarget.getAttribute('class') && eTarget.getAttribute('class').match('edit-content-type-button')) {
		var evt = document.createEvent('Event');
		evt.initEvent('submit', true, false);
		nameInputElement.value = eTarget.value;
		document.getElementById('contenttype-remove-form').dispatchEvent(evt);

		// document.getElementById('contenttype-remove-form').submit();
	}
};

window.addEventListener('load', function ( /* e */ ) {
	ctTableBody = document.getElementById('ct-t-body');
	window.ajaxFormEventListers('._pea-ajax-form');
	if (ctTableBody) {
		ctTableBody.addEventListener('click', tableClickHandler, false);
	}
});

window.addContentTypeRowResult = function (AjaxResponseObject) {
	var newAttribute = AjaxResponseObject.doc.attributes[AjaxResponseObject.doc.attributes.length - 1],
		tablerow = document.createElement('tr'),
		dvaluename = (newAttribute.defaultvalue) ? newAttribute.defaultvalue : '';
	tablerow.innerHTML = '<td>' + newAttribute.name + '</td>' + '<td>' + newAttribute.datatype + '</td>' + '<td>' + dvaluename + ' <button type="button" value="' + newAttribute.name + '" name="attributename" class="edit-content-type-button _pea-button _pea-pull-right _pea-color-error">x</button>';
	tablerow.id = 'attr-name-val-' + newAttribute.name;
	ctTableBody.appendChild(tablerow);
};
window.RemoveContentTypeRowResult = function ( /* AjaxResponseObject */ ) {
	var nameInputElementVal = document.getElementById('remove-item-name').value,
		rowElement = document.getElementById('attr-name-val-' + nameInputElementVal);
	rowElement.parentElement.removeChild(rowElement);
	// console.log("rowElement",rowElement);
};
window.setItemToRemove = function ( /* etarget */ ) {
	var nameInputElement = document.getElementById('remove-item-name');
};

window.removeContentTypeRow = function (deleteData) {
	var rowElement = document.getElementById('contenttype-tr-' + deleteData._id);
	rowElement.parentElement.removeChild(rowElement);
};

window.backToContentLanding = function (deleteData) {
	window.location = '/p-admin/contenttypes';
};
