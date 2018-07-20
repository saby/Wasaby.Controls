define('Controls/interface/IOpener', [], function() {

   /**
    * Interface for opener.
    *
    * @interface Controls/interface/IOpener
    * @public
    */


   /**
    * @name Controls/interface/IOpener#templateOptions
    * @cfg {Object} Options for the template component
    */

   /**
    * @name Controls/interface/IOpener#popupOptions.template
    * @cfg {String|Function} Popup template
    */

   /**
    * @name Controls/interface/IOpener#popupOptions.closeByExternalClick
    * @cfg {Boolean} Close popup by click on external node
    */

   /**
    * @name Controls/interface/IOpener#popupOptions.opener
    * @cfg {Object} The component that opened the popup. Used to establish a logical connection
    */

   /**
    * @name Controls/interface/IOpener#closePopupBeforeUnmount
    * @cfg {Boolean} Close popup when opener destroyed.
    * Default value: true
    */
});
