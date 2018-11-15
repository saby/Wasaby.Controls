define('Controls/Input/interface/IInputText', [], function() {

   /**
    * Interface for text inputs.
    *
    * @interface Controls/Input/interface/IInputText
    * @public
    * @author Колесова П.С.
    */

   /**
    * @name Controls/Input/interface/IInputText#value
    * @cfg {String} Text in the field.
    * @default '' (empty string)
    * @remark If you don`t update value option, will not be able to enter anything in the field. You need to subscribe to _valueChanged event and update value that is passed to the control. To make it simpler, you can use bind notation.
    * @example
    * In this example you bind _inputValue in control's state to the value of input field. At any time of control's lifecycle, _inputValue will contain the current value of the input field.
    * <pre>
    *    <Input.Text bind:value="_inputValue" />
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

   /**
    * @event Controls/Input/interface/IInputText#valueChanged Occurs when field value was changed.
    * @param {String} value Value of the field.
    * @remark
    * This event should be used to react to changes user makes in the field. Value returned in the event is not inserted in control unless you pass it back to the field as an option. Usually you would use bind notation instead. Example below shows the difference.
    * @example
    * In this example, we show how you can 'bind' control's value to the field. In the first field, we do it manually using valueChanged event. In the second field we use bind notation. Both fields in this examples will have identical behavior.
    * <pre>
    *    <Controls.Input.Text value="_fieldValue" on:valueChanged="_valueChangedHandler()" />
    *
    *    <Controls.Input.Text bind:value="_anotherFieldValue" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _fieldValue: '',
    *
    *       _valueChangedHandler(value) {
    *          this._fieldValue = value;
    *       },
    *
    *       _anotherFieldValue: ''
    *
    *    });
    * </pre>
    * @see value
    */

   /**
    * @event Controls/Input/interface/IInputText#inputCompleted Occurs when input is completed (field lost focus or user pressed ‘enter’).
    * @param {String} value Value of the field.
    * @remark
    * This event can be used as a trigger to validate the field or send entered data to some other control.
    * @example
    * In this example, we subscribe to inputCompleted event and save field's value to the database.
    * <pre>
    *    <Controls.Input.Text on:inputCompleted="_inputCompletedHandler()" />
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
});
