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
      'wml!Controls-demo/Filter/Button/ChooseDate'
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
               {id: 'kind', value: ['0'], resetValue: ['0'], textValue: 'All'},
               {id: 'type', value: ['0'], resetValue: ['0'], textValue: ''}
            ];
            this._itemsKaizen = [
               {id: 'own', value: ['0'], resetValue: ['0'], textValue: 'All'},
               {id: 'used', value: ['0'], resetValue: ['0'], textValue: ''},
               {id: 'deleted', value: false, resetValue: false, textValue: 'Show deleted'}
            ];
            this._dataObject = {
               orientation: {
                  selectedKey: 1,
                  displayProperty: 'title',
                  keyProperty: 'id'
               },
               items: {
                  items: [
                     {id: '1', title: 'Filters in discussions'},
                     {id: '2', title: 'Filters in kaizen'}
                  ],
                  value: 'Filters in discussions'
               },
               templateName: {
                  readOnly: true
               },
               lineSpaceTemplate: {
                  items: [
                     {id: '1', title: 'Selection a period'}
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
         },

         _optionsChanged: function(event, options) {
            if (this._currentItems !== options.description.items.value) {
               if (options.description.items.value === 'Filters in kaizen') {
                  this._componentOptions.items = this._itemsKaizen;
               } else if (options.description.items.value === 'Filters in discussions') {
                  this._componentOptions.items = this._items;
               }
               this._currentItems = options.description.items.value;
            }
            if (options.description.lineSpaceTemplate.value === '') {
               this._componentOptions.lineSpaceTemplate = undefined;
            } else if (options.description.lineSpaceTemplate.value === 'Selection a period'){
               this._componentOptions.lineSpaceTemplate = 'wml!Controls-demo/Filter/Button/ChooseDate';
            }
            
         }
      });
      return FilterButtonPG;
   });
