define('Controls-demo/Checkbox/Checkbox', [
   'Core/Control',
   'wml!Controls-demo/Checkbox/Checkbox',
   'WS.Data/Source/Memory',
   'Controls/Toggle/Checkbox',
   'css!Controls-demo/Checkbox/Checkbox',
], function(Control, template, MemorySource) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template,
         _readOnly: false,
         _caption: 'default caption',
         _triState: false,
         _tooltip: 'tooltip',
         _value: false,
         _eventName: 'no event',
         _source: null,
         _beforeMount: function() {
            this._source = new MemorySource({
               idProperty: 'title',
               data: [
                  {
                     title: 'true',
                     value: true
                  },
                  {
                     title: 'false',
                     value: false
                  }
               ]
            });
         },
         reset: function() {
            this._eventName = 'no event';
         },
         changeValue: function(e, key) {
            this._eventName = 'valueChanged';
            this._selectedValue = key;
            var self = this;
            this._source.read(key).addCallback(function(item) {
               self._value = item.get('value');
               self._forceUpdate();
            });
         },
         setTristate: function(e, value) {
            if (value) {
               this._source = new MemorySource({
                  idProperty: 'title',
                  data: [
                     {
                        title: 'true',
                        value: true
                     },
                     {
                        title: 'false',
                        value: false
                     },
                     {
                        title: 'null',
                        value: null
                     }
                  ]
               });
            } else {
               this._source = new MemorySource({
                  idProperty: 'title',
                  data: [
                     {
                        title: 'true',
                        value: true
                     },
                     {
                        title: 'false',
                        value: false
                     }
                  ]
               });
            }
         }
      }
   );
   return ModuleClass;
});
