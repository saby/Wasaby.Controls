define('Controls-demo/Input/Number/NumberPG',
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
      var NumberPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Input/Number',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               },
               tagStyle: {
                  emptyText: 'none',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  placeholder: 'select',
                  selectedKey: 0
               },
               textAlign: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  placeholder: 'select',
                  selectedKey: 0
               }
            };
            this._componentOptions = {
               name: 'Number',
               value: null,
               placeholder: 'Input number',
               tagStyle: 'primary',
               precision: 2,
               onlyPositive: true,
               integersLength: 5,
               showEmptyDecimals: true,
               textAlign: 'left',
               readOnly: false,
               tooltip: 'myTooltip',
               validationErrors: '',
               selectOnClick: false
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return NumberPG;
   });
