define('Controls-demo/Input/Date/Picker',
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
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Input/Date/Picker',
         _my: myTmpl,
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               }
            };
            this._componentOptions = {
               name: 'DatePicker',
               readOnly: false,
               tooltip: 'myTooltip',
               validationErrors: ''
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return Component;
   });
