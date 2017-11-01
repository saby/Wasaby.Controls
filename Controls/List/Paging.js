/**
 * Created by kraynovdo on 01.11.2017.
 */
define('js!Controls/List/Paging', [
   'Core/Control',
   'tmpl!Controls/List/Paging'
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