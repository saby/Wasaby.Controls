define('Controls-demo/Filter/Button/panelOptions/panelPG',
   [
      'Core/Control',
      'wml!Controls-demo/Filter/Button/panelOptions/panelPG',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel',
      'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel',
      'Controls-demo/Filter/Button/panelOptions/HistorySourceDemo',
      'wml!Controls-demo/Filter/Button/resources/itemTemplate/unread',
      'wml!Controls-demo/Filter/Button/ChooseDate'
   ],

   function(Control, template, config) {
      'use strict';
      var TextPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Filter/Button/Panel',
         _dataObject: null,
         _items: null,
         _itemsSimple: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._items = [
               { id: 'period', value: [1], resetValue: [1], myItemTemplate: 'wml!Controls-demo/Filter/Button/ChooseDate' },
               { id: 'state', value: [1], resetValue: [1] },
               { id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: false },
               { id: 'sender', value: '', resetValue: '', visibility: false },
               { id: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: ''},
               { id: 'responsible', value: '', resetValue: '', visibility: false },
               { id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false },
               { id: 'operation', value: '', resetValue: '', visibility: false },
               { id: 'group', value: [1], resetValue: '', visibility: false },
               { id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false, myTemplate: 'wml!Controls-demo/Filter/Button/resources/itemTemplate/unread'  },
               { id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false },
               { id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: false },
               { id: 'our organisation', value: '', resetValue: '', visibility: false },
               { id: 'document', value: '', resetValue: '', visibility: false },
               { id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false }
            ];
            this._itemsSimple = [
               { id: 'period', value: [1], resetValue: [1], myItemTemplate: 'wml!Controls-demo/Filter/Button/ChooseDate' },
               {id: 'loose', value: true, resetValue: false, textValue: 'Loose'},
               {id: 'document', value: '', resetValue: ''},
               {id: 'unread', value: true, resetValue: false, textValue: 'Unread'},
               {id: 'own', value: [1], resetValue: [1]}
            ];
            this._dataObject = {
               items: {
                  items: [
                     { id: '1', title: 'Filters with additional params', items: this._items },
                     { id: '2', title: 'Filters without additional params', items: this._itemsSimple }
                  ],
                  value: 'Filters with additional params'
               },
               historyId: {
                  items: [
                     { id: '1', title: 'DEMO_HISTORY_ID', value: 'DEMO_HISTORY_ID' },
                     { id: '2', title: 'Not specified', value: '' }
                  ],
                  value: 'Not specified'
               },
               additionalTemplate: {
                  items: [
                     {
                        id: '1',
                        title: 'Not specified',
                        template: undefined
                     },
                     {
                        id: '2',
                        title: 'custom template',
                        template: { templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel' }
                     }
                  ],
                  value: 'custom template'
               },
               additionalTemplateProperty: {
                  items: [
                     {id: '1', title: 'template Unread from additionalTemplateProperty', value: 'myTemplate'},
                     {id: '2', title: 'Not specified', value: ''}
                  ],
                  value: 'Not specified'
               },
               itemTemplateProperty: {
                  items: [
                     {id: '1', title: 'first filter from itemTemplateProperty', value: 'myItemTemplate'},
                     {id: '2', title: 'Not specified', value: ''}
                  ],
                  value: 'Not specified'
               },
               itemTemplate: {
                  items: [
                     {
                        id: '1',
                        title: 'Not specified',
                        template: undefined
                     },
                     {
                        id: '2',
                        title: 'custom template',
                        template: { templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel' }
                     }
                  ],
                  value: 'custom template'
               }
            };
            this._componentOptions = {
               name: 'FilterPanel',
               items: this._items,
               additionalTemplate: {
                  templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/additionalBlockPanel'
               },
               additionalTemplateProperty: '',
               itemTemplate: {
                  templateName: 'tmpl!Controls-demo/Filter/Button/resources/withAdditional/mainBlockPanel'
               },
               itemTemplateProperty: '',
               historyId: undefined,
               panelStyle: 'default',
               headerStyle: 'primary',
               title: 'Отбираются',
               readOnly: false
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return TextPG;
   });
