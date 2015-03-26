/*!
 * jQuery casement calculator plugin
 * 
 * Required
 *  tabs extender like https://gist.github.com/MrSwed/4246691aa788058a9934
 */

$.fn.extend ({
 "calculator" : function(p){
  return this.each(function() {
   var _t=this;
   p=$.extend({},{
    "tabs": ".tabs",
    "params": ".parameters",
    "type": ".template .type",
    "template": ".template",
    "preview": ".preview",
    "sizes":".sizes",
    "data": false, // need data
    "texts" : {warning:""}, // set warning for understanding approximate calculation
    "control":[
     function(o){ //#windows
      _t._log(1,"init windows control at ", o.index(), o);
      var $type = $(_t._p.type,o);
      if (!$type.size()) {
       // use template or create new
       (($(_t._p.type,_t).size() || $(_t._p.type,_t).closest(_t._p.template).size()) && ($type = $(_t._p.type,_t).clone().appendTo(o))) 
        || ($type = $("<div/>").addClass($type.class()).appendTo(o));
      }
      var $tg = $(".casement",$type);
      $tg.size() || ($tg = $("<div/>").addClass($tg.class()).appendTo($type));
      $tg.html();
      $.each(_t._p.data[o.index()].data, function (id, gr) {
       var $gr = $("<div/>").addClass("group")
            .attr("title",gr.title)
            .appendTo($tg);
       var $gv = $("<div/>").addClass("variants").appendTo($gr);
        $.each(gr.group, function (id, item) {
         $("<a>").prop({"href":item.image})
          .append($("<img/>").attr({"src":item.preview,"alt":item.title,"title":item.title})
          .load(function () {
           _t._log(1,"loaded ", this, this.width, $gr.width());
           if ($gr.width() < this.width) $gr.width(this.width + ($gv.outerWidth()-$gv.width()));
          })).appendTo($gv)
          .on("init click", function (e) {
           e.preventDefault();
           var $a = $(this);
           var $i = $a.find("[src]");
           _t._log(2,"Img triggered ",e.type, $i, e);
           $a.addClass("selected").siblings().removeClass("selected");
           if (e.type == "click") {
            _t._log(2,"Clicked", $a);
            $tg.find(".variants >*").removeClass("active");
            $a.addClass("active");
            _t.preview({"src":$a.attr("href"),"alt": $i.attr("alt"),"title": $i.attr("title")});
            _t._sizes();
           }
          })
        });
       $("img:first",$gv).trigger("init");
      });
      $("img:first",o).trigger("click");
      return o;
     },
     function(o){ // #balcony
      _t._log(2,"init balcony control at", o.index(), o);
      return o;
     }
    ]
   },p);
   _t._p = p;
   _t._log = function(d){
    if (arguments.length === 0) return;
    var args = [];
    Array.prototype.push.apply( args, arguments );
    $.isNumeric(d) && args.shift() || ( d=false );
    _t._p.debug && (!d || _t._p.debug <= d) && console.dir(args);
    return _t;
   };
   _t.init = function(p) {
    p = {} || p;
    _t._log(1,"_init");
    $.each("tabs,params".split(","), function (i, k) {
     _t._log(1,"Params to $", i, k, _t._p[k]);
     switch (true) {
      case typeof _t._p[k] == "string":
       _t._p[k] = $(_t._p[k], _t);
       _t._p[k].size() || (_t._p[k] = $('<div/>').addClass(_t._p[k].class()).prependTo(_t));
       _t._log(2,"Param inited:", k, _t._p[k]);
       break;
     }
    });
    $(_t.tabs("init")).tabs();
    if (_t._p.texts && _t._p.texts.warning) {
     $(_t._p.warning=$(".warning", _t._p.params)).size() || 
        (_t._p.warning = $("<div/>").addClass("warning")
            .html(_t._p.texts.warning).appendTo(_t._p.params));
     _t._log(1,"Init warning: ",_t._p.texts.warning);
    }
    return _t;
   };
   _t._err = function(m) {console.log(m)||alert(m); };
   _t.tabs = function(p){
    var $t = $(_t._p.tabs);
    switch (true) {
     case p=="init":
      var $tH = $(".headers",$t);
      var $tC = $(".contents",$t);
      $tH.size() || ($tH = $("<div>").addClass($tH.class()).appendTo($t));
      $tC.size() || ($tC = $("<div>").addClass($tC.class()).appendTo($t));
      (_t._p.data && $.each(_t._p.data, function(i,k){
       _t._log(1,"Tab init: ",i +" = ",k);
       if ($.isNumeric(i)){
        // check or add header tabs and it contents
        var $tHi=$("[href*='"+ k.alias+"']",$tH);
        $tHi.size() || ($tHi = $("<a>").attr({"href": location.pathname+k.alias}).text(k.name).appendTo($tH));
        var $tCi=$(">*",$tC).eq(i);
        $tCi.size() || ($tCi = $("<div>").appendTo($tC)).addClass(k.alias.replace("#",""));
        // init control function for tab content
        (!k.function && typeof _t._p.control[i]=="function" && (k.function = _t._p.control[i])) || 
         (typeof k.function == "string" && typeof _t._p.control[k.function]=="function" && (k.function = _t._p.control[k.function])); 
        (typeof k.function == "function" && k.function($tCi)) || _t._err("Control function error for "+ k.alias);
       }
      })) || _t._err("data error");
      break;
    }
    return $t.tabs();
   };
   _t.preview = function(p){
    p = $.extend({},{"alt":"","src":"","title":""},p);
    var $t = $(_t._p.preview);
    $t.size() || ($t = $("<div/>").addClass($t.class()).appendTo(_t));
    var $a = $("a",$t);
    $a.size() || ($a = $("<a/>").appendTo($t));
    $a.attr({"href": p.href || p.src, "title": p.title,"target":"_blank"});
    if (typeof $.fancybox=="function") $a.fancybox();
    var $i = $("img",$a);
    $i.size() || ($i = $("<img/>").appendTo($a));
    $i.attr(p);
    _t._log(1,"Preview inited: ",$t,$a,$i);
    return $t;
   };
   _t._sizes = function(p) {
    var llevel=1;
    _t._log(llevel+1,"Sizes: call ",p);
    var $t = $(_t._p.sizes);
    if (!p && !_t._sizesInited) {
     _t._log(llevel+1,"Sizes: First init");
     return _t._sizes("init");
    }
    switch (p) {
     case "init":
      $t.size() || (($t = $("<div/>").addClass($t.class()).appendTo(_t)) || _t._log(llevel,"Create Sizes",$t));
      var $s={"h":"height","w":"width"};
      $.each($s,function(i,v){
       $s[i] = $("[name='"+v+"']",$t);
       $s[i].size() || ($s[i] = $("<input/>").attr({"name":$s[i].name()}).appendTo($t));
       $s[i].parent().is("label") || $s[i].wrap('<label class="'+v+'"/>');
       $s[i].attr("type","slider");
       $( "<div class='slider'></div>" ).insertAfter( $s[i] ).slider({
        orientation: i=="h"?"vertical":"horizontal",
        min: 1,
        max: 6,
        range: "min",
        value: $s[i].val(),
        slide: function( event, ui ) {
         $s[i].val(ui.value);
        }
       });
       $s[i].change(function(e) {
        _t._log(llevel+2, e.type+" trggered",$(this),"for slider:",$(this).siblings(".slider"));
        $(this).siblings(".slider").slider( "value", $(this).val() );
       });
      });
      _t._log(llevel,"Sizes inited",$t,"Inputs: ",$s);
      _t._sizesInited = true;
     break;
    }
    return _t;
   };
   _t.init();
  });
 }
});

