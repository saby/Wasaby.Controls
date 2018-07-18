define('Controls-demo/Headers/standartDemoHeader', [
   'Core/Control',
   'tmpl!Controls-demo/Headers/standartDemoHeader',
   'css!Controls-demo/Headers/standartDemoHeader',
   'css!components/themes/fonts/glyphs'
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