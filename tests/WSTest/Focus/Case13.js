define('js!WSTest/Focus/Case13', [
   'tmpl!WSTest/Focus/Case13',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      },
   });
   return moduleClass;
});