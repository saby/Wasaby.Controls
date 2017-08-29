define('js!WSTest/VdomCompoundVdom/TestCompound', [
   'tmpl!WSTest/VdomCompoundVdom/TestCompound',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            compoundText: 'compound text'
         }
      },
   });
   return moduleClass;
});