
define('Controls-demo/RadioGroup/RadioGroupDemo', [
   'Core/Control',
   'tmpl!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/RadioGroup/resources/RadioItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/UnionItemTemplate',
   'css!Controls-demo/RadioGroup/RadioGroupDemo'
], function (Control,
             template,
             MemorySource,
             CustomItemTemplate,
             SingleItemTemplate,
             UnionItemTemplate
) {
   'use strict';
   var source = new MemorySource({
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
               caption: 'Не такой как все',
               template: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate'
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
      _customItemTemplate: CustomItemTemplate,
      _unionItemTemplate: UnionItemTemplate,
      _source: source,
      _selectKey: null,
      changeKey: function (e, key) {
         this._selectKey=key;
      }
   });
   return RadioGroupDemo;
});