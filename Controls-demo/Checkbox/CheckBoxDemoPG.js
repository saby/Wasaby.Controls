define('Controls-demo/Checkbox/CheckBoxDemoPG',
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
      var CheckBoxDemoPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Toggle/Checkbox',
         _my: myTmpl,
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: false
               }
            };
            this._componentOptions = {
               name: 'CheckBox',
               readOnly: false,
               tooltip: 'myTooltip',
               caption: 'State1',
               triState: false

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return CheckBoxDemoPG;
   });
