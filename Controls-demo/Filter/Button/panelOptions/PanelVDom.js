define('Controls-demo/Filter/Button/panelOptions/PanelVDom',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'tmpl!Controls-demo/Filter/Button/panelOptions/PanelVDom',

      'tmpl!Controls-demo/Filter/Button/panelOptions/filterPanelTemplateOptions',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel',

      'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author',

      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel',
      'Controls-demo/Filter/Button/panelOptions/HistorySourceDemo',

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
         _itemTemplate: null,
         _addTemplate: null,
         _itemsSimple: null,
         _hasItemTemplateProperty: false,
         _eventNameFilter: 'no event',
         _eventNameItems: 'no event',
         _title: 'Отбираются',
         _alignFilterSource: null,
         _selectedKeyOrientation: 'left',
         _selectedKeyStyle: 'primary',
         _spaceTemplateKeys: null,
         _spaceTemplateSource: null,
         _spaceTemplate: false,
         _additionalBlock: false,
         _historyBlock: false,
         _items: null,
         _sourcePeriod: null,
         _sourceGroup: null,
         _sourceLimit: null,
         _sourceState: null,
         _sourceOwner: null,
         _beforeMount: function() {
            this._itemTemplate = { templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel' };
            this.sourceOwner = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'On me'},
                     {key: 2, title: 'On department'}
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
            this.sourceLimit = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'Due date'},
                     {key: 2, title: 'Overdue'}
                  ],
                  idProperty: 'key'
               }
            };
            this.sourceGroup = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'My'},
                     {key: 2, title: 'My department'}
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
            this._itemsSimple = [
               {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: this.sourcePeriod},
               {id: 'state', value: [1], resetValue: [1], source: this.sourceState},
               {id: 'sender', value: '', resetValue: ''},
               {id: 'author', value: 'Ivanov K.K.', resetValue: '', templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
               {id: 'responsible', value: '', resetValue: ''}
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
            this._spaceTemplateKeys = [1];
            this._spaceTemplateSource = {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {key: 1, title: 'It is space line template'},
                     {key: 2, title: 'Second line'}
                  ],
                  idProperty: 'key'
               }
            };
            this._items = [
               {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: this.sourcePeriod},
               {id: 'state', value: [1], resetValue: [1], source: this.sourceState},
               {id: 'limit', value: [1], resetValue: '', source: this.sourceLimit, visibility: false},
               {id: 'sender', value: '', resetValue: ''},
               {id: 'author', value: 'Ivanov K.K.', resetValue: '', templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
               {id: 'responsible', value: '', resetValue: ''},
               {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
               {id: 'operation', value: '', resetValue: '', visibility: false},
               {id: 'group', value: [1], resetValue: '', source: this.sourceGroup, visibility: false},
               {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
               {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
               {id: 'own', value: [2], resetValue: '', textValue: 'On department', source: this.sourceOwner, visibility: false},
               {id: 'our organisation', value: '', resetValue: '', visibility: false},
               {id: 'document', value: '', resetValue: '', visibility: false}
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

         valueChangedHandler: function(event, value) {
            if (value) {
               this._itemsSimple = [
                  {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: this.sourcePeriod},
                  {id: 'state', value: [1], resetValue: [1], source: this.sourceState},
                  {id: 'limit', value: [1], resetValue: '', source: this.sourceLimit, visibility: false},
                  {id: 'sender', value: '', resetValue: ''},
                  {id: 'author', value: 'Ivanov K.K.', resetValue: '', templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
                  {id: 'responsible', value: '', resetValue: ''},
                  {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
                  {id: 'operation', value: '', resetValue: '', visibility: false},
                  {id: 'group', value: [1], resetValue: '', source: this.sourceGroup, visibility: false},
                  {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
                  {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
                  {id: 'own', value: [2], resetValue: '', textValue: 'On department', source: this.sourceOwner, visibility: false},
                  {id: 'our organisation', value: '', resetValue: '', visibility: false},
                  {id: 'document', value: '', resetValue: '', visibility: false}
               ];
               this._addTemplate = {templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel'};
            } else {
               this._itemsSimple = [
                  {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: this.sourcePeriod},
                  {id: 'state', value: [1], resetValue: [1], source: this.sourceState},
                  {id: 'sender', value: '', resetValue: ''},
                  {id: 'author', value: 'Ivanov K.K.', resetValue: '', templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
                  {id: 'responsible', value: '', resetValue: ''}
               ];
               this._addTemplate = null;
            }
         },

         valueChangedHandler2: function(event, value) {
            if (value) {
               this._itemTemplateProperty = 'templateItem';
            } else {
               this._itemTemplateProperty = null;
            }
         },
      });

      return PanelVDom;
   });
