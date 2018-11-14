define('Controls/interface/IDialogOptions', [], function() {

   /**
    * Dialog popup options
    *
    * @interface Controls/interface/IDialogOptions
    * @public
    * @author Красильников А.С.
    */

   /**
    * @typedef {Object} PopupOptions
    * @description Dialog popup options.
    * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
    * @property {Boolean} isModal Determines whether the window is modal.
    * @property {String} className Class names of popup.
    * @property {Boolean} closeByExternalClick Determines whether possibility of closing the popup when clicking past.
    * @property {Object} opener Control, which is the logical initiator of popup opening.
    * @property {String|Template} template Template inside popup.
    * @property {String|Template} templateOptions Template options inside popup.
    * @property {Object} eventHandlers Callback functions on popup events.
    * @property {Boolean} draggable Determines whether the control can be moved by d'n'd.
    * @property {Integer} minWidth The minimum width of popup.
    * @property {Integer} maxWidth The maximum width of popup.
    * @property {Integer} minHeight The minimum height of popup.
    * @property {Integer} maxHeight The maximum height of popup.
    * @property {Boolean} maximize Determines whether the control is displayed in full screen.
    * @property {Boolean} resizable Determines whether popup can be resized.
    * @property {Integer} top Distance from the window to the top of the screen.
    * @property {Integer} left Distance from the window to the left border of the screen.
    * @property {Boolean} draggable Determines whether the component can be moved.
    */

   /**
    * @cfg {PopupOptions[]} Sets the popup configuration.
    * @name Controls/interface/IDialogOptions#popupOptions
    * @default {}
    * @remark
    * PopupOptions can be set both on the opener options and passed to the open method. PopupOptions passed to the open method will be merged with popupOptions declared on the open options.
    * @example
    * wml
    * <pre>
    *     <Controls.Popup.Opener.Dialog name="dialog">
    *         <ws:popupOptions template="Controls-demo/Popup/TestDialog" isModal="{{true}}" autofocus="{{false}}">
    *             <ws:templateOptions key="111"/>
    *         </ws:popupOptions>
    *     </Controls.Popup.Opener.Dialog>
    *
    *     <Controls.Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
    * </pre>
    * js
    * <pre>
    *     Control.extend({
    *       ...
    *
    *       _openDialog() {
    *          var popupOptions = {
    *             autofocus: true,
    *             templateOptions: {
    *                record: this._record
    *             }
    *          }
    *          this._children.dialog.open(popupOptions)
    *       }
    *       ...
    *    });
    * </pre>
    * @see open
    *
    * @public
    */

   /**
    * @name Controls/interface/IDialogOptions#eventHandlers
    * @cfg {PopupOptions[]} Callback functions on popup events.
    * @variant onResult Callback function is called at the sendResult event in the popup template.
    * @variant onClose Callback function is called when popup is closed.
    * @default {}
    * @remark
    * You need to consider the context of callback functions execution. see examples.
    * @example
    * userControl.wml
    * <pre>
    *     <Controls.Popup.Opener.Stack name="stack">
    *         <ws:popupOptions template="Controls-demo/Popup/TestStack" isModal="{{true}}" autofocus="{{false}}">
    *            <ws:templateOptions key="111"/>
    *            <ws:eventHandlers onResult="{{_onResultHandler}}" onClose="{{_onCloseHandler}}" />
    *         </ws:popupOptions>
    *      </Controls.Popup.Opener.Stack>
    *
    *      <Controls.Button name="openStackButton" caption="open stack" on:click="_openStack()"/>
    * </pre>
    * userControl.js
    * <pre>
    *   Control.extend({
    *      ...
    *
    *      constructor: function() {
    *         Control.superclass.constructor.apply(this, arguments);
    *         this._onResultHandler = this._onResultHandler.bind(this);
    *         this._onCloseHandler= this._onCloseHandler.bind(this);
    *      }
    *
    *      _openStack() {
    *         var popupOptions = {
    *             autofocus: true,
    *             templateOptions: {
    *               record: this._record
    *             }
    *         }
    *         this._children.stack.open(popupOptions)
    *      }
    *
    *      _onResultHandler(newData) {
    *         this._data = newData;
    *      }
    *
    *      _onCloseHandler() {
    *         this._sendData(this._data);
    *      }
    *      ...
    *  });
    * </pre>
    * TestStack.wml
    * <pre>
    *     ...
    *     <Controls.Button name="sendDataButton" caption="sendData" on:click="_sendData()"/>
    *     ...
    * </pre>
    * TestStack.js
    * <pre>
    *     Control.extend({
    *         ...
    *
    *         _sendData() {
    *            var data = {
    *               record: this._record,
    *               isNewRecord: true
    *            }
    *
    *            // send data to userControl.js
    *            this._notify('sendResult', [data], {bubbling: true});
    *
    *            // close popup
    *            this._notify('close', [], {bubbling: true});
    *         }
    *         ...
    *     );
    * </pre>
    */

});
