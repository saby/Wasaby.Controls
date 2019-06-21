export interface IIconSizeOptions {
   iconStyle?: string;
}

/**
 * Interface for button icon.
 *
 * @interface Controls/_interface/IIconSize
 * @public
 */
export default interface IIconSize {
   readonly '[Controls/_interface/IIconSize]': boolean;
}
/**
 * @name Controls/_interface/IIconSize#iconSize
 * @cfg {Enum} Icon display Size.
 * @variant s
 * @variant m
 * @variant l
 * @variant default
 * @example
 * Button with default icon size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="button"/>
 * </pre>
 * Button with large size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" iconSize="l" viewMode="button"/>
 * </pre>
 * @see Icon
 */
