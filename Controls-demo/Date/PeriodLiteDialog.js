define('Controls-demo/Date/PeriodLiteDialog', [
   'Core/Control',
   'tmpl!Controls-demo/Date/PeriodLiteDialog'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _year: new Date(2017, 0, 1),
      _startValue: new Date(2017, 0, 1),
      _endValue: new Date(2017, 1, 0),
      _endValue2: new Date(2017, 2, 31),
      _endValue3: new Date(2017, 11, 31),
      _checkedStart: new Date(2017, 3, 1)
   });
   return ModuleClass;
});
