define('Controls-demo/Switch/DoubleSwitchDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Switch/DoubleSwitchDemo',
   'css!Controls-demo/Headers/resetButton',
   'css!Controls-demo/Switch/UnionSwitchDemo',
   'css!Controls-demo/Switch/DoubleSwitchDemo'
], function(Control, MemorySource, template) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _orientationSource: null,
         _selectedOrientation: 'horizontal',
         _caption1: 'on',
         _caption2: 'off',
         _tooltip: '',
         _eventName: 'no event',
         _beforeMount: function() {
            this._orientationSource = new MemorySource({
               idProperty: 'title',
               data: [
                  {
                     title: 'horizontal'
                  },
                  {
                     title: 'vertical'
                  }
               ]
            });
         },

         changeOrientation: function(e, key) {
            this._selectedOrientation = key;
         },

         changeValue: function(e, value) {
            this._value = value;
            this._eventName = 'valueChanged';
         },
         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});