define('Controls-demo/Input/Date/Range', [
   'Core/Control',
   'wml!Controls-demo/Input/Date/Range',
   'css!Controls-demo/Input/Date/Range'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _startDate: new Date(2017, 0, 1, 12, 15, 30, 123),
      _endDate: new Date(2017, 0, 2, 12, 15, 30, 123),

      _masks: [
         'DD.MM.YY',
         'DD.MM.YYYY'
      ]

   });
   return ModuleClass;
});
