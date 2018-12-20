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
                  'M': '[А-ЯA-ZЁ]',
                  'm': '[а-яa-zё]',
                  'l': '[0-9]',
                  'd': '[А-ЯA-Zа-яa-z0-9ёЁ]'
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
                  readOnly: false
               },
               replacer: {
                  readOnly: false
               },
               formatMaskChars: {
                  items: [
                     {
                        id: '1', title: 'default', example: 'L:[А-ЯA-ZЁ]\nl:[а-яa-zё]\nd:[0-9]\nx:[А-ЯA-Zа-яa-z0-9ёЁ]', items: this._items
                     },
                     {
                        id: '2', title: 'secondary', example: 'M:[А-ЯA-ZЁ]\nm:[а-яa-zё]\nk:[0-9]\nd:[А-ЯA-Zа-яa-z0-9ёЁ]', items: this._itemsSimple
                     }
                  ],
                  value: 'default',
                  config: {
                     template: 'custom',
                     value: 'title',
                     comment: 'example'
                  }
               }
            };
            this._componentOptions = {
               name: 'Mask',
               mask: 'dd-dd dd',
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
