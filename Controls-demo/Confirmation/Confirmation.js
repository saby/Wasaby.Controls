define('Controls-demo/Confirmation/Confirmation',
   [
      'Core/Control',
      'tmpl!Controls-demo/Confirmation/Confirmation'
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
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               type: 'ok'
            }
         }, {
            caption: 'YESNO',
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               type: 'yesno'
            }
         }, {
            caption: 'YESNOCANCEL',
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
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               style: 'default'
            }
         }, {
            caption: 'SUCCESS',
            background: '#00d407',
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               style: 'success'
            }
         }, {
            caption: 'ERROR',
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
            background: BG,
            cfg: {
               message: MESSAGE,
               details: DETAILS,
               okCaption: 'Custom ok',
               type: 'ok'
            }
         }, {
            caption: 'THREE BUTTON',
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

         _open: function(e, cfg){
            var self = this;
            this._children.popupOpener.open(cfg).addCallback(function(res){
               self._result = res;
               self._forceUpdate();
            });
         }

      });

      return InfoBox;
   }
);