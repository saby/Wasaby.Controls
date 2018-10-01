define('Controls-demo/Filter/Button/ButtonPG',
   [
      'Core/Control',
      'wml!Controls-demo/Filter/Button/ButtonPG',
      'WS.Data/Source/Memory',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
      'Controls/Input/Dropdown',
      'wml!Controls-demo/Filter/Button/buttonPGTemplate',
      'wml!Controls-demo/Filter/Button/mainBlockPG',
      'wml!Controls-demo/Filter/Button/ChooseDate',
      'wml!Controls-demo/Filter/Button/TextLine'
   ],

   function(Control, template, MemorySource, config) {
      'use strict';

      var FilterButtonPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Filter/Button',
         _dataObject: null,
         _componentOptions: null,
         _items: null,
         _itemsKaizen: null,
         _eventType: 'itemsChanged',
         _nameOption: 'items',
         _currentItems: 'Filters in contacts',

         _beforeMount: function() {
            this._items = [
               {
                  id: 'kind', value: ['0'], resetValue: ['0'], textValue: 'All'
               },
               {
                  id: 'type', value: ['0'], resetValue: ['0'], textValue: ''
               }
            ];
            this._itemsKaizen = [
               {
                  id: 'own', value: ['0'], resetValue: ['0'], textValue: 'All'
               },
               {
                  id: 'used', value: ['0'], resetValue: ['0'], textValue: ''
               },
               {
                  id: 'deleted', value: false, resetValue: false, textValue: 'Show deleted'
               }
            ];
            this._dataObject = {
               orientation: {
                  selectedKey: 1,
                  displayProperty: 'title',
                  keyProperty: 'id'
               },
               items: {
                  items: [
                     { id: '1', title: 'Filters in discussions', items: this._items },
                     { id: '2', title: 'Filters in kaizen', items: this._itemsKaizen }
                  ],
                  value: 'Filters in discussions'
               },
               templateName: {
                  readOnly: true
               },
               lineSpaceTemplate: {
                  items: [
                     { id: '1', title: 'Selection a period', template: 'wml!Controls-demo/Filter/Button/ChooseDate' },
                     { id: '2', title: 'Text', template: 'wml!Controls-demo/Filter/Button/TextLine' }
                  ],
                  value: 'Selection a period'
               }
            };
            this._componentOptions = {
               name: 'filterButton',
               readOnly: false,
               orientation: 'left',
               lineSpaceTemplate: 'wml!Controls-demo/Filter/Button/ChooseDate',
               templateName: 'wml!Controls-demo/Filter/Button/buttonPGTemplate',
               items: this._items
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return FilterButtonPG;
   });
