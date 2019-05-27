define('Controls-demo/Headers/HeaderSeparator/HeadingSeparatorPG',
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
         _content: 'Controls/heading:Separator',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               style: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               }
            };
            this._componentOptions = {
               readOnly: false,
               style: 'secondary',
               name: 'HeadingSeparator'

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return HeadingPG;
   });
