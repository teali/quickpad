
function myCookie(callback){
	$.get( "mycookie").done(function(data){
		callback(data);
	});
}

$(function(){
	var mydata
	getCSRFToken();

	var arr = { 'file': "print \"It works!\"", 'fileName' : "JSONtest", 'fileExt':".py",'eDays':'99','eHours':'1', 'eMinutes':'1' };
	var tab = {'tabs' : 'None', 'active':'None'};
	$.ajax({
    url: 'settabs',
		type: 'POST',
		data: JSON.stringify(tab),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data) {
			console.log(data);
		}
	});
	$.ajax({
    url: 'au',
		type: 'POST',
		data: JSON.stringify(arr),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data) {
			console.log(data['link']);
		}
	});
	$.get( "d/0Tbx84d8", function( data, textStatus, jqXHR ) {
		console.log( jqXHR.getResponseHeader('Content-Disposition').replace('attachment; filename=',''));
	});
	myCookie(function(data){console.log(data);});
	/*
	$.get( "mycookie").done(function(data){
		console.log(data);
	});*/

});

function myCookie(callback){
	$.get( "mycookie").done(function(data){
		callback(data);
	});
}

function getCSRFToken(){
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
	var csrftoken = getCookie('csrftoken');
	function csrfSafeMethod(method) {
		// these HTTP methods do not require CSRF protection
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	$.ajaxSetup({
		crossDomain: false, // obviates need for sameOrigin test
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type)) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
}

function upload(file,fileName,fileExt,expDays,expHours,expMinutes){
	var arr = { 'file': file, 'fileName' : fileName, 'fileExt':fileExt,'eDays':expDays,'eHours': expHours, 'eMinutes': expMinutes};
	var status = false;
	$.ajax({
    url: 'au',
		type: 'POST',
		data: JSON.stringify(arr),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data) {status = true;},
	});
	return status;
}

function getFile(fileId){
	var response = {}
	response['status'] = false;
	$.get( "d/"+fileId, function( data, textStatus, jqXHR ) {
		response['status'] = true;
		response['file'] = data;
		response['fileName'] = jqXHR.getResponseHeader('Content-Disposition').replace('attachment; filename=','');
	});
	return response;
}






































