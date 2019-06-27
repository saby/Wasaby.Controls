export interface IButtonOptions {
   style?: string;
   viewMode?: string;
   size?: string;
   transparent?: boolean;
}

/**
 * Интерфейс для кнопок.
 *
 * @interface Controls/_interface/IButton
 * @public
 * @author Михайловский Д.С.
 */

/*
 * Interface for control Button.
 *
 * @interface Controls/_interface/IButton
 * @public
 * @author Михайловский Д.С.
 */
export default interface IButton {
   readonly '[Controls/_interface/IButton]': boolean;
}
/**
 * @name Controls/_interface/IButton#style
 * @cfg {Enum} Стиль отображения кнопки.
 * @variant primary 
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant secondary
 * @variant default
 * @default secondary
 * @example
 * Кнопка-ссылка со стилем отображения 'primary'.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Кнопка на панели инструментов со стилем 'danger'.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="danger" viewMode="toolButton"/>
 * </pre>
 * @see Size
 */

/*
 * @name Controls/_interface/IButton#style
 * @cfg {Enum} Button display style.
 * @variant primary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant secondary
 * @variant default
 * @default secondary
 * @example
 * Primary link button with 'primary' style.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Toolbar button with 'danger' style.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="danger" viewMode="toolButton"/>
 * </pre>
 * @see Size
 */

/**
 * @name Controls/_interface/IButton#viewMode
 * @cfg {Enum} Режим отображения кнопки.
 * @variant link Декорированная гиперссылка.
 * @variant button Кнопка по умолчанию.
 * @variant toolButton Кнопка панели инструментов.
 * @default button
 * @example
 * Кнопка в режиме отображения 'link'.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Кнопка в режиме отображения 'toolButton'.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="danger" viewMode="toolButton"/>
 * </pre>
 * Кнопка в режиме отображения 'button'.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="success" viewMode="button"/>
 * </pre>
 * @see Size
 */

/*
 * @name Controls/_interface/IButton#viewMode
 * @cfg {Enum} Button view mode.
 * @variant link Decorated hyperlink.
 * @variant button Default button.
 * @variant toolButton Toolbar button.
 * @default button
 * @example
 * Button with 'link' viewMode.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Button with 'toolButton' viewMode.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="danger" viewMode="toolButton"/>
 * </pre>
 * Button with 'button' viewMode.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="success" viewMode="button"/>
 * </pre>
 * @see Size
 */

/**
 * @name Controls/_interface/IButton#size
 * @cfg {String} Размер кнопки. Значение задается общими обозначениями размера.
 * @variant s Маленькиц размер кнопки.
 * @variant m Средний размер кнопки.
 * @variant l Большой размер кнопки.
 * @variant xl Очень большой размер кнопки.
 * @default m
 * @example
 * Размер кнопки 'L'.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="button" size="l"/>
 * </pre>
 * Размер кнопки по умолчанию.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="button"/>
 * </pre>
 * Неправильный размер кнопки.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="button" size="xl"/>
 * </pre>
 * @see style
 */

/*
 * @name Controls/_interface/IButton#size
 * @cfg {String} Button size. The value is given by common size notations.
 * @variant s Small button size.
 * @variant m Medium button size.
 * @variant l Large button size.
 * @variant xl Extra large button size.
 * @default m
 * @example
 * 'L' size of primary button.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="button" size="l"/>
 * </pre>
 * Default size of primary button.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="button"/>
 * </pre>
 * Uncorrect size of primary button.
 * <pre>
 *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="button" size="xl"/>
 * </pre>
 * @see style
 */

/**
 * @name Controls/_interface/IButton#transparent
 * @cfg {Boolean} Определяет, имеет ли кнопка фон.
 * @default false
 * @remark
 * true - Кнопка имеет прозрачный фон..
 * false - Кнопка имеет фон по умолчанию для этого режима отображения и стиля.
 * @example
 * Кнопка имеет прозрачный фон.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="primary" viewMode="toolButton" transparent="{{true}}" size="l"/>
 * </pre>
 * Кнопка имеет непрозрачный фон.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="primary" viewMode="toolButton" transparent="{{false}}"/>
 * </pre>
 * @see style
 */

/*
 * @name Controls/_interface/IButton#transparent
 * @cfg {Boolean} Determines whether button having background.
 * @default false
 * @remark
 * true - Button has transparent background.
 * false - Button has default background for this viewmode and style.
 * @example
 * Button has transparent background.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="primary" viewMode="toolButton" transparent="{{true}}" size="l"/>
 * </pre>
 * Button hasn't transparent background.
 * <pre>
 *    <Controls.buttons:Button caption="Send document" buttonStyle="primary" viewMode="toolButton" transparent="{{false}}"/>
 * </pre>
 * @see style
 */
