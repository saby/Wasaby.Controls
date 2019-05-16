/**
 * Interface for input tooltip
 *
 * @interface Controls/interface/IInputTooltip
 *
 * @public
 * @author Журавлев М.С.
 */
interface IInputTooltip {
    readonly _options: {
        /**
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
