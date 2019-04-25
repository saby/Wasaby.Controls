define('Controls/Button/interface/IIconStyle', [
], function() {

   /**
    * Interface for button icon.
    *
    * @interface Controls/Button/interface/IIconStyle
    * @public
    */

   /**
    * @name Controls/Button/interface/IIconStyle#iconStyle
    * @cfg {Enum} Icon display style.
    * @variant primary
    * @variant secondary
    * @variant success
    * @variant warning
    * @variant danger
    * @variant info
    * @variant default
    * @default secondary
    * @example
    * Primary button with default icon style.
    * <pre>
    *    <Controls.buttons:Button icon="icon-small icon-Add" style="buttonPrimary"/>
    * </pre>
    * Primary button with done icon style.
    * <pre>
    *    <Controls.buttons:Button icon="icon-small icon-Add" iconStyle="done" style="buttonPrimary"/>
    * </pre>
    * @see Icon
    */

});
