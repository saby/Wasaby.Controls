export interface IHeightOptions {
   inlineHeight?: string;
}

/**
 * Интерфейс для контролов с различными значениями высоты.
 *
 * @interface Controls/_interface/IHeight
 * @public
 */

/*
 * Interface for control, which has different height values
 *
 * @interface Controls/_interface/IHeight
 * @public
 */
export default interface IHeight {
   readonly '[Controls/_interface/IHeight]': boolean;
}
/**
 * @name Controls/_interface/IHeight#inlineHeight
 * @cfg {Enum} Высота контрола.
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant default
 * @example
 * Кнопка большого размера (l).
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" height="l" viewMode="button"/>
 * </pre>
 * @see Icon
 */

/*
 * @name Controls/_interface/IHeight#inlineHeight
 * @cfg {Enum} Control height value
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant default
 * @example
 * Button with large height.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" height="l" viewMode="button"/>
 * </pre>
 * @see Icon
 */
