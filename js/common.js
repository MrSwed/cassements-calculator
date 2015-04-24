function number_format( num, decimals, dec_point, thousands_sep, hide_null ) {
 if (num && typeof num == "string") num = num.replace(/ /g,"");
 if (hide_null && !parseInt(num)) return "";
 var i, j, kw, kd, km, minus = "";
 if(num < 0){
  minus = "-";
  num = num*-1;
 }
 if( isNaN(decimals = Math.abs(decimals)) ){
  decimals = 2;
 }
 if( dec_point == undefined ){
  dec_point = ".";
 }
 if( thousands_sep == undefined ){
  thousands_sep = " ";
 }
 i = parseInt(num = (+num || 0).toFixed(decimals)) + "";
 if( (j = i.length) > 3 ){
  j = j % 3;
 } else{
  j = 0;
 }
 km = (j ? i.substr(0, j) + thousands_sep : "");
 kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
 //kd = (decimals ? dec_point + Math.abs(num - i).toFixed(decimals).slice(2) : "");
 kd = (decimals ? dec_point + Math.abs(num - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
 return minus + km + kw + kd;
}

if (typeof jQuery == "function") {
$(function(){

 $.fn.extend({
  "class": function() {
   return $(this).attr("class") || $(this).selector.toString().replace(/^.*[\s]+([^\s])/,"$1").replace(/(^[^\.]+\.|[:].+$)/g,"").split(".").join(" ").trim(); 
  },
  "name": function() {
   return $(this).attr("name") || (($m = $(this).selector.match(/^.*\[name=['"]*([^'"]+)['"]*\].*$/,"$1")) && $m[1]);
  },
  "modal" : function(cm,p) {
   if (!cm) cm = "init";
   var o = $(this);
   p = $.extend({},{debug:false,"afterOpen":false,"afterClose":false},p);
   if (cm!="init" && !o.data("inited")) o.modal("init",p);
   switch (cm) {
    case "init":
     $(this).each(function(){
      var o = $(this);
      p.debug && console.log("Modal inited",o);
      var cl = $(".close",o);
      if (!cl.size()) cl = $("<div class='close'>X</div>").prependTo(o);
      cl.unbind().click(function(e){
       p.debug && console.log("Modal Close button",o);
       o.modal("close",p)
      });
      o.data("inited",true);
     });
    break;
    case "open":
     p.debug && console.log("Modal Open",o);
     o.show();
     if (p.afterOpen && typeof p.afterOpen=="function") {
      p.debug && console.log("AfterOpen function ",p.afterOpen);
      o.each(p.afterOpen);
     }
    break;
    case "close":
     p.debug && console.log("Modal Close",o);
     o.hide();
     if (p.afterClose && typeof p.afterClose=="function") {
      p.debug && console.log("AfterClose function ",p.afterClose);
      o.each(p.afterClose);
     }
    break;
   }   
   return o;
  },
  "tabs" :  function(p){
    var _t=$(this);
    p= $.extend({
     "headers": $(".headers",_t),
     "contents" : $(".contents",_t),
     "active" : location.hash
     //"change":function(){}
    },p);
    p.headers.on("click",">*",function(e,init){
     e.preventDefault();
     var a=$(this);
     a.attr("href") && (
      a._hash = a.attr("href").replace(new RegExp(
      '('+location.protocol+'\/\/)?'+
      '('+location.host+')?'+
      '('+location.pathname+')', 'ig'),'')) && (
      init || (location.hash="#" + a._hash)
     ); 
     p.headers.find(">*").removeClass("active");
     a.addClass("active");
     _t.trigger("change",{"selected": a.index()});
     p.contents.find(">*").hide().eq(a.index()).show();
     (typeof p.change == "function") && _t.each(p.change);
    });
   var _active=$();
   if (p.active) {
    _active = p.headers.find(">*").filter("[href*='" + p.active + "']");
    _active.size() || (_active = p.headers.find(">*").filter("[href*='" + p.active.replace(/^#/, '') + "']"));
   } 
   _active.size() || (_active = p.headers.find(">*:first"));
   _active.size() && _active.trigger("click",[true]);
   return $(this);
   }
 });

});
}
