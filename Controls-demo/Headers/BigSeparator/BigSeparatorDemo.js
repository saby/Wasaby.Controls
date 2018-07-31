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

         clickIcon: function(e) {
            this._value = !this._value;
            this._eventName = 'click';
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
