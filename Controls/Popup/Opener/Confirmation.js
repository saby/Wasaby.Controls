define('Controls/Popup/Opener/Confirmation',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Core/Deferred'
   ],
   function(BaseOpener, Deferred) {
      'use strict';

      /**
       * Component that opens the confirmation popup.
       * @class Controls/Popup/Opener/Confirmation
       * @mixes Controls/interface/IConfirmationOptions
       * @control
       * @public
       * @category Popup
       * @author Красильников А.С.
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

         /**
          * Open confirmation popup.
          * @function Controls/Popup/Opener/Confirmation#open
          * @param {Object} popupOptions Confirmation options.
          * @returns {Deferred} The deferral will end with the result when the user closes the popup.
          * @remark
          * If you want use custom layout in the dialog you need to open popup via {@link dialog opener} using the basic template {@link ConfirmationTemplate}.
          * @example
          * wml
          * <pre>
          *    <Controls.Popup.Opener.Confirmation name="confirmationOpener">
          *    </Controls.Popup.Opener.Confirmation>
          *
          *    <Controls.Button name="openConfirmation" caption="open confirmation" on:click="_open()"/>
          * </pre>
          * js
          * <pre>
          *     Control.extend({
          *       ...
          *
          *        _open() {
          *           var config= {
          *              message: 'Сохранить изменения?'
          *              type: 'yesnocancel'
          *           }
          *           this._children.confirmationOpener.open(config)
          *        }
          *     });
          * </pre>
          */
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
