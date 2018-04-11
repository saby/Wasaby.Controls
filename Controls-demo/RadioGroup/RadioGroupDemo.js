
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
               title: 'Done'
            },
            {
               id: "2",
               title: 'From Me'
            },
            {
               id: "3",
               title: 'Controlled'
            },
            {
               id: "4",
               title: 'very'
            },
            {
               id: "5",
               title: 'hard'
            },
            {
               id: "6",
               title: 'invent'
            },
            {
               id: "7",
               title: 'tabs'
            },
            {
               id: "8",
               title: 'titles'
            }
         ]
      });

   var RadioGroupDemo = Control.extend({
      _template: template,
      _source: source
   });
   return RadioGroupDemo;
});