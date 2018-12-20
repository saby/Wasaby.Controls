define('Controls/interface/IOpener', [], function() {

   /**
    * Interface for opener.
    *
    * @interface Controls/interface/IOpener
    * @public
    * @author Красильников А.С.
    */

   /**
    * @typedef {Object} eventHandlers
    * @property {Function} onResult Occurs when the pop-up notify 'sendResult'. More information you can read <a href='/doc/platform/developmentapl/interface-development/ws4/components/openers/#_8/'> here</a>
    * @property {Function} onClose Occurs when the pop-up is closed.
    */

   /**
    * @typedef {Object} PopupOptions
    * @property {Boolean} closeByExternalClick Close popup by click on external node.
    * @property {String|Function} template Popup template.
    * @property {templateOptions} templateOptions Options for the template component.
    * @property {eventHandlers} eventHandlers Handlers for pop-up event.
    * @property {Object} opener The component that opened the popup. Used to establish a logical connection.
    */

   /**
    * @name Controls/interface/IOpener#closePopupBeforeUnmount
    * @cfg {Boolean} Determines whether to close the popup when the component is destroyed.
    * Default value: true
    */


   /** @name Controls/interface/IOpener#popupOptions
    * @cfg {PopupOptions} Sets the popup configuration.
    */

   /**
    * @name Controls/interface/IOpener#displayMode
    * @cfg {String} Allows display multiple popups
    * @variant 'single' default. Show only one popup at a time
    * @variant 'multiple' Allow multiple popups on a screen
    */

   /**
    * @event Controls/interface/IOpener#popupClose Occurs when popup is closed.
    * @example
    * In this example, we subscribe to popupClose event and remove item at list
    * <pre>
    *    <Controls.Popup.Opener.Stack on:popupClose="_popupCloseHandler()" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _popupCloseHandler() {
    *          this._removeItem(this._currentItem);
    *       }
    *       ...
    *    });
    * </pre>
    */

   /**
    * @event Controls/interface/IOpener#popupResult Occurs when child control of popup notify "sendResult" event.
    * @example
    * In this example, we subscribe to popupResult event and save user data.
    * <pre>
    *    // MainControl.wml
    *    <Controls.Popup.Opener.Stack on:popupResult="_popupResultHandler()" />
    * </pre>
    *
    * <pre>
    *    // MainControl.js
    *    Control.extend({
    *       ...
    *       _popupResultHandler(event, userData) {
    *          this._saveUserData(userData);
    *       }
    *       ...
    *    });
    * </pre>
    *
    * <pre>
    *    // popupTemplate.js
    *    Control.extend({
    *       ...
    *       _sendDataToMainControl(userData) {
    *          this._notify('sendResult', [userData], { bubbling: true});
    *       }
    *       ...
    *    });
    * </pre>
    */

   /**
    * @event Controls/interface/IOpener#popupOpen Occurs when popup is opened.
    * @example
    * In this example, we subscribe to popupOpen event and change text at input control
    * <pre>
    *    <Controls.Popup.Opener.Stack on:popupOpen="_popupOpenHandler()" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _popupOpenHandler() {
    *          this._popupOpened = true;
    *          this._changeStatus(this._popupOpened);
    *       }
    *       ...
    *    });
    * </pre>
    */
});
