$(function(){ 

    $(".collapse").on('click',function(e){
		$(".settings").css("display","none");
		$(".sidebar").css("width", "2.5em");
		$(this).css("display","none");
    	$(".expand").css("display","block");
    	$(".shortcuts").css("display","block");
    });

    $(".expand").on('click',function(e){
		$(".settings").css("display","block");
		$(".sidebar").css("width", "13em");
		$(this).css("display","none");
		$(".collapse").css("display","block");
		$(".shortcuts").css("display","none");
    });

});
