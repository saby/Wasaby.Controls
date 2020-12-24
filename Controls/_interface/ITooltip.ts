/**
 * Интерфейс опций всплывающей подсказки.
 * @public
 * @author Красильников А.С.
 */
export interface ITooltipOptions {
   /**
    * Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
    * @default undefined
    * @remark Атрибут "Title" добавляется в корневой узел контрола и всплывающая подсказка браузера по умолчанию отображается при наведении курсора мыши.
    * @example
    * Подсказка "Add".
    * <pre class="brush: html">
    * <!-- WML -->
    * <ControlsDirectory.Control tooltip="Add"/>
    * </pre>
    */
   tooltip?: string;
}

/**
 * Интерфейс всплывающей подсказки.
 * @public
 * @author Красильников А.С.
 */
export default interface ITooltip {
   readonly '[Controls/_interface/ITooltip]': boolean;
}

/*
 * Interface for the tooltip.
 * @public
 * @author Красильников А.С.
 */

/*
 * @name Controls/_interface/ITooltip#tooltip
 * @cfg {String} Text of the tooltip shown when the control is hovered over.
 * @default Undefined
 * @remark "Title" attribute added to the control's root node and default browser tooltip is shown on hover.
 * @example
 * Tooltip is "Add".
 * <pre>
 *    <ControlsDirectory.Control tooltip="Add"/>
 * </pre>
 */
