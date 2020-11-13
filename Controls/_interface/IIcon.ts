export interface IIconOptions {
   icon?: string;
}

/**
 * Интерфейс для контролов, который имеют возможность отображения иконки.
 *
 * @interface Controls/_interface/IIcon
 * @public
 */

/*
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
 * @cfg {String} Определяет иконку, которая будет отображена в контроле.
 * @default undefined
 * @remark Все иконки — символы специального шрифта иконок.
 * Список всех иконок можно увидеть <a href="/docs/js/icons/">здесь</a>.
 * Данная опция задает только символ шрифта иконки. Размер и цвет задаются другими соответствующими опциями iconSize iconStyle
 * @example
 * Кнопка со стилем primary и иконкой Add.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" buttonStyle="primary" viewMode="button"/>
 * </pre>
 * @see Controls/interface/IIconSize
 * @see Controls/interface/IIconStyle
 */

/*
 * @name Controls/_interface/IIcon#icon
 * @cfg {String} Button icon.
 * @default Undefined
 * @remark Icon is given by icon classes.
 * All icons are symbols of special icon font. You can see all icons at <a href="/docs/js/icons/">this page</a>.
 * @example
 * Button with style buttonPrimary and icon Add.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" buttonStyle="primary" viewMode="button"/>
 * </pre>
 * @see iconStyle
 */


