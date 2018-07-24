define('Controls-demo/Checkbox/Checkbox', [
   'Core/Control',
   'tmpl!Controls-demo/Checkbox/Checkbox',
   'WS.Data/Source/Memory',
   'Controls/Toggle/Checkbox',
   'css!Controls-demo/Checkbox/Checkbox',
], function(Control, template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         _readOnly: false,
         _caption: 'no caption',
         _triState: false,
         _tooltip: 'tooltip',
         _value: false,
         changeValue: function(e, value) {
            this._value = value;
         }
      });
   return ModuleClass;
});