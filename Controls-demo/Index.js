/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/Index', [
   'Core/Control',
   'tmpl!Controls-demo/Index'
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