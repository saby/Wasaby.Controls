define('Controls-demo/Headers/demoHeader', [
   'Core/Control',
   'tmpl!Controls-demo/Headers/demoHeader',
   'css!Controls-demo/Headers/demoHeader'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,

         clickHandler: function (e) {
            console.log('click');
         }
      });
   return ModuleClass;
});