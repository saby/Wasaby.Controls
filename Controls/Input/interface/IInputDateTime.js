define('Controls/Input/interface/IInputDateTime', [
], function() {

   /**
    * Interface for date/time inputs.
    *
    * @interface Controls/Input/interface/IInputDateTime
    * @public
    * @author Миронов А.Ю.
    */

   /**
    * @name Controls/Input/interface/IInputDateTime#value
    * @cfg {Date} The date that the user entered in the input field.
    * @default null
    * @remark If you don`t update value option, will not be able to enter anything in the field.
    * You need to subscribe to “valueChanged” event and update value that is passed to the control.
    * To make it simpler, you can use bind notation.
    * @example
    * In this example you bind _inputValue in control's state to the value of input field.
    * At any time of control's lifecycle, _inputValue will contain the current value of the input field.
    * <pre>
    *    <Controls.Input.DateTime bind:value="_inputValue" />
    *    <Controls.Button on:click="_sendButtonClick()" />
    * </pre>
    * <pre>
    *    Control.extend({
    *       ...
    *       _inputValue: new Date(),
    *
    *       _sendButtonClick() {
    *          this._sendData(this._inputValue);
    *       }
    *       ...
    *  });
    * </pre>
    */

   /**
    * @event Controls/Input/interface/IInputDateTime#valueChanged Occurs when field value was changed.
    * @param {Date} value New field value.
    * @param {String} displayValue Text value of the field.
    * @remark
    * This event should be used to react to changes user makes in the field.
    * Value returned in the event is not inserted in control unless you pass it back to the field as an option.
    * Usually you would use bind notation instead. Example below shows the difference.
    * @example
    * In this example, we show how you can 'bind' control's value to the field.
    * In the first field, we do it manually using valueChanged event. In the second field we use bind notation.
    * Both fields in this examples will have identical behavior.
    * <pre>
    *    <Controls.Input.DateTime value="_fieldValue" on:valueChanged="_valueChangedHandler()"/>
    *    <Controls.Input.DateTime bind:value="_anotherFieldValue"/>
    * </pre>
    * <pre>
    * Control.extend({
    *    ....
    *    _fieldValue: null,
    *    _valueChangedHandler(value, displayValue) {
    *       this._fieldValue = value;
    *       this._saveToDatabase(displayValue);
    *    },
    *
    *    _anotherFieldValue: null
    *    ...
    * });
    * </pre>
    */

   /**
    * @event Controls/Input/interface/IInputDateTime#inputCompleted Occurs when input was completed (field lost focus or user pressed ‘enter’).
    * @param {Date} value Field value.
    * @param {String} displayValue Text value of the field.
    * @remark
    * This event can be used as a trigger to validate the field or send entered data to some other control.
    * @example
    * In this example, we subscribe to inputCompleted event and save field's value to the first database and field`s display value to the second database.
    * <pre>
    *    <Controls.Input.Text on:inputCompleted="_inputCompletedHandler()" />
    * </pre>
    * <pre>
    *    Control.extend({
    *       ....
    *       _inputCompletedHandler(value, displayValue) {
    *          this._saveEnteredValueToDabase1(value);
    *          this._saveEnteredValueToDabase2(displayValue);
    *       }
    *       ...
    *    })
    * </pre>
    */

});
