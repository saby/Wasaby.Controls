define('Controls/interface/IOpener', [], function() {

   /**
    * Interface for opener.
    *
    * @interface Controls/interface/IOpener
    * @public
    */

   /**
    * @typedef {Object} popupOptions
    * @property {Boolean} closeByExternalClick Close popup by click on external node
    * @property {String|Function} template Popup template
    * @property {templateOptions} templateOptions  Options for the template component
    * @property {Object} eventHandlers
    * @property {Object} opener The component that opened the popup. Used to establish a logical connection
    */

   /**
    * @name Controls/interface/IOpener#closePopupBeforeUnmount
    * @cfg {Boolean} Close the pop-up window when the opener was destroyed.
    * Default value: true
    */


   /** @name Controls/interface/IDropdownList#popupOptions
    * @cfg {popupOptions} Options for pop-up
    */
});
