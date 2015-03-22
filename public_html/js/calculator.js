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
   $.each("tabs,params".split(","),function(i,k){
    p.debug && console.log(i,k, p[k]);
    switch (true) {
     case typeof p[k] == "string": p[k] = $(p[k], _t); break;
    }
   });
   _t.param = p;
   _t.init = function(p){
    p={}||p;
    if (p.debug || _t.param.debug) console.log("_init");
    return _t;
   };


   //p=$.extend({
   // "function":function(){var msg="need control function";console.log(msg)||alert(msg);}
   //},p);

   _t.init();
  });
 }
});

