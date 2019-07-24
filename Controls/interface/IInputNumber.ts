/**
 * Интерфейс для контрола Input.Number.
 *
 * @interface Controls/interface/IInputNumber
 * @public
 * @author Журалев М.С.
 */

/**
 * @name Controls/interface/IInputNumber#value
 * @cfg {Number|String|null} Числое значение поля.
 * @default 0
 * @remark
 * Для корректной работы пользователя с полем, вам нужно обновлить опцию. Иначе в поле ничего не введется. Для того чтобы её обновить, необходимо подписаться на событие _valueChanged и обновить состояние, связанное с опцией. Для упрощения вы можете использовать синтаксис связывания(bind).
 * Работая с типом Number, можно столкнуться с проблемой потери точности. Например, числа 99999999999999999999 не существует. Оно представляется как 100000000000000000000, ввиду особенностей движка javascript, регламентируемых стандартом {@link http://www.softelectro.ru/ieee754.html IEEE 754}. Для того чтобы избежать этой проблемы, необходимо работать с типом String.
 * @example
 * В этом примере состояние контрола _inputValue связывается с опцией value поля ввода. В любом хуке жизненного цикла контрола значение _inputValue будет содержать текущее значение поля ввода.
 * <pre>
 *    <Controls.input:Number bind:value="_inputValue" />
 *    <Controls.Button on:click="_sendButtonClick()" />
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _inputValue: 0,
 *
 *       _sendButtonClick() {
 *             this._sendData(this._inputValue);
 *       }
 *       ...
 *    });
 * </pre>
 * @see valueChanged
 * @see inputCompleted
 */

/**
 * @event Происходит при изменении значения поля.
 * @name Controls/interface/IInputNumber#valueChanged
 * @param {Number|String|null} value Числое значение поля.
 * @param {String} displayValue Отображаемое значение в поле.
 * @remark
 * Это событие можно использовать в качестве реакции на изменения, вносимые пользователем в поле. Значение из аргументов события, не вставляется в контрол, если не передать его обратно в поле в качестве опции. Обычно, вместо этого можно использовать синтаксис связывания(bind).
 * @example
 * В этом примере мы покажем, как можно связать состояние контрола _anotherFieldValue с опцией value. В первом поле мы делаем это вручную, используя событие valueChanged. Во втором поле - используя нотацию привязки(bind). Поведение этих полей будет одинаковым.
 * <pre>
 *    <Controls.input:Text value="_fieldValue" on:valueChanged="_valueChangedHandler()" />
 *
 *    <Controls.input:Text bind:value="_anotherFieldValue" />
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
 * @event Происходит, когда ввод завершен (поле потеряло фокус или пользователь нажал "enter").
 * @name Controls/interface/IInputNumber#inputCompleted
 * @param {Number|String|null} value Числое значение поля.
 * @param {String} displayValue Отображаемое значение в поле.
 * @remark
 * Реагируя на это событие, можно проверить поле на валидность введенных данных или отправить данные в другой контрол.
 * @example
 * В этом примере мы подписываемся на событие inputCompleted и сохраняем значение поля в базе данных.
 * <pre>
 *    <Controls.input:Text on:inputCompleted="_inputCompletedHandler()" />
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

/*
 * Interface for Input.Number.
 *
 * @interface Controls/interface/IInputNumber
 * @public
 * @author Журалев М.С.
 */
interface IInputNumber {
    /*
     * @name Controls/interface/IInputNumber#value
     * @cfg {Number|String|null} The number that will be projected to the text in the field.
     * @default 0
     * @remark
     * If you don`t update value option, will not be able to enter anything in the field. You need to subscribe to _valueChanged event and update value that is passed to the control. To make it simpler, you can use bind notation.
     * Working with the Number type you can face the problem of loss of accuracy. For example, the number 999999999999999999 does not exist. It is represented as 100000000000000000000. The thing is that the number in js is represented by the {@link http://www.softelectro.ru/ieee754.html IEEE 754} standard. To avoid this problem, you must work with the String type.
     * @example
     * In this example you bind _inputValue in control's state to the value of input field. At any time of control's lifecycle, _inputValue will contain the current value of the input field.
     * <pre>
     *    <Controls.input:Number bind:value="_inputValue" />
     *    <Controls.Button on:click="_sendButtonClick()" />
     * </pre>
     *
     * <pre>
     *    Control.extend({
     *        ...
     *       _inputValue: 0,
     *
     *       _sendButtonClick() {
     *          this._sendData(this._inputValue);
     *       }
     *       ...
     *    });
     * </pre>
     * @see valueChanged
     * @see inputCompleted
     */
    value: number | null;
}

/*
 * @event Occurs when field value was changed.
 * @name Controls/interface/IInputNumber#valueChanged
 * @param {Number|String|null} value The number that will be projected to the text in the field.
 * @param {String} displayValue Value of the field.
 * @remark
 * This event should be used to react to changes user makes in the field. Value returned in the event is not inserted in control unless you pass it back to the field as an option. Usually you would use bind notation instead. Example below shows the difference.
 * @example
 * In this example, we show how you can 'bind' control's value to the field. In the first field, we do it manually using valueChanged event. In the second field we use bind notation. Both fields in this examples will have identical behavior.
 * <pre>
 *    <Controls.input:Text value="_fieldValue" on:valueChanged="_valueChangedHandler()" />
 *
 *    <Controls.input:Text bind:value="_anotherFieldValue" />
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

/*
 * @event Occurs when input is completed (field lost focus or user pressed ‘enter’).
 * @name Controls/interface/IInputNumber#inputCompleted
 * @param {Number|String|null} value The number that will be projected to the text in the field.
 * @param {String} displayValue Value of the field.
 * @remark
 * This event can be used as a trigger to validate the field or send entered data to some other control.
 * @example
 * In this example, we subscribe to inputCompleted event and save field's value to the database.
 * <pre>
 *    <Controls.input:Text on:inputCompleted="_inputCompletedHandler()" />
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

export default IInputNumber;
