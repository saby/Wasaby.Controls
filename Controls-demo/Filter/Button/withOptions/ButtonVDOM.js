define('Controls-demo/Filter/Button/withOptions/ButtonVDOM',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'wml!Controls-demo/Filter/Button/withOptions/ButtonVDOM',
      'wml!Controls-demo/Filter/Button/resources/withoutAdditional/filterPanelTemplateSimple',
      'tmpl!Controls-demo/Filter/Button/resources/withoutAdditional/mainBlockPanelSimple',

      'css!Controls-demo/Filter/Button/withOptions/ButtonVDOM'
   ],

   function(Control, MemorySource, Chain, template) {

      /**
       * @class Controls/Container/Search
       * @extends Controls/Control
       * @control
       * @public
       */

      'use strict';
      var PanelVDom = Control.extend({
         _template: template,
         _suggestValue: 'items 1',
         _itemsSimple: null,
         _templateName: 'custom',
         _templateNameItems: null,
         _alignFilterSource: null,
         _selectedKeyOrientation: 'left',
         _lineSpaceValue: false,
         _spaceTemplate: 'default',
         _itemsSpaceTemplate: null,
         _spaceTemplateSource: null,
         _spaceTemplateKeys: null,
         _items: null,
         _eventNameFilter: 'no event',
         _eventNameItems: 'no event',
         _beforeMount: function() {
            this.sourceState = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'All states'},
                     {key: 2, title: 'In progress'},
                     {key: 3, title: 'Done'},
                     {key: 4, title: 'Not done'},
                     {key: 5, title: 'Deleted'}
                  ],
                  idProperty: 'key'
               }
            };
            this.sourcePeriod = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'All time'},
                     {key: 2, title: 'Today'},
                     {key: 3, title: 'Past month'},
                     {key: 4, title: 'Past 6 months'},
                     {key: 5, title: 'Past year'}
                  ],
                  idProperty: 'key'
               }
            };
            this._templateNameItems = [
               {key: 1, title: 'custom'}
            ];
            this._alignFilterSource = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'right'},
                     {key: 2, title: 'left'}
                  ],
                  idProperty: 'key'
               }
            };
            this._itemsSpaceTemplate = [
               {key: 1, title: 'default'},
               {key: 2, title: 'custom template'}
            ];
            this._spaceTemplateSource = [
               {
                  id: 'limit',
                  resetValue: 1,
                  value: 1,
                  properties: {
                     keyProperty: 'key',
                     displayProperty: 'title',
                     source: {
                        module: 'WS.Data/Source/Memory',
                        options: {
                           data: [
                              {key: 1, title: 'Due date'},
                              {key: 2, title: 'Overdue'}
                           ],
                           idProperty: 'key'
                        }
                     }
                  }
               }
            ];
            this._spaceTemplateKeys = [1];
            this._items = [
               {key: 1, title: 'items 1'},
               {key: 2, title: 'items 2'}
            ];
            this._itemsSimple = [
               {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: this.sourcePeriod},
               {id: 'state', value: [1], resetValue: [1], source:  this.sourceState},
               {id: 'sender', value: '', resetValue: ''}
            ];
         },
         reset: function() {
            this._eventNameFilter = 'no event';
            this._eventNameItems = 'no event';
         },

         filterChangeHandler: function() {
            this._eventNameFilter = 'filterChanged';
         },

         itemsChangeHandler: function() {
            this._eventNameItems = 'itemsChanged';
         },

         _suggestHandler: function(event, value) {
            if (value === 'items 1') {
               this._itemsSimple = [
                  {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source:  this.sourcePeriod},
                  {id: 'state', value: [1], resetValue: [1], source:  this.sourceState},
                  {id: 'sender', value: '', resetValue: ''}
               ];
            } else if (value === 'items 2') {
               this._itemsSimple = [
                  {id: 'author', value: 'Ivanov K.K.', resetValue: '', textValue: 'Author: Ivanov K.K.'},
                  {id: 'responsible', value: '', resetValue: ''}
               ];
            }
         },
      });

      return PanelVDom;
   });
