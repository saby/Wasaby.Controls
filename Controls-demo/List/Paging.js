/**
 * Created by kraynovdo on 01.11.2017.
 */
define('Controls-demo/List/Paging', [
   'Core/Control',
   'wml!Controls-demo/List/Paging/Paging'
], function (BaseControl,
             template
   ) {
   'use strict';



   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _selectedKey: 1

      });
   return ModuleClass;
});