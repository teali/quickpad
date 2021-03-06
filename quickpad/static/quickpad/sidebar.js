function pxInt(a){
    return parseInt(a,10);
};

$(function(){ 

	window.define= window.define || ace.define;
    window.require= ace.require;
	var Document = require("ace/document").Document;
    var Session = require("ace/edit_session").EditSession;
    var edit = require("ace/editor").Editor;
    ace.require("ace/ext/language_tools");


	var editor = ace.edit("editor");

    $(".collapse").on('click',function(e){
		$(this).css("display","none");
		$(".settings").css("display","none");
		$(".recents").css("opacity","0");
		$(".urltab").css("display","none");
		$(".expand").css("display","block");
    	$(".actions").css("display","none");
		$(".sidebar").animate({left:"-11em"},"fast","linear",function(){}).toggleClass("collapsed").toggleClass("expanded");

		var acewidth=$(window).width() - ($(".sidebar").width() -176)-pxInt($("div.sidebar").css("padding-left"));
		
		$(".tab-content").animate({"left":"-11em","width":"+=11em"},"fast");
		$("#editor").animate({width:acewidth},{duration:"fast",progress:function(){
			editor.getSession().setUseWrapMode(false);
			editor.getSession().setUseWrapMode(true);
		}});

    });

    $(".expand").on('click',function(e){
    	$(".shortcuts").fadeOut().css("display","none");
		$(this).css("display","none");
		$(".settings").css("display","block");
		$(".recents").css("opacity","1");
		$(".urltab").css("display","block");
		$(".actions").css("display","block");
		$(".sidebar").animate({left:"0em"},"fast","linear",function(){
			$(".collapse").css("display","block");
		}).toggleClass("expanded").toggleClass("collapsed");
		
		var acewidth=$(window).width() - $(".sidebar").width()-pxInt($("div.sidebar").css("padding-left"));
    	
		$(".tab-content").animate({left:"0em","width":"-=11em"},"fast");
		$("#editor").animate({width:acewidth},{duration:"fast",progress:function(){
			editor.getSession().setUseWrapMode(false);
			editor.getSession().setUseWrapMode(true);
		}});

    });

});

function pos(){
	console.log($(window).innerWidth());
	console.log($(".sidebar").outerWidth()+40);
	$(".content").width($(window).width()-$(".sidebar").width());
	$(".content").height($(window).height()-$(".header").height());
}