define('Controls-demo/Input/DateTime/DateTimePG',
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
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/input:DateBase',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               }
            };
            this._componentOptions = {
               name: 'DateTime',
               readOnly: false,
               tooltip: 'myTooltip',
               validationErrors: '',
               tagStyle: undefined
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return Component;
   });
