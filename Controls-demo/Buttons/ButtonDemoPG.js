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
         _content: 'Controls/buttons:Button',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               buttonStyle: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               viewMode: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 1
               },
               inlineHeight: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 2
               },
               iconStyle: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               iconSize: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               fontSize: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 2
               },
               fontColorStyle: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               showClickEvent: true
            };
            this._componentOptions = {
               contrastBackground: false,
               readOnly: false,
               inlineHeight: 'm',
               fontSize: 'm',
               fontColorStyle: 'secondary',
               icon: 'icon-Add',
               iconStyle: 'secondary',
               iconSize: 's',
               caption: 'Caption',
               buttonStyle: 'secondary',
               viewMode: 'button',
               tooltip: '',
               name: 'Button',
               href: ''

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return SwitchDemoPG;
   });
