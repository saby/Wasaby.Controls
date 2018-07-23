define('Controls-demo/Buttons/standartDemoButton', [
   'Core/Control',
   'tmpl!Controls-demo/Buttons/standartDemoButton',
   'css!Controls-demo/Buttons/standartDemoButton',
   'Controls/Button'
], function(Control, template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         toggleState: false,

         clickHandler: function(e) {
            this.count++;
         },

         clickChangeState: function(e, value) {
            this.toggleState = value;
         }
      });
   return ModuleClass;
});