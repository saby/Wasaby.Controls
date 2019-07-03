/**
 * Интерфейс для поддержки стиля отображения поля ввода.
 *
 * @interface Controls/interface/IInputStyle
 *
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for input style
 *
 * @interface Controls/interface/IInputStyle
 *
 * @public
 * @author Красильников А.С.
 */
interface IInputStyle {
    readonly _options: {
        /**
         * @name Controls/interface/IInputStyle#style
         * @cfg {Enum} Стиль отображения поля.
         * @variant info - стиль отображения информационного поля.
         * @variant invalid - стиль отображения поля с недопустимым значением.
         * @variant danger - стиль отображения поля с небезопасным значением.
         * @variant success -  стиль отображения поля с верным значением.
         * @variant warning -  стиль отображения поля с предупреждением.
         * @variant primary - акцентный стиль отображения поля.
         * @default info
         * @remark
         * Выбор значения зависит от контекста, в котором используется это поле. Используйте значение "info" для ввода информации, которая не требует внимания.
         * Но если вы хотите привлечь внимание пользователя, используйте "primary". Если поле валидно, используйте "success", иначе "danger". 
         * Если значение в поле допустимо, но вы хотите показать, что введенные данные могут быть опасны, используйте значение "warning".
         * @example
         * В этом примере мы создали форму для регистрации. Поля для ввода имени, логина и пароля являются обязательными. Поля для ввода места жительства являются дополнительными и могут оставаться незаполненными.
         * После ввода пароля поле изменит стиль отображения в зависимости от введенного значения.
         * <pre>
         *    <div class="form">
         *       <div class="fio">
         *          <Controls.input:Text name="firstName" style="primary" bind:value="_firstName"/>
         *          <Controls.input:Text name="lastName" style="primary" bind:value="_lastName"/>
         *       </div>
         *       <div class="residence">
         *          <Controls.input:Text name="street" style="info" bind:value="_street"/>
         *          <Controls.input:Text name="houseNumber" style="info" bind:value="_houseNumber"/>
         *       </div>
         *       <Controls.input:Text name="login" style="primary" bind:value="_login"/>
         *       Controls.input:Password name="password" style="_passwordStyle" bind:value="_password" on:inputCompleted="_inputCompletedHandler()"/>
         *       <Controls.buttons:Button name="register" caption="register" on:click="_sendDataClick()"/>
         *    </div>
         * </pre>
         *
         * <pre>
         *    Control.extend({
         *    ...
         *    _firstName: '',
         *
         *    _lastName: '',
         *
         *    _street: '',
         *
         *    _houseNumber: '',
         *
         *    _login: '',
         *
         *    _password: '',
         *
         *    _passwordStyle: 'primary',
         *
         *    _inputCompletedHandler: function() {
         *        if (this._validatePassword()) {
         *            this._passwordStyle = this._password === this._login ? 'warning' : 'success';
         *        } else {
         *            this._passwordStyle = 'danger'
         *        }
         *    },
         *
         *    _sendButtonClick() {
         *        this._sendData();
         *    }
         *    ...
         *    });
         * </pre>
         */

        /*
         * @name Controls/interface/IInputStyle#style
         * @cfg {Enum} Display style of the field.
         * @variant info - information field display style.
         * @variant invalid - the display style of the field with invalid value.
         * @variant danger - the display style of the field with danger.
         * @variant success -  the display style of the field with success.
         * @variant warning -  the display style of the field with warning.
         * @variant primary - display style to attract attention.
         * @default info
         * @remark
         * The choice of value depends on the context in which the field is used. Use the 'info' value to enter information that does not require attention. But if you want to draw the user's attention, use 'primary'. If the field is validated, use 'success' otherwise 'danger'. If the field is valid, but you want to show that the entered data can be dangerous, use the 'warning' value.
         * @example
         * In this example, we created form for register. Fields for entering name, login and password are mandatory. Fields for entering place of residence are additional and can remain unfilled. After entering the password, the field will change the display style depending on the entered value.
         * We draw the user's attention to the required fields, for this we use the style option in the 'primary' value. For additional fields used 'info' value. We subscribe to inputCompleted event and change password field's display style. If the value is not valid, set the style option to 'danger', otherwise 'success'. if the password equal login, then set 'warning'.
         * <pre>
         *    <div class="form">
         *       <div class="fio">
         *          <Controls.input:Text name="firstName" style="primary" bind:value="_firstName"/>
         *          <Controls.input:Text name="lastName" style="primary" bind:value="_lastName"/>
         *       </div>
         *       <div class="residence">
         *          <Controls.input:Text name="street" style="info" bind:value="_street"/>
         *          <Controls.input:Text name="houseNumber" style="info" bind:value="_houseNumber"/>
         *       </div>
         *       <Controls.input:Text name="login" style="primary" bind:value="_login"/>
         *       Controls.input:Password name="password" style="_passwordStyle" bind:value="_password" on:inputCompleted="_inputCompletedHandler()"/>
         *       <Controls.buttons:Button name="register" caption="register" on:click="_sendDataClick()"/>
         *    </div>
         * </pre>
         *
         * <pre>
         *    Control.extend({
         *    ...
         *    _firstName: '',
         *
         *    _lastName: '',
         *
         *    _street: '',
         *
         *    _houseNumber: '',
         *
         *    _login: '',
         *
         *    _password: '',
         *
         *    _passwordStyle: 'primary',
         *
         *    _inputCompletedHandler: function() {
         *        if (this._validatePassword()) {
         *            this._passwordStyle = this._password === this._login ? 'warning' : 'success';
         *        } else {
         *            this._passwordStyle = 'danger'
         *        }
         *    },
         *
         *    _sendButtonClick() {
         *        this._sendData();
         *    }
         *    ...
         *    });
         * </pre>
         */
        style: 'info' | 'invalid' | 'danger' | 'success' | 'warning' | 'primary';
    }
}

export default IInputStyle;
