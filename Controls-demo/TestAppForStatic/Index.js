define('Controls-demo/TestAppForStatic/Index', [
   'Core/Control',
   'wml!Controls-demo/TestAppForStatic/Index'
], function (BaseControl,
             template
) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template
      });

   return ModuleClass;
});
