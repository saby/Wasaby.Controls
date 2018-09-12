define('Controls-demo/Buttons/demoButtons', [
   'Core/Control',
   'wml!Controls-demo/Buttons/demoButtons',
   'css!Controls-demo/Buttons/demoButtons',
   'Controls/Button'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         count:0,
         toggleState: false,

         clickHandler: function (e) {
            this.count++;
         },

         clickChangeState: function (e, value) {
            this.toggleState = value;
         }
      });
   return ModuleClass;
});