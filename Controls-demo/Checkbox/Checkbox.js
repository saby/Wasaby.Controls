define('Controls-demo/Checkbox/Checkbox', [
   'Core/Control',
   'tmpl!Controls-demo/Checkbox/Checkbox',
   'WS.Data/Source/Memory',
   'Controls/Toggle/Checkbox'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         _value: false,
         checkEvent: function (e, value) {
            this._value = value;
            console.log('Value changed');
         }
      });
   return ModuleClass;
});