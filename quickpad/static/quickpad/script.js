$(function(){
	var mydata
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
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

	var arr = { 'file': "print \"It works!\"", 
				'fileName' : "JSONtest", 
				'fileExt':".py",
				'eDays':'99',
				'eHours':'1', 
				'eMinutes':'1' };

	var tab = { 'tabs' : 'None', 
				'active':'None'};

	var settings = {'font':'Consolas',
					'fontSize':'12',
					'style':'Monokai'};

	//checks if cookies are enabled
	$.get( "mycookie").done(function(data){
		console.log(data);
	});

	//changes tabs for session
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

	//changes settings for session
	$.ajax({
    url: 'setsettings',
		type: 'POST',
		data: JSON.stringify(settings),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data) {
			console.log(data);
		}
	});

	//au(async upload) uploads a file
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

	//downloads a file
	$.get( "d/jfElnrd2", function( data, textStatus, jqXHR ) {
		console.log( jqXHR.getResponseHeader('Content-Disposition').replace('attachment; filename=',''));
	});
});
