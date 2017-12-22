define('js!Controls/Utils/PopupOpener',
   [
      'Core/Control',
      'Core/core-merge',
      'tmpl!Controls/Utils/PopupOpener/PopupOpener',
      'js!Controls/Popup/templates/Submit'
   ],
   function (Control, merge, template) {
      'use strict';

      /**
       * Хелпер открытия информационных окон
       * @class Controls/Utils/PopupOpener
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/Utils/PopupOpener#confirmDialog
       * Открыть диалоговое окно подтверждения
       */

      /**
       * @function Controls/Utils/PopupOpener#infoDialog
       * Открыть диалоговое окно со статусом "информация"
       */

      /**
       * @function Controls/Utils/PopupOpener#errorDialog
       * Открыть диалоговое окно со статусом "ошибка"
       */

      /**
       * @function Controls/Utils/PopupOpener#successDialog
       * Открыть диалоговое окно со статусом "успех"
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
         _controlName: 'Controls/Utils/PopupOpener',
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

         confirmDialog: function(cfg, positiveHandler, negativeHandler, cancelHandler){
            _private.openDialog.call(this, cfg, 'confirm', positiveHandler, negativeHandler, cancelHandler);
         },

         infoDialog: function(cfg, handler){
            _private.openDialog.call(this, cfg, 'default', null, null, handler);
         },

         errorDialog: function(cfg, handler){
            _private.openDialog.call(this, cfg, 'error', null, null, handler);
         },

         successDialog: function(cfg, handler){
            _private.openDialog.call(this, cfg, 'success', null, null, handler);
         }

      });
   }
);