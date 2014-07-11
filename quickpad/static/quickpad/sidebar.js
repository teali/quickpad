$(function(){ 
	var contentleft = $(".collapse").offset().left - $(".expand").offset().left - $(".collapse").width() +13;

	var widthdiff=11*parseInt($("body").css("font-size"),10);
	console.log("body"+widthdiff)
    $(".collapse").on('click',function(e){
		$(this).css("display","none");
		$(".sidebar").animate({left:"-11em"},"fast","linear",function(){
			$(".settings").fadeOut().css("display","none");
			$(".expand").css("display","block");
    		$(".shortcuts").fadeIn().css("display","block");
		}).toggleClass("collapsed").toggleClass("expanded");

		var leftmove = "-=" + contentleft;
		var acewidth = "+=" + widthdiff
		
		$(".tab-content").animate({"left":"-11em"},"fast");
		//$("#editor").animate({"padding-right":acewidth},"fast");

    });

    $(".expand").on('click',function(e){
    	$(".shortcuts").fadeOut().css("display","none");
		$(this).css("display","none");
		$(".settings").css("display","block");
		$(".sidebar").animate({left:"0em"},"fast","linear",function(){
			$(".collapse").css("display","block");
		}).toggleClass("expanded").toggleClass("collapsed");

		var leftmove = "+=" + contentleft;
		var acewidth = "-=" + widthdiff
    	
		$(".tab-content").animate({left:"0em"},"fast");
		//$("#editor").animate({"padding-right":acewidth},"fast");

    });

});
