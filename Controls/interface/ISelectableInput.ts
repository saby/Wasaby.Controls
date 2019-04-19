/**
 * Interface for input selection
 *
 * @interface Controls/interface/ISelectableInput
 *
 * @public
 * @author Журавлев М.С.
 */
interface ISelectableInput {
    readonly _options: {
        /**
         * @name Controls/interface/ISelectableInput#selectOnClick
         * @cfg {Boolean} Determines whether text is selected when input is clicked.
         * @default false
         * @remark
         * This option can be used if you know that user clicking the field to enter a new value is a more frequent scenario
         * than user wanting to edit the current value. In that case, they will click on the field, text will get selected, a
         * nd they will be able to start entering new value immediately.
         * @example
         * In this example, when the field is clicked, all text in it will be selected.
         * <pre>
         *    <Controls.input:Text selectOnClick={{true}}/>
         * </pre>
         */
        selectOnClick: boolean;
    };
}

export default ISelectableInput;
