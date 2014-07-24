$(function(){ 
	var contentleft = $(".collapse").offset().left - $(".expand").offset().left - $(".collapse").width() +13;

	var widthdiff=11*parseInt($("body").css("font-size"),10);
	console.log("body"+widthdiff)
	//pos();
	

    $(".collapse").on('click',function(e){
		$(this).css("display","none");
		$(".settings").fadeOut().css("display","none");
		$(".recents").fadeOut().css("display","none");
		$(".urltab").fadeOut().css("display","none");
		$(".expand").css("display","block");
    	$(".shortcuts").fadeIn().css("display","block");
		$(".sidebar").animate({left:"-11em"},"fast","linear",function(){}).toggleClass("collapsed").toggleClass("expanded");

		var leftmove = "-=" + contentleft;
		var acewidth = "+=" + widthdiff
		
		$(".tab-content").animate({"left":"-11em","width":"+=11em"},"fast");
		//$("#editor").animate({"padding-right":acewidth},"fast");

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

		var leftmove = "+=" + contentleft;
		var acewidth = "-=" + widthdiff
    	
		$(".tab-content").animate({left:"0em","width":"-=11em"},"fast");
		//$("#editor").animate({"padding-right":acewidth},"fast");

    });

});

function pos(){
	console.log($(window).innerWidth());
	console.log($(".sidebar").outerWidth()+40);
	$(".content").width($(window).width()-$(".sidebar").width());
	$(".content").height($(window).height()-$(".header").height());
}