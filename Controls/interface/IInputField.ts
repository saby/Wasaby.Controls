/**
 * Интерфейс управления значением текстового контрола ввода.
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
         * @cfg {String|null} Значение контрола ввода.
         * @default '' (empty string)
         * @remark
         * При установке опции value в контроле ввода, отображаемое значение всегда будет соответствовать её значению. В этом случае родительский контрол управляет отображаемым значением. Например, вы можете менять значение по событию {@link valueChanged}:
         * <pre>
         *     <Controls:input:Text value="{{_value}}" on:valueChanged="_handleValueChange()"/>
         *
         *     export class Form extends Control<IControlOptions, void> {
         *         private _value: string = '';
         *
         *         private _handleValueChange(event: SyntheticEvent<Event>, value) {
         *             this._value = value;
         *         }
         *     }
         * </pre>
         * Пример можно упростить, воспользовавшись синтаксисом шаблонизатора {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/options/#two-way-binding bind}:
         * <pre>
         *     <Controls:input:Text bind:value="_value"/>
         * </pre>
         * Альтернатива - не задавать опцию value. Значение контрола будет кешироваться в контроле ввода:
         * <pre>
         *     <Controls.input:Text/>
         * </pre>
         * Не рекомендуем использовать опцию для изменения поведения обработки ввода. Такой подход увеличит время перерисовки.
         * Плохо:
         * <pre>
         *     <Controls:input:Text value="{{_value}}" on:valueChanged="_handleValueChange()"/>
         *
         *     export class Form extends Control<IControlOptions, void> {
         *         private _value: string = '';
         *
         *         private _handleValueChange(event: SyntheticEvent<Event>, value) {
         *             this._value = value.toUpperCase();
         *         }
         *     }
         * </pre>
         * Лучшим подходом будет воспользоваться опцией {@link Controls/interface/ICallback#inputCallback}.
         * Хорошо:
         * <pre>
         *     <Controls:input:Text bind:value="{{_value}}" inputCallback="{{_toUpperCase}}"/>
         *
         *     class Form extends Control<IControlOptions, void> {
         *         private _value: string = '';
         *
         *         private _toUpperCase(data) {
         *             return {
         *                 position: data.position,
         *                 value: data.value.toUpperCase()
         *             }
         *         }
         *     }
         * </pre>
         * @example
         * Сохраняем данные о пользователе и текущее время при отправке формы.
         * <pre>
         *     <form action="Auth.php" name="form">
         *         <Controls.input:Text bind:value="_login"/>
         *         <Controls.input:Password bind:value="_password"/>
         *         <Controls.buttons:Button on:click="_saveUser()" caption="Отправить"/>
         *     </form>
         *
         *     export class Form extends Control<IControlOptions, void> {
         *         private _login: string = '';
         *         private _password: string = '';
         *         private _server: Server = new Server();
         *
         *         private _saveUser() {
         *             this._server.saveData({
         *                 date: new Date(),
         *                 login: this._login,
         *                 password: this._password
         *             });
         *
         *             this._children.form.submit();
         *         }
         *     }
         * </pre>
         *
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
         *    <Controls.buttons:Button on:click="_sendButtonClick()" />
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
    };
}

/**
 * @event Controls/interface/IInputField#valueChanged Происходит при изменении отображаемого значения контрола ввода.
 * @param {String} value Значение контрола ввода.
 * @param {String} displayValue Отображаемое значение контрола ввода.
 * @remark
 * Событие используется в качестве реакции на изменения, вносимые пользователем.
 * @example
 * Контрол ввода пароля с информационной подсказкой. Подсказка содержит информацию о его безопасности.
 * <pre>
 *     <Controls.input:Password name="password" on:valueChanged="_validatePassword()"/>
 *
 *     export class InfoPassword extends Control<IControlOptions, void> {
 *         private _validatePassword(event, value) {
 *             let lengthPassword: number = value.length;
 *             let cfg = {
 *                 target: this._children.password,
 *                 targetSide: 'top',
 *                 alignment: 'end',
 *                 message: null
 *             }
 *
 *             if (lengthPassword < 6) {
 *                 cfg.message = 'Сложность пароля низкая';
 *             }
 *             if (lengthPassword >= 6 && lengthPassword < 10) {
 *                 cfg.message = 'Сложность пароля средняя';
 *             }
 *             if (lengthPassword >= 10) {
 *                 cfg.message = 'Сложность пароля высокая';
 *             }
 *
 *             this._notify('openInfoBox', [cfg], {
 *                 bubbling: true
 *             });
 *         }
 *     }
 * </pre>
 *
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
 * @event  Происходит при завершении ввода.
 * @name Controls/interface/IInputField#inputCompleted
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} value Значение контрола ввода.
 * @param {String} displayValue Отображаемое значение контрола ввода.
 * @remark
 * Событие используется в качестве реакции на завершение ввода пользователем.
 * Например, проверка на валидность введенных данных или отправка данных в другой контрол.
 * Под завершением ввода понимается нажатие клавиши "enter" пользователем или потеря контролом фокуса.
 * @example
 * Подписываемся на событие inputCompleted и сохраняем значение поля в базе данных.
 * <pre>
 *    <Controls.input:Text on:inputCompleted="_inputCompletedHandler()"/>
 *
 *    export class Form extends Control<IControlOptions, void> {
 *        ...
 *        private _inputCompletedHandler(event, value) {
 *            this._saveEnteredValueToDatabase(value);
 *        }
 *        ...
 *    }
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
