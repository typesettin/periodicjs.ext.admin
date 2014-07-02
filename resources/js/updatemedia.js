'use strict';

var updatemedia = function( element, mediadoc ){
	var updateMediaResultHtml = function(element,mediadoc){
		element.appendChild(generateMediaHtml(mediadoc));
	};

	var generateMediaHtml = function(mediadoc){
		var mediaHtml = document.createElement("div"),
			htmlForInnerMedia='';
		mediaHtml.setAttribute("class","_pea-col-span4 media-item-x");
		mediaHtml.setAttribute("data-id",mediadoc._id);
		htmlForInnerMedia+='<input style="display:none;" name="assets" type="checkbox" value="'+mediadoc._id+'" checked="checked"></input>';
		if(mediadoc.assettype.match("image")){
			htmlForInnerMedia+='<img class="_pea-col-span11" src="'+mediadoc.fileurl+'"/>';
		}
		else{
			htmlForInnerMedia+='<div class="_pea-col-span11"> '+mediadoc.fileurl+'</div>';
		}
		mediaHtml.innerHTML = htmlForInnerMedia;
		return mediaHtml;
	};

	updateMediaResultHtml(element, mediadoc);
};

module.exports =updatemedia;