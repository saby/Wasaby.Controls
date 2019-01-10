define('Controls-demo/Popup/Templates/ConfirmationTemplatePG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'wml!Controls-demo/Popup/Templates/resources/defaultBodyContent',
      'wml!Controls-demo/Popup/Templates/resources/customBodyContent',
      'wml!Controls-demo/Popup/Templates/resources/defaultFooterContent',
      'wml!Controls-demo/Popup/Templates/resources/customFooterContent',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
   ],

   function(Control, template, config) {
      'use strict';
      var DialogPG = Control.extend({
         _template: template,
         _metaData: null,
         _dataOptions: null,
         _content: 'Controls/Popup/Templates/Dialog/ConfirmationTemplate',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               name: {
                  readOnly: true
               },
               bodyContentTemplate: {
                  items: [
                     {
                        id: '1',
                        title: 'wml!Controls-demo/Popup/Templates/resources/defaultBodyContent',
                        template: 'wml!Controls-demo/Popup/Templates/resources/defaultBodyContent'
                     },
                     {
                        id: '2',
                        title: 'wml!Controls-demo/Popup/Templates/resources/customBodyContent',
                        template: 'wml!Controls-demo/Popup/Templates/resources/customBodyContent'
                     }
                  ],
                  value: 'wml!Controls-demo/Popup/Templates/resources/defaultBodyContent'
               },
               footerContentTemplate: {
                  items: [
                     {
                        id: '1',
                        title: 'wml!Controls-demo/Popup/Templates/resources/defaultFooterContent',
                        template: 'wml!Controls-demo/Popup/Templates/resources/defaultFooterContent'
                     },
                     {
                        id: '2',
                        title: 'wml!Controls-demo/Popup/Templates/resources/customFooterContent',
                        template: 'wml!Controls-demo/Popup/Templates/resources/customFooterContent'
                     }
                  ],
                  value: 'wml!Controls-demo/Popup/Templates/resources/defaultFooterContent'
               },
            };
            this._componentOptions = {
               name: 'ConfirmationTemplate',
               style: 'default',
               size: 'm',
               bodyContentTemplate: 'wml!Controls-demo/Popup/Templates/resources/defaultBodyContent',
               footerContentTemplate: 'wml!Controls-demo/Popup/Templates/resources/defaultFooterContent'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return DialogPG;
   });
