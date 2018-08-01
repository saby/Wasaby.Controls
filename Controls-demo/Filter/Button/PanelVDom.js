define('Controls-demo/Filter/Button/PanelVDom',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'tmpl!Controls-demo/Filter/Button/PanelVDom',
      'Controls-demo/Filter/Button/panelOptions/HistorySourceDemo',

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


      var itemsSimple = [
         {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: sourcePeriod},
         {id: 'state', value: [1], resetValue: [1], source: sourceState},
         {id: 'sender', value: '', resetValue: ''},
         {id: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: ''},
         {id: 'responsible', value: '', resetValue: ''}
      ];

      var itemsTemplate = [
         {id: 'author', value: '', resetValue: '',
            templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
         { id: 'period', value: [1], textValue: 'Period', resetValue: [1],
            source: sourcePeriod,
            templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/period'}
      ];

      var items = [
         {id: 'period', value: [1], resetValue: [1]},
         {id: 'state', value: [1], resetValue: [1]},
         {id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: false},
         {id: 'sender', value: '', resetValue: '', visibility: false},
         {id: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: ''},
         {id: 'responsible', value: '', resetValue: '', visibility: false},
         {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
         {id: 'operation', value: '', resetValue: '', visibility: false},
         {id: 'group', value: [1], resetValue: '', visibility: false},
         {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
         {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
         {id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: false},
         {id: 'our organisation', value: '', resetValue: '', visibility: false},
         {id: 'document', value: '', resetValue: '', visibility: false},
         {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
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
         _items: items,
         _itemsHistory: items

      });
      return PanelVDom;
   });
