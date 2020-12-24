/**
 * Интерфейс опций контролов, которые поддерживают разные цвета иконок
 * @public
 * @author Красильников А.С.
 */
export interface IIconStyleOptions {
   /**
    * Стиль отображения иконки.
    * @variant primary
    * @variant secondary
    * @variant success
    * @variant warning
    * @variant danger
    * @variant info
    * @variant label
    * @variant default
    * @variant contrast
    * @default secondary
    * @remark
    * Цвет иконки задается константой из стандартного набора цветов, который определен для текущей темы оформления.
    * @demo Controls-demo/Buttons/IconStyles/Index
    * @example
    * Кнопка с иконкой по умолчанию.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.buttons:Button icon="icon-Add" viewMode="button"/>
    * </pre>
    * Кнопка с иконкой в стиле "success".
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.buttons:Button icon="icon-Add" iconStyle="success" viewMode="button"/>
    * </pre>
    * @see Icon
    */
   iconStyle?: string;
}

/**
 * Интерфейс для контролов, которые поддерживают разные цвета иконок
 * @public
 * @author Красильников А.С.
 */
export default interface IIconStyle {
   readonly '[Controls/_interface/IIconStyle]': boolean;
}

/*
 * Interface for button icon.
 *
 * @public
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
