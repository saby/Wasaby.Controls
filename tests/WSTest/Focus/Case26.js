define('js!WSTest/Focus/Case26', [
   'tmpl!WSTest/Focus/Case26',
   'js!SBIS3.CORE.CompoundControl'
], function(dotTplFn, CompoundControl) {

   var moduleClass = CompoundControl.extend({
      name: 'AreaAbstract0',
      _dotTplFn: dotTplFn,
      _getElementToFocus: function() {
         return $('.div1');
      }
   });
   return moduleClass;
});