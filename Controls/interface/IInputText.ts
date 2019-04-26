/**
 * Interface for text inputs.
 *
 * @interface Controls/interface/IInputText
 * @public
 * @author Журавлев М.С.
 */
interface IInputText {
    readonly _options: {
        /**
         * @name Controls/interface/IInputText#trim
         * @cfg {Boolean} Determines whether the field value should be trimmed when input is completed.
         * @default false
         * @remark
         * String is trimmed only when input is completed.
         * If you bind control's state to the value in the field, the state will contain spaces when user types, and will be trimmed only when input is completed.
         * true - removes whitespaces from both ends of the string when input is completed.
         * false - does not do anything.
         * @example
         * In this example, extra spaces with both side will be trimmed when the focus leaves the text box.
         * <pre>
         *    <Controls.input:Text trim="{{true}}" bind:value="_fieldValue" on:inputCompleted="_inputCompletedHandler()"/>
         * </pre>
         *
         * <pre>
         *    Control.extend({
         *       ...
         *       _fieldValue: '',
         *
         *       _inputCompletedHandler(value) {
         *          // When event fires, both value and _fieldValue will contain trimmed field value
         *       }
         *       ...
         *    });
         * </pre>
         * @see Controls/interface/IInputText#inputCompleted
         */
        trim: boolean;
        /**
         * @name Controls/interface/IInputText#maxLength
         * @cfg {Number} Maximum number of characters that can be entered in the field.
         * @remark
         * If user tries to enter text longer than the value of maxLength, control will prevent input.
         * @example
         * In this example, only 20 characters can be entered in the field.
         * <pre>
         *    <Controls.input:Text maxLength="{{20}}"/>
         * </pre>
         */
        maxLength?: number;
        /**
         * @name Controls/interface/IInputText#constraint
         * @cfg {String} Regular expression for input filtration.
         * @remark
         * This regular expression is applied to every character that user enters. If entered character doesn't match regular expression, it is not added to the field. When user pastes a value with multiple characters to the field, we check the value characters by characters, and only add the characters that pass regular expression. For example, if you try to paste "1ab2cd" to the field with constraint "[0-9]", only "12" will be inserted in the field.
         * @example
         * In this example, the user will be able to enter only numbers in the field.
         * <pre>
         *    <Controls.input:Text constraint="[0-9]"/>
         * </pre>
         */
        constraint?: string;
    }
}

export default IInputText;
