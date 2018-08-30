define('Controls-demo/Confirmation/Confirmation',
   [
      'Core/Control',
      'wml!Controls-demo/Confirmation/Confirmation',
      'Controls-demo/Confirmation/resources/detailsComponent'
   ],
   function(Control, template) {

      'use strict';

      var MESSAGE = 'Message';
      var DETAILS = 'Details';
      var BG = '#409eff';

      var blocks = [{
         caption: 'Type',
         items: [{
            caption: 'OK',
            test_name: 'ok',
            background: BG,
            cfg: {
               message: MESSAGE,
               details: 'Controls-demo/Confirmation/resources/detailsComponent',
               type: 'ok'
            }
         }, {
            caption: 'YESNO',
            test_name: 'yesno',
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               type: 'yesno'
            }
         }, {
            caption: 'YESNOCANCEL',
            test_name: 'yesnocancel',
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               type: 'yesnocancel'
            }
         }]
      }, {
         caption: 'Style',
         items: [{
            caption: 'DEFAULT',
            test_name: 'default',
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               style: 'default'
            }
         }, {
            caption: 'SUCCESS',
            test_name: 'success',
            background: '#00d407',
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               style: 'success'
            }
         }, {
            caption: 'ERROR',
            test_name: 'error',
            background: '#dc0000',
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               style: 'error'
            }
         }]
      }, {
         caption: 'Button caption',
         items: [{
            caption: 'ONE BUTTON',
            test_name: 'one_button',
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               okCaption: 'Custom ok',
               type: 'ok'
            }
         }, {
            caption: 'THREE BUTTON',
            test_name: 'three_button',
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               yesCaption: 'My yes',
               noCaption: 'My no',
               cancelCaption: 'My cancel',
               type: 'yesnocancel'
            }
         }]
      }];

      var InfoBox = Control.extend({
         _template: template,
         _blocks: blocks,
         _result: '',

         _beforeMount: function() {
            this._onResultHandler = this._onResultHandler.bind(this);
         },

         _open: function(e, cfg) {
            var self = this;
            this._children.popupOpener.open(cfg).addCallback(function(res) {
               self._result = res;
               self._forceUpdate();
            });
         },

         _onResultHandler: function(result) {
            this._resultHandler = result;
            this._forceUpdate();
         }

      });

      return InfoBox;
   }
);
