define('Controls/interface/IConfirmationOptions', [
], function() {

   /**
    * Confirmation configuration.
    *
    * @interface Controls/interface/IConfirmationOptions
    * @typedef Object
    * @public
    * @author Красильников А.С.
    */

   /**
    * @typedef {Object} Config
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

   /**
    * @cfg {Config[]} Confirmation configuration.
    * @name Controls/interface/IConfirmationOptions#config
    */

});
