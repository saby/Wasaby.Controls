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
         _iconValue: false,

         clickIcon: function (e) {
            this._iconValue = !this._iconValue;
         }
      });
   return ModuleClass;
});