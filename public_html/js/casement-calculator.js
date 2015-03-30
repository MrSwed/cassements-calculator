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
    "reference":{}, // prices for service, step of slider, important message, etc 
    "form":{"id":"id","w":"width","h":"height","price":"price"},
    "price":$(".price",_t), // price output     
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
            .attr("title",(_t._debug(3)?id+": ":'')+gr.title)
            .appendTo($tg);
       var $gv = $("<div/>").addClass("variants").appendTo($gr);
        $.each(gr.group, function (id, item) {
         $("<a>").prop({"href":item.image})
          .append($("<img/>").attr({"src":item.preview,"alt":item.title,"title":(_t._debug(3)?id+": ":'')+item.title})
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
            _t.preview({"src":$a.attr("href"),"alt": $i.attr("alt"),"title": (_t._debug(3)?id+": ":'')+$i.attr("title")});
            _t._val(_t._p.form.id,id);
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
   // short aliaces
   p._ref = p.reference;
   _t._p = p;
   _t._debug = function(d) {return _t._p.debug && (!d || _t._p.debug <= d)};
   _t._log = function(d){
    if (arguments.length === 0) return;
    var args = [];
    Array.prototype.push.apply( args, arguments );
    $.isNumeric(d) && args.shift() || ( d=false );
    _t._debug(d) && console.dir(args);
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
    _t._tabs("init");
    if (_t._p.texts && _t._p.texts.warning) {
     $(_t._p.warning=$(".warning", _t._p.params)).size() || 
        (_t._p.warning = $("<div/>").addClass("warning")
            .html(_t._p.texts.warning).appendTo(_t._p.params));
     _t._log(1,"Init warning: ",_t._p.texts.warning);
    }
    $.each(_t._p.form,function(a,item){
     var v = item.value || "";
     var n = item.name || item.toString();
     var i = $("[name='"+n+"']",_t);
     i.size() || (i = $("<input/>").attr({"type":"hidden","name":n,"value":v}).appendTo(_t));
     _t._p.form[a] = i;
    });
    return _t;
   };
   _t._val = function(n,v) {
    var i;
    i = typeof n=="object"?n:((i=$("[name='"+_t._p.form[n.toString()]+"']")).size()?i:$("[name='"+n.toString()+"']",_t));
    _t._log(2,"_val ",n,i,v);
    (!v && (v = i.val())) || i.val(v);
    return v ;
   };
   _t._err = function(m) {console.log(m)||alert(m); };
   _t._tabs = function(p){
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
     case p=="opened":
      _t._log(2,"Tabs opened",$(".active",_t._p.tabs).index());
      return $(".active",_t._p.tabs).index();
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
    var dlevel=1;
    var $t = $(_t._p.sizes);
    var _d=_t._data(_t._val(_t._p.form.id));
    _t._log(dlevel+1,"Sizes: call ",p,"Data",_d);
    switch (true) {
     case !!_d.data:
      $t.size() || (($t = $("<div/>").addClass($t.class()).appendTo(_t)) || _t._log(dlevel,"Create Sizes",$t));
      $t.html("");
      var $s={"w":"width","h":"height"};
      var tabI = _t._tabs("opened");
      //var colsT = ["alias","name","dimensions","input"];
      var cols=_t._p.data[tabI].cols;
      $.each(cols,function(i,item){
        $.each(item,function(k,v){
         if (!parseInt(i)) { // first - aliaces
          (cols._index || (cols._index={})) && (cols._index[v]=k);
         } else {
         (cols[cols[0][k]] || (cols[cols[0][k]]=[])) && (cols[cols[0][k]][i-1]=v);
         _t._log(dlevel,"cols[]= ",tabI,i,k,cols[0][k], "value: "+v);
         }
        });
      });
      _t._log(dlevel+1,"Sizes Data:",_t._val(_t._p.form.id),_d,"Tab: ",tabI,_t._p.data[tabI],cols);
      $.each($s,function(i,v){
       _d.atad || (_d.atad={});
       if (!_d.atad[i]) _d.atad[i] = _t._getDataCol(_d.data,cols._index[i]);
       var _dCol = _d.atad[i];
       var _mnx = _t._minmax(_dCol);
       var _s = $("[name='"+v+"']",$t);
       _s.size() || (_s = $("<input/>").attr({"name":_s.name()}).prependTo($t));
       _s.val() || _s.val(_dCol[Math.round(_dCol.length/2)]);
       _s.parent().is("label") || _s.wrap('<label class="'+v+'"/>');
       _s.prev().size() || $('<span>'+cols[i][0]+', '+cols[i][1]+'</span>').insertBefore(_s);
       _s.attr("type","slider");
       // check and set defaults for slider
       _t._log(2,"test tootls (i,v,cols,cols.index,_dCol,_mnx):",i,v,cols,cols._index[i],_dCol,_mnx);
       $( "<div class='slider'></div>" ).insertAfter( _s )
        .slider({
         orientation: i=="h"?"vertical":"horizontal",
         min: _mnx.min,
         max: _mnx.max,
         range: "min",
         step: parseInt(_t._p._ref.step),
         value: _s.val(),
         slide: function( event, ui ) {
          _s.val(ui.value).trigger("change");
          _t._log(2,"Slided",tabI);
         }
        });
       _s.on("change",function(e) {
        _t._log(dlevel+2, e.type+" trggered",$(this),"for slider:",$(this).siblings(".slider"));
        $(this).siblings(".slider").slider( "value", $(this).val() );
       });
       $s[i] = _s;
      });
      _t._log(dlevel,"Sizes inited",$t,"Inputs: ",$s,"data",_d);
     break;
     case !!_d.group:
     break;
    }
    return _t;
   };
   _t._data = function(p,data,grKey,deep) {
    var dlevel=2;
    var _result;
    data = data  || _t._p.data;
    if (data._index && data._index[p]) return data._index[p]; // cache
    grKey = grKey?grKey:"data,group";
    grKey = typeof grKey!="object"?grKey.split(","):grKey;
    _result=false;
   _t._log(dlevel,"Get Data",p,data,deep);
     switch (true) {
      case $.isNumeric(p): // return last level data
          if (typeof data[p]!=="undefined") return data[p]; // end recursion
          $.each(data,function(i,item){
           _t._log(dlevel,"Get Data: check item ",i,item,deep);
           if (typeof item=="object") {
            for (k in grKey) {
             if (item[grKey[k]]) {
             _t._log(dlevel,"Get Data: recursion in '"+grKey[k]+"':  ",i,item[grKey[k]],deep);
              if (_result = _t._data(p, item[grKey[k]],grKey,deep?deep+1:1)) {
               return false;
              }
             }
            }
           }  
          });
      break;
     }
    if (!deep) {
     data._index || (data._index={});
     data._index[p]=_result;
    }
    return _result;
   };
   _t._getRange = function(v,ar) {
     for (var i = 1;i<ar.length;i++) 
      if (ar[i-1] < v && v < ar[i]) return [i-1,i];
   };
   _t._calc = function() {
    var dlevel = 3;
    var f = $("[name]", _t);
    var _d = _t._data(_t._val(_t._p.form.id));
    if (!_d.atad.area) {
     _d.atad.area=[];
     for (var k in _d.atad.w) _d.atad.area[k] = (_d.atad.w[k] / 1000 ) * (_d.atad.w[k] / 1000 );
    }
    var _result = 0;
    switch (true) {
     case !!_d.data:
      _t._log(2," Calc by data");
      var _prCol;
      var S = (_t._val(_t._p.form.w)/1000) *(_t._val(_t._p.form.h)/1000);
      
      var _Srange = {};
      //while ()
      _result = S;
      break;
     case _d.group:
      _t._log(2," Calc by group");
      break;
    }

    _t._log(dlevel,"Calc ("+_t._counts("_calc",1 + _t._counts("_calc")).toString()+"): ",
        "from data:",f.serializeObject(),"data",_d.data);
    return _result;
   };
   _t._counts = function(n,v) {
    _t.$counts || (_t.$counts = {});
    v = typeof v!="undefined"? v : parseInt(_t.$counts[n]) || 0 ;
    _t.$counts[n] = parseInt(v) || 0;
    return v;
   };
   _t._getDataCol = function(data,c) {
    c!=null || (c=0);
    var ar=[];
    for (var i in data) ar.push(data[i][c]);
    _t._log(2,"_getDataCol ("+_t._counts("_getDataCol",1 + _t._counts("_getDataCol")).toString()+") (data,c,ar): ",data,c,ar);
    return ar;
   };

   _t._minmax = function(ar,c) {
     return {"max":Math.max.apply(null, ar),"min":Math.min.apply(null, ar)};
   };

   _t.init();
   $("[name]",_t).on("change",function(e){
    var _r = _t._calc();
    _t._val("price",_r);
    _t._p.price && $(_t._p.price).html(number_format(_r));
    _t._log(2,"Change triggered at :",e,"result "+_r,"Target: ",_t._p.price);
   });
  });
 }
});

