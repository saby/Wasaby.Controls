define('Controls-demo/Filter/Button/withOptions/ButtonVDOM',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'tmpl!Controls-demo/Filter/Button/withOptions/ButtonVDOM',
      'tmpl!Controls-demo/Filter/Button/resources/withoutAdditional/filterPanelTemplateSimple',
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

      var alignFilterSource = {
         module: 'WS.Data/Source/Memory',
         options: {
            data: [
               {key: 1, title: 'right'},
               {key: 2, title: 'left'}
            ],
            idProperty: 'key'
         }
      };

      var sourcePeriod = {
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

      var sourceState = {
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

      var spaceTemplateSource = [
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

      var _items =  [
         {key: 1, title: 'items 1'},
         {key: 2, title: 'items 2'}
      ];

      var _itemsSpaceTemplate = [
         {key: 1, title: 'default'},
         {key: 2, title: 'custom template'}
      ];

      var _templateNameItems = [
         {key: 1, title: 'custom'}
      ];

      var items1 = [
         {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: sourcePeriod},
         {id: 'state', value: [1], resetValue: [1], source: sourceState},
         {id: 'sender', value: '', resetValue: ''}
      ];

      var items2 = [
         {id: 'author', value: 'Ivanov K.K.', resetValue: '', textValue: 'Author: Ivanov K.K.'},
         {id: 'responsible', value: '', resetValue: ''}

      ];

      var PanelVDom = Control.extend({
         _template: template,
         _suggestValue: 'items 1',
         _itemsSimple: items1,
         _templateName: 'custom',
         _templateNameItems: _templateNameItems,

         _suggestHandler: function(event, value) {
            if (value === 'items 1') {
               this._itemsSimple = items1;
            } else if (value === 'items 2') {
               this._itemsSimple = items2;
            }
         },

         _alignFilterSource: alignFilterSource,
         _selectedKeyOrientation: 'left',
         _lineSpaceValue: false,
         _spaceTemplate: 'default',
         _itemsSpaceTemplate: _itemsSpaceTemplate,
         _spaceTemplateSource: spaceTemplateSource,
         _spaceTemplateKeys: [1],
         _items: _items

      });

      return PanelVDom;
   });
