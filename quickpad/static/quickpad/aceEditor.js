function pxInt(a){
    return parseInt(a,10);
};
function pxEm(a,b){
    b = typeof b !== 'undefined' ? b : 'body';
    return a / parseFloat($(b).css("font-size"));
}

function em(length){
    return String(length)+"em";
}

$(document).ready(function() {    
    var testtxt="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nthis is space where you can code on the go"


    window.define= window.define || ace.define;
    window.require= ace.require;

    var Document = require("ace/document").Document;
    var Session = require("ace/edit_session").EditSession;
    var edit = require("ace/editor").Editor;
    ace.require("ace/ext/language_tools");


	var editor = ace.edit("editor");

    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setUseWrapMode(true);    
    editor.resize();  

    var quicknum= new Date().getTime() + Math.floor(Math.random()*100000);
    var qdoc = new Document(testtxt);
    var qsession = new Session(qdoc);

    var allseshs = [];
    var alldocs = [];

    allseshs[quicknum]=qsession;
    alldocs[quicknum]=qdoc;
    editor.setSession(qsession);
    var qwidth= 9+6.0/7+"em";
    $("#quickcode").attr("id",quicknum).css({width:qwidth}).parent("li").css({"padding-right":0});

    var count=1;

    $('#addbutton').on('click', function(e){
        newTab(e);
    });

    $(document).on('mousedown','.tabs .tab-links a', function(e)  {

        console.log(this);

        $(this).parent('li').addClass('active').siblings().removeClass('active');
        
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
        console.log(leftval+"!");

        if(sizeli==1){
            var nullsesh=new Session("");
            editor.setSession(nullsesh);
        }
        else if($(this).parent('li').hasClass('active')){
            var successorElement;
            if(currindex==sizeli-1){
                successorElement=$(this).parent('li').prev();

            }
            else{
                successorElement=$(this).parent('li').next();
            }
            successorElementID=successorElement.children('a').attr('id');
            successorElement.addClass('active').siblings().removeClass('active')
            console.log(successorElementID);
            var nextSession=allseshs[successorElementID];
            editor.setSession(nextSession);

        }
        $(this).parent('li').remove();
        count--;
        leftval.splice(count,1);
        console.log(leftval+"2");

        for(var i=currindex;i<count;i++){
            $(".tab-links li").eq(i).stop().animate({
                left: leftval[i]
            },{
                duration: 200
            });
        }

        e.preventDefault();
    });
//once upload function works make it so that it find the extension
    var newTab = function(e){
        console.log("newtableft"+leftval);
        console.log("count:"+count);

        var tabs = $('.tabs');
        var ultabs=tabs.find('ul');

        var tabnum= new Date().getTime() + Math.floor(Math.random()*100000);
        var newtablinks=$('<li class="tab"><a id="' + tabnum + '" class="object">'+ tabnum+'</a><img class="closeButton" src="/static/quickpad/del.png"></img></li>');

        ultabs.append(newtablinks);

        var newtabfind=$('#'+tabnum);

        console.log("newtabfind:"+newtabfind);

        newtabfind.parent('li').addClass('active').siblings().removeClass('active');

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

        $(".tab-links li").eq(count).css({left:value,width:"8em"});
        leftval[count]=value;
        console.log(leftval);
        size++;
        count++;
        console.log(count);
        //to here
        console.log($(".tab-links li").width()+"tab width");
        console.log($("li.tab").css("font-size")+"tab font-size");
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
    var extrawidth=30;
    var extraheight=0;

    function resize(e){
        var containerwidth= $(".icons").offset().left - $(".header").width();
        console.log(pxInt($("div.sidebar").css("left")));
        console.log($(window).width()+"wind");
        var acewidth=$(window).width() - ($(".sidebar").width() + pxInt($("div.sidebar").css("left")))-extrawidth;
        var aceheight=$(window).height() - $(".header").height() - extraheight;
        console.log(containerwidth);
        $(".tab-container").css({width:containerwidth});
        $("#editor").css({
            "width":acewidth,
            "height":aceheight
        });
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);    
    }

    $(window).on("resize",function(e){
        resize();    
    });
    resize(); 

    var size=1;
    var leftval=[startval];
    var startval=25;
    var leftinterval=155;

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
        var lastmoveX;


        console.log("down");
        console.log("the list:"+leftval)
        $(this).parent("li").addClass("drag").css({"z-index":1});

        index=$(".drag").index();
        console.log(index); 

        var difference=0;
        var limit=pxInt($("li.drag").css("left"));
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

        var leftMouse=leftval[index] +pxInt($("div.tabs").css("left")) - e.pageX+5 ;//not debugging
        console.log(e.pageX+"epagex");
        console.log(leftMouse+"leftmoose");

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
            console.log("new-------------------------");
            console.log(e.pageX+"second epagex");
            var moveX=e.pageX+leftMouse;
            console.log(moveX+"movex");

           
            console.log("limitval"+limit);
            var leftlim=17;
            var rightlim=$("div.tab-container").width()+1.5*$(".icons input").width()-$("div.menu").width();
            // var rightlim=$("div.icons").offset().left - $("div.header").width();
            console.log(rightlim);
            var extramove;
            var pre,post;

            if(limit>leftlim && limit<rightlim){
                $("li.drag").offset({left:moveX});
                lastmoveX=moveX;
                console.log("before"+limit);
                limit=pxInt($("li.drag").css("left"));
                console.log("after"+limit);
                console.log(1);
                console.log(limit+"goodarea limit");
            }
            else if(limit<=leftlim){

                $("li.drag").stop().animate({
                    left:leftlim
                },{
                    duration:200,
                start: function(){
                    pre=pxInt($("li.drag").css("left"));
                    console.log(pre+"pre");
                }});
                
                
                if(lastmoveX<=moveX){
                    console.log("lo"+pre);
                    extramove=leftlim-pre;
                    console.log("extra"+extramove)
                    limit=leftlim+1;
                    $("li.drag").stop().offset({left:(moveX+extramove)});
                    console.log(3);
                    console.log(limit+"leftlim limit");
                }
                console.log(2);
            }
            else if(limit>=rightlim){
                $("li.drag").stop().animate({
                    left:rightlim
                },{
                    duration:200,
                start: function(){
                    pre=pxInt($("li.drag").css("left"));
                    console.log("pre"+pre);
                }});

                if(lastmoveX>=moveX){
                    extramove=pre-rightlim;
                    console.log(extramove);
                    limit=rightlim-1;
                    $("li.drag").stop().offset({left:(moveX)});
                    console.log(4);
                    console.log(limit+"rightlim limit");
                }
            }
            console.log(lastmoveX+"lastmoveX");
            e.preventDefault();
        });
        e.preventDefault();
        
    });
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
