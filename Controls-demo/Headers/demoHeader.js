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

         clickHandler: function (e) {
            console.log('Click');
         },

         clickCount: function (e) {
            console.log('clickCount');
         },

         clickIcon: function (e) {
            console.log('iconCount');
            this._iconValue = !this._iconValue;
         }
      });
   return ModuleClass;
});