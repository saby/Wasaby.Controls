define('Controls/interface/INotificationOptions', [
], function() {

   /**
    * Notification popup options.
    *
    * @interface Controls/interface/INotificationOptions
    * @public
    * @author Красильников А.С.
    */

   /**
    * @typedef {Object} PopupOptions
    * @description Sets the popup configuration.
    * @property {} autofocus Determines whether focus is set to the template when popup is opened.
    * @property {} className Class names of popup.
    * @property {} opener Control, which is the logical initiator of popup opening.
    * @property {} template Template inside popup.
    * @property {} templateOptions Template options inside popup.
    * @property {} eventHandlers Callback functions on popup events.
    */

   /**
    * @name Controls/interface/INotificationOptions#popupOptions
    * @cfg {PopupOptions[]} Sets the popup configuration.
    */
});
