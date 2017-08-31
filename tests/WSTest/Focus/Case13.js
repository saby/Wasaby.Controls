define('js!WSTest/Focus/Case13', [
   'tmpl!WSTest/Focus/Case13',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      constructor: function(cfg) {
         moduleClass.superclass.constructor.call(this, cfg);
      }
   });
   return moduleClass;
});