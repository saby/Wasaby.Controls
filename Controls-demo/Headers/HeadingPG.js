define('Controls-demo/Headers/HeadingPG',
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
         _content: 'Controls/Heading',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               fontColorStylestyle: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               fontSize: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 1
               }
            };
            this._componentOptions = {
               readOnly: false,
               fontSize: 'l',
               caption: 'Heading',
               fontStyle: 'secondary',
               tooltip: '',
               name: 'Heading'

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return HeadingPG;
   });
