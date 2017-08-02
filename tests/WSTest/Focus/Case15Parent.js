define('js!WSTest/Focus/Case15Parent', [
   'tmpl!WSTest/Focus/Case15Parent',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});