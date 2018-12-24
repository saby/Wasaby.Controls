define('Controls-demo/InfoBox/InfoBoxPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
      'wml!Controls-demo/InfoBox/resources/CustomContent',
      'wml!Controls-demo/InfoBox/resources/DefaultContent',
      'wml!Controls-demo/InfoBox/resources/CustomTemplate',
      'wml!Controls-demo/InfoBox/resources/DefaultTemplate',
      'wml!Controls-demo/Validate/ErrorMessage'
   ],

   function(Control, template, config) {
      'use strict';
      var InfoBoxPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Popup/InfoBox',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._items = {
               message: 'hello'
            };
            this._itemsSimple = {
               message: 'goodbye'
            };
            this._dataObject = {
               template: {
                  items: [
                     {
                        id: '1',
                        title: 'wml!Controls-demo/InfoBox/resources/DefaultTemplate',
                        template: 'wml!Controls-demo/InfoBox/resources/DefaultTemplate'
                     },
                     {
                        id: '2',
                        title: 'wml!Controls-demo/InfoBox/resources/CustomTemplate',
                        template: 'wml!Controls-demo/InfoBox/resources/CustomTemplate'
                     }
                  ],
                  value: 'wml!Controls-demo/InfoBox/resources/DefaultTemplate'
               },
               content: {
                  items: [
                     {
                        id: '1',
                        title: 'wml!Controls-demo/InfoBox/resources/DefaultContent',
                        template: 'wml!Controls-demo/InfoBox/resources/DefaultContent'
                     },
                     {
                        id: '2',
                        title: 'wml!Controls-demo/InfoBox/resources/CustomContent',
                        template: 'wml!Controls-demo/InfoBox/resources/CustomContent'
                     }
                  ],
                  value: 'wml!Controls-demo/InfoBox/resources/DefaultContent'
               }
            };
            this._componentOptions = {
               content: 'wml!Controls-demo/InfoBox/resources/DefaultContent',
               position: 'tl',
               name: 'InfoBox',
               hideDelay: 300,
               showDelay: 300,
               trigger: 'hover',
               floatCloseButton: true,
               style: 'default',
               template: 'wml!Controls-demo/InfoBox/resources/DefaultTemplate'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return InfoBoxPG;
   });
