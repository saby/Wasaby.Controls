define('Controls-demo/Input/Base/Base',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
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
               tooltip: 'Please enter text'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });

      return Base;
   }
);
