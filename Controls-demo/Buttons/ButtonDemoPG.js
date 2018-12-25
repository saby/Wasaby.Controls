define('Controls-demo/Buttons/ButtonDemoPG',
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
      var SwitchDemoPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Button',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               style: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               viewMode: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               size: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 1
               },
               iconStyle: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               showClickEvent: {
                  value: true,
                  type: 'none'
               }
            };
            this._componentOptions = {
               readOnly: false,
               size: 'm',
               icon: 'icon-small icon-Add',
               iconStyle: 'default',
               caption: 'Caption',
               style: 'secondary',
               viewMode: 'link',
               tooltip: '',
               name: 'Button',
               href: ''

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return SwitchDemoPG;
   });
