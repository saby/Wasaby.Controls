define('Controls-demo/Input/TimeInterval/TimeIntervalPG',
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
      var TimeIntervalPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/input:TimeInterval',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               },
               mask: {
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               tagStyle: {
                  emptyText: 'none',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  placeholder: 'select',
                  selectedKey: 0
               },
               size: {
                  emptyText: 'none',
                  placeholder: 'select',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
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
               }
            };
            this._componentOptions = {
               name: 'TimeInterval',
               value: null,
               mask: 'HH:mm',
               placeholder: 'Input TimeInterval',
               readOnly: false,
               tooltip: 'myTooltip',
               validationErrors: '',
               selectOnClick: false,
               fontStyle: 'default',
               tagStyle: null
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return TimeIntervalPG;
   });
