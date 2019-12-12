define('Controls-demo/Input/Date/Link', [
   'Core/Control',
   'wml!Controls-demo/Input/Date/Link',
   'css!Controls-demo/Input/Date/Link'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _value: new Date()
   });
   return ModuleClass;
});
