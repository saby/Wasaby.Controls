
define('Controls-demo/RadioGroup/RadioGroupDemo', [
   'Core/Control',
   'wml!Controls-demo/RadioGroup/RadioGroupDemo',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/RadioGroup/resources/RadioItemTemplate',
   'wml!Controls-demo/RadioGroup/resources/SingleItemTemplate',
   'wml!Controls-demo/RadioGroup/resources/ContentTemplate',
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
            title: 'Title1',
            caption: 'Additional caption1'
         },
         {
            id: '2',
            title: 'Title2',
            caption: 'Additional caption2'
         },
         {
            id: '3',
            title: 'Title3',
            templateTwo: 'wml!Controls-demo/RadioGroup/resources/SingleItemTemplate',
            caption: 'Additional caption3'
         },
         {
            id: '4',
            title: 'Title4',
            caption: 'Additional caption4'
         },
         {
            id: '5',
            title: 'Title5',
            caption: 'Additional caption5'
         },
         {
            id: '6',
            title: 'Title6',
            caption: 'Additional caption6'
         }
      ]
   });

   var source2 = new MemorySource({
      idProperty: 'id',
      data: [
         {
            id: '1',
            title: 'Header1',
            caption: 'Caption1'
         },
         {
            id: '2',
            title: 'Header2',
            caption: 'Caption2'
         },
         {
            id: '3',
            title: 'Header3',
            caption: 'Caption3'
         },
         {
            id: '4',
            title: 'Header4',
            caption: 'Caption4'
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
            template: 'wml!Controls-demo/RadioGroup/resources/ContentTemplate'
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
      _displayProperty: 'title',

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
      changeSelectedKey: function(e, key) {
         this._selectKey = key;
      },
      changedDisplayProperty: function(e, displayPropertyValue) {
         this._displayProperty = (displayPropertyValue ? 'caption' : 'title');
      },
      reset: function() {
         this._eventName = 'no event';
      }
   });
   return RadioGroupDemo;
});