define('js!WSTest/Focus/Case15', [
   'tmpl!WSTest/Focus/Case15',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});