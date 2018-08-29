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
          var PanelVDom = Control.extend({
         _template: template,
         _itemsSimple: null,
         _itemsTemplate: null,
         _items: null,
         _itemsHistory: null,
         sourcePeriod: null,
         sourceState: null,
         _beforeMount: function() {
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
            this._itemsSimple = [
               {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: this.sourcePeriod},
               {id: 'state', value: [1], resetValue: [1], source: this.sourceState},
               {id: 'sender', value: '', resetValue: ''},
               {id: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: ''},
               {id: 'responsible', value: '', resetValue: ''}
            ];
            this._itemsTemplate = [
               {id: 'author', value: '', resetValue: '',
                  templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
               { id: 'period', value: [1], textValue: 'Period', resetValue: [1],
                  source: this.sourcePeriod,
                  templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/period'}
            ];
            this._items = [
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
            this._itemsHistory = this._items;
         },
         _filterChangedHandler: function(event, filter) {
            Chain(this._items).each(function(item) {
               item.textValue = filter[item.id];
            });
         }

      });
      return PanelVDom;
   });
