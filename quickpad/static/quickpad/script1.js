$(function(){
	
	var input = "{Folder,folder,0,closed} {file.py,file,0,closed}";
	load(input,".container");


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
		return "{Folder,folder,0,tester} {file.py,folder,0,tester}";
	}
	