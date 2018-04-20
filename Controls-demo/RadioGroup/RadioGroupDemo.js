
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
               tittle: 'Значение1'
            },
            {
               id: "2",
               tittle: 'Значение2'
            },
            {
               id: "3",
               tittle: 'Особенный',
               templateTwo: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate'
            },
            {
               id: "4",
               tittle: 'Значение4'
            },
            {
               id: "5",
               tittle: 'Не такой как все',
               template: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate'
            },
            {
               id: "6",
               tittle: 'Значение6'
            },
            {
               id: "7",
               tittle: 'Супер Особенный',
               templateTwo: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate'
            },
            {
               id: "8",
               tittle: 'Значение8'
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