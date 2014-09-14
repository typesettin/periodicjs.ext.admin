'use strict';

window.removeTagRow = function (deleteData) {
	var rowElement = document.getElementById('tag-tr-' + deleteData._id);
	rowElement.parentElement.removeChild(rowElement);
};
