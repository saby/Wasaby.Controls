define('Controls-demo/Input/Base/Base',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      /*'wml!Controls-demo/Input/Base/Base',*/
      'json!Controls-demo/Input/Base/Base'
   ],

   function(Control, template, config) {

      'use strict';

      var Base = Control.extend({
         _template: template,

         _metaData: null,

         _dataObject: null,

         _componentOptions: null,

         _content: 'Controls/Input/Base',

         _beforeMount: function() {
            this._dataObject = {
               style: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               fontStyle: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               tagStyle: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title'
               }
            };
            this._componentOptions = {
               name: 'BaseField',
               placeholder: 'Text...',
               tooltip: 'Please enter text',
               value: '1234',
               style: undefined,
               tagStyle: undefined,
               readOnly: undefined,
               fontStyle: undefined
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }/*,

         _test: '1234',

         _console: function(event, value, displayValue) {
            if (value === '123456') {
               this._test = '12345';
            } else {
               this._test = value;
            }
            console.log('demo= ' + value + ', ' + displayValue);
         },

         _changeValue: function() {
            this._test = 'Значение изменено';
         }*/
      });

      return Base;
   }
);
