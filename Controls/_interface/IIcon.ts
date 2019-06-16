export interface IIconOptions {
   icon?: string;
}

/**
 * Interface for button icon.
 *
 * @interface Controls/_interface/IIcon
 * @public
 */
export default interface IIcon {
   readonly '[Controls/_interface/IIcon]': boolean;
}
/**
 * @name Controls/_interface/IIcon#icon
 * @cfg {String} Button icon.
 * @default Undefined
 * @remark Icon is given by icon classes.
 * All icons are symbols of special icon font. You can see all icons at <a href="https://wi.sbis.ru/docs/js/icons/">this page</a>.
 * @example
 * Button with style buttonPrimary and icon Add.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" style="primary" viewMode="button"/>
 * </pre>
 * @see iconStyle
 */
