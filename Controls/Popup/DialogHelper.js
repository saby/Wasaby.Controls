define('js!Controls/Popup/DialogHelper',
   [
      'Core/Control',
      'Core/core-merge',
      'tmpl!Controls/Popup/DialogHelper/DialogHelper',
      'js!Controls/Windows/Submit'
   ],
   function (Control, merge, template) {
      'use strict';

      /**
       * Хелпер открытия диалоговых окон
       * @class Controls/Popup/DialogHelper
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/Popup/DialogHelper#confirm
       * Открыть диалоговое окно подтверждения
       */

      /**
       * @function Controls/Popup/DialogHelper#info
       * Открыть окно со статусом "информация"
       */

      /**
       * @function Controls/Popup/DialogHelper#error
       * Открыть окно со статусом "ошибка"
       */

      /**
       * @function Controls/Popup/DialogHelper#success
       * Открыть окно со статусом "успех"
       */

      var _private = {
         openDialog: function(cfg, status, positiveHandler, negativeHandler, cancelHandler){
            this._children.opener.open({
               componentOptions: merge(merge({
                  status: status
               }, this._options.dialogOptions), cfg)
            });

            this._positiveHandler = positiveHandler;
            this._negativeHandler = negativeHandler;
            this._cancelHandler = cancelHandler;
         },

         resultHandler: function(res){
            var handler;

            switch(res){
               case true: handler = this._positiveHandler; break;
               case false: handler = this._negativeHandler; break;
               default: handler = this._cancelHandler; break;
            }

            if(handler && typeof handler === 'function'){
               handler(res);
            }
            this._notify('onResult', res);
         }
      };

      return Control.extend({
         _controlName: 'Controls/Popup/DialogHelper',
         _template: template,

         _positiveHandler: null,
         _negativeHandler: null,
         _cancelHandler: null,

         _afterMount: function () {
            var self = this;

            self._children.opener.subscribe('onResult', function (e, res) {
               _private.resultHandler.call(self, res);
            });
         },

         confirm: function(cfg, positiveHandler, negativeHandler, cancelHandler){
            _private.openDialog.call(this, cfg, 'confirm', positiveHandler, negativeHandler, cancelHandler);
         },

         info: function(cfg, handler){
            _private.openDialog.call(this, cfg, 'default', null, null, handler);
         },

         error: function(cfg, handler){
            _private.openDialog.call(this, cfg, 'error', null, null, handler);
         },

         success: function(cfg, handler){
            _private.openDialog.call(this, cfg, 'success', null, null, handler);
         }

      });
   }
);