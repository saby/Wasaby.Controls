define('Controls-demo/Input/Text/TextPG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'Core/core-merge',
      'tmpl!Controls-demo/Input/Text/TextPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, MemorySource, Chain, cMerge, template, myTmpl, config) {
      'use strict';
      var TextPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Input/Text',
         _my: myTmpl,
         _dataObject: null,
         _textOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               },
               tagStyle: {
                  emptyText: 'none',
                  placeholder: 'select'
               },
               constraint: {
                  source: [
                     { id: 1, title: '[0-9]', example: 'You can use only digits' },
                     { id: 2, title: '[a-zA-Z]', example: 'You can use only letters' },
                     { id: 3, title: '[a-z]', example: 'You can use only lowercase letters' },
                     { id: 4, title: '[A-Z]', example: 'You can use only uppercase letters' }
                  ],
                  config: {
                     template: 'custom',
                     value: 'title',
                     comment: 'example'
                  }
               }
            };
            this._textOptions = {
               name: 'Switch',
               placeholder: 'Input text',
               tagStyle: 'primary',
               constraint: '',
               trim: false,
               maxLength: 100,
               selectOnClick: true,
               readOnly: false,
               tooltip: 'myTooltip',
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return TextPG;
   });
