define('Controls-demo/Browser/Browser', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Browser/Browser',
   'Controls/Browser',
   'Controls-demo/Browser/resources/listTemplate'
], function(Control, Memory, template) {
   'use strict';



   var searchConfig = {
      value: ''
   };

   var ModuleClass = Control.extend(
      {
         _template: template,

         _searchConfig: searchConfig
      });
   return ModuleClass;
});
