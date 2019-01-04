define('Controls-demo/Popup/Opener/ConfirmationPG',
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
         _content: 'Controls/Popup/Opener/Confirmation',
         _nameOpener: 'confirmationOpener',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {


            };
            this._componentOptions = {
               name: 'Dialog',
               type: 'yesnocancel',
               style: 'success',
               message: 'Do you want to close this window?',
               details: 'So just shoose yes but only if you really want to',
               yesCaption: 'yes!!!',
               noCaption: 'no!!!',
               cancelCaption: 'cancel!!!',
               okCaption: 'ok!!!'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return DialogPG;
   });
