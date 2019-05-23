define('Controls-demo/Headers/Counter/CounterPG',
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
      var HeadingPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/heading:Counter',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               style: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               size: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 1
               }
            };
            this._componentOptions = {
               readOnly: false,
               size: 'm',
               caption: '12',
               style: 'secondary',
               tooltip: '',
               name: 'Counter'

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return HeadingPG;
   });
