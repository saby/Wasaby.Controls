define('Controls-demo/Filter/Button/panelOptions/PanelVDom',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'tmpl!Controls-demo/Filter/Button/panelOptions/PanelVDom',
      'Controls/Filter/Button/Panel',

      'tmpl!Controls-demo/Filter/Button/panelOptions/filterPanelTemplateOptions',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel',

      'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author',

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

      var spaceTemplateSource = {
         module: 'WS.Data/Source/Memory',
         options: {
            data: [
               {key: 1, title: 'It is space line template'},
               {key: 2, title: 'Second line'}
            ],
            idProperty: 'key'
         }
      };

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
         {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: sourcePeriod},
         {id: 'state', value: [1], resetValue: [1], source: sourceState},
         {id: 'sender', value: '', resetValue: ''},
         {id: 'author', value: 'Ivanov K.K.', resetValue: '', templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
         {id: 'responsible', value: '', resetValue: ''}
      ];

      var items = [
         {id: 'period', value: [2], resetValue: [1], textValue: 'Today', source: sourcePeriod},
         {id: 'state', value: [1], resetValue: [1], source: sourceState},
         {id: 'limit', value: [1], resetValue: '', source: sourceLimit, visibility: false},
         {id: 'sender', value: '', resetValue: ''},
         {id: 'author', value: 'Ivanov K.K.', resetValue: '', templateItem: 'tmpl!Controls-demo/Filter/Button/resources/itemTemplate/author'},
         {id: 'responsible', value: '', resetValue: ''},
         {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
         {id: 'operation', value: '', resetValue: '', visibility: false},
         {id: 'group', value: [1], resetValue: '', source: sourceGroup, visibility: false},
         {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
         {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
         {id: 'own', value: [2], resetValue: '', textValue: 'On department', source: sourceOwner, visibility: false},
         {id: 'our organisation', value: '', resetValue: '', visibility: false},
         {id: 'document', value: '', resetValue: '', visibility: false}
      ];

      var PanelVDom = Control.extend({
         _template: template,
         _itemTemplate: { templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel'},
         _addTemplate: {templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel'},
         _itemsSimple: items,
         _hasItemTemplateProperty: false,

         valueChangedHandler: function(event, value) {
            if (value) {
               this._itemsSimple = itemsSimple;
               this._addTemplate = null;
            } else {
               this._itemsSimple = items;
               this._addTemplate = {templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel'};
            }
         },

         valueChangedHandler2: function(event, value) {
            if (value) {
               this._itemTemplateProperty = 'templateItem';
            } else {
               this._itemTemplateProperty = null;
            }
         },

         _title: 'Отбираются',

         _alignFilterSource: alignFilterSource,
         _selectedKeyOrientation: 'left',
         _selectedKeyStyle: 'primary',
         _spaceTemplateKeys: [1],
         _spaceTemplateSource: spaceTemplateSource,
         _spaceTemplate: false,
         _additionalBlock: false,

         _items: items

      });

      return PanelVDom;
   });
