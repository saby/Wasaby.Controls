define('Controls/Popup/Opener/Confirmation',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Core/Deferred'
   ],
   function(BaseOpener, Deferred) {
      'use strict';

      /**
       * Хелпер открытия окна подтверждения
       * @class Controls/Popup/Opener/Confirmation
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/Popup/Opener/Confirmation#open
       * Открыть диалоговое окно
       * @param {Object} Объект конфигурации открываемого диалога - {@link Controls/Popup/Opener/Confirmation/Dialog}.
       */

      var Confirmation = BaseOpener.extend({
         _resultDef: null,
         _openerResultHandler: null,

         _beforeMount: function() {
            this._closeHandler = this._closeHandler.bind(this);
            Confirmation.superclass._beforeMount.call(this);
         },

         _closeHandler: function(res) {
            if (this._resultDef) {
               this._resultDef.callback(res);
               this._resultDef = null;
            }
         },

         open: function(templateOptions) {
            this._resultDef = new Deferred();
            var popupOptions = this._getPopupOptions(templateOptions);
            Confirmation.superclass.open.call(this, popupOptions, 'Controls/Popup/Opener/Dialog/DialogController');
            return this._resultDef;
         },

         _getPopupOptions: function(templateOptions) {
            templateOptions.closeHandler = this._closeHandler;
            return {
               template: 'Controls/Popup/Opener/Confirmation/Dialog',
               isModal: true,
               className: 'controls-Confirmation_popup',
               templateOptions: templateOptions
            };
         }

      });

      return Confirmation;
   }
);
