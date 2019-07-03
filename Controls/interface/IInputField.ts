/**
 * Интерфейс полей ввода.
 *
 * @interface Controls/interface/IInputField
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for input fields.
 *
 * @interface Controls/interface/IInputField
 * @public
 * @author Красильников А.С.
 */
interface IInputField {
    readonly _options: {
        /**
         * @name Controls/interface/IInputField#value
         * @cfg {String|null} Текст в поле ввода.
         * @default '' (empty string)
         * @remark
         * Если вы не обновите параметр 'value', вы не сможете ничего ввести в поле. Необходимо подписаться на событие _valueChanged и обновить значение, передаваемое контролу. 
         * Чтобы сделать его проще, вы можете использовать биндинг.
         * Не рекомендуется использовать эту опцию для изменения поведения обработки входных данных. Такой подход увеличивает время перерисовки. Используйте опцию inputCallback.
         * @example
         * В этом примере _inputValue в контроле привязывается к значению поля ввода. В любое время жизненного цикла контрола значение _inputValue будет содержать текущее значение поля ввода.
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

        /*
         * @name Controls/interface/IInputField#value
         * @cfg {String|null} Text in the field.
         * @default '' (empty string)
         * @remark
         * If you don`t update value option, will not be able to enter anything in the field. You need to subscribe to _valueChanged event and update value that is passed to the control. To make it simpler, you can use bind notation.
         * It is not recommended to use the option to change the behavior of input processing.This approach increases the redrawing time. Use the inputCallback option.
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
        value: string | null;
    }
}


/**
 * @event valueChanged Происходит при изменении значения отображения поля.
 * @name Controls/interface/IInputField#valueChanged
 * @param {String} value Значение поля.
 * @param {String} displayValue Отображение значения в поле.
 * @remark
 * Это событие должно использоваться для реагирования на изменения, вносимые пользователем в поле. 
 * Значение, возвращаемое в событии, не вставляется в контрол, если не передать его обратно в поле в качестве опции.
 * Однако, чаще в таких случаях используют биндинг. Пример ниже иллюстрирует разницу между двумя вариантами.
 * @example
 * В этом примере мы покажем, как можно привязать значение контрола к полю. В первом поле мы делаем это вручную, используя событие valueChanged.
 * Во втором поле используется привязка (биндинг). Оба поля в этом примере будут иметь одинаковое поведение.
 * <pre>
 *    <Controls.input:Text value="{{_fieldValue}}" on:valueChanged="_valueChangedHandler()" />
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
 * @event Occurs when field display value was changed.
 * @name Controls/interface/IInputField#valueChanged
 * @param {String} value Value of the field.
 * @param {String} displayValue Display value of the field.
 * @remark
 * This event should be used to react to changes user makes in the field. Value returned in the event is not inserted in control unless you pass it back to the field as an option. Usually you would use bind notation instead. Example below shows the difference.
 * @example
 * In this example, we show how you can 'bind' control's value to the field. In the first field, we do it manually using valueChanged event. In the second field we use bind notation. Both fields in this examples will have identical behavior.
 * <pre>
 *    <Controls.input:Text value="{{_fieldValue}}" on:valueChanged="_valueChangedHandler()" />
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
 * @event inputCompleted Происходит при завершении ввода (поле потеряло фокус или пользователь нажал "enter").
 * @name Controls/interface/IInputField#inputCompleted
 * @param {String} value Значение поля.
 * @remark
 * Это событие можно использовать в качестве триггера для проверки поля или отправки введенных данных в какой-либо другой контрол.
 * @example
 * В этом примере мы подписываемся на событие InputCompleted и сохраняем значение поля в базе данных.
 * <pre>
 *    <Controls.input:Text on:inputCompleted="_inputCompletedHandler()" />
 * </pre
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
 * @event Occurs when input is completed (field lost focus or user pressed ‘enter’).
 * @name Controls/interface/IInputField#inputCompleted
 * @param {String} value Value of the field.
 * @remark
 * This event can be used as a trigger to validate the field or send entered data to some other control.
 * @example
 * In this example, we subscribe to inputCompleted event and save field's value to the database.
 * <pre>
 *    <Controls.input:Text on:inputCompleted="_inputCompletedHandler()" />
 * </pre
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

export default IInputField;
