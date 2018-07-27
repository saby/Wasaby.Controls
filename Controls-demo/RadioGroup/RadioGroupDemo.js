
define('Controls-demo/RadioGroup/RadioGroupDemo', [
   'Core/Control',
   'tmpl!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/RadioGroup/resources/RadioItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/SingleItemTemplate',
   'tmpl!Controls-demo/RadioGroup/resources/ContentTemplate',
   'css!Controls-demo/RadioGroup/RadioGroupDemo',
   'css!Controls-demo/Headers/resetButton',
   'WS.Data/Collection/RecordSet'// Удалить после мержа https://online.sbis.ru/opendoc.html?guid=6989b29a-8e1d-4c3b-bb7d-23b09736ef2c
], function(Control,
             template,
             MemorySource,
             CustomItemTemplate,
             SingleItemTemplate
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
         }
      ]
   });

   var sourceOfSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'source',
            source: source
         },
         {
            title: 'source2',
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

   var sourceContentTemplate = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default',
            template: ''
         },
         {
            title: 'custom',
            template: 'tmpl!Controls-demo/RadioGroup/resources/ContentTemplate'
         }
      ]
   });

   var RadioGroupDemo = Control.extend({
      _template: template,
      _source: source,
      _sourceOfSource: sourceOfSource,
      _selectKey: null,
      _selectedSource: 'source',
      _selectedDirection: 'vertical',
      _directionSource: directionSource,
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
      changeContentTemplate: function(e, key) {
         this._selectedContentTemplate = key;
         var self = this;
         sourceContentTemplate.read(key).addCallback(function(model) {
            self._contentTemplate = model.get('template');
            self._forceUpdate();
         });
      },
      reset: function() {
         this._eventName = 'no event';
      }
   });
   return RadioGroupDemo;
});