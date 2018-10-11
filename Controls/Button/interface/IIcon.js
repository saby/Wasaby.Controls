define('Controls/Button/interface/IIcon', [
], function() {

   /**
    * Interface for button icon.
    *
    * @interface Controls/Button/interface/IIcon
    * @public
    */

   /**
    * @name Controls/Button#icon
    * @cfg {String} Button icon.
    * @default Undefined
    * @remark Icon is given by size and icon classes. Icons have three size: icon-small, icon-medium, icon-large. Sizes are set by CSS rules.
    * All icons are symbols of special icon font. You can see all icons at <a href="https://wi.sbis.ru/docs/js/icons/">this page</a>.
    * @example
    * Button with style buttonPrimary and icon Add.
    * <pre>
    *    <Controls.Button icon="icon-small icon-Add" style="primary" viewMode="button"/>
    * </pre>
    * @see iconStyle
    */

   /**
    * @name Controls/Button#iconStyle
    * @cfg {Enum} Icon display style.
    * @variant primary attract attention.
    * @variant secondary Default field display style.
    * @variant success Success field display style.
    * @variant warning Warning field display style.
    * @variant danger Danger field display style.
    * @variant info Information field display style.
    * @default Default
    * @remark Default display style is different for different button styles.
    * @example
    * Primary button with default icon style.
    * <pre>
    *    <Controls.Button icon="icon-small icon-Add" style="buttonPrimary"/>
    * </pre>
    * Primary button with done icon style.
    * <pre>
    *    <Controls.Button icon="icon-small icon-Add" iconStyle="done" style="buttonPrimary"/>
    * </pre>
    * @see Icon
    */

});
