
define('Controls-demo/RadioGroup/RadioGroupDemo', [
   'Core/Control',
   'tmpl!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/RadioGroup/resources/RadioItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/UnionItemTemplate',
   'css!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Collection/RecordSet'// Удалить после мержа https://online.sbis.ru/opendoc.html?guid=6989b29a-8e1d-4c3b-bb7d-23b09736ef2c
], function(Control,
             template,
             MemorySource,
             CustomItemTemplate,
             SingleItemTemplate,
             UnionItemTemplate
) {
   'use strict';
   var source = new MemorySource({
      idProperty: 'id',
      displayProperty: 'caption',
      data: [
         {
            id: '1',
            title: 'Caption1',
            caption: 'Additional caption1'
         },
         {
            id: '2',
            title: 'Caption2',
            caption: 'Additional caption2'
         },
         {
            id: '3',
            title: 'Caption3',
            templateTwo: 'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate',
            caption: 'Additional caption3'
         },
         {
            id: '4',
            title: 'Caption4',
            caption: 'Additional caption4'
         },
         {
            id: '5',
            title: 'Caption5',
            caption: 'Additional caption5'
         },
         {
            id: '6',
            title: 'Caption6',
            caption: 'Additional caption6'
         }
      ]
   });

   var source2 = new MemorySource({
      idProperty: 'id',
      data: [
         {
            id: '1',
            title: 'Header1'
         },
         {
            id: '2',
            title: 'Header2'
         },
         {
            id: '3',
            title: 'Header3'
         },
         {
            id: '4',
            title: 'Header4'
         },
         {
            id: '5',
            title: 'Header5'
         },
         {
            id: '6',
            title: 'Header6'
         }
      ]
   });

   var sourceOfSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'Source',
            source: source
         },
         {
            title: 'Source2',
            source: source2
         }
      ]
   });

   var directionSource = new MemorySource({
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

   var RadioGroupDemo = Control.extend({
      _template: template,
      _customItemTemplate: CustomItemTemplate,
      _unionItemTemplate: UnionItemTemplate,
      _source: source,
      _sourceOfSource: sourceOfSource,
      _selectKey: null,
      _selectedSource: 'Source',
      _selectedDirection: 'vertical',
      _directionSource: directionSource,

      changeKey: function(e, key) {
         this._selectKey = key;
      },
      changeSource: function(e, key) {
         sourceOfSource.read(key).addCallback(function(source) {
            this._source = source;
         });
      },
      changeDirection: function(e, key) {
         this._selectedDirection = key;
      }
   });
   return RadioGroupDemo;
});