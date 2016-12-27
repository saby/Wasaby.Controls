/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.DOCS.FBAdditionalTemplateA', 
   [
      'js!SBIS3.CORE.CompoundControl', 
      'html!SBIS3.DOCS.FBAdditionalTemplateA', 
      'js!SBIS3.CONTROLS.FilterLink', 
      'js!SBIS3.CONTROLS.FilterSelect'
   ], 
   function(
      CompoundControl, 
      dotTplFn
   ) {
   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      init: function() {
         moduleClass.superclass.init.call(this);
      
      }
   });

   return moduleClass;
});