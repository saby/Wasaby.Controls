define('Controls/Button/interface/IIconStyle', [
], function() {

   /**
    * Interface for button icon.
    *
    * @interface Controls/Button/interface/IIconStyle
    * @public
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
    * @default secondary
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
