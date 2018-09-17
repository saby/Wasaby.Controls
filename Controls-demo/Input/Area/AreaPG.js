define('Controls-demo/Input/Area/AreaPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, myTmpl, config) {
      'use strict';
      var AreaPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Input/Area',
         _my: myTmpl,
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               },
               tagStyle: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title'
               },
               newLineKey: {
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title'
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
            this._componentOptions = {
               name: 'Area',
               placeholder: 'Input text',
               tagStyle: undefined,
               constraint: '',
               value: '',
               trim: false,
               maxLength: 100,
               selectOnClick: true,
               readOnly: false,
               tooltip: 'myTooltip',
               validationErrors: '',
               minLines: 3,
               maxLines: 6,
               newLineKey: undefined
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return AreaPG;
   });
