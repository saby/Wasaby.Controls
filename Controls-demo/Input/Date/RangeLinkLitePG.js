define('Controls-demo/Input/Date/RangeLinkLitePG',
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
         _content: 'Controls/dateRange:LiteSelector',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               startValue: {
                  readOnly: true
               },
               endValue: {
                  readOnly: true
               }
            };
            this._componentOptions = {
               name: 'DateRangeLinkLite',
               readOnly: false,
               tooltip: 'myTooltip',
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return Component;
   });
