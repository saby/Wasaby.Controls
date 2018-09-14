define('Controls-demo/Date/PeriodDialog', [
   'Core/Control',
   'wml!Controls-demo/Date/PeriodDialog',
   'css!themes/online/online'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _year: new Date(1900, 0, 1),
      _startValue: new Date(1900, 1, 3),
      _endValue: new Date(1900, 2, 0)
   });
   return ModuleClass;
});
