define('Controls/Popup/Opener/Dialog',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(Base) {
      /**
       * Component that opens a popup that is positioned in the center of the browser window. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#_3 See more}
       * @class Controls/Popup/Opener/Dialog
       * @control
       * @public
       * @author Красильников А.С.
       * @category Popup
       * @mixes Controls/interface/IDialogOptions
       */

      var _private = {
         getDialogConfig: function(config) {
            config = config || {};

            //The dialog is isDefaultOpener by default. For more information, see  {@link Controls/interface/ICanBeDefaultOpener}
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            return config;
         }
      };

      var Dialog = Base.extend({

         /**
          * Open dialog popup.
          * @function Controls/Popup/Opener/Dialog#open
          * @returns {Undefined}
          * @param {Object} popupOptions Dialog popup options.
          * @remark
          * {@link https://wi.sbis.ru/docs/js/Controls/interface/IDialogOptions#popupOptions popupOptions}
          * @example
          * wml
          * <pre>
          *    <Controls.Popup.Opener.Dialog name="dialog">
          *       <ws:popupOptions template="Controls-demo/Popup/TestDialog" isModal="{{true}}">
          *          <ws:templateOptions key="111"/>
          *       </ws:popupOptions>
          *    </Controls.Popup.Opener.Dialog>
          *
          *    <Controls.Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
          *    <Controls.Button name="closeDialogButton" caption="close dialog" on:click="_closeDialog()"/>
          * </pre>
          * js
          * <pre>
          *   Control.extend({
          *      ...
          *
          *       _openDialog() {
          *          var popupOptions = {
          *              autofocus: true
          *          }
          *          this._children.dialog.open(popupOptions)
          *       }
          *
          *       _closeDialog() {
          *          this._children.dialog.close()
          *       }
          *       ...
          *   });
          * </pre>
          * @see close
          */
         open: function(config) {
            config = _private.getDialogConfig(config);
            Base.prototype.open.call(this, config, 'Controls/Popup/Opener/Dialog/DialogController');
         }
      });

      Dialog._private = _private;

      return Dialog;
   }

   /**
    * @name Controls/Popup/Opener/Dialog#closePopupBeforeUnmount
    * @cfg {Object} Determines whether to close the popup when the component is destroyed.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#close
    * @function
    * @description Close dialog popup.
    * @returns {Undefined}
    * @example
    * wml
    * <pre>
    *    <Controls.Popup.Opener.Dialog name="dialog">
    *       <ws:popupOptions template="Controls-demo/Popup/TestDialog" isModal="{{true}}">
    *          <ws:templateOptions key="111"/>
    *       </ws:popupOptions>
    *    </Controls.Popup.Opener.Dialog>
    *
    *    <Controls.Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
    *    <Controls.Button name="closeDialogButton" caption="close dialog" on:click="_closeDialog()"/>
    * </pre>
    * js
    * <pre>
    *   Control.extend({
    *      ...
    *
    *       _openDialog() {
    *          var popupOptions = {
    *              autofocus: true
    *          }
    *          this._children.dialog.open(popupOptions)
    *       }
    *
    *       _closeDialog() {
    *          this._children.dialog.close()
    *       }
    *       ...
    *   });
    * </pre>
    * @see open
    */

   /**
    * @name Controls/Popup/Opener/Dialog#isOpened
    * @function
    * @description Popup opened status.
    */
);
