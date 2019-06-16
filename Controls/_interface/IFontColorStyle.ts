export interface IFontColorStyleOptions {
   fontColorStyle?: string;
}

/**
 * Interface for control, which has different font colors
 *
 * @interface Controls/_interface/IFontColor
 * @public
 */
export default interface IFontColorStyle {
   readonly '[Controls/_interface/IFontColorStyle]': boolean;
}
/**
 * @name Controls/_interface/IFontColorStyle#fontColorStyle
 * @cfg {Enum} Font color style value.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant unaccented
 * @variant link
 * @variant label
 * @variant default
 * @example
 * Button with default font style.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="button"/>
 * </pre>
 * Button with success font style.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" fontColorStyle="success" viewMode="button"/>
 * </pre>
 * @see Icon
 */
