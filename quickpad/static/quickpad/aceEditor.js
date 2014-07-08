function pxInt(a){
    return parseInt(a,10);
};
function pxEm(a){
    return a / parseFloat($("body").css("font-size"));
}

function em(length){
    return String(length)+"em";
}

$(document).ready(function() {    


    window.define= window.define || ace.define;
    window.require= ace.require;

    var Document = require("ace/document").Document;
    var Session = require("ace/edit_session").EditSession;
    var edit = require("ace/editor").Editor;
    ace.require("ace/ext/language_tools");


	var editor = ace.edit("editor");

    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/python");
    editor.resize();  

    var allseshs = [];
    var alldocs = [];
    var count=0;

    $('.newTab').on('click', function(e){
        newTab(e);
    });

    $(document).on('mousedown','.tabs .tab-links a', function(e)  {

        console.log(this);

        $(this).parent('li').addClass('active').siblings().removeClass('active').children('div').removeClass('select');
        $(this).siblings('div').addClass('select');
        
        e.preventDefault();

        var tabnum=$(this).attr('id');
        console.log(tabnum);
        changeSession = allseshs[tabnum];
        console.log(changeSession);
        editor.setSession(changeSession);
    });
    $(document).on('click','.tabs .tab-links .closeButton',function(e){
        var currindex=$(this).parent('li').index();
        console.log(currindex);
        var sizeli=$('.tab-links li').length;
        console.log(size);

        if(sizeli==1){
            var nullsesh=new Session("");
            editor.setSession(nullsesh);
        }
        else if($(this).siblings('div').hasClass('select')){
            var successorElement;
            if(currindex==sizeli-1){
                successorElement=$(this).parent('li').prev();

            }
            else{
                successorElement=$(this).parent('li').next();
            }
            successorElementID=successorElement.children('a').attr('id');
            successorElement.addClass('active').siblings().removeClass('active').children('div').removeClass('select');
            successorElement.children('div').addClass('select');
            console.log(successorElementID);
            var nextSession=allseshs[successorElementID];
            editor.setSession(nextSession);

        }
        $(this).parent('li').remove();
        e.preventDefault();
    });

    var newTab = function(e){
        console.log("count:"+count);

        var tabs = $('.tabs');
        var ultabs=tabs.find('ul');

        var tabnum= new Date().getTime() + Math.floor(Math.random()*100000);
        var newtablinks=$('<li><a id="' + tabnum + '" class="object">'+ tabnum+' Tab</a><img class="closeButton" src="{{ STATIC_URL }}quickpad/del.png"></img><div></div></li>');

        ultabs.append(newtablinks);

        var newtabfind=$('#'+tabnum);

        console.log("newtabfind:"+newtabfind);

        newtabfind.parent('li').addClass('active').siblings().removeClass('active').children('div').removeClass('select');
        newtabfind.siblings('div').addClass('select');

        var contentdiv=tabs.find('div.tab-content');

        doc = new Document("newnew123 "+tabnum);

        session = new Session(doc);
        console.log("session:"+session);
        editor.setSession(session);

        alldocs[tabnum]=doc;
        allseshs[tabnum]=session;

        console.log("allsession:"+allseshs);

        //here is start of drag code
        console.log(index+" :index");
        if(count>0){
            var value= leftval[count-1]+leftinterval; // in here, count is equal to index
            console.log(leftval[count-1]);
        }
        else{
            var value=startval;
        }

        $(".tab-links li").eq(count).css({left:value});
        leftval[count]=value;
        console.log(leftval);
        size++;
        count++;
        console.log(count);
        //to here
        e.preventDefault();

    };

    var setTheme = function(themename){
        //assume themename is input from a list of available themes
        editor.setTheme("ace/theme/"+themename);
    };
    var setLang = function(lang){
        //assume lang is the desired programming language chosen from a list of available
        editor.getSession.setMode("ace/mode/"+lang);

    };

    var size=0;
    var leftval=[];
    var startval=25;
    var leftinterval=173;

    $(".tab-links > li").each(function(i){
        if(i==0){
            $(this).css({left:startval});
            leftval[0]=startval;
            size++;
        }
        else{
            var value=pxInt($(this).prev().css("left"))+leftinterval;

            $(this).css({left:value});
            leftval[i]=value;
            size++;
        }

    });
   

    var prev,curr,next,index;

    $(document).on("mousedown","li > a.object",function(e){

        console.log("down");
        $(this).parent("li").addClass("drag").css({"z-index":1});

        index=$(".drag").index();
        console.log(index); 

        var difference=0;

        curr=leftval[index];
        console.log("this curr: "+curr);

        if(index+1<size){//all except last: has next 
            next=leftval[index+1];
            difference=next-curr;
        }
        if(index>0){//all except first: has prev
            prev=leftval[index-1];
            difference=curr-prev;
        }

        console.log(difference+"diff");

        var leftMouse=leftval[index] +pxInt($("div.tabs").css("left")) - e.pageX ;//not debugging
        console.log(e.pageX);
        console.log(leftMouse);
        $(document).on("mousemove",document,function(e){

            var currleft=pxInt($("li.drag").css("left"));

            if((index+1)<size){//all except last: has next

                if(difference-(next-currleft)>=difference*0.52){
                    //                    .
                    var curritem=$(".tab-links li").eq(index);

                    curritem.next().stop().animate({
                        left: curr
                    },200);

                    curritem.insertAfter(curritem.next());

                    index+=1;

                    prev=curr;

                    curr=next;

                    if(index+1<size){
                        next=leftval[index+1];
                    }
                    //right after prev, curr and next should change
                    //also change order or elements in DOM
                }
            }
            if(index>0){//all except first: has prev

                if(difference-(currleft-prev)>=difference*0.52){

                    //
                    var curritem=$(".tab-links li").eq(index); 

                    curritem.prev().stop().animate({
                        left: curr
                    },200);
                  
                    curritem.insertBefore(curritem.prev());

                    index-=1;
                    
                    next=curr;

                    curr=prev;

                    if(index>0){
                        prev=leftval[index-1];
                    }

                    //right after prev, curr and next should change
                    //also change order or elements in DOM
                }
            }

            var moveX=e.pageX+leftMouse;

            $("li.drag").offset({left:moveX});

            e.preventDefault();
        });
        e.preventDefault();
        
    })
    $(document).on("mouseup",document,function(e){

        $(".drag").removeClass("drag");

        var enditem=$(".tab-links li").eq(index);
        console.log(curr+"this");

        enditem.stop().animate({
            left: curr
            },{ 
            duration: 200,
            complete: function() {
                enditem.css({"z-index":0});
            }
        });

        $(document).unbind("mousemove");
        
        e.preventDefault();
    });




});
