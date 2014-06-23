$(function(){ 

    $(".collapse").on('click',function(e){
		$(this).css("display","none");

		$(".sidebar").animate({left:"-11em"},"fast","linear",function(){
			$(".settings").fadeOut().css("display","none");
			$(".expand").css("display","block");
    		$(".shortcuts").fadeIn().css("display","block");
		});
		
    	
    });

    $(".expand").on('click',function(e){
    	$(".shortcuts").fadeOut().css("display","none");
		$(this).css("display","none");
		$(".settings").css("display","block");
		$(".sidebar").animate({left:"0em"},"fast","linear",function(){
			$(".collapse").css("display","block");
		});
		
		
		
    });

});
