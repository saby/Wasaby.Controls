define('Controls-demo/Filter/Button/PanelVDom',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'tmpl!Controls-demo/Filter/Button/PanelVDom',
      'Controls/Filter/Button/Panel',

      'tmpl!Controls-demo/Filter/Button/resources/withoutAdditional/filterPanelTemplateSimple',
      'tmpl!Controls-demo/Filter/Button/resources/withoutAdditional/mainBlockPanelSimple',

      'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/filterPanelTemplateItemProperty',
      'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/period',
      'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author',

      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/filterPanelTemplateAdditional',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel',

      'css!Controls-demo/Filter/Button/PanelVDom'
   ],

   function(Control, MemorySource, Chain, template) {

      /**
       * @class Controls/Container/Search
       * @extends Controls/Control
       * @control
       * @public
       */

      'use strict';

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

      var sourceGroup = {
         module: 'WS.Data/Source/Memory',
         options: {
            data: [
               {key: 1, title: 'My'},
               {key: 2, title: 'My department'}
            ],
            idProperty: 'key'
         }
      };
      var sourceLimit = {
         module: 'WS.Data/Source/Memory',
         options: {
            data: [
               {key: 1, title: 'Due date'},
               {key: 2, title: 'Overdue'}
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
      var sourceOwner = {
         module: 'WS.Data/Source/Memory',
         options: {
            data: [
               {key: 1, title: 'On me'},
               {key: 2, title: 'On department'}
            ],
            idProperty: 'key'
         }
      };

      var itemsSimple = [
         {id: 'period', value: [1], resetValue: [1], textValue: 'Period', source: sourcePeriod, visibility: true},
         {id: 'state', value: [1], resetValue: [1], textValue: 'Stage', source: sourceState, visibility: true},
         {id: 'sender', value: '', resetValue: '', textValue: 'Sender', visibility: true},
         {id: 'author', value: 'Ivanov K.K.', resetValue: '', textValue: 'Author', visibility: true},
         {id: 'responsible', value: '', resetValue: '', textValue: 'Responsible', visibility: true}
      ];

      var itemsTemplate = [
         {id: 'author', value: '', textValue: 'Author', resetValue: '', visibility: true,
            templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
         { id: 'period', value: [1], textValue: 'Period', resetValue: [1], visibility: true,
            source: sourcePeriod,
            templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/period'}
      ];

      var items = [
         {id: 'period', value: [1], resetValue: [1], textValue: 'Period', source: sourcePeriod, visibility: true},
         {id: 'state', value: [1], resetValue: [1], textValue: 'State', source: sourceState, visibility: true},
         {id: 'limit', value: [1], resetValue: [1], textValue: 'Limit', source: sourceLimit, visibility: true},
         {id: 'sender', value: '', resetValue: '', textValue: 'Sender', visibility: false},
         {id: 'author', value: 'Ivanov K.K.', resetValue: '', textValue: 'Author', visibility: true},
         {id: 'responsible', value: '', resetValue: '', textValue: 'Responsible', visibility: false},
         {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
         {id: 'operation', value: '', resetValue: '', textValue: 'Operation', visibility: false},
         {id: 'group', value: [1], resetValue: '', textValue: 'Department', source: sourceGroup, visibility: false},
         {id: 'unread', value: true, resetValue: '', textValue: 'Unread', visibility: true},
         {id: 'loose', value: '', resetValue: '', textValue: 'Loose', visibility: false},
         {id: 'own', value: [2], resetValue: '', textValue: 'On department', source: sourceOwner, visibility: false},
         {id: 'our organisation', value: '', resetValue: '', textValue: 'Our company', visibility: false},
         {id: 'document', value: '', resetValue: '', textValue: 'Document', visibility: false}
      ];

      var PanelVDom = Control.extend({
         _template: template,

         _filterChangedHandler: function(event, filter) {
            Chain(this._items).each(function(item) {
               item.textValue = filter[item.id];
            });
         },

         _itemsSimple: itemsSimple,
         _itemsTemplate: itemsTemplate,
         _items: items

      });

      return PanelVDom;
   });
