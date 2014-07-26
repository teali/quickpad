$(function(){ 

    $(".collapse").on('click',function(e){
		$(this).css("display","none");
		$(".settings").css("display","none");
		$(".recents").css("opacity","0");
		$(".urltab").css("display","none");
		$(".expand").css("display","block");
    	$(".actions").css("display","none");
		$(".sidebar").animate({left:"-11em"},"fast","linear",function(){}).toggleClass("collapsed").toggleClass("expanded");

		var widthdiff=$(window).width() - $(".sidebar").width() + pxInt($(".sidebar").css("font-size"))*11-30;
		
		$(".tab-content").animate({"left":"-11em","width":"+=11em"},"fast");
		$("#editor").animate({width:widthdiff},"fast");

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