'use strict';

var contentEntryModule = require('./contententry'),
	contententry,
	tag_lp,
	cat_lp,
	athr_lp,
	cnt_lp;


window.backToItemLanding = function () {
	window.location = '/p-admin/items';
};

window.addEventListener('load', function () {
	contententry = new contentEntryModule({
		ajaxFormToSubmit: document.getElementById('edit-item-form'),
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

	if (typeof itemtags === 'object') {
		tag_lp.setPreloadDataObject(window.itemtags);
	}
	if (typeof itemcategories === 'object') {
		cat_lp.setPreloadDataObject(window.itemcategories);
	}
	if (typeof itemauthors === 'object') {
		athr_lp.setPreloadDataObject(window.itemauthors);
	}
	if (typeof itemcontenttypes === 'object') {
		cnt_lp.setPreloadDataObject(window.itemcontenttypes);
	}

	window.ajaxFormEventListers('._pea-ajax-form');
});
