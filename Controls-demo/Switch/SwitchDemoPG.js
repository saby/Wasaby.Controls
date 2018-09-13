define('Controls-demo/Switch/SwitchDemoPG',
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
      var SwitchDemoPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Toggle/Switch',
         _my: myTmpl,
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               value: {
                  readOnly: true
               },
               captionPosition: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               }
            };
            this._componentOptions = {
               name: 'Switch',
               readOnly: false,
               tooltip: 'myTooltip',
               caption: 'State1',
               captionPosition: 'left'

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return SwitchDemoPG;
   });
