import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import getZIndex = require('Controls/Utils/getZIndex');
import Deferred = require('Core/Deferred');


      /**
       * Component that opens the confirmation popup.
       * <a href="/materials/demo-ws4-confirmation">Demo-example</a>.
       *
       * @class Controls/_popup/Opener/Confirmation
       * @control
       * @public
       * @category Popup
       * @author Красильников А.С.
       * @demo Controls-demo/Popup/Opener/ConfirmationPG
       *
       * @css @font-size_SubmitPopup-message Font-size of message.
       * @css @font-weight_SubmitPopup-message Font-weight of message.
       * @css @color_SubmitPopup-message Color of message.
       * @css @spacing_SubmitPopup-between-message-border-bottom Spacing between message and border-bottom.
       *
       * @css @font-size_SubmitPopup-details Font-size of details.
       * @css @color_SubmitPopup-details Color of details.
       *
       * @css @height_SubmitPopup-button Height of buttons.
       * @css @spacing_SubmitPopup-between-button-border Spacing between border and button.
       * @css @min-width_SubmitPopup-button Min-width of buttons.
       * @css @min-width_SubmitPopup-button-small Min-width of small buttons.
       */

      /**
       * @name Controls/_popup/Opener/Confirmation#type
       * @cfg {String} Type of dialog. Determines  the result of  the confirmation window closed.
       * @variant ok (undefined)
       * @variant yesno  ( true/false)
       * @variant yesnocancel  (true/false/undefined)
       */

      /**
       * @name Controls/_popup/Opener/Confirmation#style
       * @cfg {String} Confirmation display style
       * @variant default
       * @variant success
       * @variant danger
       */

      /**
       * @name Controls/_popup/Opener/Confirmation#size
       * @cfg {String} Confirmation size
       * @variant m
       * @variant l
       */

      /**
       * @name Controls/_popup/Opener/Confirmation#message
       * @cfg {String} Main text
       */

      /**
       * @name Controls/_popup/Opener/Confirmation#details
       * @cfg {String} Additional text
       */

      /**
       * @name Controls/_popup/Opener/Confirmation#yesCaption
       * @cfg {String} Сonfirmation button text
       */

      /**
       * @name Controls/_popup/Opener/Confirmation#noCaption
       * @cfg {String} Negation button text
       */
      /**
       * @name Controls/_popup/Opener/Confirmation#cancelCaption
       * @cfg {String} 	Cancel button text
       */
      /**
       * @name Controls/_popup/Opener/Confirmation#PrimaryAction
       * @cfg {String} Determines which button is activated when ctrl+enter is pressed
       * @variant yes
       * @variant no
       */
      /**
       * @name Controls/_popup/Opener/Confirmation#okCaption
       * @cfg {String} Accept button text
       */


      var _private = {
         compatibleOptions: function(self, popupOptions) {
            // For the old page, set the zIndex manually
            popupOptions.zIndex = popupOptions.zIndex || popupOptions.templateOptions.zIndex || getZIndex(self);
         }
      };

      var Confirmation = BaseOpener.extend({
         _resultDef: null,
         _openerResultHandler: null,

         _beforeMount: function() {
            this._closeHandler = this._closeHandler.bind(this);
            Confirmation.superclass._beforeMount.apply(this, arguments);
         },

         _closeHandler: function(res) {
            if (this._resultDef) {
               this._resultDef.callback(res);
               this._resultDef = null;
            }
         },



         /**
          * @name Controls/_popup/Opener/Confirmation#isOpened
          * @function
          * @description Popup opened status.
          */

         /**
          * Close popup.
          * @function Controls/_popup/Opener/Confirmation#close
          */

         /**
          * Open confirmation popup.
          * @function Controls/_popup/Opener/Confirmation#open
          * @param {popupOptions[]} popupOptions Confirmation options.
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
          *              message: 'Save changes?'
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
            Confirmation.superclass.open.call(this, popupOptions, require('Controls/popup').DialogController);
            return this._resultDef;
         },

         _getPopupOptions: function(templateOptions) {
            templateOptions.closeHandler = this._closeHandler;
            return {
               template: require('Controls/popup').ConfirmationDialog,
               modal: true,
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

      export = Confirmation;

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


