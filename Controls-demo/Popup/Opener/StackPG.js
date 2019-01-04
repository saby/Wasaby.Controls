define('Controls-demo/Popup/Opener/StackPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/Popup/Opener/OpenerDemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'wml!Controls-demo/Popup/Opener/DialogTpl',
      'wml!Controls/Popup/Templates/Stack/StackTemplate',
      'wml!Controls-demo/Popup/Opener/DefaultStack',
      'wml!Controls-demo/Popup/Opener/MaximazedStack',

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
         _content: 'Controls/Popup/Opener/Stack',
         _nameOpener: 'StackOpener',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               className: {
                  readOnly: true,
               },
               template: {
                  items: [
                     {
                        id: '1',
                        title: 'wml!Controls-demo/Popup/Opener/DefaultStack',
                        template: 'wml!Controls-demo/Popup/Opener/DefaultStack'
                     },
                     {
                        id: '2',
                        title: 'wml!Controls-demo/Popup/Opener/MaximazedStack',
                        template: 'wml!Controls-demo/Popup/Opener/MaximazedStack',
                     }
                  ],
               },
            };
            this._componentOptions = {
               name: 'Stack',
               autofocus: true,
               isModal: true,
               className: 'stack_demoPG',
               closeByExternalClick: true,
                template: 'wml!Controls-demo/Popup/Opener/DefaultStack',
               width: 300,
               winWidth: 300,
               maxWidth: 500,
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return DialogPG;
   });
