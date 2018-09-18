define('Controls/Input/interface/IInputText', [
], function() {

   /**
    * Interface for text inputs.
    *
    * @interface Controls/Input/interface/IInputText
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputText#value
    * @cfg {String} Text in the field.
    * @default '' (empty string)
    * @remark Control always renders that value of this option. If you do not update option's value, user will not be able to enter anything in the field. You need to subscribe to _valueChanged event and update value that is passed to the control. To make it simpler, you can use bind notation. More details can be found here.
    * @example
    * In this example you bind _inputValue in control's state to the value of input field. At any time of control's lifecycle, _inputValue will contain the current value of the input field.
    * <pre>
    *    <Input.Text
    *       bind:value="_inputValue" />
    *    <Controls.Button
    *       on:click="_sendButtonClick()" />
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
    * @see Documentation: bind
    * @see Documentaion: Inputs
    * @see valueChanged
    */

   /**
    * @event Controls/Input/interface/IInputText#valueChanged Occurs when field value was changed.
    * @param {String} value Value of the field.
    * @remark This event should be used to react to changes user makes in the field. Value returned in the event is not inserted in control unless you pass it back to the field as an option. Usually you would use bind notation instead. Example below shows the difference.
    * @example
    * In this example, we show how you can 'bind' control's value to the field. In the first field, we do it manually using valueChanged event. In the second field we use bind notation. Both fields in this examples will have identical behavior.
    * <pre>
    *    <Controls.Input.Text
    *       value="_fieldValue"
    *       on:valueChanged="_valueChangedHandler()" />
    *
    *    <Controls.Input.Text
    *       bind:value="_anotherFieldValue" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _fieldValue: '',
    *       _valueChangedHandler(value) {
    *          this._fieldValue = value;
    *       },
    *
    *       _anotherFieldValue: ''
    *
    *    });
    * </pre>
    * @see Documentation: bind
    * @see Documentaion: Inputs
    * @see value
    */

   /**
    * @event Controls/Input/interface/IInputText#inputCompleted Occurs when input is completed (field lost focus or user pressed ‘enter’).
    * @param {String} value Value of the field.
    * @remark This event can be used as a trigger to validate the field or send entered data to some other control.
    * @example
    * In this example, we subscribe to inputCompleted event and save field's valut to the database.
    * <pre>
    *    <Controls.Input.Text
    *       on:inputCompleted="_inputCompletedHandler()" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _inputCompletedHandler(value) {
    *          this._saveEnteredValueToDabase(value);
    *       }
    *       ...
    *    });
    * </pre>
    * @see Documentaion: Inputs
    */

   /**
    * @name Controls/Input/interface/IInputText#tooltip
    * @cfg {String} Text of the tooltip shown when the control is hovered over.
    * @default None
    * @remark "Title" attribute added to the control's root node and default browser tooltip is shown on hover.
    * @example
    * In this example, when you hover over the field, "Enter your name" tooltip will be shown.
    * <pre>
    *    <Input.Text tooltip="Enter your name" />
    * </pre>
    */

   /**
    * @name Controls/Input/interface/IInputText#style
    * @cfg {String}
    * @variant default
    * @variant error
    * @default Default
    * @remark Depending on the option's value, different styles are applied to the field. This option is used by validation controller to mark input as invalid.
    * @example
    * Example description.
    * <pre>
    *    <Controls.Input.Text style="error"/>
    * </pre>
    * @see Documentation: Validation
    * @see Documentaion: Inputs
    */
});
