
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
               title: 'Значение1'
            },
            {
               id: "2",
               title: 'Значение2'
            },
            {
               id: "3",
               title: 'Особенный',
               templateTwo: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate'
            },
            {
               id: "4",
               title: 'Значение4',
               displayProperty: 'caption',
               caption: 'Другое значение'
            },
            {
               id: "5",
               title: 'Не такой как все',
               template: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate'
            },
            {
               id: "6",
               title: 'Значение6'
            },
            {
               id: "7",
               title: 'Супер Особенный',
               templateTwo: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate'
            },
            {
               id: "8",
               title: 'Значение8'
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