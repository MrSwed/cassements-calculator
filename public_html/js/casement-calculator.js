/*!
 * jQuery casement calculator plugin
 *
 * Required
 *  tabs extender like https://gist.github.com/MrSwed/4246691aa788058a9934
 *  jQuery class extender https://gist.github.com/MrSwed/0a837b3acbfbf8cfb19e
 */
$.fn.extend ({
 "calculator" : function(p){
  return this.each(function() {
   var _t=this;
   p=$.extend({},{
    "tabs": ".tabs",
    "params": ".parameters",
    "type": ".type",
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
      _t._log(3,"init windows control at ", o.index(), o);
      var $type = _t._type(o);
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
            _t.preview({"src":$a.attr("href"),"alt": $i.attr("alt"),"title": $i.attr("title")});
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
      var $type = _t._type(o);
      var $tg = $(".casesets",$type);
      $tg.size() || ($tg = $("<div/>").addClass($tg.class()).appendTo($type));
      $tg.html();
      $.each(_t._p.data[o.index()].data, function (id, item) {
       $("<a>").prop({"href":item.image})
        .append($("<img/>").attr({"src":item.preview,"alt":item.title,"title":(_t._debug(3)?id+": ":'')+item.title}))
         .appendTo($tg)
         .on("init click", function (e) {
          e.preventDefault();
          var $a = $(this);
          var $i = $a.find("[src]");
          _t._log(2, "Img triggered ", e.type, $i, e);
          if (e.type == "click") {
           _t._log(2, "Clicked", $a);
           $a.addClass("active").siblings().removeClass("active");
           _t.preview({"src": $a.attr("href"), "alt": $i.attr("alt"), "title": $i.attr("title")});
           _t._val(_t._p.form.id, id);
           _t._sizes();
          }
         });
      });
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
    _t._log(1,"init");
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
    $(_t).on("change","[name]",function(e){
     var _r = _t._calc();
     _t._val("price",_r);
     _t._p.price && $(_t._p.price).html(number_format(_r,0));
     _t._log(2,"Change triggered at :",e,"result "+_r,"Target: ",_t._p.price);
    });
    $(".radio:has([type='radio'])",_t).filter(":not(:has([type='radio']:checked))").each(function(){
      $("[type='radio']:first",this).attr("checked",true);
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
   _t._type = function(o) {
    var $type = $(_t._p.type,o);
    if (!$type.size()) {
     // use template or create new
     ($(_t._p.template,_t).find(_t._p.type).size() && ($type = $(_t._p.template,_t).find(_t._p.type).clone().appendTo(o)))
      || ($type = $("<div/>").addClass($type.class()).appendTo(o));
    }
    return $type;
   };
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
      return $t.on("change",function(e,p){
       var $active = $(".headers .active",this).index();
       var $type = _t._type($(".contents >* ",this).eq($active));
       var $a = $("a.active",$type);
       $a.size() || ($a = $("a:first",$type));
       $a.trigger("click");
       _t._log(2,"Tabs changed (this, e,p,$type,$a)",this,e,p,$type,$a);
      }).tabs({"headers":$tH,"contents":$tC});
      break;
     case p=="opened":
      _t._log(1,"Tabs opened",$(".active",_t._p.tabs).index());
      return $(".active",_t._p.tabs).index();
      break;
    }
    return $t;
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
   _t._initDimension = function(p){
    var dlevel = 2;
    p = $.extend({},{
     // обязательные параметры
     "obj":false,
     "name":"",
     "minmax":[],
     "orientation":"horizontal",
     //"caption":"",
     //"step":false
     "value":false
    },p);
    if (!(p.obj && p.name && typeof p.minmax=="object")) {
     _t._err("_initDimension: Parameters error ");
     return;
    }
    var _s = $("[name='"+ p.name+"']", p.obj);
    _s.size() || (_s = $("<input/>").attr({"name":_s.name()}).prependTo(p.obj));
    _s.val() || (p.value && _s.val(p.value));
    _s.parent().is("label") || _s.wrap('<label class="'+ p.name+'"/>');
    _s.prev().size() || (p.caption && $('<span>'+p.caption+'</span>').insertBefore(_s));
    _s.attr("type","slider");
    // check and set defaults for slider
    _t._log(dlevel+1,"_initDimension (p):",p);
    $( "<div class='slider'></div>" ).insertAfter( _s )
     .slider({
      orientation: p.orientation,
      min: p.minmax.min,
      max: p.minmax.max,
      range: "min",
      step: parseInt(p.step),
      value: _s.val(),
      slide: function( event, ui ) {_s.val(ui.value).trigger("change");}
     });
    _s.on("change",function(e) {
     _t._log(dlevel+2, e.type+" triggered",$(this),"for slider:",$(this).siblings(".slider"));
     $(this).siblings(".slider").slider( "value", $(this).val() );
    });
    return _s;
   };
   _t._sizes = function(p) {
    // инициализация выбора размеров
    var dlevel=1;
    var $t = $(_t._p.sizes);
    var _d=_t._data(_t._val(_t._p.form.id));
    _t._log(dlevel+1,"Sizes: call ",p,"Data",_d);
    $t.size() || (($t = $("<div/>").addClass($t.class()).appendTo(_t)) || _t._log(dlevel,"Create Sizes",$t));
    $t.html("");
    var $s={"w":"width","h":"height"};
    var tabI = _t._tabs("opened");
    switch (typeof _d.data) {
     case "object":
      //var colsT = ["alias","name","dimensions","input"];
      var cols=_t._p.data[tabI].cols;
      $.each(cols,function(i,item){
       // определение колонок данных для ширины и высоты
        $.each(item,function(k,v){
         if (!parseInt(i)) { // первая строка (i=0) содержит алиасы
          // значения в соотв алиасу массив
          (cols._index || (cols._index={})) && (cols._index[v]=k);
         } else {
         (cols[cols[0][k]] || (cols[cols[0][k]]=[])) && (cols[cols[0][k]][i-1]=v);
         _t._log(dlevel,"cols[]= ",tabI,i,k,cols[0][k], "value: "+v);
         }
        });
      });
      _t._log(dlevel+1,"Sizes Data:",_t._val(_t._p.form.id),_d,"Tab: ",tabI,_t._p.data[tabI],cols);
      $.each($s,function(i,v){
       // определяем поля ввода и слайдеры для каждого измерения 
       _d.atad || (_d.atad={});
       if (!_d.atad[i]) _d.atad[i] = _t._getDataCol(_d.data,cols._index[i]);
       var _dCol = _d.atad[i];
       $s[i]=_t._initDimension({
            "obj":$t,
            "name":v,
            "minmax":_t._minmax(_dCol),
            "orientation":v=="height"?"vertical":"horizontal",
            "caption":cols[i][0]+', '+cols[i][1],
            "step":parseInt(_t._p._ref.step),
            "value":_dCol[Math.round(_dCol.length/2)]
           });
      });
      _t._log(dlevel,"Sizes inited",$t,"Inputs: ",$s,"data",_d);
     break;
     case "string":
     break;
    }
    $("input:first",$t).trigger("change");
    return _t;
   };
   _t._data = function(p,data,grKey,deep) {
    // получение и кеширование данных по идентификатору
    var dlevel=2;
    var _result;
    data = data  || _t._p.data;
    if (data._index && data._index[p]) return data._index[p]; // cache
    grKey = grKey?grKey:"data,group";
    grKey = typeof grKey!="object"?grKey.split(","):grKey;
    _result=false;
    _t._log(dlevel, "Get Data", p, data, deep);
     switch (true) {
      case $.isNumeric(p): // return last level data
       if (typeof data[p] !== "undefined") return data[p]; // end recursion
       $.each(data, function (i, item) {
        _t._log(dlevel, "Get Data: check item ", i, item, deep);
        if (typeof item == "object") {
         for (var k in grKey) {
          if (item[grKey[k]]) {
           _t._log(dlevel, "Get Data: recursion in '" + grKey[k] + "':  ", i, item[grKey[k]], deep);
           if (_result = _t._data(p, item[grKey[k]], grKey, deep ? deep + 1 : 1)) {
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
   _t._getRange = function(v,ar) { for (var i = 1;i<ar.length;i++) if (ar[i-1] <= v && v < ar[i]) return [i-1,i];};
   _t._flFix = function(v,d) {
    d = d || 10;
    _t._log(2,"flFix",v,d);
    v = parseFloat(v);
    return !isNaN(v)?parseFloat(v.toFixed(d)):0;
   };
   _t._calcToMatch = function(Bval,BScope,SScope){
    // получение соответствующего значения из искомого диапазона SScope  (цены)
    // на основе известной точки Bvsl заданного диапазона BScope (площадь)
    var _scope = _t._getRange(Bval,BScope);                                          // определение точек, между которыми находится определяющее значение
    var _range = _t._flFix(BScope[_scope[1]] - BScope[_scope[0]]);                   // определение диапазона между заданными точками
    var _c = {
     "BDelta"       : _t._flFix(Bval - BScope[_scope[0]]),                           // разница между минимальной точкой и текущим значением
     "first"        : _t._flFix(SScope[_scope[0]]),                                  // Значения точек, соотв первое и последнее в найденом диапазоне
     "last"         : _t._flFix(SScope[_scope[1]]),
     "IDelta"       : SScope[_scope[1]] - SScope[_scope[0]],                         // Длина диапазона в котором ищем значение (для отладки)
     "IDelta_range" : _t._flFix(( SScope[_scope[1]] - SScope[_scope[0]] ) / _range)  // шаг соответственно известному диапазону 
    };
    _c.result = _c.first + (_c.BDelta * _c.IDelta_range);                            // искомое значение в нужном диапазоне
    _t._log(2,"_calcToMatch (Bval,BScope,SScope,_scope,_range,_c)",Bval,BScope,SScope,_scope,_range,_c);
    return _c.result;
   };
   _t._calc = function() {
    var dlevel = 3;
    var f = $("[name]", _t);
    var _d = _t._data(_t._val(_t._p.form.id));
    var _ref = _t._p._ref.price;
    var _result = 0;
    var fData = f.serializeObject();
    var tabI = _t._tabs("opened");
    var L = _t._flFix((1*fData.width + 1*fData.height) * 0.002);
    switch (typeof _d.data) {
     case "object":
      var S = _t._flFix((fData.width/1000) *(fData.height/1000));
      if (!_d.atad.area) {
       _d.atad.area = [];
       for (var k in _d.atad.w) _d.atad.area[k] = _t._flFix((_d.atad.w[k] / 1000 ) * (_d.atad.h[k] / 1000 ));
      }
      _d.atad['price['+fData.system+']'] || (_d.atad['price['+fData.system+']'] = _t._getDataCol(_d.data,_t._p.data[tabI].cols._index['price['+fData.system+']']));
      _d.atad['kit['+fData.kit+']'] || (_d.atad['kit['+fData.kit+']'] = _t._getDataCol(_d.data,_t._p.data[tabI].cols._index['kit['+fData.kit+']']));
      var _cAr = {
       "baseprice" : _d.atad['price['+fData.system+']'],
       "kitprice"  : _d.atad['kit['+fData.kit+']']
      };
      var _c = {};
      var _cI;
      for (var k in _cAr)
       if ((_cI=$.inArray(S,_d.atad.area)) > 0) {
       // get predefined values
        _c[k] = _t._flFix(_cAr[k][_cI]);
       } else {
       // calculate shifts
        _c[k]= _t._calcToMatch(S,_d.atad.area,_cAr[k]);
       }
      _c.montage = fData.montage==1?_t._flFix(S * _ref["montage"].base ):0;
      _c.montage_kit = fData.montage==1?_t._flFix(L * _ref["montage"].kit[fData.kit] ):0;
 // Price = _c.baseprice + (kit?_c[kit[<selected}]]:0) + (montage? _ref[montage]*S + (kit[panel]?_ref[montage][panel]*L:0) :0)
      _result = _c.baseprice + _c.kitprice + _c.montage + _c.montage_kit;
      _t._log(dlevel," Calc by data (S,L,_cI,_cAr,_c)",S,L,_cI,_cAr,_c);
      break;
     case "string":
      _t._log(dlevel," Calc by group");
      break;
    }
    _t._log(dlevel,"Calc ("+_t._counts("_calc",1 + _t._counts("_calc")).toString()+"): ",
        "form data:",fData,"data",_d.data);
    return _result;
   };
   _t._counts = function(n,v) {
    // для отладки. посчет вызова функции n, например _t._counts("_calc",1 + _t._counts("_calc")
    _t.$counts || (_t.$counts = {});
    v = typeof v!="undefined"? v : parseInt(_t.$counts[n]) || 0 ;
    _t.$counts[n] = parseInt(v) || 0;
    return v;
   };
   _t._getDataCol = function(data,c) {
    // Получить колонку значений из матрицы
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
  });
 }
});
