define('js!Controls/InformationWindow',
   [
      'Core/Control',
      'Core/core-merge',
      'tmpl!Controls/InformationWindow/InformationWindow',
      'js!Controls/InformationWindow/Confirm'
   ],
   function (Control, merge, template) {
      'use strict';

      /**
       * Хелпер открытия информационных окон
       * @class Controls/InformationWindow
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/InformationWindow#openConfirmDialog
       * Открыть диалоговое окно подтверждения с кнопками "Да", "Нет", "Отмена"
       */

      /**
       * @function Controls/InformationWindow#openInfoDialog
       * Открыть информационное диалоговое окно с кнопкой "ОК"
       */

      var _private = {
         openDialog: function(self, componentOptions, handlers){
            self._children.opener.open({
               componentOptions: componentOptions
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

         openConfirmDialog: function(cfg, yesHandler, noHandler, cancelHandler){
            _private.openDialog(this, merge(cfg, {
               type: 'confirm'
            }), {
               yes: yesHandler,
               no: noHandler,
               cancel: cancelHandler
            });
         },

         openInfoDialog: function(cfg, handler){
            _private.openDialog(this, merge(cfg, {
               type: 'info'
            }), {
               cancel: handler
            });
         }

      });
   }
);