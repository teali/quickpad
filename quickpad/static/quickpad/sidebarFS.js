$(function(){
	
	var input = "{website.html,file,0,closed} {file.py,file,0,closed}";
	load("{Recent,folder,0,closed}",".container");


	$(".container").on('click','.folder',function(e){
		e.stopPropagation();
		if ($(this).hasClass("opened")){
			
			if ( $(this).children("div").css("display") == "none"){
				$(this).children("div").css("display","block");
			}
			else{
				$(this).children("div").css("display","none");				
			}	
		}
		else{
			$(this).append("<div class='container'></div>");
			load(getData("id"),$(this).children("div"));
			$(this).toggleClass("opened");
		}		
	});	

	$(".container").on('click','.file',function(e){
		e.stopPropagation();
		alert($(this).attr("class"));	
	});		
});

	function parse(input){
		var arr=[];
		var data = input.split(" ");
		
		for (var i = 0; i<data.length; i++){
			var tmp = data[i].split(",");
			arr.push({name:tmp[0].replace("{",""),type:tmp[1],level:tmp[2],id:tmp[3].replace("}","")});
		}
		return arr;
	}


	function load(input,parentId){
		
		var arr=parse(input);
		for (var i = 0 ; i <arr.length ; i ++){
			$(parentId).append('<div class=  '+ arr[i].type+ ' >'+
										arr[i].name+'</div>');
		}

		
	}
	
	function getData(id){
		return "{website.html,file,0,closed} {file.py,file,0,closed}";
	}
	