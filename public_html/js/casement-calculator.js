/*!
 * jQuery casement calculator plugin
 *
 * Required
 *  jQuery tabs extender like https://gist.github.com/MrSwed/4246691aa788058a9934
 *  jQuery class extender https://gist.github.com/MrSwed/0a837b3acbfbf8cfb19e
 *  number_format https://gist.github.com/MrSwed/fb740550b60d07ab7449
 *  jQuery serializeObject https://github.com/macek/jquery-serialize-object
 *  jQuery unparam https://github.com/MrSwed/jquery.unparam
 */
$.fn.extend ({
 "calculator" : function(p){
  return this.each(function() {
   var _t=this;
   _t.p = p;
   p=$.extend({},{
    "dataUrl": false, // получить данные и справочники калькулятора ajax запросом по указанной ссылке (data,reference)
    "tabs": ".tabs",
    "params": ".parameters",
    "type": ".type",
    "template": ".template",
    "preview": ".preview",
    "sizes":".sizes",
    "reference":false, // справочник. общие цены на монтаж, шаг  
    "data": false,  // данные конструкций  
    "form":{"id":"id","width":"width","height":"height","price":"price"},
    "price":$(".price",_t), // price output
    "showUrl":true, // Показать ссылку на выбранный вариант
    "initVal": location.hash.split('?',2)[1]?$.unparam(location.hash.split('?',2)[1]):{} //  Параметры инициализации по умолчанию 
    //"texts" : {warning:""}
   },p);
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
    var dlevel=0;
    p = {} || p;
    _t._log(dlevel+1,"init");
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
       _t._log(dlevel+2, "_INIT: Ajax load success (_t._stor.dataUrl,response,textStatus,jqXHR)", _t._stor.dataUrl, response, textStatus, jqXHR);
       $.each(dataKeys, function (i, k) { // проверяем наличие данных для ключа
        !_t._stor[k] && response.data[k] && (_t._stor[k] = response.data[k]);
       });
       _t._stor.dataUrl = false;
       _t._ajaxLeft -= 1;
       _t._log(dlevel+2, "_INIT: Ajax loaded data, reinit", response.data,  "left: " + _t._ajaxLeft, _t._stor );
       _t.init();
      }
     };
     _t._log(dlevel+2, "_INIT: Ajax get data", ajaxSetting, "left: " + _t._ajaxLeft);
     $.ajax(ajaxSetting);
    }
    if (_t._ajaxLeft || _t._ajaxLeft > 0) {
     _t._log(dlevel+2,"Ajax wait "+_t._ajaxLeft);
     return;
    }
    //инициализация элементов 
    $.each("tabs,params".split(","), function (i, k) {
     _t._log(dlevel+1,"Params to $", i, k, _t._stor[k]);
     switch (true) {
      case typeof _t._stor[k] == "string":
       _t._stor[k] = $(_t._stor[k], _t);
       _t._stor[k].size() || (_t._stor[k] = $('<div/>').addClass(_t._stor[k].class()).prependTo(_t));
       _t._log(dlevel+2,"Param inited:", k, _t._stor[k]);
       break;
     }
    });
    // параметры
    _t._stor.choice = $(">.choice",_t._stor.params); 
    _t._stor.choice.size() || (_t._stor.choice = $('<div/>').addClass(_t._stor.choice.class()).prependTo(_t._stor.params));
    if (_t._stor.reference.captions) $.each(_t._stor.reference.captions,function(k,v){
     var $fieldset = $(">.radio:has([name='"+k+"'])", _t._stor.choice);
     $fieldset.size() || ($fieldset = $('<div/>').addClass(k).addClass($fieldset.class()).appendTo(_t._stor.choice).append($("<div/>").addClass("title").html(v.name)));
     if (v.variants) {
      var $kAlias = k.split(/[\[\]]/,2);
      var $kD = $(">*:not(:first):not(.title)", $fieldset);
      $kD.size() || ($kD = $("<div/>").appendTo($fieldset));
_t._log(dlevel+2,"Variants: ",$fieldset,k,v);
      $.each({"Да":"1","Нет":"0"},function(n,val){
      var _Lab = $("<label/>").append($("<input/>").attr({"name": $kAlias[0], "value": val, "type": "radio"}))
                .append(" " + n).appendTo($kD);
_t._log(dlevel+2,"Variants each ",$kAlias,$kD,n,val,v,_Lab);
      });
     }
    });
    // обработчик событий - расчет
    $(_t).on("change","[name]",function(e,init){
     var _r = _t._calc(init);
     _t._val("price",_r);
     _t._stor.price && $(_t._stor.price).html(number_format(_r,0));
     _t._log(dlevel+2,"Change triggered at :",e,"result "+_r,"Target: ",_t._stor.price);
    });
    $.each(_t._stor.form,function(a,item){
     var v = item.value || "";
     var n = item.name || item.toString();
     var i = $("[name*='"+n+"']",_t);
     i.size() || (i = $("<input/>").attr({"type":"hidden","name":n,"value":v}).appendTo(_t));
     _t._stor.form[a] = i;
    });
    _t._tabs("init");
    return $(_t).trigger("inited");
   };
   _t._val = function(n,v) {
    var i;
    i = typeof n=="object"?n:((i=$("[name='"+_t._stor.form[n.toString()]+"']")).size()?i:$("[name='"+n.toString()+"']",_t));
    _t._log(2,"_val ",n,i,v);
    (!v && (v = i.val())) || i.val(v);
    return v ;
   };
   _t._err = function(m) {console.log(m)||alert(m); };
   _t._itemUrl = function(item) { return (item.url && item.url.replace(location.pathname,'')) || item.alias || item.id; };
   _t._type = function(o) {
    var dlevel=1;
    var $type = $(_t._stor.type,o);
    if (!$type.size()) {
     // use template or create new
     ($(_t._stor.template,_t).find(_t._stor.type).size() && ($type = $(_t._stor.template,_t).find(_t._stor.type).clone().appendTo(o)))
      || ($type = $("<div/>").addClass($type.class()).appendTo(o));
    }
    var tabI = o.index();
    //var this
    var $tg = $(".select",$type);
    $tg.size() || ($tg = $("<div/>").addClass($tg.class()).appendTo($type));
    if (!$type.data("activated")) {
     _t._log(dlevel+1, "_type: init type control control for \"" + _t._stor.data[tabI].datatype + "\" at ", "index check: " + o.index() + " " + tabI, "_t._stor.data[tabI]", _t._stor.data[tabI], "$type,$tg", $type, $tg);
     $tg.html("");
     $.each(_t._stor.data[o.index()].data, function (id1, item1) {
       if (!(item1.name + item1.alias)) return 1; // Пропускаем неопубликованные
      if (item1.group) { // два уровня todo:модернизировать в соответствии с новой структурой данных
       $tg.addClass("casement");
       _t._log(dlevel, "_type: twolevels structure: ");
       var $gr = $("<div/>").addClass("group").attr("title", (_t._debug(3) ? id1 + ": " : '') + (item1.title || item1.name)).appendTo($tg);
       var $gv = $("<div/>").addClass("variants").appendTo($gr);
       $.each(item1.group, function (id, item) {
        if (!(item.name + item.alias)) return 1; // Пропускаем неопубликованные
        $("<a>").prop({"href": item.image,"title": (_t._debug(3) ? id + ": " : '') + (item.title || item.name)})
         .attr({"data-url":_t._itemUrl(item)})
         .append($("<img/>").attr({"src": item.preview, "alt": item.title || item.name
        }).load(function () {
         var $gr = $(this).closest(".group");
         _t._log(dlevel+2, "_type: loaded ", this, this.width, $gr.width());
         if ($gr.width() < this.width) $gr.width(this.width + ($gv.outerWidth() - $gv.width()));
        })).appendTo($gv).on("init click", function (e,init) { // обработка нажатия на изображение просмотра - смена параметров
         e.preventDefault();
         var $a = $(this);
         var $i = $a.find("[src]");
         _t._log(dlevel+1, "_type: Img triggered ", e.type, $i, e);
         $a.addClass("selected").siblings().removeClass("selected");
         if (e.type == "click") {
          _t._log(dlevel+2, "_type: Clicked", $a);
          $(".active",$tg).removeClass("active");
          $a.addClass("active");
          _t.preview({"src": $a.attr("href"), "alt": $i.attr("alt"), "title": $i.attr("title")});
          _t._val(_t._stor.form.id, id);
          _t._parameters(true);
          if (_t._stor.showUrl && !init && !Object.keys(_t._stor.initVal).length) location.hash = $a.attr("data-url");
         }
        })
       });
       $("img:first", $gv).trigger("init");
      } else { // один уровень
       $tg.addClass("casesets");
       _t._log(dlevel+2, "_type: init one level structure", o.index(), o);
       $("<a>").prop({"href": item1.image, "title": (_t._debug(3) ? id1 + ": " : '') + (item1.title || item1.name)})
        .attr({"data-url":_t._itemUrl(item1)})
        .append($("<img/>").attr({ "src": item1.preview, "alt": item1.title || item1.name}))
        .appendTo($tg).on("init click", function (e,init) { // обработка нажатия на изображение просмотра - смена параметров
        e.preventDefault();
        var $a = $(this);
        var $i = $a.find("[src]");
        _t._log(dlevel+2, "_type: Img triggered ", e.type, $i, e);
        if (e.type == "click") {
         _t._log(dlevel+2, "_type: Clicked", $a);
         $(".active",$tg).removeClass("active");
         $a.addClass("active");
         _t.preview({"src": $a.attr("href"), "alt": $i.attr("alt"), "title": $i.attr("title")});
         _t._val(_t._stor.form.id, id1);
         _t._parameters(true);
         if (_t._stor.showUrl && !init && !Object.keys(_t._stor.initVal).length) location.hash = $a.attr("data-url");
        }
       });
      }
     });
    }
    return $type;
   };
   _t._tabs = function(p){
    var dlevel=3;
    var $t = $(_t._stor.tabs);
    var $tH = $(".headers", $t);
    var $tC = $(".contents", $t);
    switch (true) {
     case p=="init":
      $tH.size() || ($tH = $("<div>").addClass($tH.class()).appendTo($t));
      $tC.size() || ($tC = $("<div>").addClass($tC.class()).appendTo($t));
      (_t._stor.data && $.each(_t._stor.data, function(i,k){
       _t._log(dlevel + 1,"Tab init: ",i +" = ",k);
       if ($.isNumeric(i)){
        // check or add header tabs and it contents
        var $tHi=$("[href*='"+ k.alias+"']",$tH);
        $tHi.size() || ($tHi = $("<a>").attr({"href": location.pathname+k.alias}).text(k.name).appendTo($tH));
        var $tCi=$(">*",$tC).eq(i);
        $tCi.size() || ($tCi = $("<div>").appendTo($tC)).addClass(k.alias.replace("#",""));
       }
      })) || _t._err("data error");
      return $t.on("change",function(e,init){
       var $active = $(".headers > .active",this).index();
       var $type = _t._type($(".contents >* ",this).eq($active));
       var $a = $(".active",$type);
       $a.size() || ($a = $("[data-url*='"+location.hash.replace("#",'').split("?")[0]+"']:first"));
       $a.size() || ($a = $("a:first",$type));
       _t._log(dlevel + 3,"Tabs changed (this, e,p,$type,$a,$active.location.hash)",this,e,p,$type,$a,$active,location.hash.replace("#",''));
       $a.trigger("click",[init]);
      }).tabs({"headers":$tH,"contents":$tC,"active":location.hash.replace(/\/.*$/,'')});
      break;
     case p=="opened":
      _t._log(dlevel + 1,"Tabs opened",$(".active",$tH).index());
      return $(".active",$tH).index();
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
    var dlevel=2;
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
    _t._log(dlevel,"_initDimension (p):",p);
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
   _t._choice = function(cols,init,arr){
    // Построение выбора параметров
    dlevel = 8;
    var $c = $(_t._stor.choice);
    if ($c.data("id")==_t._val(_t._stor.form.id)) return false;
    var fData=$("[name]", _t).serializeObject();
    if (!arr || !arr.length) {
     arr=[];
     $.each(cols._index,function(i){
       if (i.split(/[\[\]]/).length>1)
        arr.push(i)
     });     
    }
    $.each(arr,function(i,k){
      var $k = k.split(/[\[\]]/,2);//.filter(function(el){if (el )return el;});
      if ($k.length>1) {
       var $kAlias = (cols[k][2] || $k[0]);
       var $kS = $("." + $kAlias, $c);
       var $kD = $(">*:not(:first):not(.title)", $kS);
       if ($kD.data("id")!=_t._val(_t._stor.form.id)) $("label",$kD).remove();
       $kD.size() || ($kD = $("<div/>").appendTo($kS));
       $("<label/>").append($("<input/>").attr({"name": $kAlias, "value": $k[1], "type": "radio"}))
        .append(" " + cols[k][0]).appendTo($kD);
       _t._log(dlevel+5, "choices:", k, $kAlias, $kS, $kD,fData);
       $kD.data("id",_t._val(_t._stor.form.id));
      }
    });
    $(">*",_t._stor.choice).each(function(){
      var _c = $(this);
      var $kAlias = _c.class().split(" ")[0];
     _t._log(dlevel+5, "choices set checked:", $kAlias, fData);

      if (!$("*:checked",_c).size()) {
       $("[name='" + $kAlias + "'][value='"+fData[$kAlias]+"']",_c).prop("checked",true);
       $("*:checked",_c).size() || (_t._stor.initVal && _t._stor.initVal[$kAlias] && $("[name='" + $kAlias + "'][value='"+_t._stor.initVal[$kAlias]+"']",_c).prop("checked",true)); 
       $("*:checked",_c).size() || $("[name='" + $kAlias + "']:first",_c).prop("checked",true); 
      }
    });
    $c.data("id",_t._val(_t._stor.form.id));
   };
   _t._parameters = function(init) {
    // инициализация выбора размеров и параметров
    var dlevel=10;
    var $s = $(_t._stor.sizes);
    var _d=_t._data(_t._val(_t._stor.form.id));
    _t._log(dlevel,"_parameters: call (p,_d)",_d,_t._stor.form.id);
    $s.size() || (($s = $("<div/>").addClass($s.class()).appendTo(_t)) || _t._log(dlevel,"Create Sizes",$s));
    $s.html("");
    var $dm=["height","width"];
    var tabI = _t._tabs("opened");
    var cols=_t._cols(tabI);
    switch (typeof _d.data) {
     case "object": // datatype = section
      //var colsT = ["alias","name","dimensions","input"];
      _t._log(dlevel+1,"Sizes Data:",_t._val(_t._stor.form.id),_d,"Tab: ",tabI,_t._stor.data[tabI],cols);
      // параметры выбора
      _t._choice(cols,init);
      $.each($dm,function(i,dim){
       // определяем поля ввода и слайдеры для каждого измерения 
       _d.atad || (_d.atad={});
       if (!_d.atad[dim]) _d.atad[dim] = _t._getDataCol(_d.data,cols._index[dim]);
       var _dCol = _d.atad[dim];
       var $minmax = _t._minmax(_dCol);
       _t._stor.initVal[dim] || (_t._stor.initVal[dim] = _dCol[Math.round(_dCol.length/2)]);
       _t._stor.initVal[dim] && typeof _t._stor.initVal[dim] == "object" && (_t._stor.initVal[dim] = _t._stor.initVal[dim][0]);
       (_t._stor.initVal[dim] > $minmax.max || _t._stor.initVal[dim] < $minmax.min) && (_t._stor.initVal[dim] = _dCol[Math.round(_dCol.length/2)]);
       $dm[dim]=_t._initDimension({
            "obj":$s,
            "name":dim,
            "minmax":$minmax,
            "orientation":dim=="height"?"vertical":"horizontal",
            "caption":cols[dim][0]+', '+cols[dim][1],
            "step":parseInt(_t._stor.reference.step),
            "value":_t._stor.initVal[dim]
           });
      _t._log(dlevel+1,"_parameters inited",$s,"Inputs: ",$dm,"data","dim",dim,_d,"_t._stor.initVal",_t._stor.initVal);
      });
     break;
     case "string": // datatype == multiple
      _d._complect || (_d._complect = _d.data.split(","));
      var _wW = [];
      //var _colsUse=[];
                   // если будут сегменты с разным набором параметров - будет ошибка
      $.each(_d._complect,function(i,item){
       var _segment = _t._data(item);
       !cols && (cols=_t._cols(_segment.tabI));
       //// определение общих параметров параметров секций для секций с разным набором параметров
       //if (!_colsUse.length) $.each(cols._index,function(i){ if (i.split(/[\[\]]/).length>1) _colsUse.push(i) });
       //else _colsUse = _colsUse.filter(function(el){ return !!cols._index[el]; });
       $.each($dm,function(n,dim){
        // определяем поля ввода и слайдеры для каждого измерения 
        _segment.atad || (_segment.atad={});
        if (!_segment.atad[dim]) _segment.atad[dim] = _t._getDataCol(_segment.data,cols._index[dim]);
        var _dCol = _segment.atad[dim];
        var $minmax = _t._minmax(_dCol);
        var slVal = ((typeof _t._stor.initVal[dim] =="object")?_t._stor.initVal[dim][i] : _t._stor.initVal[dim]) || _dCol[Math.round(_dCol.length/2)]; 
        (slVal > $minmax.max || slVal < $minmax.min) && (slVal = _dCol[Math.round(_dCol.length/2)]);
        var _dimP = {
         "obj":$s,
         "name":dim,
         "label":dim,
         "minmax":$minmax,
         "orientation":dim=="height"?"vertical":"horizontal",
         "caption":cols[dim][0]+', '+cols[dim][1],
         "step":parseInt(_t._stor.reference.step),
         "value":slVal
        };
        _t._log(dlevel+1,'_parameters Multi (dim,_dCol,_t._stor.initVal,$minmax)',dim,_dCol,_t._stor.initVal,init,$minmax,slVal );
        if (dim=="height") {
         var _vS = $("[name='"+dim+"']",$s).siblings(".slider");
         if (_vS.size()) {
          // проверка вертикального слайдера, установка минимальных макс-мин 
          _t._log(dlevel,'_parameters Multi height sets (_dimP.minmax,) _vS.slider("option","maxmax")',_dimP.minmax,{"max":_vS.slider("option","max"),"min":_vS.slider("option","min")});
          ((_dimP.minmax.max > _vS.slider("option","max")) && (_dimP.minmax.max = _vS.slider("option","max"))) || _vS.slider("option","max",_dimP.minmax.max );
          ((_dimP.minmax.min < _vS.slider("option","min")) && (_dimP.minmax.min = _vS.slider("option","min"))) || _vS.slider("option","min",_dimP.minmax.min );
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
      _t._choice(cols,init);
      $("label.width",$s).each(function(){
       var _s = $(".slider",this);
       var _sMnx = _s.slider("option","max");
       var _maxW = Math.max.apply(null,_wW);
       if (_sMnx < _maxW) _s.width( _t._flFix(_s.width() * ((_sMnx / _maxW))));
      });
     break;
    }
    $("input:first",$s).trigger("change",[init]);
    return _t;
   };
   _t._cols = function(tabI,key) {
     // определение колонок данных секции, номер (строка), alias - 1ст, название - 2ст, ед изм - 3ст
    var dlevel=2;
    var cols=_t._stor.data[tabI].cols;
    //var _al = ["alias","name","unit"];
      _t._log(dlevel+2,"_COLS Start: ","tabI = "+tabI,"cols",cols);
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
    return key?cols._index[key]:cols;
   };
   _t._data = function(p,data,grKey,deep) {
    // рекурсивное получение и кеширование данных по идентификатору
    var dlevel=3;
    var _result;
    var tabI;
    data = data  || _t._stor.data;
    if (data._index && data._index[p]) return data._index[p]; // cache
    grKey = grKey?grKey:"data,group";
    grKey = typeof grKey!="object"?grKey.split(","):grKey;
    _result=false;
    _t._log(dlevel, "Get Data", p, data, deep);
     switch (true) {
      case p && $.isNumeric(p): // return last level data
       if (typeof data[p] !== "undefined") return data[p]; // end recursion
       (typeof data=="object") && $.each(data, function (i, item) {
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
    var dlevel=3;
    // получение соответствующего значения из искомого диапазона SScope  (цены)
    // на основе известной точки Bval заданного диапазона BScope (площадь)
    var _scope = _t._getRange(Bval,BScope);                                          // определение точек, между которыми находится определяющее значение
    _t._log(dlevel+1,"_calcToMatch Start: (Bval,BScope,SScope,_scope)",Bval,BScope,SScope,_scope);
    var _range = _t._flFix(BScope[_scope[1]] - BScope[_scope[0]]);                   // определение диапазона между заданными точками
    var _c = {
     "BDelta"       : _t._flFix(Bval - BScope[_scope[0]]),                           // разница между минимальной точкой и текущим значением
     "first"        : _t._flFix(SScope[_scope[0]]),                                  // Значения точек, соотв первое и последнее в найденом диапазоне
     "last"         : _t._flFix(SScope[_scope[1]]),
     "IDelta"       : SScope[_scope[1]] - SScope[_scope[0]],                         // Длина диапазона в котором ищем значение (для отладки)
     "IDelta_range" : _t._flFix(( SScope[_scope[1]] - SScope[_scope[0]] ) / _range)  // шаг соответственно известному диапазону 
    };
    _c.result = _c.first + (_c.BDelta * _c.IDelta_range);                            // искомое значение в нужном диапазоне
    _t._log(dlevel,"_calcToMatch (Bval,BScope,SScope,_scope,_range,_c)",Bval,BScope,SScope,_scope,_range,_c);
    return _c.result;
   };
   _t._calcSection = function(_d,fData,dim) {
    var dlevel=2;
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
    _d.atad['price['+fData.system+']'] || (_d.atad['price['+fData.system+']'] = _t._getDataCol(_d.data,_t._cols(tabI,'price['+fData.system+']')));
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
   _t._calc = function(init) {
    var dlevel=3;
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
        "form data:",fData,"data",_d,"L",L,"_result",_result,"init",init);
    if (_t._stor.showUrl && !init) {
     location.hash = _t._itemUrl(_d) + "?"+$.param($.extend({}, _t._stor.initVal,
       f.filter(function(){return $(this).val() && ($.inArray($(this).attr("name").replace(/\[.*$/,''),
                      "height,width,id,system,kit,montage".split(","))!=-1)}).serializeObject()
     ))
    }
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
   _t.report = function(){
    var dlevel=12;
    var _r = _t._stor.report;
    if (!_r || !_r.tpl ) return false;
    _r._out = _r.tpl.toString();
    var fData = $.extend({},_t._stor.initVal,$("[name]:visible", _t).serializeObject());
    $.each(fData,function(k,v){ // по собранным данным
     _t._log(dlevel,"Report: Template set <%"+k+"%> to "+v);
     var fItem = $("[name='"+k+"'][value='"+v+"']", _t);
     
     if (fItem.is("[type='radio']")) v = fItem.closest("label").text().trim();
     _r._out = _r._out.replace("<%"+k+"%>",typeof v == "object" ? $.map(v,function(v) {return v;}).join(","):v);
    });
    var _d=_t._data(_t._val(_t._stor.form.id));
    $.each(_d,function(k,v){  // данные элемента (name,item)
     _t._log(dlevel,"Report: data set ",k,v);
     var _v = v;
     if (k=="url") _v = location.protocol+"//"+location.host+location.pathname + "#"+ v.replace(location.pathname,'')+"?"+$.param(fData);
     _r._out = _r._out.replace("<%"+k+"%>",!_v?_v: (typeof _v == "object" ? $.map(_v,function(_v) {return _v;}).join(","):_v));
    });
    _r._out = _r._out.replace("<%price%>",number_format(_t._val("price")));
    _r._out = _r._out.replace("<%id%>",_t._val(_t._stor.form.id)+(typeof _d.data=="string"?": "+_d.data+"":""));
     _t._log(dlevel, "Report: _r.out ",_r.out,_d);
    if (_r.out && $(_r.out).size()) {
     switch (true) {
      case $(_r.out).is(":not([type='checkbox']),:not([type='radio']),:not([type='password']),textarea,:not(input),:not(select)"):
       $(_r.out).val(_r._out);
       break;
      default:
       $(_r.out).html(_r._out);
       break;
     }
    }
    return _r._out;
   };
   _t.init();
  });
 }
});
