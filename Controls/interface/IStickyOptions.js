define('Controls/interface/IStickyOpener', [], function() {

   /**
    * Sticky popup options.
    *
    * @interface Controls/interface/IStickyOpener
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
    * @property {Integer} corner Sets the popup build point relative target.
    * @property {Integer} horizontalAlign Sets the horizontal alignment of the popup.
    * @property {Integer} verticalAlign Sets the vertical alignment of the popup.
    * @property {Integer} target The maximum width of the panel in a maximized state.
    * @property {Integer} minWidth The target relative to which the popup is positioned.
    * @property {Integer} maxWidth The minimum width of popup.
    * @property {Integer} minHeight The maximum height of popup.
    * @property {Integer} maxHeight The maximum height of popup.
    * @property {String} locationStrategy A method of adjusting the popup panel to the free space next to the target.
    */

   /**
    * @cfg {PopupOptions[]} Sets the popup configuration.
    * @name Controls/interface/IStickyOpener#popupOptions
    * @default {}
    * @remark
    * PopupOptions can be set both on the opener options and passed to the open method. PopupOptions passed to the open method will be merged with popupOptions declared on the open options.
    * @example
    * wml
    * <pre>
    *     <Controls.Popup.Opener.Sticky name="sticky">
    *         <ws:popupOptions template="Controls-demo/Popup/TestDialog">
    *             <ws:verticalAlign side="bottom"/>
    *             <ws:horizontalAlign side="left"/>
    *             <ws:corner vertical="bottom" horizontal="left"/>
    *         </ws:popupOptions>
    *     </Controls.Popup.Opener.Sticky>
    *
    *     <div name="target">{{_text}}</div>
    *
    *     <Controls.Button name="openStickyButton" caption="open sticky" on:click="_open()"/>
    *     <Controls.Button name="closeStickyButton" caption="close sticky" on:click="_close()"/>
    * </pre>
    * js
    * <pre>
    *     Control.extend({
    *       ...
    *
    *       _open() {
    *          var popupOptions = {
    *             target: this._children.target,
    *             opener: this._children.openStickyButton,
    *             templateOptions: {
    *                record: this._record
    *             }
    *          }
    *          this._children.sticky.open(popupOptions);
    *       }
    *
    *       _close() {
    *           this._children.sticky.close()
    *       }
    *       ...
    *   });
    * </pre>
    * @see open
    *
    * @public
    */

   /**
    * @name Controls/interface/IStickyOpener#eventHandlers
    * @cfg {PopupOptions[]} Callback functions on popup events.
    * @variant onClose Callback function is called when popup is closed.
    * @variant onResult Callback function is called at the sendResult event in the popup template.
    * @default {}
    * @remark
    * You need to consider the context of callback functions execution. See examples.
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
