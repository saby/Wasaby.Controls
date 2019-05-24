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
      'wml!Controls-demo/InfoBox/resources/DefaultTemplate'
   ],

   function(Control, template, config) {
      'use strict';
      var InfoBoxPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/popup:InfoboxTarget',
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
                        title: 'Default',
                        template: 'wml!Controls-demo/InfoBox/resources/DefaultTemplate'
                     },
                     {
                        id: '2',
                        title: 'Custom',
                        template: 'wml!Controls-demo/InfoBox/resources/CustomTemplate'
                     }
                  ],
                  value: 'Default'
               },
               content: {
                  items: [
                     {
                        id: '1',
                        title: 'Button',
                        template: 'wml!Controls-demo/InfoBox/resources/DefaultContent'
                     },
                     {
                        id: '2',
                        title: 'Input',
                        template: 'wml!Controls-demo/InfoBox/resources/CustomContent'
                     }
                  ],
                  value: 'Button'
               },
               templateOptions: {
                  items: [
                     { id: '1', title: '{ value: \'My text\' }', items: { value: 'My text' }},
                     { id: '2', title: '{ value: \'Custom text\' }', items: { value: 'Custom text' } }
                  ],
                  value: '{ value: \'My text\' }'
               }
            };
            this._componentOptions = {
               content: 'wml!Controls-demo/InfoBox/resources/DefaultContent',
               targetSide: 'top',
               alignment: 'start',
               name: 'InfoBox',
               hideDelay: 300,
               showDelay: 300,
               trigger: 'hover',
               floatCloseButton: true,
               templateOptions: { value: 'My text' },
               style: 'default',
               template: 'wml!Controls-demo/InfoBox/resources/DefaultTemplate'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return InfoBoxPG;
   });
