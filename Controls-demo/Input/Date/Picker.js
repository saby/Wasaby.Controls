define('Controls-demo/Input/Date/Picker', [
   'Core/Control',
   'wml!Controls-demo/Input/Date/Picker',
   'css!Controls-demo/Input/Date/Picker'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _date: new Date(2017, 0, 1, 12, 15, 30, 123),

      _masks: [
         'DD.MM.YYYY',
         'DD.MM.YY'
      ]

   });
   return ModuleClass;
});
