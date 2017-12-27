define('js!Controls/ConfirmationWindow',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/Deferred',
      'tmpl!Controls/ConfirmationWindow/ConfirmationWindow',
      'js!Controls/ConfirmationWindow/Dialog'
   ],
   function (Control, merge, Deferred, template) {
      'use strict';

      /**
       * Хелпер открытия окна подтверждения
       * @class Controls/ConfirmationWindow
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/ConfirmationWindow#open
       * Открыть диалоговое окно
       */

      return Control.extend({
         _template: template,
         _resultDef: null,

         _afterMount: function () {
            var self = this;

            self._children.opener.subscribe('onResult', function (e, res) {
               self._resultDef.callback(res);
            });
         },

         open: function(cfg){
            this._resultDef = new Deferred();
            this._children.opener.open({
               componentOptions: cfg
            });
            return this._resultDef;
         }

      });
   }
);