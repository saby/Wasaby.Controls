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
               size: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 1
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
               },
               textAlign: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               }
            };
            this._componentOptions = {
               name: 'BaseField',
               placeholder: 'Text...',
               value: '',
               size: undefined,
               style: undefined,
               tagStyle: undefined,
               readOnly: undefined,
               fontStyle: undefined,
               textAlign: undefined
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });

      return Base;
   }
);
