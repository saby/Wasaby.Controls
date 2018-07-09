define('Controls-demo/Headers/axureDemoHeader', [
   'Core/Control',
   'tmpl!Controls-demo/Headers/axureDemoHeader',
   'css!Controls-demo/Headers/axureDemoHeader'
], function(Control, template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         _iconValue: false,

         clickIcon: function(e) {
            this._iconValue = !this._iconValue;
         }
      });
   return ModuleClass;
});