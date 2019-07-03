export interface IIconStyleOptions {
   iconStyle?: string;
}

/**
 * Интерфейс иконки кнопки.
 *
 * @interface Controls/_interface/IIconStyle
 * @public
 */

/*
 * Interface for button icon.
 *
 * @interface Controls/_interface/IIconStyle
 * @public
 */
export default interface IIconStyle {
   readonly '[Controls/_interface/IIconStyle]': boolean;
}
/**
 * @name Controls/_interface/IIconStyle#iconStyle
 * @cfg {Enum} Стиль отображения иконки.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant default
 * @default secondary
 * @example
 * Кнопка с иконкой по умолчанию.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="button"/>
 * </pre>
 * Кнопка с иконкой в стиле "success".
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" iconStyle="success" viewMode="button"/>
 * </pre>
 * @see Icon
 */

/*
 * @name Controls/_interface/IIconStyle#iconStyle
 * @cfg {Enum} Icon display style.
 * @variant primary
 * @variant secondary
 * @variant success
 * @variant warning
 * @variant danger
 * @variant info
 * @variant default
 * @default secondary
 * @example
 * Button with default icon style.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="button"/>
 * </pre>
 * Button with success icon style.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" iconStyle="success" viewMode="button"/>
 * </pre>
 * @see Icon
 */
