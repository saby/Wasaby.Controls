define('Controls-demo/Input/Date/RangeLinkLite', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Date/RangeLinkLite'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _startValue: new Date(2017, 0, 1),
      _endValue: new Date(2017, 0, 31)
   });
   return ModuleClass;
});
