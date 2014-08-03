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

function splitname(filename){
    var a = filename.split(".");

    if(a.length ===1){//|| (a[0]==="" && a.length===2)
        return a[0];
    } 
    else{
        var length=a.length-2;
        var name=a[0];
        for(var i=0;i<length;i++){
            name=name.join("."+a[i+1]);
        }
        return name;
    }
}

function splitext(filename){
    var a = filename.split(".");
    if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
        return "";
    }
    return "."+a.pop();
}

$(document).ready(function() { 
    var mydata
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    var cookiedata;
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
        //checks if cookies are enabled
    $.get("mycookie").done(function(data){
        console.log(data+"THE COOKIEEE");
        console.log(data);
        cookiedata=data;
        var tablist=data.tabs.split("|||");
        console.log(tablist+"tablist")
        for(var i=0;i<tablist.length;i++){
            console.log(tablist[i]+"initating and starting")
            $.get( "d/"+tablist[i], function( data, textStatus, jqXHR ) {
                console.log( jqXHR.getResponseHeader('Content-Disposition').replace('attachment; filename=',''));
                console.log(data);
            });
            console.log("--------------")
        }
    });

    var testtxt="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nthis is space where you can code on the go"


    window.define= window.define || ace.define;
    window.require= ace.require;

    var Document = require("ace/document").Document;
    var Session = require("ace/edit_session").EditSession;
    var edit = require("ace/editor").Editor;
    ace.require("ace/ext/language_tools");


	var editor = ace.edit("editor");

    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/python");
    editor.getSession().setUseWrapMode(true);    
    editor.resize();  

    var quicknum= new Date().getTime() + Math.floor(Math.random()*100000);
    var qdoc = new Document(testtxt);
    var qsession = new Session(qdoc);

    var allseshs = [];
    var alldocs = [];
    var tabext = {};
    var tabnames={};
    var keys ={};

    allseshs[quicknum]=qsession;
    alldocs[quicknum]=qdoc;
    tabext[quicknum]=".py";
    tabnames[quicknum]="QuickQode";
    var activeid =quicknum;

    editor.setSession(qsession);
    var qwidth= 9+6.0/7+"em";
    $("#quickcode").attr("id",quicknum).css({width:qwidth}).parent("li").css({"padding-right":0});



    var arr = { 'file': "print \"It works!\"", 
                'fileName' : "JSONtest", 
                'fileExt':".py",
                'eDays':'99',
                'eHours':'1', 
                'eMinutes':'1' };

    var tab = { 'tabs' : 'None', 
                'active':'None'};

    var settings = {'font':'Consolas',
                    'fontSize':'12',
                    'style':'Monokai'};

    var edit = {'fId':"jfElnrd2",
                'name':'ze name',
                'file':'thecode'};

    onkeydown = function(e){
        if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)){
            e.preventDefault();
            saveTab();
        }
    }
    editor.commands.addCommand({
        name: 'myCommand',
        bindKey: {win: 'Ctrl-s',  mac: 'Command-s'},
        exec: function(editor) {
            saveTab();
        }
    });
    $("select").on("change", function(){

        console.log($(this).val());

        settings['font']=$(".theme select").val();
        settings['fontSize']=$(".size select").val();
        settings['style']=$(".font select").val();

        console.log(settings);

        $.ajax({
            url: 'setsettings',
            type: 'POST',
            data: JSON.stringify(settings),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                console.log(data);
            }
        });
    })
    var saveTab=function(){
        console.log("saving this tab")
        if((activeid in keys)==false){
            arr['file']=alldocs[activeid].getValue();
            arr['fileName']=tabnames[activeid];
            arr['fileExt']=tabext[activeid];
            arr['eDays']=9999;
            arr['eHours']=1;
            arr['eMinutes']=1;

            $.ajax({
                url: 'au',
                type: 'POST',
                data: JSON.stringify(arr),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data) {
                    console.log(data['link']);
                    keys[activeid]=data['link'];
                    console.log("keysaved"+keys[activeid]);
                }
            });
        }
        else{
            edit['fId']=keys[activeid];
            edit['name']=tabnames[activeid];
            console.log(activeid+"activeid");
            edit['file']=alldocs[activeid].getValue();

            $.ajax({
                url:"editfile",
                tpye:"POST",
                data: JSON.stringify(edit),
                contentType: 'application/json; charset=utf-8',
                dataType:"json",
                success: function(){
                    console.log("edit done");
                }
            })
        }
    };
    saveTab();
    var saveSession= function(){
        console.log("saving session")
        var currentID=[];
        if(count>0){
            var starting=Math.min(count,tabnumlimit);    
            for(var i=0;i<starting;i++){
                var saveid=$("li.tab").eq(i).children("a").attr("id");
                currentID[i]=saveid;
                console.log(i);
                if((saveid in keys)==false){
                    arr['file']=alldocs[saveid].getValue();
                    arr['fileName']=tabnames[saveid];
                    arr['fileExt']=tabext[saveid];
                    arr['eDays']=9999;
                    arr['eHours']=1;
                    arr['eMinutes']=1;

                    $.ajax({
                        url: 'au',
                        type: 'POST',
                        data: JSON.stringify(arr),
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: function(data) {
                            console.log(data['link']);
                            keys[saveid]=data['link'];
                            console.log("keysaved"+keys[saveid]);
                        }
                    });
                }
                else{
                    edit['fId']=keys[saveid];
                    edit['name']=tabnames[saveid];
                    console.log(saveid+"saveid");
                    edit['file']=alldocs[saveid].getValue();

                    $.ajax({
                        url:"editfile",
                        tpye:"POST",
                        data: JSON.stringify(edit),
                        contentType: 'application/json; charset=utf-8',
                        dataType:"json",
                        success: function(){
                            console.log("edit done");
                        }
                    })
                }
            }
            if(count>tabnumlimit){
                for(var i=0;i<count-tabnumlimit;i++){
                    var saveid=$("li.storedtab").eq(i).children("a").attr("id");
                    currentID[i+tabnumlimit]=saveid;
                    console.log(saveid+"saveid now");
                    console.log(saveid in keys)
                    if((saveid in keys)==false){
                        console.log('first cond in here?')
                        arr['file']=alldocs[saveid].getValue();
                        arr['fileName']=tabnames[saveid];
                        arr['fileExt']=tabext[saveid];
                        arr['eDays']=9999;
                        arr['eHours']=1;
                        arr['eMinutes']=1;

                        $.ajax({
                            url: 'au',
                            type: 'POST',
                            data: JSON.stringify(arr),
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            success: function(data) {
                                console.log(data['link']);
                                keys[saveid]=data['link'];
                                console.log("keysaved"+keys[saveid]);
                            }
                        });
                    }
                    else{
                        edit['fId']=keys[saveid];
                        edit['name']=tabnames[saveid];
                        edit['file']=alldocs[saveid].getValue();

                        $.ajax({
                            url:"editfile",
                            tpye:"POST",
                            data: JSON.stringify(edit),
                            contentType: 'application/json; charset=utf-8',
                            dataType:"json",
                            success: function(){
                                console.log("edit done");
                            }
                        })
                    }
                }
            }
            var keystring=[];
            console.log(currentID.length+"currentidlength")
            for(var i=0;i<currentID.length;i++){
                keystring[i]=keys[currentID[i]];
            }
            var tabstring=keystring.join("|||");
            var keyactiveindex=$("#"+activeid).parent("li").index();
            console.log(activeid+" id");
            tab['tabs']=tabstring;
            console.log(tabstring+" tabstring")
            console.log(currentID[keyactiveindex]+" activeid")
            tab['active']=keys[currentID[keyactiveindex]];
            console.log(keys[currentID[keyactiveindex]]+" activekey");

            $.ajax({
                url: 'settabs',
                type: 'POST',
                data: JSON.stringify(tab),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data) {
                    console.log(data+ "heres?");
                }
            });

        }
    }

    setInterval(function(){saveSession()},5000);

    //changes tabs for session
    $.ajax({
    url: 'settabs',
        type: 'POST',
        data: JSON.stringify(tab),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            console.log(data);
        }
    });

    //changes settings for session
    $.ajax({
    url: 'setsettings',
        type: 'POST',
        data: JSON.stringify(settings),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            console.log(data);
        }
    });

    //au(async upload) uploads a file
    $.ajax({
    url: 'au',
        type: 'POST',
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            console.log(data['link']);
        }
    });

    $.ajax({
        url:"editfile",
        tpye:"POST",
        data: JSON.stringify(edit),
        contentType: 'application/json; charset=utf-8',
        dataType:"json"
    })

    //downloads a file
    $.get( "d/jfElnrd2", function( data, textStatus, jqXHR ) {
        console.log( jqXHR.getResponseHeader('Content-Disposition').replace('attachment; filename=',''));
        console.log(data);
    });

    var count=1;

    $(document).on("click",".tabstore li.storedtab",function(e){
        var currid=$(this).children("a").attr("id");
        var tostoreId=$("ul.tab-links li:first > a").attr("id");

        // if(tostoreId!=quicknum){
        //     $("ul.tab-links li:first > img").remove();
        // }
        $("ul.tab-links li:first").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").css("left",0).appendTo("div.tabstore > ul");

        if(currid==quicknum){
            $(this).appendTo("ul.tab-links").children("a").css({width:qwidth}).parent("li").css("display","none");
        }
        else{
            // var closehtml="<img class='closeButton' src='/static/quickpad/del.png'></img>";
            $(this).appendTo("ul.tab-links").children("a").css({"width":nexttabwidth}).parent("li").css("display","none");//.append(closehtml)
        }

            
        $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({left:leftval[tabnumlimit-1]}).addClass("active").fadeIn().siblings().removeClass("active");
        activeid=$("ul.tab-links li:last").children("a").attr("id")
        editor.setSession(allseshs[currid]);

        console.log(leftval+"check")
        for(var i=0;i<tabnumlimit;i++){
            $("ul.tab-links li.tab").eq(i).stop(true,true).animate({left:leftval[i]});
            console.log("val:"+$("ul.tab-links li.tab").eq(i).children("a").html()+"left:"+leftval[i]);
        }

        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    });
    $(document).on("click",".storebutton",function(e){
        console.log("here closed");

        if($(".tabstore").hasClass("closed")){
            $("div.tabstore").stop(true,true).animate({height:"+="+(1.125*(count-tabnumlimit)+2)+"em"},{duration:"fast",
                step:function(height){
                    console.log(height+"click storebutton height step");
                    if(height*17>maxtabstoreheight){
                        console.log("height here")
                        $("div.tabstore").stop().css({"overflow-y":"auto","overflow-x":"hidden"});
                    }
            }});
            //markpoint
            $("li.storedtab").stop(true,true).fadeIn("fast");
        }
        else if($(".tabstore").hasClass("opened")){
            $("li.storedtab").stop(true,true).fadeOut("fast")
            $("div.tabstore").stop().delay("fast").stop().animate({height:0},{duration:"fast"});
        }
        $("div.tabstore").toggleClass("closed").toggleClass("opened");
    });

    var tabstoretop, tabstorewidth, tabstoreleft,maxtabstoreheight;
    var nexttabwidth=8*pxInt($("body").css("font-size"));

    var newTabfinal = function(e,name){
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


            $("div.tabstore").css({"left":tabstoreleft,"top":tabstoretop,"width":tabstorewidth,"z-index":10,"height":0,"display":"block"}).stop().animate({opacity:0},0).stop().animate({opacity:0.84,top:"+="+(pxInt($(".tabstore").css("border-width"))/2-1)},"fast");
            //secondmark

            newOverTab(e,name);

            $(".storebutton").css({"display":"block"});
        }
        else if(count>tabnumlimit){
            newOverTab(e,name);
        }
        else if(tabnumlimit>count){
            newTab(e,name);
        }
        saveTab();
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    };

    $(document).on('click','#addbutton', function(e){
        newTabfinal(e);
    });

    $(document).on('mousedown','.tabs .tab-links a', function(e)  {

        console.log(this);

        $(this).parent('li').addClass('active').siblings().removeClass('active');
        activeid=$(this).attr("id")
        e.preventDefault();

        var tabnum=$(this).attr('id');
        console.log(tabnum);
        changeSession = allseshs[tabnum];
        console.log(changeSession);
        editor.setSession(changeSession);
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    });

    $(document).on('click',".tabstore .storedtab .closeButton", function(e){
        if(tabnumlimit+1==count){

            removeInstore($(this));

            tabstoretop=pxInt($(".tabstore").css("border-width"));
            tabstorewidth=$(window).width()-(tabwidth+$("li.tab:last").offset().left); 
            tabstoreleft=$(window).width()-tabstorewidth;

            $("div.tabstore").stop().animate({height:0},{duration:"fast",complete:function(){
                $("div.tabstore").stop().animate({top:"-="+tabstoretop,opacity:0},{duration:"slow",complete:function(){
                    $("div.tabstore").remove();
                    
                }});
            }});
            $(".storebutton").remove();
        }
        else{
            removeInstore($(this));
        }
    });
    $(document).on('click','.tabs .tab-links .closeButton',function(e){ 

        if(tabnumlimit+1==count){

            removeOverTab(e,$(this));

            tabstoretop=pxInt($(".tabstore").css("border-width"));
            tabstorewidth=$(window).width()-(tabwidth+$("li.tab:last").offset().left); 
            tabstoreleft=$(window).width()-tabstorewidth;

            $("div.tabstore").stop().animate({height:0},{duration:"fast",complete:function(){
                $("div.tabstore").stop().animate({top:"-="+tabstoretop,opacity:0},{duration:"slow",complete:function(){
                    $("div.tabstore").remove();
                    
                }});
            }});
            $(".storebutton").remove();
        }
        else if(count>tabnumlimit+1){
            removeOverTab(e,$(this));
        }
        else if(tabnumlimit>=count){
            removeTab(e,$(this));
        }
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
        
    });

    var removeInstore=function(that){
        that.parent("li").fadeOut("fast").remove();
        count--;
        var tabstoreheight=(1.125*(count-tabnumlimit)+2);

        if(tabstoreheight*16<=maxtabstoreheight){
            $("div.tabstore").stop(true,true).animate({height:tabstoreheight+"em"},{duration:200}).css({"overflow-y":"hidden","overflow-x":"hidden"});//markpoint}
        }
        else{
            $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
        }
        
        $(".storebutton").val(count-tabnumlimit);
        e.preventDefault();
    };

    var removeOverTab=function(e,that){
        console.log("removeOVERTABB")
        var currindex=that.parent('li').index();
        console.log(currindex);
        var currcloseid=that.siblings("a").attr("id");
        console.log(currindex+"cindex");
        var sizeli=$('.tab-links li').length;

        console.log(size);
        console.log(leftval+"!");

        var nextstoredid=$("ul li.storedtab:first > a").attr("id");
        var newtabwidth=8*pxInt($("body").css("font-size"));



        if(nextstoredid==quicknum){
            $("ul li.storedtab:first").appendTo("ul.tab-links").css({left:leftval[tabnumlimit-1],width:0}).children().css("display","none").parent("li").stop().animate({opacity:0},0).stop().animate({width:146,opacity:1}).children("a").animate({width:138}).fadeIn();
        }
        else{
            // var closehtml="<img class='closeButton' src='/static/quickpad/del.png'></img>";
            $("ul li.storedtab:first").appendTo("ul.tab-links").css({left:leftval[tabnumlimit-1],width:0}).children().css("display","none").parent("li").stop().animate({opacity:0,width:0},0).animate({width:newtabwidth,opacity:1}).children("a").animate({width:nexttabwidth}).siblings().addBack().fadeIn();//.append(closehtml)
        }
        $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({"display":"block"}).children().css({"display":"block"});

        if(that.parent('li').hasClass('active')){
            var successorElement;
            successorElement=that.parent('li').next();
            successorElementID=successorElement.children('a').attr('id');
            successorElement.addClass('active').siblings().removeClass('active')
            console.log(successorElementID);
            var nextSession=allseshs[successorElementID];
            editor.setSession(nextSession);
            activeid=successorElementID;

        }
        
        count--;

        if($(".tabstore").hasClass("opened")==true){
            
            $("li.storedtab").eq(count-tabnumlimit).fadeOut("fast");
            var tabstoreheight=(1.125*(count-tabnumlimit)+2);
            console.log("tabheight"+tabstoreheight*16+"max"+maxtabstoreheight);
            if(tabstoreheight*16<=maxtabstoreheight){
                $("div.tabstore").stop(true,true).animate({height:tabstoreheight+"em"},{duration:200}).css({"overflow-y":"hidden","overflow-x":"hidden"});//markpoint}
            }
            else{
                $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
            }
        }


        that.siblings().addBack().fadeOut().parent('li').animate({opacity:0, width:0}).remove();
        console.log(leftval+"2");

        for(var i=currindex;i<tabnumlimit;i++){
            $(".tab-links li").eq(i).stop(true,true).animate({left:leftval[i]},200);
            if(i==tabnumlimit-1){
                var currRight=leftval[tabnumlimit-1]+pxInt($("li.tab").css("padding-right"))+10+$("li.tab").width();
                $(".tab-links li").eq((tabnumlimit-1)).css({left:currRight}).stop(true,true).animate({opacity:0,width:0},0).children().css("display","none").parent("li").stop(true,true).animate({opacity:1,width:newtabwidth,left:leftval[tabnumlimit-1],"padding-right":18},200).children().fadeIn(200);
            }
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
            activeid=successorElementID;

        }
        that.siblings().addBack().fadeOut().parent('li').animate({opacity:0, width:0}).remove();
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
    var newOverTab=function(e,name,where){

        var tabs = $('.tabs');
        var ultabs=tabs.find('ul');
        var tabnum= new Date().getTime() + Math.floor(Math.random()*100000);
        var newtablinks=$('<li class="tab"><a id="' + tabnum + '" class="object"></a><img class="closeButton" src="/static/quickpad/del.png"></img></li>');
        if(where==undefined){
            ultabs.append(newtablinks);

            $("#"+tabnum).text(tabnum+".py");        
            var newtabfind=$('#'+tabnum);
            activeid=tabnum;

            console.log("newtabfind:"+newtabfind);
            
            newtabfind.parent('li').addClass('active').siblings().removeClass('active');

            doc = new Document("newnew123 "+tabnum);

            session = new Session(doc);
            console.log("session:"+session);
            editor.setSession(session);

            alldocs[tabnum]=doc;
            allseshs[tabnum]=session;
            count++;
            var storedtabwidth=$("div.tabstore").width();
            console.log(storedtabwidth+"storedtabwidth")
            $("ul li.tab").eq(0).removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").css("left",0).appendTo("div.tabstore > ul");

            $("ul li.storedtab").eq(count-tabnumlimit-1).css({"display":"none"});//.children("img").remove()

            if($(".tabstore").hasClass("opened")==true){
                var tabstoreheight=(1.125*(count-tabnumlimit)+2);
                if(tabstoreheight*16<=maxtabstoreheight){
                    $("div.tabstore").stop(true,true).animate({height:tabstoreheight+"em"},{duration:200});//markpoint}
                }
                else{
                    $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
                }
                
                $("li.storedtab").eq(count-tabnumlimit-1).delay("fast").stop(true,true).fadeIn("fast");
            }
            var newtabwidth=8*pxInt($("body").css("font-size"));

           
            //"+="+(count-tabnumlimit+2)+"em"11        
            
            for(var i=0;i<tabnumlimit;i++){
                $(".tab-links li").eq(i).stop(true,true).animate({left:leftval[i]},400);
                if(i==tabnumlimit-1){
                    var currRight=leftval[tabnumlimit-1]+pxInt($("li.tab").css("padding-right"))+10+$("li.tab").width();
                    console.log("curright"+currRight)
                    $(".tab-links li").eq(tabnumlimit-1).css({left:currRight}).stop().animate({opacity:0,width:0},0).children().css("display","none").fadeIn().parent("li").stop(false,false).animate({opacity:1,width:newtabwidth,left:leftval[tabnumlimit-1]},400);
                }
                
            }
            
            // $(".tab-links li").eq((tabnumlimit-1))
            



            $(".storebutton").val(count-tabnumlimit);
        }
        else if(where=="before"){
            $("#"+tabnum).text(name);
        }
        else if(where=="after")
            $("#"+tabnum).text(name);

        var entirename=$("#"+tabnum).text();
        var tempname=splitname(entirename);
        var ext=splitext(entirename);

        tabnames[tabnum]=tempname;
        tabext[tabnum]=ext;


        e.preventDefault;

    };
    var newTab = function(e,name,where){
        console.log("newtableft"+leftval);
        console.log("count:"+count);

        var tabs = $('.tabs');
        var ultabs=tabs.find('ul');

        var tabnum= new Date().getTime() + Math.floor(Math.random()*100000);
        var newtablinks=$('<li class="tab"><a id="' + tabnum + '" class="object"></a><img class="closeButton" src="/static/quickpad/del.png"></img></li>');
        if(where==undefined){
            ultabs.append(newtablinks);
            $("a#"+tabnum).text(tabnum+".py");

            var newtabfind=$('#'+tabnum);
            activeid=tabnum;

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
            $(".tab-links li").eq(count).css({left:value,width:0}).children().css("display","none").parent("li").stop().animate({opacity:0},0).stop().animate({width:newtabwidth,opacity:1}).children().fadeIn();

            leftval[count]=value;
            console.log(leftval);

        }
        else if (where=="before"){
            $("a#"+tabnum).text(name);
        }
        else if(where=="after"){
            $("a#"+tabnum).text(name);
        }
        var entirename=$("a#"+tabnum).text();
        console.log(entirename+"entirename");
        var tempname=splitname(entirename);
        var ext=splitext(entirename);

        tabnames[tabnum]=tempname;
        tabext[tabnum]=ext;
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
        var acewidth=$(window).width() - ($(".sidebar").width() + pxInt($("div.sidebar").css("left")))-pxInt($("div.sidebar").css("padding-left"));
        var aceheight=$(window).height() - $(".header").height();
        console.log(containerwidth);
        $(".tab-container").css({width:containerwidth});
        $("#editor").css({
            "width":acewidth,
            "height":aceheight
        });
        
        tabwidth=$("li.tab").width()+pxInt($("li.tab").css("padding-right"));
        console.log("tabwidth"+tabwidth);
        var lcontainerlim=17;
        var rcontainerlim=$("div.tab-container").width()-16-19.5-$("div.menu").width();  
        maxtabstoreheight=$("#editor").height();
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
        var acewidth=$(window).width() - ($(".sidebar").width() + pxInt($("div.sidebar").css("left")))-pxInt($("div.sidebar").css("padding-left"));
        var aceheight=$(window).height() - $(".header").height();
        console.log(containerwidth);
        $(".tab-container").css({width:containerwidth});
        $("#editor").css({
            "width":acewidth,
            "height":aceheight
        });
        tabwidth=$("li.tab").width()+pxInt($("li.tab").css("padding-right"));
        console.log("tabwidth"+tabwidth);
        var lcontainerlim=17;
        var rcontainerlim=$("div.tab-container").width()-16-19.5-$("div.menu").width();  
        rightlim=rcontainerlim;
        leftlim=lcontainerlim;
        maxtabstoreheight=$("#editor").height();
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
                        // var closehtml="<img class='closeButton' src='/static/quickpad/del.png'></img>";
                        $("ul li.storedtab:first").appendTo("ul.tab-links").children("a").css({"width":nexttabwidth});//.append(closehtml)
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
                        activeid=$("ul.tab-links li.tab:last").prev().children("a").attr("id")
                    }
                    $("ul.tab-links li.tab:last").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").prependTo("div.tabstore > ul");
                    // $("ul li.storedtab:first").children("img").remove();
                    $("ul li.storedtab:first").css({"display":"none"});

                    if($(".tabstore").hasClass("opened")==true){
                        var tabstoreheight=(1.125*(count-tabnumlimit)+2);

                        if(tabstoreheight*16<=maxtabstoreheight){
                            $("div.tabstore").stop().animate({height:tabstoreheight+"em"},{duration:200});//markpoint}
                        }
                        else{
                            $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
                        }   

                        
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

                $("div.tabstore").css({"left":tabstoreleft,"top":tabstoretop,"width":tabstorewidth,"z-index":10,"height":0,"display":"block"}).stop().animate({opacity:0},0).stop().animate({opacity:0.84,top:"+="+(pxInt($(".tabstore").css("border-width"))/2-1)},"fast");

                for(var i=0;i<count-tabnumlimit;i++){
                    if($("ul.tab-links li.tab:last").hasClass("active")){
                        $("ul.tab-links li.tab:last").prev().addClass("active").siblings().removeClass("active");
                        activeid=$("ul.tab-links li.tab:last").prev().children("a").attr("id")
                    }
                    $("ul.tab-links li.tab:last").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").prependTo("div.tabstore > ul");
                    // $("ul li.storedtab:first").children("img").remove();
                    $("ul li.storedtab:first").css({"display":"none"});
                    
                    if($(".tabstore").hasClass("opened")==true){
                        var tabstoreheight=(1.125*(count-tabnumlimit)+2);
                        if(tabstoreheight*16<=maxtabstoreheight){
                            $("div.tabstore").stop().animate({height:tabstoreheight+"em"},{duration:200});//markpoint
                        }
                        else{
                            $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
                        }       
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

    var rightlim=$("div.tab-container").width()-16-19.5-$("div.menu").width();
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
        console.log($("li.tab").index(".active"))

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
