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
    if(a.length ===1){
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
    var temp=a.pop();
    if(temp=="tjs"){
        return ".js"
    }
    return "."+temp;
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
    function csrfSafeMethod(method) {
        
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
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
    var quicknum= Math.floor(new Date().getTime()/1000) + Math.floor(Math.random()*100000);

    var allseshs = [];
    var alldocs = [];
    var tabext = [];
    var tabnames=[];
    var keys =[];
    
    var quickname="QuickQode";
    var quickExt="";
    var qdoc = new Document(testtxt);
    var qsession = new Session(qdoc);
    allseshs[quicknum]=qsession;
    alldocs[quicknum]=qdoc;
    tabext[quicknum]=quickExt;
    tabnames[quicknum]=quickname;                               
    
    var activeid = quicknum;
    
    
    var count=0;
    
    var tabwidth;
    var containerFtr =1.5;
    var size=0;
    var startval=25;
    var leftval=[startval];
    var leftinterval=155;
    var tabnumlimit;

    var langToExt = {'abap':".ABAP",
            'actionscript':'.as',
            'assembly_x86':'.asm',
            'batchfile':'.bat',
            'c_cpp':".C",
            'coffee':'.coffee',
            'csharp':'.cs',
            'css':'.css',
            'glsl':".glsl",
            'golang':'.go',
            'groovy':'.gvy',
            'haskell':'.hs',
            'html':".html",
            'java':'.JAVA',
            'javascript':'.tjs',
            'json':'.json',
            'latex':".tex",
            'lisp':'.lisp',
            'lua':'.lua',
            'mysql':'.mysql',
            'objectivec':".m",
            'pascal':'.pas',
            'perl':'.pl',
            'php':'.php',
            'python':".py",
            'ruby':'.rb',
            'sass':'.sass',
            'scss':'.scss',
            'sql':".sql",
            'text':'.txt',
            'xml':'.xml',
            'xquery':'.xq',
            'yaml':'.yaml'
        };

    var extToLang = {'.ABAP':'abap',
            '.as':'actionscript',
            '.asm':'assembly_x86',
            '.bat':'batchfile',
            '.C':'c_cpp',
            '.coffee':'coffee',
            '.cs':'csharp',
            '.css':'css',
            '.glsl':'glsl',
            '.go':'golang',
            '.gvy':'groovy',
            '.hs':'haskell',
            '.html':'html',
            '.JAVA':'java',
            '.tjs':'javascript',
            '.js':'javascript',
            '.json':'json',
            '.tex':'latex',
            '.lisp':'lisp',
            '.lua':'lua',
            '.mysql':'mysql',
            '.m':'objectivec',
            '.pas':'pascal',
            '.pl':'perl',
            '.php':'php',
            '.py':'python',
            '.rb':'ruby',
            '.sass':'sass',
            '.scss':'scss',
            '.sql':'sql',
            '.txt':'text',
            '.xml':'xml',
            '.xq':'xquery',
            '.yaml':'yaml'
        };
    function resize(e){
        var containerwidth= $(".icons").offset().left - $(".header").width();
        
        
        var acewidth=$(window).width() - ($(".sidebar").width() + pxInt($("div.sidebar").css("left")))-pxInt($("div.sidebar").css("padding-left"));
        var aceheight=$(window).height() - $(".header").height();
        
        $(".tab-container").css({width:containerwidth});
        $("#editor").css({
            "width":acewidth,
            "height":aceheight
        });
        
        tabwidth=$("li.tab").width()+pxInt($("li.tab").css("padding-right"));
        
        var lcontainerlim=17;
        var rcontainerlim=$("div.tab-container").width()-$("div.menu").width()+$("#addbutton").width();  
        maxtabstoreheight=$("#editor").height();
        
        tabnumlimit=Math.ceil((rcontainerlim-lcontainerlim)/leftinterval);
        
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    }
    resize(); 
    
    
    var tabflow=false;
    function inittab(i,tablist,prevactive,limit){
        if(i>=limit){
            if(i>=tabnumlimit && $("div.tabstore").length==1){
                showstore();   
            }
            
            
            return;
        }
        if(limit>tabnumlimit && i==tabnumlimit && $("div.tabstore").length==0){
            
            createstore();
            
        }
            
        var contentfullname,contentdata,contentname,contentExt;
        var tempdoc,tempsession;
        var tempid=Math.floor(new Date().getTime()/1000) + Math.floor(Math.random()*100000);
        $.get( "d/"+tablist[i], function( data, textStatus, jqXHR ) {
            contentfullname=jqXHR.getResponseHeader('Content-Disposition').replace('attachment; filename=','');
            
            
            
            contentdata=data;

            contentExt=splitext(contentfullname);
            
            contentname=splitname(contentfullname);
            console.log(contentExt)
            contentfullname = contentname+contentExt;
            
            keys[tempid]=tablist[i];
            tabnames[tempid]=contentname;
            tabext[tempid]=contentExt;

            if(count<tabnumlimit && tabflow==false){
                
                
                newTab(contentfullname,tempid);
                
                if(count==tabnumlimit){
                    tabflow=true;
                }

                tempdoc=new Document(contentdata);
                tempsession = new Session(tempdoc);
                alldocs[tempid]=tempdoc;
                
                allseshs[tempid]=tempsession;
                
                if(tablist[i]==prevactive){
                    activeid=tempid;
                    editor.setSession(tempsession);
                    $("li.tab").removeClass("active")
                    $("li.storedtab").removeClass("active")
                    $("#"+tempid).parent("li").addClass("active");
                    $(".lang select").val(extToLang[tabext[activeid]]);
                    console.log(tabext[activeid]+"test")
                    setLang(extToLang[tabext[activeid]]);
                    editor.getSession().setUseWrapMode(false);   
                    editor.getSession().setUseWrapMode(true);
                }
            }
            else if(tabflow==true){
                
                newOverTab(contentfullname,tempid);
                tempdoc=new Document(contentdata);
                tempsession = new Session(tempdoc);
                alldocs[tempid]=tempdoc;
                allseshs[tempid]=tempsession;
            }
            inittab(i+1,tablist,prevactive,limit)
        });  
    }
    function createstore(){
        var htmltabstore="<div class='tabstore closed'><ul></ul></div>"
        var htmlicon="<input class='storebutton' type='button'>"
        $("body").append(htmltabstore);
        $("div.icons").append(htmlicon);
        $("div.tabstore").css({"z-index":10,"height":0,opacity:0.84,"display":"none"});
        $(".storebutton").css({"display":"block"});
        
        
    }
    function showstore(){
        $("div.tabstore").css({"display":"block"});
        resizeOver();
    }
    var pathname=window.location.pathname;
    var isSingle=false;
    
    function startup(){
        var pathnamearr=pathname.split("/");
        var lastEL=pathnamearr[pathnamearr.length-1];
        if(lastEL.length == 8){
            var i=0;
            var temparr=[lastEL];
            isSingle=true;
            inittab(i,temparr,temparr[0],1);
        }
        else{
            $.get("mycookie").done(function(data){
                
                
                
                setTheme(data.style);
                $(".theme select").val(data.style);
                
                setFontSize(data.fontSize);
                $(".size select").val(data.fontSize);

                var tablist=data.tabs.split("|||");
                for(var i=0;i<tablist.length;i++){
                    if(tablist[i]==""){
                        tablist.splice(i,1);
                    }
                }
                var doubledel = [];
                $.each(tablist, function(i, el){
                    if($.inArray(el, doubledel) == -1){
                        doubledel.push(el);
                    }
                });
                tablist=doubledel;
                
                var prevactive=data.active;
                
            
                if(tablist=="None" || tablist==""){
                    newTab("QuickQode",quicknum);
                    editor.setSession(qsession);
                    activeid=quicknum; 
                    editor.getSession().setUseWrapMode(false);   
                    editor.getSession().setUseWrapMode(true);
                }
                else{
                        var i=0
                        inittab(i,tablist,prevactive,tablist.length);
                }
            }); 
        }
    }
    startup();
    
    
    var arr = { 'file': "print \"It works!\"", 
                'fileName' : "JSONtest", 
                'fileExt':".py",
                'eDays':'99',
                'eHours':'1', 
                'eMinutes':'1' };
    var tab = { 'tabs' : 'None', 
                'active':'None'};
    var settings = {'font':'python',
                    'fontSize':'12px',
                    'style':'ace/theme/ambiance'};
    var edit = {'fId':"jfElnrd2",
                'name':'ze name',
                'ext':'.py',
                'file':'thecode'};
    onkeydown = function(e){
        if(e.ctrlKey){
            var tries=0;
            if(e.keyCode == 'S'.charCodeAt(0)){
                e.preventDefault();
                
                saveTab();
                tabOrderSave(tries);
            }
            else if(e.keyCode == '1'.charCodeAt(0)){
                e.preventDefault();
                
                
                newTabfinal();
                saveTab();
                tabOrderSave(tries);
            }
            else if(e.keyCode == '2'.charCodeAt(0)){
                e.preventDefault();
                
                console.log("ys")
                removeOverTabFinal(e,$("#"+activeid).siblings(".closeButton"))
                saveTab();
                tabOrderSave(tries);
            }
        }
    }

    editor.commands.addCommand({
        name: 'myCommand',
        bindKey: {win: 'Ctrl-s',  mac: 'Command-s'},
        exec: function(editor) {
            var tries=0;
            saveTab();
            tabOrderSave(tries);
            
        }
    });

    var setTheme = function(themename){
        
        editor.setTheme(themename);
    };
    var setLang = function(lang){
        
        editor.getSession().setMode("ace/mode/"+lang);
    };
    var setFontSize =function(size){
        document.getElementById("editor").style.fontSize=size;
    }
    $("select").on("change", function(){
        
        
        var currFontSize = $(".size select").val();
        var currTheme = $(".theme select").val();
        var currLang = $(".lang select").val();
        setTheme(currTheme);
        setLang(currLang);
        setFontSize(currFontSize);

        tabext[activeid]=langToExt[currLang];
        var tempext = tabext[activeid];
        if(tempext==".tjs"){
            tempext=".js"
        }
        $("a#"+activeid).text(tabnames[activeid]+tempext);
        
        settings['font']=currLang;
        settings['fontSize']=currFontSize;
        settings['style']=currTheme;

        
        $.ajax({
            url: 'setsettings',
            type: 'POST',
            data: JSON.stringify(settings),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        })
        saveTab();
    })
    var saveTab=function(){
        savingprogress=true;
        var result=true;
        if((activeid in keys)==false){

            arr['file']=alldocs[activeid].getValue();
            arr['fileName']=tabnames[activeid];
            arr['fileExt']=tabext[activeid];
            arr['eDays']=9999;
            arr['eHours']=1;
            arr['eMinutes']=1;
            console.log(arr);

            $.ajax({
                url: 'au',
                type: 'POST',
                data: JSON.stringify(arr),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success:function(data){
                    console.log(data)
                    console.log("12")
                    keys[activeid]=data.link;
                },
                error: function(data){
                    if(data.status==200){
                        console.log("good1");
                    }
                    else{
                        console.log("bad2");
                        return false;
                    }
                }
            });
        }
        else{
            edit['fId']=keys[activeid];
            edit['name']=tabnames[activeid];
            edit['ext']=tabext[activeid];
            edit['file']=alldocs[activeid].getValue();
            $.ajax({
                url:"editfile",
                type:"POST",
                data: JSON.stringify(edit),
                contentType: 'application/json; charset=utf-8',
                dataType:"json",
                error: function(data){
                    if(data.status==200){
                        console.log("good11");
                        savingprogress=false;
                    }   
                    else{
                        console.log("bad22");
                        testsavetab();
                    }
                }
            });
        }
        return true;

    };
    function tabOrsession(){
        saveTab();
        console.log("insd")
        if(isSingle==false){
            var tries=0;
            tabOrderSave(tries);
        }
    }
    function keygen(arr,saveid){
        $.ajax({
            url: 'au',
            type: 'POST',
            data: JSON.stringify(arr),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                
                keys[saveid]=data['link'];
                
            }
        });
    }
    function tabrefresh(edit){
        $.ajax({
            url:"editfile",
            type:"POST",
            data: JSON.stringify(edit),
            contentType: 'application/json; charset=utf-8',
            dataType:"json",
            success: function(){
                
            }
        })
    }
    var thereIsGap=false;
    var currsaving=false;
    var actionsave;
    var tabOrderSaveAction = function(tries){
        console.log("insdietbs")
        for(var i in keys){
            
            if(keys[i]==undefined){
                tempkeys=keys.filter(Boolean);
                
                keys=tempkeys
                
            }
        }
        
        var currentID=[];
        
        if(count>0){
            var starting=Math.min(count,tabnumlimit); 
            for(var i=0;i<starting;i++){
                var saveid=$("li.tab").eq(i).children("a").attr("id");
                
                currentID[i]=saveid;
                
            }
            if(count>tabnumlimit){
                for(var i=0;i<count-tabnumlimit;i++){
                    var saveid=$("li.storedtab").eq(i).children("a").attr("id");
                    currentID[i+tabnumlimit]=saveid;
                    
                    
                }
            }
            var keystring=[];
            
            for(var i=0;i<currentID.length;i++){
                keystring[i]=keys[currentID[i]];

                if(keystring[i]==undefined){
                    console.log("trued here"+keystring)
                    testsavetab();
                    return true;
                }
            }

            var tabstring=keystring.join("|||");
            var keyactiveindex=$("#"+activeid).parent("li").index();
            
            
            tab['tabs']=tabstring;
            
            
            tab['active']=keys[currentID[keyactiveindex]];
            
            
            $.ajax({
                url: 'settabs',
                type: 'POST',
                data: JSON.stringify(tab),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                error: function(data){
                    if(data.status==400 && tries <3){
                        tries++;
                        tabOrderSave(tries);
                        console.log("trued heresa")
                        return true;
                    }
                    else if(data.status==200){
                        savingprogress=false;
                        return false;
                    }
                }    
            });
            
        }
    }
    var testsave = function(){
        if(!currsaving){
            currsaving=true;
            var trys=0;
            tabOrderSaveAction(trys);
            console.log("im nd")
            actionsave = setInterval(function(){
                
                var tries=0;
                var gaps=tabOrderSaveAction(tries);
                console.log("gaps"+gaps)
                if(!gaps){
                    console.log("erase"+gaps);
                    currsaving=false;
                    gaps=true;
                    clearInterval(actionsave);
                }
            },1000);
        }
    }
    var tabOrderSave= function(){
        savingprogress=true;
        testsave();
    }
    var saveSession= function(tries){
        for(var i in keys){
            if(keys[i]==undefined){
                tempkeys=keys.filter(Boolean);
                keys=tempkeys
            }
        }
        
        var currentID=[];
        
        if(count>0){
            var starting=Math.min(count,tabnumlimit);    
            for(var i=0;i<starting;i++){
                var saveid=$("li.tab").eq(i).children("a").attr("id");
                
                currentID[i]=saveid;
                
                if((saveid in keys)==false){
                    
                    arr['file']=alldocs[saveid].getValue();
                    arr['fileName']=tabnames[saveid];
                    
                    arr['fileExt']=tabext[saveid];
                    arr['eDays']=9999;
                    arr['eHours']=1;
                    arr['eMinutes']=1;
                    keygen(arr,saveid);
                }
                else{
                    edit['fId']=keys[saveid];
                    edit['name']=tabnames[saveid];
                    
                    edit['ext']=tabext[saveid];
                    
                    edit['file']=alldocs[saveid].getValue();
                    
                    tabrefresh(edit);
                }
            }
            if(count>tabnumlimit){
                for(var i=0;i<count-tabnumlimit;i++){
                    var saveid=$("li.storedtab").eq(i).children("a").attr("id");
                    currentID[i+tabnumlimit]=saveid;

                    if((saveid in keys)==false){
                        arr['file']=alldocs[saveid].getValue();
                        arr['fileName']=tabnames[saveid];
                        
                        arr['fileExt']=tabext[saveid];
                        arr['eDays']=9999;
                        arr['eHours']=1;
                        arr['eMinutes']=1;
                        keygen(arr,saveid)
                    }
                    else{
                        edit['fId']=keys[saveid];
                        edit['name']=tabnames[saveid];
                        edit['ext']=tabext[saveid];
                        
                        edit['file']=alldocs[saveid].getValue();
                        
                        tabrefresh(edit);
                    }
                }
            }
            var keystring=[];
            
            for(var i=0;i<currentID.length;i++){
                keystring[i]=keys[currentID[i]];
            }
            var tabstring=keystring.join("|||");
            var keyactiveindex=$("#"+activeid).parent("li").index();

            tab['tabs']=tabstring;
            tab['active']=keys[currentID[keyactiveindex]];
            $.ajax({
                url: 'settabs',
                type: 'POST',
                data: JSON.stringify(tab),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                error: function(data){
                    if(data.status==400 && tries<3){
                        tries++;
                        saveSession(tries);
                    }
                    else if(data.status==200){
                        savingprogress=false;
                    }
                }    
            })
        }
    }
    function closeEditorWarning(){
        if(savingprogress){
            return 'It looks like you have some unsaved changes. Do you want to leave the page, discarding your changes?'
        }
    }
    window.onbeforeunload = closeEditorWarning
    
    var savingprogress=false;
    var saveprogcount=0;
    
    var currsavingtab=false;
    var actionsavetab;
    var testsavetab = function(){
        if(!currsavingtab){
            currsavingtab=true;
            saveTab();
            actionsavetab = setInterval(function(){
                console.log("here")
                var successRun=saveTab();
                console.log("successRun"+successRun)
                if(successRun){
                    console.log("erase");
                    currsavingtab=false;
                    clearInterval(actionsavetab);
                }
            },1500);
        }
    }
    editor.on("input",function(e){
        // savetimer(e);
        testsavetab();
    })

    $(document).on("click",".tabstore li.storedtab",function(e){
        var currid=$(this).children("a").attr("id");
        var tostoreId=$("ul.tab-links li:first > a").attr("id");

        $("ul.tab-links li:first").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").css("left",0).appendTo("div.tabstore > ul");
        
        $(this).appendTo("ul.tab-links").children("a").css({"width":nexttabwidth}).parent("li").css("display","none");

        $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({left:leftval[tabnumlimit-1]}).addClass("active").fadeIn().siblings().removeClass("active");
        activeid=$("ul.tab-links li:last").children("a").attr("id")
        editor.setSession(allseshs[currid]);
        
        for(var i=0;i<tabnumlimit;i++){
            $("ul.tab-links li.tab").eq(i).stop(true,true).animate({left:leftval[i]});
            
        }
        $(".lang select").val(extToLang[tabext[activeid]]);
        setLang(extToLang[tabext[activeid]]);
        tabOrsession();
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    });
    $(document).on("click",".storebutton",function(e){
        
        if($(".tabstore").hasClass("closed")){
            if((1.125*(count-tabnumlimit)+2)*17>maxtabstoreheight){
                 $("div.tabstore").stop(true,true).animate({height:maxtabstoreheight-5},{duration:"fast",
                    complete:function(){
                        $("div.tabstore").stop().css({"overflow-y":"auto","overflow-x":"hidden"});
                }});
            }
            else{
                $("div.tabstore").stop(true,true).animate({height:"+="+(1.125*(count-tabnumlimit)+2)+"em"},{duration:"fast"});
            }
            
            $("li.storedtab").stop(true,true).fadeIn("fast");
        }
        else if($(".tabstore").hasClass("opened")){
            $("li.storedtab").stop(true,true).fadeOut("fast")
            $("div.tabstore").stop().delay("fast").stop().animate({height:0},{duration:"fast"});
        }
        $("div.tabstore").toggleClass("closed").toggleClass("opened");
    });
    var tabstoretop, tabstorewidth, tabstoreleft,maxtabstoreheight;
    var storeWidthVal=175;
    var nexttabwidth=8*pxInt($("body").css("font-size"));
    var newTabfinal = function(name){
        

        if(tabnumlimit==count && $("div.tabstore").length==0){
            
            
            var htmltabstore="<div class='tabstore closed'><ul></ul></div>"
            var htmlicon="<input class='storebutton' type='button'>"
            $("body").append(htmltabstore);
            $("div.icons").append(htmlicon);
            var tabstoretop=$("div.tab-container").height()-pxInt($(".tabstore").css("border-width"))/2;
            
            var tabstorewidth = storeWidthVal 
            var tabstoreleft=$(window).width()-tabstorewidth;

            $("div.tabstore").css({"left":tabstoreleft,"top":tabstoretop,"width":tabstorewidth,"z-index":10,"height":0,"display":"block"}).stop().animate({opacity:0},0).stop().animate({opacity:0.84,top:"+="+(pxInt($(".tabstore").css("border-width"))/2-1)},"fast");
            
            resizeOver();
            newOverTab(name);
            $(".storebutton").css({"display":"block"});
        }
        else if(count>tabnumlimit){
            newOverTab(name);
        }
        else if(tabnumlimit>count){
            newTab(name);
        }
        $(".lang select").val(extToLang[tabext[activeid]]);
        setLang(extToLang[tabext[activeid]]);
        saveTab();
        tabOrsession();
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    };
    $(document).on('click','#addbutton', function(e){
        newTabfinal();
        $(".lang select").val(extToLang[tabext[activeid]]);
        setLang(extToLang[tabext[activeid]]);
        tabOrsession();
    });
    $(document).on('mousedown','.tabs .tab-links a', function(e)  {
        
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        activeid=$(this).attr("id")
        e.preventDefault();
        var tabnum=$(this).attr('id');
        
        changeSession = allseshs[tabnum];
        
        
        editor.setSession(changeSession);
        tabOrsession();
        $(".lang select").val(extToLang[tabext[activeid]]);
        setLang(extToLang[tabext[activeid]]);
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    });
    var removeTabFinal =function(e,that){
        if(tabnumlimit+1==count){
            removeInstore(that,e);
            tabstoretop=pxInt($(".tabstore").css("border-width"));
            
            tabstorewidth = storeWidthVal 
            tabstoreleft=$(window).width()-tabstorewidth;
            $("div.tabstore").stop().animate({height:0},{duration:"fast",complete:function(){
                $("div.tabstore").stop().animate({top:"-="+tabstoretop,opacity:0},{duration:"slow",complete:function(){
                    $("div.tabstore").remove();
                    
                }});
            }});
            $(".storebutton").remove();
        }
        else{
            removeInstore(that,e);
        }
        $(".lang select").val(extToLang[tabext[activeid]]);
        setLang(extToLang[tabext[activeid]]);
        tabOrsession();
    }
    $(document).on('click',".tabstore .storedtab .closeButton", function(e){
        removeTabFinal(e,$(this));

    });
    var removeOverTabFinal = function(e,that){
        if(count==1){
            
            return;
        }
        if(tabnumlimit+1==count){
            removeOverTab(e,that)
            tabstoretop=pxInt($(".tabstore").css("border-width"));
            
            tabstorewidth = storeWidthVal;
            tabstoreleft=$(window).width()-tabstorewidth;
            $("div.tabstore").stop().animate({height:0},{duration:"fast",complete:function(){
                $("div.tabstore").stop().animate({top:"-="+tabstoretop,opacity:0},{duration:"slow",complete:function(){
                    $("div.tabstore").remove();
                    
                }});
            }});
            $(".storebutton").remove();
        }
        else if(count>tabnumlimit+1){
            removeOverTab(e,that)
        }
        else if(tabnumlimit>=count){
            removeTab(e,that);
        }
        tabOrsession();
        $(".lang select").val(extToLang[tabext[activeid]]);
        setLang(extToLang[tabext[activeid]]);
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    }
    $(document).on('click','.tabs .tab-links .closeButton',function(e){ 
        removeOverTabFinal(e,$(this));
    });
    var removeInstore=function(that,e){
        that.parent("li").fadeOut("fast").remove();
        count--;
        var tabstoreheight=(1.125*(count-tabnumlimit)+2);
        if(tabstoreheight*16<=maxtabstoreheight){
            $("div.tabstore").stop(true,true).animate({height:tabstoreheight+"em"},{duration:200}).css({"overflow-y":"hidden","overflow-x":"hidden"});
        }
        else{
            $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
        }
        
        $(".storebutton").val(count-tabnumlimit);
        e.preventDefault();
    };
    var removeOverTab=function(e,that){
        
        var currindex=that.parent('li').index();
        
        var currcloseid=that.siblings("a").attr("id");
        
        var sizeli=$('.tab-links li').length;
        
        
        var nextstoredid=$("ul li.storedtab:first > a").attr("id");
        var newtabwidth=8*pxInt($("body").css("font-size"));

        
        $("ul li.storedtab:first").appendTo("ul.tab-links").css({left:leftval[tabnumlimit-1],width:0}).children().css("display","none").parent("li").stop().animate({opacity:0,width:0},0).animate({width:newtabwidth,opacity:1}).children("a").animate({width:nexttabwidth}).siblings().addBack().fadeIn();
        
        $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({"display":"block"}).children().css({"display":"block"});
        if(that.parent('li').hasClass('active')){
            var successorElement;
            successorElement=that.parent('li').next();
            successorElementID=successorElement.children('a').attr('id');
            successorElement.addClass('active').siblings().removeClass('active')
            
            var nextSession=allseshs[successorElementID];
            editor.setSession(nextSession);
            activeid=successorElementID;
        }
        
        count--;
        if($(".tabstore").hasClass("opened")==true){
            
            $("li.storedtab").eq(count-tabnumlimit).fadeOut("fast");
            var tabstoreheight=(1.125*(count-tabnumlimit)+2);
            
            if(tabstoreheight*16<=maxtabstoreheight){
                $("div.tabstore").stop(true,true).animate({height:tabstoreheight+"em"},{duration:200}).css({"overflow-y":"hidden","overflow-x":"hidden"});
            }
            else{
                $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
            }
        }

        that.siblings().addBack().fadeOut().parent('li').animate({opacity:0, width:0}).remove();
        
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
        
        var sizeli=$('.tab-links li').length;
        
        
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
            
            var nextSession=allseshs[successorElementID];
            editor.setSession(nextSession);
            activeid=successorElementID;
        }
        that.siblings().addBack().fadeOut().parent('li').animate({opacity:0, width:0}).remove();
        count--;
        size--;
        leftval.splice(count,1);
        
        for(var i=currindex;i<count;i++){
            $(".tab-links li").eq(i).stop().animate({
                left: leftval[i]
            },{
                duration: 200
            });
        }
        e.preventDefault();
    }

    function newOverTab(name,id){
        var tabs = $('.tabs');
        var ultabs=tabs.find('ul');
        var tabnum;
        if(id==undefined){
            tabnum= Math.floor(new Date().getTime()/1000) + Math.floor(Math.random()*100000);
        }
        else{
            tabnum = id;
        }
        var newtablinks=$('<li class="tab"><a id="' + tabnum + '" class="object"></a><img class="closeButton" src="/static/quickpad/del.png"></img></li>');
        var newtablinksinstore=$('<li class="storedtab"><a id="' + tabnum + '" class="storedobj"></a><img class="closeButton" src="/static/quickpad/del.png"></img></li>');
        var newtabwidth=8*pxInt($("body").css("font-size"));
        if(name!=undefined){
            $(".tabstore ul").append(newtablinksinstore);
            $("a#"+tabnum).text(name);
            $("ul li.storedtab:last").css({"width":newtabwidth,"left":0,"display":"none"})
            
        }
        else if(name==undefined){
            ultabs.append(newtablinks);
            $("#"+tabnum).text(tabnum+".txt");        
            var newtabfind=$('#'+tabnum);
            activeid=tabnum;
            
            
            newtabfind.parent('li').addClass('active').siblings().removeClass('active');
            doc = new Document("newnew123 "+tabnum);
            session = new Session(doc);
            
            editor.setSession(session);
            alldocs[tabnum]=doc;
            allseshs[tabnum]=session;
            
            
            $("ul li.tab").eq(0).removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").css("left",0).appendTo("div.tabstore > ul");
            $("ul li.storedtab").eq(count-tabnumlimit).css({"display":"none"});
            if($(".tabstore").hasClass("opened")==true){
                var tabstoreheight=(1.125*(count-tabnumlimit)+2);
                if(tabstoreheight*16<=maxtabstoreheight){
                    $("div.tabstore").stop(true,true).animate({height:tabstoreheight+"em"},{duration:200});
                }
                else{
                    $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
                }
                
                $("li.storedtab").eq(count-tabnumlimit).delay("fast").stop(true,true).fadeIn("fast");
            }
 
            
            for(var i=0;i<tabnumlimit;i++){
                $(".tab-links li").eq(i).stop(true,true).animate({left:leftval[i]},400);
                if(i==tabnumlimit-1){
                    var currRight=leftval[tabnumlimit-1]+pxInt($("li.tab").css("padding-right"))+10+$("li.tab").width();
                    
                    $(".tab-links li").eq(tabnumlimit-1).css({left:currRight}).stop().animate({opacity:0,width:0},0).children().css("display","none").fadeIn().parent("li").stop(false,false).animate({opacity:1,width:newtabwidth,left:leftval[tabnumlimit-1]},400);
                }
                
            }
            tabext[tabnum]=".txt";
            $(".lang select").val("text");
            setLang(extToLang[tabext[activeid]]);
        }

        var entirename=$("#"+tabnum).text();
        var tempname=splitname(entirename);
        var ext=splitext(entirename);
        tabnames[tabnum]=tempname;
        tabext[tabnum]=ext;
        count++;
        $(".storebutton").val(count-tabnumlimit);

    };
    function newTab(name,id){
        var tabs = $('.tabs');
        var ultabs=tabs.find('ul');
        var tabnum;
        if(id==undefined){
            tabnum= Math.floor(new Date().getTime()/1000) + Math.floor(Math.random()*100000);
        }
        else{
            tabnum=id;
        }
        var newtablinks=$('<li class="tab"><a id="' + tabnum + '" class="object"></a><img class="closeButton" src="/static/quickpad/del.png"></img></li>');
        var newtabwidth=8*pxInt($("body").css("font-size"));
        if(name==undefined){
            ultabs.append(newtablinks);
            $("a#"+tabnum).text(tabnum+".txt");
            var newtabfind=$('#'+tabnum);
            activeid=tabnum;
            
            newtabfind.parent('li').addClass('active').siblings().removeClass('active');
            doc = new Document("newnew123 "+tabnum);
            session = new Session(doc);
            
            editor.setSession(session);
            alldocs[tabnum]=doc;
            allseshs[tabnum]=session;

            if(count>0){
                var value= leftval[count-1]+leftinterval; 
            }
            else{
                var value=startval;
            }
            $(".tab-links li").eq(count).css({left:value,width:0}).children().css("display","none").parent("li").stop().animate({opacity:0},0).stop().animate({width:newtabwidth,opacity:1}).children().fadeIn();
            leftval[count]=value;
            tabext[tabnum]=".txt";
            
            $(".lang select").val("text");
            setLang(extToLang[tabext[activeid]]);
        }
        else if (name != undefined){
            ultabs.append(newtablinks)
            $("a#"+tabnum).text(name);
            if(count!=0){
                leftval[count]=leftval[count-1]+leftinterval;
            }
            $(".tab-links li").eq(count).css({width:newtabwidth,left:leftval[count]})

        }
        var entirename=$("a#"+tabnum).text();
        
        var tempname=splitname(entirename);
        var ext=splitext(entirename);
        tabnames[tabnum]=tempname;
        tabext[tabnum]=ext;
        size++;
        count++;
    };
    


    function resizeOver(e){
      
        var containerwidth= $(".icons").offset().left - $(".header").width();
        
        var acewidth=$(window).width() - ($(".sidebar").width() + pxInt($("div.sidebar").css("left")))-pxInt($("div.sidebar").css("padding-left"));
        var aceheight=$(window).height() - $(".header").height();
        
        $(".tab-container").css({width:containerwidth});
        $("#editor").css({
            "width":acewidth,
            "height":aceheight
        });
        tabwidth=$("li.tab").width()+pxInt($("li.tab").css("padding-right"));
        
        var lcontainerlim=17;
        var rcontainerlim=$("div.tab-container").width()-$("div.menu").width()+$("#addbutton").width();  
        rightlim=rcontainerlim;
        leftlim=lcontainerlim;
        maxtabstoreheight=$("#editor").height();
        
        prevlimit=tabnumlimit;
        
        
        tabnumlimit=Math.ceil((rcontainerlim-lcontainerlim)/leftinterval);
        if(count>prevlimit){
            if(tabnumlimit>prevlimit){
                var outnum=Math.min(tabnumlimit,count)-prevlimit;
                
                for(var i=0;i<outnum;i++){
                    var nextstoredid=$("ul li.storedtab:first").children("a").attr("id");

                    $("ul li.storedtab:first").appendTo("ul.tab-links").children("a").css({"width":nexttabwidth});
                    
                    $("ul.tab-links li:last").removeClass("storedtab").addClass("tab").children("a").removeClass("storedobj").addClass("object").parent("li").css({display:"block"});
                    leftval[prevlimit+i]=leftval[prevlimit+i-1]+leftinterval;
                    
                }
                if(count<=tabnumlimit){
                    $("div.tabstore").remove();
                    $(".storebutton").remove();
                }
                size+=outnum;
            }
            else{
                for(var i=0;i<prevlimit-tabnumlimit;i++){
                    if($("ul.tab-links li.tab:last").hasClass("active")){
                        $("ul.tab-links li.tab:last").prev().addClass("active").siblings().removeClass("active");
                        activeid=$("ul.tab-links li.tab:last").prev().children("a").attr("id")
                    }
                    $("ul.tab-links li.tab:last").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").prependTo("div.tabstore > ul");
                    
                    $("ul li.storedtab:first").css({"display":"none"});
                    if($(".tabstore").hasClass("opened")==true){
                        var tabstoreheight=(1.125*(count-tabnumlimit)+2);
                        if(tabstoreheight*16<=maxtabstoreheight){
                            $("div.tabstore").stop().animate({height:tabstoreheight+"em"},{duration:200});
                        }
                        else{
                            $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
                        }   
                        
                        $("ul li.storedtab:first").css({"display":"block"});
                    }
                    leftval.splice(tabnumlimit,prevlimit-tabnumlimit);
                    
                }
                size=tabnumlimit;
            }
        }
        else{
            if(tabnumlimit<count){
                var htmltabstore="<div class='tabstore closed'><ul></ul></div>"
                var htmlicon="<input class='storebutton' type='button'>"
                $("body").append(htmltabstore);
                $("div.icons").append(htmlicon);
                tabstoretop=$("div.tab-container").height()-pxInt($(".tabstore").css("border-width"))/2;
                
                tabstorewidth = storeWidthVal; 
                tabstoreleft=$(window).width()-tabstorewidth;
                $("div.tabstore").css({"left":tabstoreleft,"top":tabstoretop,"width":tabstorewidth,"z-index":10,"height":0,"display":"block"}).stop().animate({opacity:0},0).stop().animate({opacity:0.84,top:"+="+(pxInt($(".tabstore").css("border-width"))/2-1)},"fast");
                for(var i=0;i<count-tabnumlimit;i++){
                    if($("ul.tab-links li.tab:last").hasClass("active")){
                        $("ul.tab-links li.tab:last").prev().addClass("active").siblings().removeClass("active");
                        activeid=$("ul.tab-links li.tab:last").prev().children("a").attr("id")
                    }
                    $("ul.tab-links li.tab:last").removeClass("tab").addClass("storedtab").children("a").removeClass("object").addClass("storedobj").parent("li").prependTo("div.tabstore > ul");
                    
                    $("ul li.storedtab:first").css({"display":"none"});
                    
                    if($(".tabstore").hasClass("opened")==true){
                        var tabstoreheight=(1.125*(count-tabnumlimit)+2);
                        if(tabstoreheight*16<=maxtabstoreheight){
                            $("div.tabstore").stop().animate({height:tabstoreheight+"em"},{duration:200});
                        }
                        else{
                            $("div.tabstore").css({"overflow-y":"auto","overflow-x":"hidden"});
                        }       
                        $("ul li.storedtab:first").css({"display":"block"});
                    }
                }
                leftval.splice(tabnumlimit,count-tabnumlimit);
                
                size=tabnumlimit;
            }
        }
        if($(".tabstore").length==1){
            tabstoretop=$("div.tab-container").height()-pxInt($(".tabstore").css("border-width"))/2;
            
            tabstorewidth =storeWidthVal 
            tabstoreleft=$(window).width()-tabstorewidth;
            $("div.tabstore").css({"left":tabstoreleft,"top":($("div.tab-container").height()-1),"width":tabstorewidth});
        }
        
        
        for(var i=0;i<size;i++){
            $(".tab-links li").eq(i).css({left:leftval[i]});
        }
        $(".storebutton").val(count-tabnumlimit);
        $(".lang select").val(extToLang[tabext[activeid]]);
        setLang(extToLang[tabext[activeid]]);
        editor.getSession().setUseWrapMode(false);   
        editor.getSession().setUseWrapMode(true);
    }
    $(window).on("resize",function(e){
        resizeOver();    

    });
    var rightlim=$("div.tab-container").width()-16-19.5-$("div.menu").width();
    var leftlim=17;
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

        
        
        $(this).parent("li").addClass("drag").css({"z-index":1});
        index=$(".drag").index();
        
        var difference=0;
        var limit=pxInt($("li.drag").css("left"));
        curr=leftval[index];
        

        if(index+1<size){
            next=leftval[index+1];
            difference=next-curr;
        }
        if(index>0){
            prev=leftval[index-1];
            difference=curr-prev;
        }
        
        var leftMouse=leftval[index] +pxInt($("div.tabs").css("left")) - e.pageX+5 ;
        
        
        $(document).on("mousemove",document,function(e){
            var currleft=pxInt($("li.drag").css("left"));
            if((index+1)<size){
                if(difference-(next-currleft)>=difference*0.52){
                    
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
                    
                    
                }
            }
            if(index>0){
                if(difference-(currleft-prev)>=difference*0.52){
                    
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
                    
                    
                }
            }
            
            var moveX=e.pageX+leftMouse;

            var extramove;
            var pre,post;
            if(limit>leftlim && limit<rightlim){
                $("li.drag").offset({left:moveX});
                lastmoveX=moveX;
                
                limit=pxInt($("li.drag").css("left"));
                
                
                
            }
            else if(limit<=leftlim){
                $("li.drag").stop().animate({
                    left:leftlim
                },{
                    duration:200,
                start: function(){
                    pre=pxInt($("li.drag").css("left"));
                    
                }});
                
                
                if(lastmoveX<=moveX){
                    
                    extramove=leftlim-pre;
                    
                    limit=leftlim+1;
                    $("li.drag").stop().offset({left:(moveX+extramove)});
                    
                    
                }
                
            }
            else if(limit>=rightlim){
                $("li.drag").stop().animate({
                    left:rightlim
                },{
                    duration:200,
                start: function(){
                    pre=pxInt($("li.drag").css("left"));
                    
                }});
                if(lastmoveX>=moveX){
                    extramove=pre-rightlim;
                    
                    limit=rightlim-1;
                    $("li.drag").stop().offset({left:(moveX)}); 
                }
            }
            
            e.preventDefault();
        });
        e.preventDefault();
        
    });
    $(document).on("mouseup",document,function(e){
        $(".drag").removeClass("drag");
        var enditem=$(".tab-links li").eq(index);
        
        
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
