define('Controls/Popup/Opener/Confirmation',
   [
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Utils/getZIndex',
      'Core/Deferred'
   ],
   function(BaseOpener, getZIndex, Deferred) {
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

      /**
       * @name Controls/Popup/Opener/Confirmation#closePopupBeforeUnmount
       * @cfg {Object} Determines whether to close the popup when the component is destroyed.
       */

      var _private = {
         compatibleOptions: function(self, popupOptions) {
            // For the old page, set the zIndex manually
            popupOptions.zIndex = popupOptions.zIndex || getZIndex(self);
         }
      };

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
          * @name Controls/Popup/Opener/Confirmation#isOpened
          * @function
          * @description Popup opened status.
          */

         /**
          * Close popup.
          * @function Controls/Popup/Opener/Confirmation#close
          */

         /**
          * Open confirmation popup.
          * @function Controls/Popup/Opener/Confirmation#open
          * @param {PopupOptions[]} popupOptions Confirmation options.
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
            _private.compatibleOptions(this, popupOptions);
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

      Confirmation.getDefaultOptions = function() {
         return {
            _vdomOnOldPage: true // Open vdom popup in the old environment
         };
      };

      return Confirmation;
   });

/**
 * @typedef {Object} popupOptions
 * @description Confirmation configuration.
 * @property {String} type Type of dialog.
 * @property {String} style Confirmation display style.
 * @property {String} message Main text.
 * @property {String} details Additional text.
 * @property {String} yesCaption Сonfirmation button text.
 * @property {String} noCaption Negation button text.
 * @property {String} cancelCaption Cancel button text.
 * @property {String} okCaption Accept text button.
 */
