define('js!Controls/Utils/PopupOpener',
   [
      'Core/Control',
      'Core/core-merge',
      'tmpl!Controls/Utils/PopupOpener/PopupOpener',
      'js!Controls/Popup/Submit'
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
       * @function Controls/Utils/PopupOpener#openConfirmDialog
       * Открыть диалоговое окно подтверждения
       */

      /**
       * @function Controls/Utils/PopupOpener#openInfoDialog
       * Открыть диалоговое окно со статусом "информация"
       */

      /**
       * @function Controls/Utils/PopupOpener#openErrorDialog
       * Открыть диалоговое окно со статусом "ошибка"
       */

      /**
       * @function Controls/Utils/PopupOpener#openSuccessDialog
       * Открыть диалоговое окно со статусом "успех"
       */

      var _private = {
         openDialog: function(self, type, handlers){
            self._children.opener.open({
               componentOptions: merge({
                  type: type
               }, self._options.dialogOptions)
            });

            self._handlers = handlers;
         },

         resultHandler: function(self, res){
            var handler;

            switch(res){
               case true: handler = self._handlers.yes; break;
               case false: handler = self._handlers.no; break;
               default: handler = self._handlers.cancel; break;
            }

            if(handler && typeof handler === 'function'){
               handler(res);
            }
            self._notify('onResult', res);
         }
      };

      return Control.extend({
         _template: template,
         _handlers: null,

         _afterMount: function () {
            var self = this;

            self._children.opener.subscribe('onResult', function (e, res) {
               _private.resultHandler(self, res);
            });
         },

         openConfirmDialog: function(yesHandler, noHandler, cancelHandler){
            _private.openDialog(this, 'confirm', {
               yes: yesHandler,
               no: noHandler,
               cancel: cancelHandler
            });
         },

         openInfoDialog: function(handler){
            _private.openDialog(this, 'info', {
               cancel: handler
            });
         }

      });
   }
);