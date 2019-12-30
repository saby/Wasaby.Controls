define('WSTest/VdomCompoundVdom/TestCompound', [
   'tmpl!WSTest/VdomCompoundVdom/TestCompound',
   'Lib/Control/CompoundControl/CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            compoundText: 'compound text'
         }
      }
   });
   return moduleClass;
});