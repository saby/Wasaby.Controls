define('Controls-demo/Headers/BigSeparator/BigSeparatorDemo', [
   'Core/Control',
   'tmpl!Controls-demo/Headers/BigSeparator/BigSeparatorDemo',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template,
         _eventName: 'no event',
         _value: false,

         valueChangedHandler: function(e, value) {
            this._value = value;
            this._eventName = 'valueChanged';
         },

         separatorChangeStyle: function(e, key) {
            this._separatorSelectedStyle = key;
         },

         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});
