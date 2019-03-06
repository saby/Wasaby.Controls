define('Controls/Button/interface/IIcon', [
], function() {

   /**
    * Interface for button icon.
    *
    * @interface Controls/Button/interface/IIcon
    * @public
    */

   /**
    * @name Controls/Button/interface/IIcon#icon
    * @cfg {String} Button icon.
    * @default Undefined
    * @remark Icon is given by size and icon classes. Icons have three size: icon-small, icon-medium, icon-large. Sizes are set by CSS rules.
    * All icons are symbols of special icon font. You can see all icons at <a href="https://wi.sbis.ru/docs/js/icons/">this page</a>.
    * @example
    * Button with style buttonPrimary and icon Add.
    * <pre>
    *    <Controls.buttons:Button icon="icon-small icon-Add" style="primary" viewMode="button"/>
    * </pre>
    * @see iconStyle
    */

});
