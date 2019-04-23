/**
 * Interface for text inputs.
 *
 * @interface Controls/interface/IInputMaskValue
 * @public
 * @author Миронов А.Ю.
 */
interface IInputMaskValue {
    readonly _options: {
        /**
         * @name Controls/interface/IInputMaskValue#value
         * @cfg {String} Text in the field without delimiters.
         * @default '' (empty string)
         * @remark If you don`t update value option, will not be able to enter anything in the field. You need to subscribe to _valueChanged event and update value that is passed to the control. To make it simpler, you can use bind notation.
         * The value passed must be raw without delimiters. If you need to get a value with delimiters, then you can do this by the {@link Controls/interface/IInputMaskValue#valueChanged} event.
         * @example
         * In this example you bind _inputValue in control's state to the value of input field. At any time of control's lifecycle, _inputValue will contain the current value of the input field.
         * <pre>
         *    <Controls._input.Mask bind:value="_inputValue" />
         *    <Controls.Button on:click="_sendButtonClick()" />
         * </pre>
         *
         * <pre>
         *    Control.extend({
         *       ...
         *       _inputValue: '',
         *
         *       _sendButtonClick() {
         *          this._sendData(this._inputValue);
         *       }
         *
         *    });
         * </pre>
         * @see valueChanged
         * @see inputCompleted
         */
        value: string;
    }
}

/**
 * @event Controls/interface/IInputMaskValue#valueChanged Occurs when field value was changed.
 * @param {String} value Value of the field without delimiters.
 * @param {String} displayValue Value of the field with delimiters.
 * @remark
 * This event should be used to react to changes user makes in the field. Value returned in the event is not inserted in control unless you pass it back to the field as an option. Usually you would use bind notation instead. Example below shows the difference.
 * @example
 * In this example, we show how you can 'bind' control's value to the field. In the first field, we do it manually using valueChanged event. In the second field we use bind notation. Both fields in this examples will have identical behavior.
 * <pre>
 *    <Controls._input.Mask value="_fieldValue" on:valueChanged="_valueChangedHandler()" />
 *
 *    <Controls._input.Text bind:value="_anotherFieldValue" />
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _fieldValue: '',
 *
 *       _valueChangedHandler(value, displayValue) {
 *          this._fieldValue = value;
 *          this._fieldValueWithDelimiters = displayValue;
 *       },
 *
 *       _anotherFieldValue: ''
 *
 *    });
 * </pre>
 * @see value
 */

/**
 * @event Controls/interface/IInputMaskValue#inputCompleted Occurs when input is completed (field lost focus or user pressed ‘enter’).
 * @param {String} value Value of the field.
 * @param {String} displayValue Value of the field with delimiters.
 * @remark
 * This event can be used as a trigger to validate the field or send entered data to some other control.
 * @example
 * In this example, we subscribe to inputCompleted event and save field's value to the database.
 * <pre>
 *    <Controls._input.Text on:inputCompleted="_inputCompletedHandler()" />
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _inputCompletedHandler(value) {
 *          this._saveEnteredValueToDatabase(value);
 *       }
 *       ...
 *    });
 * </pre>
 * @see value
 */

export default IInputMaskValue;
