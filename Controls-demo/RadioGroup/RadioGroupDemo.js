
define('Controls-demo/RadioGroup/RadioGroupDemo', [
   'Core/Control',
   'tmpl!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Source/Memory'
], function (Control,
             template,
             MemorySource
) {
   'use strict';
   var
      source = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: "1",
               caption: 'Значение1'
            },
            {
               id: "2",
               caption: 'Значение2'
            },
            {
               id: "3",
               caption: 'Значение3'
            },
            {
               id: "4",
               caption: 'Значение4'
            },
            {
               id: "5",
               caption: 'Значение5'
            },
            {
               id: "6",
               caption: 'Значение6'
            },
            {
               id: "7",
               caption: 'Значение7'
            },
            {
               id: "8",
               caption: 'Значение8'
            }
         ]
      });

   var RadioGroupDemo = Control.extend({
      _template: template,
      _source: source,
      _selectKey: null,
      changeKey: function (e, key) {
         this._selectKey=key;
      }
   });
   return RadioGroupDemo;
});