/*window.onload=function(){
    var oHeader= document.getElementById('header');
    document.onscroll=function(){
        var nTop = document.body.scrollTop; 
        oHeader.style.top = nTop+"px";
        alert(x);
    }
}*/
/*window.addEventListener("touchmove",function(e){e.preventDefault();},false);*/
/*window.onload   = function(){
    var el;
    if (typeof($) != 'undefined') {
        console.log('jquery exists');
        el = $('.abc');
        for (o in el) {
            var myScroll = new iScroll(el[o],{useTransform:true});
        }
        
    }
//console.log(document.getElementById("content"));
    
//var myScroll = new iScroll(el,{useTransform:true});
}*/
/*
$(document).bind('pageinit', function(){
                 console.log('');
                 var el = $.mobile.activePage;
                 console.log(typeof(el));
                 console.log(el);
                 });
$(document).bind('pageshow', function(){
                 console.log('pageshow');
                 var el = $.mobile.activePage;
                 console.log(typeof(el));
                 console.log(el);
                 });
$(document).bind('pagechange', function(){
                 console.log('pagechange');
                 var el = $.mobile.activePage;
                 console.log(typeof(el));
                 console.log(el);
                 });
$(document).bind('pageload', function(){
                 console.log('pageload');
                 var el = $.mobile.activePage;
                 console.log(typeof(el));
                 console.log(el);
                 });
$(document).bind('pageremove', function(){
                 console.log('pageremove');
                 var el = $.mobile.activePage;
                 console.log(typeof(el));
                 console.log(el);
                 });

*/


/*$(document).bind('pageshow', function(){
                 console.log('init page');
                 var el = $.mobile.activePage[0];
                 console.log(">>"+typeof(el));
                  myScroll = new iScroll(el,{useTransform:true});
                 });*/
/*$(document).bind('pageinit', function(){
                 console.log('init page');
                 });*/
/*var myScroll;
$(document).ready(function loaded(){
                  myScroll = new iScroll('content');
                  });
$(document).ready.addEventListener("touchmove",function(e){e.preventDefault();},false);
$(document).ready.addEventListener("DOMContentLoaded",loaded,false);*/
window.addEventListener("touchmove",function(e){e.preventDefault();},false);
//document.addEventListener("DOMContentLoaded",loaded,false);
window.onload= x;
//$.mobile.activePage();
var iscrollList = [];
function x(){
var myScroll = new iScroll("content",{useTransform:true});
// var myScroll2 = new iScroll("content2",{useTransform:true});
$(':jqmData(role="page")').die('pageshow').live('pageshow',function(){
    var currentPage = $(this);
    var contentID = currentPage.find('.iscroll').attr('id');
    if(iscrollList[contentID]!=null&&iscrollList[contentID] instanceof iScroll){
        iscrollList[contentID].destroy();
        iscrollList[contentID] = null;
    }
    iscrollList[contentID] = new iScroll(contentID,{useTransform:true,
    onBeforeScrollStart: function (e) { 
    var target = e.target; 
    while (target.nodeType != 1) {target = target.parentNode;} 
    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') 
    {e.preventDefault();}
    }});
});

    
 
}
