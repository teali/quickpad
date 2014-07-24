$(function(){ 

    $(".collapse").on('click',function(e){
		$(this).css("display","none");
		$(".sidebar").animate({left:"-11em"},"fast","linear",function(){
			$(".settings").fadeOut().css("display","none");
			$(".recents").fadeOut().css("display","none");
			$(".urltab").fadeOut().css("display","none");
			$(".expand").css("display","block");
    		$(".shortcuts").fadeIn().css("display","block");
		}).toggleClass("collapsed").toggleClass("expanded");

		var widthdiff=$(window).width() - $(".sidebar").width() + pxInt($(".sidebar").css("font-size"))*11-30;
		
		$(".tab-content").animate({"left":"-11em","width":"+=11em"},"fast");
		$("#editor").animate({width:widthdiff},"fast");

    });

    $(".expand").on('click',function(e){
    	$(".shortcuts").fadeOut().css("display","none");
		$(this).css("display","none");
		$(".settings").css("display","block");
		$(".recents").css("display","block");
		$(".urltab").css("display","block");
		$(".sidebar").animate({left:"0em"},"fast","linear",function(){
			$(".collapse").css("display","block");
		}).toggleClass("expanded").toggleClass("collapsed");
		
		var widthdiff=$(window).width() -$(".sidebar").width()-30;
    	
		$(".tab-content").animate({left:"0em","width":"-=11em"},"fast");
		$("#editor").animate({width:widthdiff},"fast");

    });

});

function pos(){
	console.log($(window).innerWidth());
	console.log($(".sidebar").outerWidth()+40);
	$(".content").width($(window).width()-$(".sidebar").width());
	$(".content").height($(window).height()-$(".header").height());
}