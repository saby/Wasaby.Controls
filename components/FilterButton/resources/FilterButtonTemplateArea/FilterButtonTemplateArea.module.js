/**
 * Created by as.suhoruchkin on 21.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButtonTemplateArea', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButtonTemplateArea'
], function(CompoundControl, dotTplFn) {

   var FilterButtonTemplateArea = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            template: undefined,
            filterAlign: 'right'
         }
      },
      $constructor: function() {
      }
   });

   return FilterButtonTemplateArea;
});