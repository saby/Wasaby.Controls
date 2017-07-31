define('js!WSTest/Focus/Case14', [
   'tmpl!WSTest/Focus/Case14',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});