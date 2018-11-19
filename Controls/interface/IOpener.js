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
});
