define('Controls-demo/datePopup/datePopup', [
   'Core/Control',
   'wml!Controls-demo/datePopup/datePopup'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _startValue: new Date(2019, 4, 3),
      _endValue: new Date(2019, 5, 0)
   });
   return ModuleClass;
});
