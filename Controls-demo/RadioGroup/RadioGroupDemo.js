
define('Controls-demo/RadioGroup/RadioGroupDemo', [
   'Core/Control',
   'tmpl!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/RadioGroup/resources/RadioItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/UnionItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/DefaultItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/ContentTemplate',
   'css!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Collection/RecordSet'// Удалить после мержа https://online.sbis.ru/opendoc.html?guid=6989b29a-8e1d-4c3b-bb7d-23b09736ef2c
], function(Control,
             template,
             MemorySource,
             CustomItemTemplate,
             SingleItemTemplate,
             UnionItemTemplate,
             DefaultItemTemplate
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

   var sourceItemTemplate = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default',
            template: 'tmpl!Controls-demo/RadioGroup/resources/DefaultItemTemplate'
         },
         {
            title: 'custom',
            template: 'tmpl!Controls-demo/RadioGroup/resources/RadioItemTemplate'
         }
      ]
   });

   var sourceContentTemplate = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default',
            template: ''
         },
         {
            title: 'custom(only with item template === default)',
            template: 'tmpl!Controls-demo/RadioGroup/resources/ContentTemplate'
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
      _itemTemplatePropertyFlag: false,
      _sourceItemTemplate: sourceItemTemplate,
      _selectedItemTemplate: 'default',
      _itemTemplate: DefaultItemTemplate,
      _sourceContentTemplate: sourceContentTemplate,
      _selectedContentTemplate: 'default',
      _contentTemplate: '',
      _eventName: 'no event',

      changeKey: function(e, key) {
         this._selectKey = key;
         this._eventName = 'selectedKeyChanged';
      },
      changeSource: function(e, key) {
         this._selectedSource = key;
         var self = this;
         sourceOfSource.read(key).addCallback(function(model) {
            self._source = model.get('source');
            self._forceUpdate();
         });
      },
      changeDirection: function(e, key) {
         this._selectedDirection = key;
      },
      changeItemTemplate: function(e, key) {
         this._selectedItemTemplate = key;
         var self = this;
         sourceItemTemplate.read(key).addCallback(function(model) {
            self._itemTemplate = model.get('template');
            self._forceUpdate();
         });
      },
      changeContentTemplate: function(e, key) {
         this._selectedContentTemplate = key;
         var self = this;
         sourceContentTemplate.read(key).addCallback(function(model) {
            self._contentTemplate = model.get('template');
            self._forceUpdate();
         });
      }
   });
   return RadioGroupDemo;
});