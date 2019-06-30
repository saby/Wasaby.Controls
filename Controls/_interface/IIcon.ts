export interface IIconOptions {
   icon?: string;
}

/**
 * Интерфейс для кнопки с иконкой.
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
 * @cfg {String} Определяет иконку, которая будет отображена на кнопке.
 * @default Undefined
 * @remark Иконки задаются классами иконок.
 * Все иконки - символы специального шрифта иконок. Список всех иконок можно увидеть <a href="https://wi.sbis.ru/docs/js/icons/">здесь</a>.
 * @example
 * Кнопка со стилем buttonPrimary и иконкой Add.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" style="primary" viewMode="button"/>
 * </pre>
 * @see iconStyle
 */

/*
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


