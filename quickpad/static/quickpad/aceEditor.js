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
    $(document).on("click",".tabstore li.storedtab",function(e){
        var currid=$(this).children("a").attr("id");
        var inId=$("ul.tab-links li:first > a").attr("id");
        if(inId!=quicknum){
            $("ul.tab-links li:first > img").remove();
        }
        $("ul.tab-links li:first").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").appendTo("div.tabstore > ul");
        if(currid==quicknum){
            $(this).appendTo("ul.tab-links").children("a").css({width:qwidth});
        }
        else{
            var closehtml="<img class='closeButton' src='/static/quickpad/del.png'></img>";
            $(this).append(closehtml).appendTo("ul.tab-links").children("a").css({"width":nexttabwidth});
        }
            
         $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({display:"block"}).addClass("active").siblings().removeClass("active");
        editor.setSession(allseshs[currid]);
        console.log(leftval+"check")
        for(var i=0;i<size;i++){
            $("ul.tab-links li.tab").eq(i).css({left:leftval[i]});
            console.log("val:"+$("ul.tab-links li.tab").eq(i).children("a").html()+"left:"+leftval[i]);
        }
    });
    $(document).on("click",".storebutton",function(e){
        console.log("here closed");

        if($(".tabstore").hasClass("closed")){
            $("div.tabstore").stop().animate({height:"+="+(1.1875*(count-tabnumlimit)+2)+"em"},{duration:"fast",
                complete:function(){
                    $("li.storedtab").fadeIn("fast");
            }});
            $("li.storedtab").fadeIn("fast");
        }
        else if($(".tabstore").hasClass("opened")){
            $("li.storedtab").fadeOut("fast")
            $("div.tabstore").stop().delay("fast").stop().animate({height:0},{duration:"fast"});
        }
        $("div.tabstore").toggleClass("closed").toggleClass("opened");
    });

    var tabstoretop, tabstorewidth, tabstoreleft, tabstoreheight;
    var nexttabwidth=8*pxInt($("body").css("font-size"));

    $('#addbutton').on('click', function(e){
        console.log($(".tabstore").length+"tabstore exist")

        if(tabnumlimit==count && $("div.tabstore").length==0){

            console.log(tabstoreleft+"tabstoreleft");
            console.log("here??");
            var htmltabstore="<div class='tabstore closed'><ul></ul></div>"
            var htmlicon="<input class='storebutton' type='button'>"

            $("body").append(htmltabstore);
            $("div.icons").append(htmlicon);

            var tabstoretop=$("div.tab-container").height()-pxInt($(".tabstore").css("border-width"))/2;
            var tabstorewidth=$(window).width()-(tabwidth+$("li.tab:last").offset().left); 
            var tabstoreleft=$(window).width()-tabstorewidth;
            var tabstoreheight=16;
            console.log("tabheight"+tabstoreheight)

            $("div.tabstore").css({"left":tabstoreleft,"top":tabstoretop,"width":tabstorewidth,"z-index":10,"height":0,"display":"block"}).stop().animate({opacity:0},0).stop().animate({opacity:1,top:"+="+(pxInt($(".tabstore").css("border-width"))/2-1)},"fast");

            newOverTab(e);

            $(".storebutton").css({"display":"block"});
        }
        else if(count>tabnumlimit){
            newOverTab(e);
        }
        else if(tabnumlimit>count){
            newTab(e);
        }
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

        if(tabnumlimit+1==count){
            
            removeOverTab(e,$(this));

            tabstoretop=$("div.tab-container").height()-pxInt($(".tabstore").css("border-width"))/2;
            tabstorewidth=$(window).width()-(tabwidth+$("li.tab:last").offset().left); 
            tabstoreleft=$(window).width()-tabstorewidth;

            $("div.tabstore").stop().animate({height:0}).stop().animate({top:"-="+(pxInt($(".tabstore").css("border-width"))/2-1)},{opacity:0}).remove();

            $(".storebutton").remove();
        }
        else if(count>tabnumlimit+1){
            removeOverTab(e,$(this));
        }
        else if(tabnumlimit>=count){
            removeTab(e,$(this));
        }
        
    });
    var removeOverTab=function(e,that){
        console.log("removeOVERTABB")
        var currindex=that.parent('li').index();
        var currcloseid=that.siblings("a").attr("id");
        console.log(currindex);
        var sizeli=$('.tab-links li').length;
        console.log(size);
        console.log(leftval+"!");

        var nextstoredid=$("ul li.storedtab:first > a").attr("id");

        if(nextstoredid==quicknum){
            $("ul li.storedtab:first").appendTo("ul.tab-links").children("a").css({width:qwidth});
        }
        else{
            var closehtml="<img class='closeButton' src='/static/quickpad/del.png'></img>";
            $("ul li.storedtab:first").append(closehtml).appendTo("ul.tab-links").children("a").css({"width":nexttabwidth});
        }
        $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({display:"block"});

        if(that.parent('li').hasClass('active')){
            var successorElement;
            successorElement=that.parent('li').next();
            successorElementID=successorElement.children('a').attr('id');
            successorElement.addClass('active').siblings().removeClass('active')
            console.log(successorElementID);
            var nextSession=allseshs[successorElementID];
            editor.setSession(nextSession);

        }
        
        count--;

        if($(".tabstore").hasClass("opened")==true){
            
            $("li.storedtab").eq(count-tabnumlimit).fadeOut("fast");
            $("div.tabstore").delay("fast").animate({height:(1.1875*(count-tabnumlimit)+2)+"em"},{duration:150});
        }

        that.parent('li').remove();
        console.log(leftval+"2");

        for(var i=currindex;i<count;i++){
            $(".tab-links li").eq(i).css({left:leftval[i]});
        }
        $(".storebutton").val(count-tabnumlimit);

        e.preventDefault();
    }

    var removeTab=function(e,that){
        var currindex=that.parent('li').index();
        var currcloseid=that.siblings("a").attr("id");
        console.log(currindex);
        var sizeli=$('.tab-links li').length;
        console.log(size);
        console.log(leftval+"!");

        if(sizeli==1){
            var nullsesh=new Session("");
            editor.setSession(nullsesh);
        }
        else if(that.parent('li').hasClass('active')){
            var successorElement;
            if(currindex==sizeli-1){
                successorElement=that.parent('li').prev();

            }
            else{
                successorElement=that.parent('li').next();
            }
            successorElementID=successorElement.children('a').attr('id');
            successorElement.addClass('active').siblings().removeClass('active')
            console.log(successorElementID);
            var nextSession=allseshs[successorElementID];
            editor.setSession(nextSession);

        }
        that.parent('li').remove();
        count--;
        size--;//different for overflow
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
    }
//once upload function works make it so that it find the extension
    var newOverTab=function(e){
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
        count++;
        $("ul li.tab").eq(0).removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").appendTo("div.tabstore > ul");
        $("ul li.storedtab:last").children("img").remove();

        $("ul li.storedtab").eq(count-tabnumlimit-1).css({"display":"none"});

        if($(".tabstore").hasClass("opened")==true){
            $("div.tabstore").animate({height:(1.1875*(count-tabnumlimit)+2)+"em"},{duration:150});
            $("li.storedtab").eq(count-tabnumlimit-1).delay("fast").fadeIn("fast");
        }
        //"+="+(count-tabnumlimit+2)+"em"11
        var newtabwidth=8*pxInt($("body").css("font-size"));
        $(".tab-links li").eq((tabnumlimit-1)).css({width:newtabwidth});

        for(var i=0;i<tabnumlimit;i++){
            $("li.tab").eq(i).css({"left":leftval[i]});
        }

        $(".storebutton").val(count-tabnumlimit);
        e.preventDefault;

    };
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
        var newtabwidth=8*pxInt($("body").css("font-size"));
        $(".tab-links li").eq(count).css({left:value,width:newtabwidth});

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
    var tabwidth;

    var size=0;
    var leftval=[startval];
    var startval=25;
    var leftinterval=155;
    var tabnumlimit;

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
        tabwidth=$("li.tab").width()+pxInt($("li.tab").css("padding-right"));
        console.log("tabwidth"+tabwidth);
        var lcontainerlim=17;
        var rcontainerlim=$("div.tab-container").width()-2*pxInt($(".icons input").css("margin-left"))-$(".icons input").width()-$("div.menu").width();  
        console.log("cont"+rcontainerlim);

        tabnumlimit=Math.ceil((rcontainerlim-lcontainerlim)/leftinterval);

        console.log(tabnumlimit+"limit tab num");  
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    }
//alter size, and leftval appropriately
    function resizeOver(e){
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
        tabwidth=$("li.tab").width()+pxInt($("li.tab").css("padding-right"));
        console.log("tabwidth"+tabwidth);
        var lcontainerlim=17;
        var rcontainerlim=$("div.tab-container").width()-2*pxInt($(".icons input").css("margin-left"))-$(".icons input").width()-$("div.menu").width();  
        rightlim=rcontainerlim;
        leftlim=lcontainerlim;
        console.log("cont"+rcontainerlim);

        prevlimit=tabnumlimit;
        console.log(prevlimit+"prevlmit");
        console.log(count+"count");
        tabnumlimit=Math.ceil((rcontainerlim-lcontainerlim)/leftinterval);

        if(count>prevlimit){
            if(tabnumlimit>prevlimit){//min of (limit-prev and count-prev) come out into containter
                var outnum=Math.min(tabnumlimit,count)-prevlimit;
                console.log("outnum"+outnum)
                for(var i=0;i<outnum;i++){
                    var nextstoredid=$("ul li.storedtab:first").children("a").attr("id");
                    console.log("idstore"+nextstoredid);
                    console.log(quicknum+"quick")
                    if(nextstoredid==quicknum){
                        $(".tabstore ul li.storedtab:first").appendTo("ul.tab-links").children("a").css({width:qwidth});
                        console.log("quicknum")
                    }
                    else{
                        var closehtml="<img class='closeButton' src='/static/quickpad/del.png'></img>";
                        $("ul li.storedtab:first").append(closehtml).appendTo("ul.tab-links").children("a").css({"width":nexttabwidth});
                    }
                    $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({display:"block"});
                    leftval[prevlimit+i]=leftval[prevlimit+i-1]+leftinterval;
                    console.log(leftval[prevlimit+i])
                }
                if(count<=tabnumlimit){
                    $("div.tabstore").remove();
                    $(".storebutton").remove();
                }
                size+=outnum;

            }
            else{//prev-limit into store
                for(var i=0;i<prevlimit-tabnumlimit;i++){
                    if($("ul.tab-links li.tab:last").hasClass("active")){
                        $("ul.tab-links li.tab:last").prev().addClass("active").siblings().removeClass("active");
                    }
                    $("ul.tab-links li.tab:last").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").prependTo("div.tabstore > ul");
                    $("ul li.storedtab:first").children("img").remove();
                    $("ul li.storedtab:first").css({"display":"none"});

                    if($(".tabstore").hasClass("opened")==true){
                        $("div.tabstore").css({height:(1.1875*(count-tabnumlimit)+2)+"em"});
                        $("ul li.storedtab:first").css({"display":"block"});
                    }
                    leftval.splice(tabnumlimit,prevlimit-tabnumlimit);
                    console.log("splice1")
                }
                size=tabnumlimit;
            }
        }
        else{
            if(tabnumlimit<count){// add to store :count-lim
                var htmltabstore="<div class='tabstore closed'><ul></ul></div>"
                var htmlicon="<input class='storebutton' type='button'>"

                $("body").append(htmltabstore);
                $("div.icons").append(htmlicon);

                tabstoretop=$("div.tab-container").height()-pxInt($(".tabstore").css("border-width"))/2;
                tabstorewidth=$(window).width()-(tabwidth+$("li.tab:last").offset().left); 
                tabstoreleft=$(window).width()-tabstorewidth;

                $("div.tabstore").css({"left":tabstoreleft,"top":tabstoretop,"width":tabstorewidth,"z-index":10,"height":0,"display":"block"}).stop().animate({opacity:0},0).stop().animate({opacity:1,top:"+="+(pxInt($(".tabstore").css("border-width"))/2-1)},"fast");

                for(var i=0;i<count-tabnumlimit;i++){
                    if($("ul.tab-links li.tab:last").hasClass("active")){
                        $("ul.tab-links li.tab:last").prev().addClass("active").siblings().removeClass("active");
                    }
                    $("ul.tab-links li.tab:last").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").prependTo("div.tabstore > ul");
                    $("ul li.storedtab:first").children("img").remove();
                    $("ul li.storedtab:first").css({"display":"none"});
                    
                    if($(".tabstore").hasClass("opened")==true){
                        $("div.tabstore").css({height:(1.1875*(count-tabnumlimit)+2)+"em"});
                        $("ul li.storedtab:first").css({"display":"block"});
                    }
                }
                leftval.splice(tabnumlimit,count-tabnumlimit);
                console.log("splice2");
                size=tabnumlimit;
            }
        }
        if($(".tabstore").length==1){
            tabstoretop=$("div.tab-container").height()-pxInt($(".tabstore").css("border-width"))/2;
            tabstorewidth=$(window).width()-(tabwidth+$("li.tab:last").offset().left); 
            tabstoreleft=$(window).width()-tabstorewidth;

            $("div.tabstore").css({"left":tabstoreleft,"top":($("div.tab-container").height()-1),"width":tabstorewidth});

        }
        console.log("new"+size);
        console.log("new leftval"+leftval);
        for(var i=0;i<size;i++){
            $(".tab-links li").eq(i).css({left:leftval[i]});
        }
        $(".storebutton").val(count-tabnumlimit);
        console.log(tabnumlimit+"limit tab num");  
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    }

    $(window).on("resize",function(e){
        resizeOver();    
    });
    resize(); 

    var rightlim=$("div.tab-container").width()-2*pxInt($(".icons input").css("margin-left"))-$(".icons input").width()-$("div.menu").width();
    var leftlim=17;

    $(".tab-links > li").each(function(i){
        console.log("are you in here each?")
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
