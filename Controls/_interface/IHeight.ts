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
 *    <Controls.buttons:Button icon="icon-Add" inlineHeight="l" viewMode="button"/>
 * </pre>
 * @remark
 * Строковым значениям опции inlineHeight соответствуют числовые (px), которые различны для каждой темы оформления.
 * Числовые значения можно найти в <a href="http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_08_.html">стандарте контрола</a>.
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
 *    <Controls.buttons:Button icon="icon-Add" inlineHeight="l" viewMode="button"/>
 * </pre>
 * @see Icon
 */
