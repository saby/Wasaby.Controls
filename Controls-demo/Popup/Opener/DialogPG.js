define('Controls-demo/Popup/Opener/DialogPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/Popup/Opener/OpenerDemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'wml!Controls-demo/Popup/Opener/DialogTpl',
      'wml!Controls-demo/Popup/Opener/ConfirmationTpl',

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
         _content: 'Controls/Popup/Opener/Dialog',
         _nameOpener: 'dialogOpener',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               className: {
                  readOnly: true
               },
               name: {
                  readOnly: true
               },
               minWidth: {
                  readOnly: true
               },
               maxWidth: {
                  readOnly: true
               },
               minHeight: {
                  readOnly: true
               },
               maxHeight: {
                  readOnly: true
               },
               template: {
                  items: [
                     {
                        id: '1',
                        title: 'wml!Controls-demo/Popup/Opener/DialogTpl',
                        template: 'wml!Controls-demo/Popup/Opener/DialogTpl'
                     },
                     {
                        id: '2',
                        title: 'wml!Controls-demo/Popup/Opener/ConfirmationTpl',
                        template: 'wml!Controls-demo/Popup/Opener/ConfirmationTpl'
                     }
                  ],
                  value: 'wml!Controls-demo/Popup/Opener/DialogTpl'
               },

            };
            this._componentOptions = {
               autofocus: true,
               name: 'Dialog',
               isModal: false,
               className: 'controls_Dialog-Opener',
               closeByExternalClick: true,
               template: 'wml!Controls-demo/Popup/Opener/DialogTpl',
               templateOptions: {
                  draggable: true,
               },
               draggable: true,
               minWidth: 500,
               maxWidth: 700,
               minHeight: 200,
               maxHeight: 200,
               maximize: false,
               resizable: true,
               top: 50,
               left: 50
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return DialogPG;
   });
