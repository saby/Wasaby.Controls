define('Controls-demo/Switch/SwitchDemoPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Text/TextPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, myTmpl, config) {
      'use strict';
      var TextPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Toggle/Switch',
         _my: myTmpl,
         _dataObject: null,
         _textOptions: null,
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
            this._textOptions = {
               name: 'Switch',
               readOnly: false,
               tooltip: 'myTooltip',
               caption: 'State1',
               captionPosition: 'left'

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return TextPG;
   });
