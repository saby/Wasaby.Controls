define('js!WSTest/Focus/Case17', [
   'tmpl!WSTest/Focus/Case17',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});