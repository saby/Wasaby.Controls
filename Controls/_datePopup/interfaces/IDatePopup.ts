/**
 * Interface to select the period of the dialogue..
 * @interface Controls/_datePopup/interfaces/IDatePopup
 * @public
 * @author Миронов А.Ю.
 */

/**
 * @name Controls/_datePopup/interfaces/IDatePopup#startValue
 * @cfg {Date} Beginning of period
 * @example
 * In this example you bind _startValue in control's state to the value of period.
 * At any time of control's lifecycle, _startValue will contain the current start value of the period.
 * <pre>
 *    <Controls.datePopup bind:startValue="_startValue" />
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
 * @name Controls/_datePopup/interfaces/IDatePopup#endValue
 * @cfg {Date} End of period
 * @example
 * In this example you bind _endValue in control's state to the value of period.
 * At any time of control's lifecycle, _endValue will contain the current ens value of the period.
 * <pre>
 *    <Controls.datePopup bind:endValue="_endValue" />
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
 * @event Controls/_datePopup/interfaces/IDatePopup#startValueChanged Occurs when period start value was changed.
 * @param {Date} value New period value.
 * @param {String} displayValue Text value of the period.
 * @remark
 * This event should be used to react to changes user makes in the period.
 * @example
 * In this example, we show how you can 'bind' control's value to the period.
 * In the first period, we do it manually using valueChanged event. In the second period we use bind notation.
 * Both period in this examples will have identical behavior.
 * <pre>
 *    <Controls.datePopup startValue="_fieldValue" on:startValueChanged="_valueChangedHandler()"/>
 *    <Controls.datePopup bind:startValue="_anotherFieldValue"/>
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
 * @event Controls/_datePopup/interfaces/IDatePopup#endValueChanged Occurs when period end value was changed.
 * @param {Date} value New period value.
 * @param {String} displayValue Text value of the period.
 * @remark
 * This event should be used to react to changes user makes in the period.
 * @example
 * In this example, we show how you can 'bind' control's value to the period.
 * In the first period, we do it manually using valueChanged event. In the second period we use bind notation.
 * Both period in this examples will have identical behavior.
 * <pre>
 *    <Controls.datePopup endValue="_fieldValue" on:endValueChanged="_valueChangedHandler()"/>
 *    <Controls.datePopup bind:endValue="_anotherFieldValue"/>
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
 * @event Controls/_datePopup/interfaces/IDatePopup#inputCompleted Occurs when input was completed (period lost focus or user pressed ‘enter’).
 * @param {Date} startValue Start period value.
 * @param {Date} endValue End period value.
 * @param {String} displayedStartValue Text value of the start period.
 * @param {String} displayedEndValue Text value of the end period.
 * @remark
 * This event can be used as a trigger to validate the period or send entered data to some other control.
 * @example
 * In this example, we subscribe to inputCompleted event and save period's value to the first database and period`s display value to the second database.
 * <pre>
 *    <Controls.datePopup on:inputCompleted="_inputCompletedHandler()" />
 * </pre>
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
