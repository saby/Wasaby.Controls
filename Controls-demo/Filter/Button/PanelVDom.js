define('Controls-demo/Filter/Button/PanelVDom',
   [
      'Core/Control',
      'Types/source',
      'Types/chain',
      'wml!Controls-demo/Filter/Button/PanelVDom',
      'Controls-demo/Filter/Button/panelOptions/HistorySourceDemo',

      'wml!Controls-demo/Filter/Button/resources/withoutAdditional/filterPanelTemplateSimple',
      'tmpl!Controls-demo/Filter/Button/resources/withoutAdditional/mainBlockPanelSimple',

      'wml!Controls-demo/Filter/Button/resources/itemTemplate/filterPanelTemplateItemProperty',
      'wml!Controls-demo/Filter/Button/resources/itemTemplate/period',
      'wml!Controls-demo/Filter/Button/resources/itemTemplate/author',

      'wml!Controls-demo/Filter/Button/resources/withAdditional/filterPanelTemplateAdditional',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel',

      'css!Controls-demo/Filter/Button/PanelVDom'
   ],

   function(Control, sourceLib, chain, template) {

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
         _sourcePeriod: null,
         _stateSource: null,
         _beforeMount: function() {
            this._periodSource = new sourceLib.Memory({
               data: [
                  {key: 1, title: 'All time'},
                  {key: 2, title: 'Today'},
                  {key: 3, title: 'Past month'},
                  {key: 4, title: 'Past 6 months'},
                  {key: 5, title: 'Past year'}
               ],
               idProperty: 'key'
            });
            this._stateSource = new sourceLib.Memory({
               data: [
                  {key: 1, title: 'All states'},
                  {key: 2, title: 'In progress'},
                  {key: 3, title: 'Done'},
                  {key: 4, title: 'Not done'},
                  {key: 5, title: 'Deleted'}
               ],
               idProperty: 'key'
            });
            this._limitSource = new sourceLib.Memory({
               idProperty: 'key',
               data: [
                  {key: 1, title: 'Due date'},
                  {key: 2, title: 'Overdue'}
               ]
            });
            this._itemsSimple = [
               {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: this._periodSource},
               {id: 'state', value: [1], resetValue: [1], source: this._stateSource},
               {id: 'sender', value: '', resetValue: ''},
               {id: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: ''},
               {id: 'responsible', value: '', resetValue: ''}
            ];
            this._itemsTemplate = [
               {id: 'author', value: 'Author: Ivanov A.A.', resetValue: '', textValue: 'Author: Ivanov A.A.',
                  templateItem: 'wml!Controls-demo/Filter/Button/resources/itemTemplate/author'},
               { id: 'period', value: [1], textValue: 'Period', resetValue: [1],
                  source: this._periodSource,
                  templateItem: 'wml!Controls-demo/Filter/Button/resources/itemTemplate/period'}
            ];
            this._items = [
               {id: 'period', value: [1], resetValue: [1], source: this._periodSource},
               {id: 'state', value: [1], resetValue: [1], source: this._stateSource},
               {id: 'limit', value: [1], resetValue: [1], textValue: 'Due date', visibility: false, source: this._limitSource},
               {id: 'sender', value: '', resetValue: '', visibility: false},
               {id: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: ''},
               {id: 'responsible', value: '', resetValue: '', visibility: false},
               {id: 'tagging', value: false, resetValue: false, textValue: 'Marks', visibility: false},
               {id: 'operation', value: '', resetValue: '', visibility: false},
               {id: 'group', value: [1], resetValue: '', visibility: false, source: new sourceLib.Memory({
                  idProperty: 'key',
                  data: [
                     { key: 1, title: 'My' },
                     { key: 2, title: 'My department' }
                  ]
               })},
               {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
               {id: 'own', value: 2, resetValue: '', textValue: 'On department', visibility: false, source: new sourceLib.Memory({
                  idProperty: 'key',
                  data: [
                     { key: 1, title: 'On me' },
                     { key: 2, title: 'On department' }
                  ]
               })},
               {id: 'our organisation', value: '', resetValue: '', visibility: false},
               {id: 'document', value: '', resetValue: '', visibility: false},
               {id: 'activity', value: [1], resetValue: [1], visibility: false, source: new sourceLib.Memory({
                  idProperty: 'key',
                  data: [
                     { key: 1, title: 'Activity for the last month' },
                     { key: 2, title: 'Activity for the last quarter' },
                     { key: 3, title: 'Activity for the last year' }
                  ]
               })}
            ];
            this._itemsHistory = this._items;
         },
         _filterChangedHandler: function(event, filter) {
            chain.factory(this._items).each(function(item) {
               item.textValue = filter[item.id];
            });
         }

      });
      return PanelVDom;
   });
