define('js!WSTest/Focus/Case18', [
   'tmpl!WSTest/Focus/Case18',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});