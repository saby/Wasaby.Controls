define('Controls/interface/IStackOptions', [], function() {

   /**
    * Stack popup options.
    *
    * @interface Controls/interface/IStackOptions
    * @public
    * @author Красильников А.С.
    */

   /**
    * @typedef {Object} PopupOptions
    * @description Stack popup options.
    * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
    * @property {Boolean} isModal Determines whether the window is modal.
    * @property {String} className Class names of popup.
    * @property {Boolean} closeByExternalClick Determines whether possibility of closing the popup when clicking past.
    * @property {Object} opener Control, which is the logical initiator of popup opening.
    * @property {String|Template} template Template inside popup.
    * @property {String|Template} templateOptions Template options inside popup.
    * @property {Object} eventHandlers Callback functions on popup events.
    * @property {Integer} minWidth The minimum width of popup.
    * @property {Integer} maxWidth The maximum width of popup.
    * @property {Integer} minimizedWidth The width of the panel in a minimized state.
    * @property {Boolean} maximize Determines whether the control is displayed in full screen.
    */

   /**
    * @cfg {PopupOptions[]} Sets the popup configuration.
    * @name Controls/interface/IStackOptions#popupOptions
    * @default {}
    * @remark
    * PopupOptions can be set both on the opener options and passed to the open method. PopupOptions passed to the open method will be merged with popupOptions declared on the open options.
    * @example
    * wml
    * <pre>
    *     <Controls.Popup.Opener.Stack name="stack">
    *         <ws:popupOptions template="Controls-demo/Popup/TestStack" isModal="{{true}}" autofocus="{{false}}">
    *             <ws:templateOptions key="111"/>
    *             <ws:eventHandlers onResult="{{_onResultHandler}}" onClose="{{_onCloseHandler}}" />
    *         </ws:popupOptions>
    *     </Controls.Popup.Opener.Stack>
    *
    *     <Controls.Button name="openStackButton" caption="open stack" on:click="_openStack()"/>
    * </pre>
    * js
    * <pre>
    *     Control.extend({
    *       ...
    *
    *       _openStack() {
    *          var popupOptions = {
    *             autofocus: true,
    *             templateOptions: {
    *                record: this._record
    *             }
    *          }
    *          this._children.stack.open(popupOptions)
    *       }
    *
    *       _onResultHandler(newData) {
    *           this._data = newData;
    *       }
    *
    *       _onCloseHandler() {
    *           this._sendData(this._data);
    *       }
    *       ...
    *   });
    * </pre>
    * @see open
    *
    * @public
    */

   /**
    * @name Controls/interface/IStackOptions#eventHandlers
    * @cfg {PopupOptions[]} Callback functions on popup events.
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
