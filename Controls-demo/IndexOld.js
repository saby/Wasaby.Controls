/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/IndexOld', [
   'Core/Control',
   'wml!Controls-demo/IndexOld'
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