export interface IFontSizeOptions {
   fontSize?: string;
}

/**
 * Интерфейс для контролов с поддержкой разных размеров шрифта.
 *
 * @interface Controls/_interface/IFontSize
 * @public
 */

/*
 * Interface for control, which has different font sizes
 *
 * @interface Controls/_interface/IFontSize
 * @public
 */
export default interface IFontSize {
   readonly '[Controls/_interface/IFontSize]': boolean;
}
/**
 * @name Controls/_interface/IFontSize#fontSize
 * @cfg {Enum} Размер шрифта.
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @example
 * Кнопка с размером шрифта xl.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" fontSize="xl" viewMode="button"/>
 * </pre>
 * @see Icon
 */

/*
 * @name Controls/_interface/IFontSize#fontSize
 * @cfg {Enum} Font size value
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @example
 * Button with xl font size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" fontSize="xl" viewMode="button"/>
 * </pre>
 * @see Icon
 */
