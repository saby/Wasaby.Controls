define('Controls/Button/interface/IHref', [
], function() {

   /**
    * Interface for buttons with href links.
    *
    * @interface Controls/Button/interface/IHref
    * @public
    */

   /**
    * @name Controls/Button/interface/IHref#href
    * @cfg {String} Specifies the linked resource.
    * @default Undefined
    * @remark This options is analog of html href.
    * @example
    * When button pressed, we go to google.com
    * <pre>
    *    <Controls.Button href="https://www.google.com/" icon="icon-Add" style="primary" viewMode="button"/>
    * </pre>
    */
});
