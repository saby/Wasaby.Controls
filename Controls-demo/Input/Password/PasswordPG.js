define('Controls-demo/Input/Password/PasswordPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Text/TextPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, myTmpl, config) {
      'use strict';
      var PasswordPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Input/Password',
         _my: myTmpl,
         _dataObject: null,
         _textOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: false
               },
               tagStyle: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               }
            };
            this._textOptions = {
               name: 'Password',
               mask: '',
               placeholder: 'Input text',
               tagStyle: 'primary',
               readOnly: false,
               tooltip: 'myTooltip',
               validationErrors: ''
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return PasswordPG;
   });
