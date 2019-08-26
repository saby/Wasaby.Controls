/**
 * Интерфейс для полей ввода, имеющих возможность отображения всплывающей подсказки.
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
         * Подсказка отображает указанный текст, только если введенное значение полностью помещается в поле ввода. Когда значение не помещается полностью, подсказка отображает значение из поля ввода.
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
