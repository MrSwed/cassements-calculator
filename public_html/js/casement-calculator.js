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
    "tabs":".tabs",
    "params":".parameters",
    "data":false // need data
   },p);
   _t._p = p;
   _t.init = function(p){
    p={}||p;
    if (p.debug || _t._p.debug) console.log("_init");
    $.each("tabs,params".split(","),function(i,k){
     _t._p.debug && console.log(i,k, _t._p[k]);
     switch (true) {
      case typeof _t._p[k] == "string": _t._p[k] = $(_t._p[k], _t);
       if (!_t._p[k].size()) {
        _t._p[k] = $('<div/>').addClass(_t._p[k].class()).prependTo(_t);
        _t._p.debug && console.log("inited new "+k,_t._p[k]);
       }
       break;
     }
    });
    $(_t.tabs("init")).tabs();
    return _t;
   };
   _t._err = function(m) {console.log(m)||alert(m); };
   _t.tabs = function(p){
    var $t = $(_t._p.tabs);
    switch (true) {
     case p=="init":
      var $tH = $(".headers",$t);
      var $tC = $(".contents",$t);
      if (!$tH.size()) $tH = $("<div>").addClass($tH.class()).appendTo($t);
      if (!$tC.size()) $tC = $("<div>").addClass($tC.class()).appendTo($t);
      (_t._p.data && $.each(_t._p.data, function(i,k){
       _t._p.debug && console.log(i,k);
       if ($.isNumeric(i)){
        // check or add header tabs and it contents
        var $tHi=$("[href=]"+ k.alias,$tH);
        if (!$tHi.size()) $tHi = $("<a>").attr({"href": location.pathname+k.alias}).text(k.name).appendTo($tH)
        var $tCi=$(">*",$tC).eq(i);
        if (!$tCi.size()) $tCi = $("<div>").appendTo($tC)
       }
      })) || _t._err("data error");
      break;
    }
    return $t.tabs();
   };


   //p=$.extend({
   // "function":function(){var msg="need control function";console.log(msg)||alert(msg);}
   //},p);

   _t.init();
  });
 }
});

