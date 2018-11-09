define('Controls/Input/interface/IInputDateRange', [
], function() {
   'use strict';

   /**
    * Interface for date range inputs..
    * mixin Controls/Input/interface/IInputDateRange
    * @author Миронов А.Ю.
    */

   /**
    * @name Controls/Input/interface/IInputDateRange#startValue
    * @cfg {Date} Beginning of period
    * @example
    * In this example you bind _startValue in control's state to the value of input field.
    * At any time of control's lifecycle, _inputValue will contain the current value of the input field.
    * <pre>
    *    <Controls.Input.DatePicker bind:value="_startValue" />
    *    <Controls.Button on:click="_sendButtonClick()" />
    * </pre>
    * <pre>
    *    Control.extend({
    *       ...
    *       _startValue: new Date(),
    *      _sendButtonClick() {
    *         this._sendData(this._startValue);
    *      }
    *      ...
    *   });
    * </pre>
    */

   /**
    * @name Controls/Input/interface/IInputDateRange#endValue
    * @cfg {Date} End of period
    * @example
    * In this example you bind _endValue in control's state to the value of input field.
    * At any time of control's lifecycle, _inputValue will contain the current value of the input field.
    * <pre>
    *    <Controls.Input.DatePicker bind:value="_endValue" />
    *    <Controls.Button on:click="_sendButtonClick()" />
    * </pre>
    * <pre>
    *    Control.extend({
    *       ...
    *       _endValue: new Date(),
    *      _sendButtonClick() {
    *         this._sendData(this._endValue);
    *      }
    *      ...
    *   });
    * </pre>
    */

   /**
    * @event Controls/Input/interface/IInputDateRange#startValueChanged Occurs when field start value was changed.
    * @param {Date} value New field value.
    * @param {String} displayValue Text value of the field.
    * @remark
    * This event should be used to react to changes user makes in the field.
    * @example
    * In this example, we show how you can 'bind' control's value to the field.
    * In the first field, we do it manually using valueChanged event. In the second field we use bind notation.
    * Both fields in this examples will have identical behavior.
    * <pre>
    *    <Controls.Input.Date.Range startValue="_fieldValue" on:startValueChanged="_valueChangedHandler()"/>
    *    <Controls.Input.Date.Range bind:startValue="_anotherFieldValue"/>
    * </pre>
    * <pre>
    *    Control.extend({
    *       ....
    *       _fieldValue: null,
    *       _valueChangedHandler(value, displayValue) {
    *          this._fieldValue = value;
    *          this._saveToDatabase(displayValue);
    *       },
    *       _anotherFieldValue: null
    *       ...
    *    });
    * </pre>
    */

   /**
    * @event Controls/Input/interface/IInputDateRange#endValueChanged Occurs when field end value was changed.
    * @param {Date} value New field value.
    * @param {String} displayValue Text value of the field.
    * @remark
    * This event should be used to react to changes user makes in the field.
    * @example
    * In this example, we show how you can 'bind' control's value to the field.
    * In the first field, we do it manually using valueChanged event. In the second field we use bind notation.
    * Both fields in this examples will have identical behavior.
    * <pre>
    *    <Controls.Input.Date.Range endValue="_fieldValue" on:endValueChanged="_valueChangedHandler()"/>
    *    <Controls.Input.Date.Range bind:endValue="_anotherFieldValue"/>
    * </pre>
    * <pre>
    *    Control.extend({
    *       ....
    *       _fieldValue: null,
    *       _valueChangedHandler(value, displayValue) {
    *          this._fieldValue = value;
    *          this._saveToDatabase(displayValue);
    *       },
    *       _anotherFieldValue: null,
    *       ...
    *    });
    * </pre>
    */

   /**
    * @event Controls/Input/interface/IInputDateRange#inputCompleted Occurs when input was completed (field lost focus or user pressed ‘enter’).
    * @param {Date} startValue Start field value.
    * @param {Date} endValue End field value.
    * @param {String} displayedStartValue Text value of the start field.
    * @param {String} displayedEndValue Text value of the end field.
    * @remark
    * This event can be used as a trigger to validate the field or send entered data to some other control.
    * @example
    * In this example, we subscribe to inputCompleted event and save field's value to the first database and field`s display value to the second database.
    * <pre>
    *    <Controls.Input.Date.Range on:inputCompleted="_inputCompletedHandler()" />
    * </pre
    * <pre>
    *    Control.extend({
    *       ....
    *       _inputCompletedHandler(startValue, endValue, displaydStartValue, displaydEndValue) {
    *          this._saveEnteredValueToDabase1(startValue, endValue);
    *          this._saveEnteredValueToDabase2(displaydStartValue, displaydEndValue);
    *       },
    *       ...
    *    })
    * </pre>
    */

});
