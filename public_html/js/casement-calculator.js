/*!
 * jQuery casement calculator plugin
 *
 * Required
 *  jQuery tabs extender like https://gist.github.com/MrSwed/4246691aa788058a9934
 *  jQuery class extender https://gist.github.com/MrSwed/0a837b3acbfbf8cfb19e
 *  jQuery unParam function https://github.com/davetayls/jquery.unparam/blob/master/jquery.unparam.js 
 */
$.fn.extend ({
 "calculator" : function(p){
  return this.each(function() {
   var _t=this;
   var dataReady = true;
   _t.p = p;
   p=$.extend({},{
    "dataUrl": false, // получить данные и справочники калькулятора ajax запросом по указанной ссылке (data,reference)
    "tabs": ".tabs",
    "params": ".parameters",
    "type": ".type",
    "template": ".template",
    "preview": ".preview",
    "sizes":".sizes",
    "reference":false, // общие цены на монтаж, шаг,  или ссылка, аналогично dataUrl 
    "data": false,  // данные кунструкций или ссылка, аналогично dataUrl 
    "form":{"id":"id","width":"width","height":"height","price":"price"},
    "price":$(".price",_t), // price output
    "texts" : {warning:""}, // set warning for understanding approximate calculation
    "control":{
     "section":function(o){ //#windows
      _t._log(3,"init windows control at ", o.index(), o);
      var $type = _t._type(o);
      var $tg = $(".casement",$type);
      $tg.size() || ($tg = $("<div/>").addClass($tg.class()).appendTo($type));
      $tg.html();
      $.each(_t._stor.data[o.index()].data, function (id, gr) {
       //_t. 
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
            _t._val(_t._stor.form.id,id);
            _t._sizes();
           }
          })
        });
       $("img:first",$gv).trigger("init");
      });
      return o;
     },
     "multiple": function(o){ // #balcony
      _t._log(2,"init balcony control at", o.index(), o);
      var $type = _t._type(o);
      var $tg = $(".casesets",$type);
      $tg.size() || ($tg = $("<div/>").addClass($tg.class()).appendTo($type));
      $tg.html();
      $.each(_t._stor.data[o.index()].data, function (id, item) {
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
           _t._val(_t._stor.form.id, id);
           _t._sizes();
          }
         });
      });
      return o;
     }
    }
   },p);
   // short aliaces
   _t._stor = p;
   _t._debug = function(d) {return _t._stor.debug && (!d || _t._stor.debug <= d)};
   _t._log = function(d){
    if (arguments.length === 0) return;
    var args = [];
    Array.prototype.push.apply( args, arguments );
    $.isNumeric(d) && args.shift() || ( d=false );
    args[0] = "("+d+"): "+args[0].toString();
    _t._debug(d) && console.dir(args);
    return _t;
   };
   _t.init = function(p) {
    p = {} || p;
    _t._log(1,"init");
    var dataKeys = "data,reference".split(",");
    if (_t._stor.dataUrl) {
     // если есть ссылка то получить данные аяксом
     _t._ajaxLeft = (_t._ajaxLeft ? _t._ajaxLeft : 0) + 1;
     var ajaxSetting = {
      dataType: "json",
      method: "post",
      url: _t._stor.dataUrl.replace(/\?.*$/, ""),
      data: _t._stor.dataUrl.replace(/^.*\?/, ""),
      success: function (response, textStatus, jqXHR) {
       _t._log(4, "_INIT: Ajax load success (_t._stor.dataUrl,response,textStatus,jqXHR)", _t._stor.dataUrl, response, textStatus, jqXHR);
       $.each(dataKeys, function (i, k) { // проверяем наличие данных для ключа
        !_t._stor[k] && response.data[k] && (_t._stor[k] = response.data[k]);
       });
       _t._stor.dataUrl = false;
       _t._ajaxLeft -= 1;
       _t._log(4, "_INIT: Ajax loaded data, reinit", response.data,  "left: " + _t._ajaxLeft, _t._stor );
       _t.init();
      }
     };
     _t._log(4, "_INIT: Ajax get data", ajaxSetting, "left: " + _t._ajaxLeft);
     $.ajax(ajaxSetting);

    }
    if (_t._ajaxLeft || _t._ajaxLeft > 0) {
     _t._log(4,"Ajax wait "+_t._ajaxLeft);
     return;
    }
    //инициализация элементов 
    $.each("tabs,params".split(","), function (i, k) {
     _t._log(1,"Params to $", i, k, _t._stor[k]);
     switch (true) {
      case typeof _t._stor[k] == "string":
       _t._stor[k] = $(_t._stor[k], _t);
       _t._stor[k].size() || (_t._stor[k] = $('<div/>').addClass(_t._stor[k].class()).prependTo(_t));
       _t._log(2,"Param inited:", k, _t._stor[k]);
       break;
     }
    });
    // обработчик событий - расчет
    $(_t).on("change","[name]",function(e){
     var _r = _t._calc();
     _t._val("price",_r);
     _t._stor.price && $(_t._stor.price).html(number_format(_r,0));
     _t._log(2,"Change triggered at :",e,"result "+_r,"Target: ",_t._stor.price);
    });
    $(".radio:has([type='radio'])",_t).filter(":not(:has([type='radio']:checked))").each(function(){
      $("[type='radio']:first",this).attr("checked",true);
    });
    if (_t._stor.texts && _t._stor.texts.warning) {
     $(_t._stor.warning=$(".warning", _t._stor.params)).size() ||
        (_t._stor.warning = $("<div/>").addClass("warning")
            .html(_t._stor.texts.warning).appendTo(_t._stor.params));
     _t._log(1,"Init warning: ",_t._stor.texts.warning);
    }
    $.each(_t._stor.form,function(a,item){
     var v = item.value || "";
     var n = item.name || item.toString();
     var i = $("[name*='"+n+"']",_t);
     i.size() || (i = $("<input/>").attr({"type":"hidden","name":n,"value":v}).appendTo(_t));
     _t._stor.form[a] = i;
    });
    _t._tabs("init");
    return _t;
   };
   _t._val = function(n,v) {
    var i;
    i = typeof n=="object"?n:((i=$("[name='"+_t._stor.form[n.toString()]+"']")).size()?i:$("[name='"+n.toString()+"']",_t));
    _t._log(2,"_val ",n,i,v);
    (!v && (v = i.val())) || i.val(v);
    return v ;
   };
   _t._err = function(m) {console.log(m)||alert(m); };
   _t._type = function(o) {
    var $type = $(_t._stor.type,o);
    if (!$type.size()) {
     // use template or create new
     ($(_t._stor.template,_t).find(_t._stor.type).size() && ($type = $(_t._stor.template,_t).find(_t._stor.type).clone().appendTo(o)))
      || ($type = $("<div/>").addClass($type.class()).appendTo(o));
    }
    return $type;
   };
   _t._tabs = function(p){
    var $t = $(_t._stor.tabs);
    switch (true) {
     case p=="init":
      var $tH = $(".headers",$t);
      var $tC = $(".contents",$t);
      $tH.size() || ($tH = $("<div>").addClass($tH.class()).appendTo($t));
      $tC.size() || ($tC = $("<div>").addClass($tC.class()).appendTo($t));
      (_t._stor.data && $.each(_t._stor.data, function(i,k){
       _t._log(1,"Tab init: ",i +" = ",k);
       if ($.isNumeric(i)){
        // check or add header tabs and it contents
        var $tHi=$("[href*='"+ k.alias+"']",$tH);
        $tHi.size() || ($tHi = $("<a>").attr({"href": location.pathname+k.alias}).text(k.name).appendTo($tH));
        var $tCi=$(">*",$tC).eq(i);
        $tCi.size() || ($tCi = $("<div>").appendTo($tC)).addClass(k.alias.replace("#",""));
        // init control function for tab content
        (!k.function && k.datatype && typeof _t._stor.control[k.datatype]=="function" && (k.function = _t._stor.control[k.datatype])) ||
         (typeof k.function == "string" && typeof _t._stor.control[k.function]=="function" && (k.function = _t._stor.control[k.function]));
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
      _t._log(1,"Tabs opened",$(".active",_t._stor.tabs).index());
      return $(".active",_t._stor.tabs).index();
      break;
    }
    return $t;
   };
   _t.preview = function(p){
    p = $.extend({},{"alt":"","src":"","title":""},p);
    var $t = $(_t._stor.preview);
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
    // размеры. слайдер(ы) для высоты и ширины секции(й)
    var dlevel = 2;
    p = $.extend({},{
     // обязательные параметры
     "obj":false,
     "name":"",
     "minmax":[],
     "orientation":"horizontal",
     //"caption":"",
     //"step":false,
     //index: false,
     "label":"",
     "value":""
    },p);
    if (!(p.obj && p.name && typeof p.minmax=="object")) {
     _t._err("_initDimension: Parameters error ");
     return;
    }
    p.label || (p.label = p.name);
    var _l = _l = $("<label/>").addClass(p.label).appendTo(p.obj);
    var _s = $("<input/>").attr({"name":p.name}).appendTo(_l);
    if (p.index) $("<span/>").addClass("index").html(p.index).appendTo(_l);
    p.caption && $('<span>'+p.caption+'</span>').insertBefore(_s);
    _s.val() || (p.value && _s.val(p.value));
    _s.attr("type","slider");
    // check and set defaults for slider
    _t._log(dlevel+1,"_initDimension (p):",p);
    var _slider = _s.next(".slider");
     _slider.size() || (_slider = $( "<div class='slider'></div>" ).insertAfter( _s ));
    _slider.slider({
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
    var dlevel=3;
    var $t = $(_t._stor.sizes);
    var _d=_t._data(_t._val(_t._stor.form.id));
    _t._log(dlevel+1,"Sizes: call (p,_d)",p,_d);
    $t.size() || (($t = $("<div/>").addClass($t.class()).appendTo(_t)) || _t._log(dlevel,"Create Sizes",$t));
    $t.html("");
    var $s=["height","width"];
    var tabI = _t._tabs("opened");
    switch (typeof _d.data) {
     case "object":
      //var colsT = ["alias","name","dimensions","input"];
      var cols=_t._cols(tabI);
      _t._log(dlevel+1,"Sizes Data:",_t._val(_t._stor.form.id),_d,"Tab: ",tabI,_t._stor.data[tabI],cols);
      $.each($s,function(i,dim){
       // определяем поля ввода и слайдеры для каждого измерения 
       _d.atad || (_d.atad={});
       if (!_d.atad[dim]) _d.atad[dim] = _t._getDataCol(_d.data,cols._index[dim]);
       var _dCol = _d.atad[dim];
       $s[dim]=_t._initDimension({
            "obj":$t,
            "name":dim,
            "minmax":_t._minmax(_dCol),
            "orientation":dim=="height"?"vertical":"horizontal",
            "caption":cols[dim][0]+', '+cols[dim][1],
            "step":parseInt(_t._stor.reference.step),
            "value":_dCol[Math.round(_dCol.length/2)]
           });
      });
      _t._log(dlevel,"Sizes inited",$t,"Inputs: ",$s,"data",_d);
     break;
     case "string":
      _d._complect || (_d._complect = _d.data.split(","));
      var _wW = [];
      $.each(_d._complect,function(i,item){
       var _segment = _t._data(item);
       var cols=_t._cols(_segment.tabI);
       $.each($s,function(n,dim){
        // определяем поля ввода и слайдеры для каждого измерения 
        _segment.atad || (_segment.atad={});
        if (!_segment.atad[dim]) _segment.atad[dim] = _t._getDataCol(_segment.data,cols._index[dim]);
        var _dCol = _segment.atad[dim];
        var _dimP = {
         "obj":$t,
         "name":dim,
         "label":dim,
         "minmax":_t._minmax(_dCol),
         "orientation":dim=="height"?"vertical":"horizontal",
         "caption":cols[dim][0]+', '+cols[dim][1],
         "step":parseInt(_t._stor.reference.step),
         "value":_dCol[Math.round(_dCol.length/2)]
        };
        if (dim=="height") {
         var _vS = $("[name='"+dim+"']",$t).siblings(".slider");
         if (_vS.size()) {
          // проверка вертикального слайдера, установка минимальных макс-мин 
          if (_dimP.minmax.max > _vS.slider("option","max")) _dimP.minmax.max = _vS.slider("option","max");
          if (_dimP.minmax.min < _vS.slider("option","min")) _dimP.minmax.min = _vS.slider("option","min");
         } else {
          _t._initDimension(_dimP);
         }
        } else {
         _dimP.name = dim+"["+i+"]";
         if (i) _dimP.caption = false;
         _dimP.index = i+1;
         _t._initDimension(_dimP);
         _wW.push(_dimP.minmax.max);
        }
       });
      });
      $("label.width",$t).each(function(){
       var _s = $(".slider",this);
       var _sMnx = _s.slider("option","max");
       var _maxW = Math.max.apply(null,_wW);
       if (_sMnx < _maxW) _s.width( _t._flFix(_s.width() * ((_sMnx / _maxW))));
      });
     break;
    }
    $("input:first",$t).trigger("change");
    return _t;
   };
   _t._cols = function(tabI) {
     // определение колонок данных секции, номер (строка), alias - 1ст, название - 2ст, ед изм - 3ст
    var dlevel=5;
    var cols=_t._stor.data[tabI].cols;
    var _al = ["alias","name","unit"];
    if (!cols._index) $.each(cols,function(k,item){
     $.each(item,function(i,v){
      if (!parseInt(i)) { // первая строка (i=0) содержит алиасы
       // значения в соотв алиасу массив
       (cols._index || (cols._index={})) && (cols._index[v]=k);
      } else {
       (cols[cols[k][0]] || (cols[cols[k][0]]=[])) && (cols[cols[k][0]][i-1]=v);
      }
      _t._log(dlevel,"_cols : [k="+k+"]= ","i = "+i, "value = "+v,"tabI = "+tabI);
     });
    });
    return cols;
   };
   _t._data = function(p,data,grKey,deep) {
    // получение и кеширование данных по идентификатору
    var dlevel=2;
    var _result;
    var tabI;
    data = data  || _t._stor.data;
    if (data._index && data._index[p]) return data._index[p]; // cache
    grKey = grKey?grKey:"data,group";
    grKey = typeof grKey!="object"?grKey.split(","):grKey;
    _result=false;
    _t._log(dlevel, "Get Data", p, data, deep);
     switch (true) {
      case $.isNumeric(p): // return last level data
       if (typeof data[p] !== "undefined") return data[p]; // end recursion
       $.each(data, function (i, item) {
       if (!deep) tabI = i; 
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
     typeof tabI!=="undefined" && (_result.tabI = tabI); 
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
   _t._calcSection = function(_d,fData,dim) {
    var dlevel=3;
    var tabI = typeof _d.tabI=="undefined"?_t._tabs("opened"):_d.tabI;
    var reference = _t._stor.reference.price;
    dim || (dim={});
    dim.width || (dim.width = fData.width);
    dim.height || (dim.height = fData.height);
    _t._log(dlevel," Calc section input (_d,fData,dim,tabI,)",_d,fData,dim,tabI);
    if (!_d.atad.area) {
     _d.atad.area = [];
     for (var k in _d.atad.width) _d.atad.area[k] = _t._flFix((_d.atad.width[k] / 1000 ) * (_d.atad.height[k] / 1000 ));
    }
    var S = _t._flFix((dim.width/1000) *(dim.height/1000)); // площадь,м2
    _d.atad['price['+fData.system+']'] || (_d.atad['price['+fData.system+']'] = _t._getDataCol(_d.data,_t._stor.data[tabI].cols._index['price['+fData.system+']']));
    _d.atad['kit['+fData.kit+']'] || (_d.atad['kit['+fData.kit+']'] = _t._getDataCol(_d.data,_t._stor.data[tabI].cols._index['kit['+fData.kit+']']));
    var _cAr = {// цены на комплект и монтаж по всем точкам
     "baseprice" : _d.atad['price['+fData.system+']'],
     "kitprice"  : _d.atad['kit['+fData.kit+']']
    };
    var _c = {};
    var _cI;
    for (var k in _cAr)
     if ((_cI=$.inArray(S,_d.atad.area)) > 0) {
      // успользуем заданные для точек значения
      _c[k] = _t._flFix(_cAr[k][_cI]);
     } else {
      // определяем значения в диапазоне
      _c[k]= _t._calcToMatch(S,_d.atad.area,_cAr[k]);
     }
    _c.montage = fData.montage==1?_t._flFix(S * reference["montage"].base ):0;
    _t._log(dlevel," Calc section (S,_cI,_cAr,_c)",S,_cI,_cAr,_c);
    return _c.baseprice + _c.kitprice + _c.montage; 
   };
   _t._calc = function() {
    var dlevel = 3;
    var f = $("[name]", _t);
    var _d = _t._data(_t._val(_t._stor.form.id));
    var reference = _t._stor.reference.price;
    var _result = 0;
    var fData = f.serializeObject();
    var L = 0;
    switch (typeof _d.data) {
     case "object": // секция
      // цена секции (цена + цена комплекта + цена монтажа) + цена монтажа комлекта за периметр)
      _result = _t._calcSection(_d,fData) + ((fData.montage==1 && reference["montage"].kit && reference["montage"].kit[fData.kit])?
       ((L=(1*fData.width + 1*fData.height) * 0.002) * reference["montage"].kit[fData.kit] ):0);
      break;
     case "string": // набор секций (ид через запятую)
      _d._complect || (_d._complect = _d.data.split(","));
      _result=0;
      $.each(_d._complect,function(i,item){
       if (fData.montage==1) L += 1*fData.width[i];
       _result += _t._calcSection(_t._data(item),fData,{"width":fData.width[i]});
      });
      if (fData.montage==1 && reference["montage"].kit && reference["montage"].kit[fData.kit]) {
       _result += (L=(L + 1*fData.height) * 0.002) * reference["montage"].kit[fData.kit];
      }
      break;
    }
    _result = _t._flFix(_result);
    _t._log(dlevel,"Calc ("+_t._counts("_calc",1 + _t._counts("_calc")).toString()+"): ",
        "form data:",fData,"data",_d,"L",L,"_result",_result);
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
    _t._log(4,"_getDataCol ("+_t._counts("_getDataCol",1 + _t._counts("_getDataCol")).toString()+") (data,c,ar): ",data,c,ar);
    return ar;
   };
   _t._minmax = function(ar,c) {
     return {"max":Math.max.apply(null, ar),"min":Math.min.apply(null, ar)};
   };
   _t.init();
  });
 }
});
