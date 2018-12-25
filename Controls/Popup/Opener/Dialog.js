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
         getDialogConfig: function(config, self) {
            config = config || {};
            if(config.closeByExternalClick !== undefined || self._options.closeByExternalClick !== undefined ) {
               config.closeByExternalClick = config.closeByExternalClick || self._options.closeByExternalClick;
            }
            if(config.autofocus !== undefined || self._options.autofocus !== undefined) {
               config.autofocus = config.autofocus || self._options.autofocus;
            }
            if(config.isModal !== undefined || self._options.isModal !== undefined) {
               config.isModal = config.isModal || self._options.isModal;
            }
            if(config.className !== undefined || self._options.className !== undefined) {
               config.className = config.className || self._options.className;
            }
            if(config.template !== undefined || self._options.template !== undefined) {
               config.template = config.template || self._options.template;
            }
            if(config.opener !== undefined || self._options.opener !== undefined) {
               config.opener = config.opener || self._options.opener;
            }
            if(config.templateOptions !== undefined || self._options.templateOptions !== undefined) {
               config.templateOptions = config.templateOptions || self._options.templateOptions;
            }
            if(config.minWidth !== undefined || self._options.winWidth !== undefined) {
               config.minWidth = config.minWidth || self._options.minWidth;
            }
            if(config.maxWidth !== undefined || self._options.maxWidth !== undefined) {
               config.maxWidth = config.maxWidth || self._options.maxWidth;
            }
            if(config.maximize !== undefined || self._options.maximize !== undefined) {
               config.maximize = config.maximize || self._options.maximize;
            }
            if(config.resizable !== undefined || self._options.resizable !== undefined) {
               config.resizable = config.resizable || self._options.resizable;
            }
            if(config.top !== undefined || self._options.top !== undefined) {
               config.top = config.top || self._options.top;
            }
            if(config.left !== undefined || self._options.left !== undefined) {
               config.left = config.left || self._options.left;
            }
            if(config.maxHeight !== undefined || self._options.maxHeight !== undefined) {
               config.maxHeight = config.maxHeight || self._options.maxHeight;
            }
            if(config.minHeight !== undefined || self._options.minHeight !== undefined) {
               config.minHeight = config.minHeight || self._options.minHeight;
            }
            if(config.draggable !== undefined || self._options.draggable !== undefined) {
               config.draggable = config.draggable || self._options.draggable;
            }
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
          * @param {PopupOptions[]} popupOptions Dialog popup options.
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
            config = _private.getDialogConfig(config, this);
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
    * @name Controls/Popup/Opener/Dialog#autofocus
    * @cfg {Boolean} Determines whether focus is set to the template when popup is opened.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#isModal
    * @cfg {Boolean} Determines whether the window is modal.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#closeByExternalClick
    * @cfg {Boolean} Determines whether possibility of closing the popup when clicking past.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#className
    * @cfg {String} Class names of popup.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#opener
    * @cfg {Object} Control, which is the logical initiator of popup opening.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#template
    * @cfg {String|Function} Template inside popup.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#templateOptions
    * @cfg {String|Function} Template options inside popup.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#draggable
    * @cfg {Boolean} Determines whether the control can be moved by d'n'd.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#minWidth
    * @cfg {Number} The minimum width of popup.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#maxWidth
    * @cfg {Number} The maximum width of popup.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#minHeight
    * @cfg {Number} The minimum height of popup.
    */

   /**
    * @name Controls/Popup/Opener/Dialog#maxHeight
    * @cfg {Number} The maximum height of popup.
    */
   /**
    * @name Controls/Popup/Opener/Dialog#maximize
    * @cfg {Boolean} Determines whether the control is displayed in full screen.
    */
   /**
    * @name Controls/Popup/Opener/Dialog#resizable
    * @cfg {Boolean} Determines whether popup can be resized.
    */
   /**
    * @name Controls/Popup/Opener/Dialog#top
    * @cfg {Number} Distance from the window to the top of the screen.
    */
   /**
    * @name Controls/Popup/Opener/Dialog#left
    * @cfg {Number} Distance from the window to the left border of the screen.
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
