/*!
 * jQuery plastic window caclulator
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
        _t._p[k] = $('<div/>').addClass(_t._p[k].selector.replace("."," ")).prependTo(_t);
        _t._p.debug && console.log("inited new "+k,_t._p[k]);
       }
       break;
     }
    });
    return _t;
   };


   //p=$.extend({
   // "function":function(){var msg="need control function";console.log(msg)||alert(msg);}
   //},p);

   _t.init();
  });
 }
});

