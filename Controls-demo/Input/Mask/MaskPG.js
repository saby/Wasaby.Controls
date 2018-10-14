define('Controls-demo/Input/Mask/MaskPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, config) {
      'use strict';
      var MaskPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Input/Mask',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._items = {
               'L': '[А-ЯA-ZЁ]',
               'l': '[а-яa-zё]',
               'd': '[0-9]',
               'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
            };
            this._itemsSimple =
               {
                  'L': '[А-ЯA-ZЁ]',
                  'l': '[а-яa-zё]',
                  'd': '[a-z]',
                  'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
               };
            this._dataObject = {
               value: {
                  readOnly: true
               },
               tagStyle: {
                  emptyText: 'none',
                  placeholder: 'select',
                  selectedKey: 0
               },
               mask: {
                  items: [
                     {
                        id: 1,
                        title: 'dd dd dddddd',
                        value: 'dd dd dddddd',
                        example: 'You can use mask of Russian passport'
                     },
                     {
                        id: 2,
                        title: 'ddd-ddd-ddd dd',
                        value: 'ddd-ddd-ddd dd',
                        example: 'You can use mask of INILA(Insurance Number of Individual Ledger Account)'
                     },
                     {
                        id: 3, title: '(ddd(ddd)ddd)', value: '(ddd(ddd)ddd)', example: ''
                     },
                     {
                        id: 4, title: 'd\\{1,3}l\\{1,3}', value: 'd\\{1,3}l\\{1,3}', example: ''
                     }
                  ],
                  config: {
                     template: 'custom',
                     value: 'title',
                     comment: 'example'
                  }
               },

               formatMaskChars: {
                  items: [
                     { id: '1', title: 'default', items: this._items },
                     { id: '2', title: 'secondary', items: this._itemsSimple }
                  ],
                  value: 'default'
               }
            };
            this._componentOptions = {
               name: 'Mask',
               mask: '',
               placeholder: 'Input text',
               tagStyle: 'primary',
               value: '',
               readOnly: false,
               replacer: '',
               tooltip: 'myTooltip',
               formatMaskChars: {
                  'L': '[А-ЯA-ZЁ]',
                  'l': '[а-яa-zё]',
                  'd': '[0-9]',
                  'x': '[А-ЯA-Zа-яa-z0-9ёЁ]'
               }
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return MaskPG;
   });
