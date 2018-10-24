define('Controls-demo/Input/Money/Money',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/Input/Money/Money'
   ],

   function(Control, template, config) {

      'use strict';

      var Money = Control.extend({
         _template: template,

         _metaData: null,

         _dataObject: null,

         _componentOptions: null,

         _content: 'Controls/Input/Money',

         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               },
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
               name: 'MoneyField',
               placeholder: 'Text...',
               tooltip: 'Please enter text',
               value: '0.00',
               style: undefined,
               tagStyle: undefined,
               readOnly: undefined,
               fontStyle: undefined
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });

      return Money;
   }
);
