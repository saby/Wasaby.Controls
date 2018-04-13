
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
               caption: 'radio1'
            },
            {
               id: "2",
               caption: 'radio2'
            },
            {
               id: "3",
               caption: 'radio3'
            },
            {
               id: "4",
               caption: 'radio4'
            },
            {
               id: "5",
               caption: 'radio5'
            },
            {
               id: "6",
               caption: 'radio6'
            },
            {
               id: "7",
               caption: 'radio7'
            },
            {
               id: "8",
               caption: 'radio8'
            }
         ]
      });

   var RadioGroupDemo = Control.extend({
      _template: template,
      _source: source
   });
   return RadioGroupDemo;
});