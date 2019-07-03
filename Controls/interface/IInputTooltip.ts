/**
 * Интерфейс для ввода текста всплывающей подсказки.
 *
 * @interface Controls/interface/IInputTooltip
 *
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for input tooltip
 *
 * @interface Controls/interface/IInputTooltip
 *
 * @public
 * @author Красильников А.С.
 */
interface IInputTooltip {
    readonly _options: {
        /**
         * @name Controls/interface/IInputTooltip#tooltip
         * @cfg {String} Текст всплывающей подсказки, отображаемой при наведении указателя мыши на элемент.
         * @remark
         * Атрибут "Title" добавляется в корневой узел контрола и всплывающая подсказка браузера по умолчанию отображается при наведении курсора.
         * @example
         * В этом примере при наведении курсора мыши на поле появится подсказка "Enter your name".
         * <pre>
         *    <Controls.input:Text tooltip="Enter your name"/>
         * </pre>
         */

        /*
         * @name Controls/interface/IInputTooltip#tooltip
         * @cfg {String} Text of the tooltip shown when the control is hovered over.
         * @remark
         * "Title" attribute added to the control's root node and default browser tooltip is shown on hover.
         * @example
         * In this example, when you hover over the field, "Enter your name" tooltip will be shown.
         * <pre>
         *    <Controls.input:Text tooltip="Enter your name"/>
         * </pre>
         */
        tooltip?: String
    }
}

export default IInputTooltip;
