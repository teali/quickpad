$(function(){
	

	load(getData("s"));


	

	$(".s").on('click','.file',function(e){
		e.stopPropagation();
		alert($(this).attr("class"));	
	});		
});

	function parse(input){
		var arr=[];
		var data = input.split(";");
		
		for (var i = 0; i<data.length; i++){
			var tmp = data[i].split(",");
			arr.push({name:tmp[0].replace("{",""),type:tmp[1],level:tmp[2],id:tmp[3].replace("}","")});
		}
		return arr;
	}


	function load(input){
		
		var arr=parse(input);
		for (var i = 0 ; i <arr.length ; i ++){

			$(".container").append('<div class="file"><img class= "thumb" src="/static/quickpad/file.png"><p style="display:inline; color:#252525;">'+arr[i].name+'</p></div>');
		}
		
	}
	
	function getData(id){
		return "{website.html,file,0,closed};{file.py,file,0,closed}";
	}
	