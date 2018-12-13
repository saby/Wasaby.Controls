define('Controls/Input/interface/IInputBase', [], function() {

   /**
    * Interface for Input.Base.
    *
    * @interface Controls/Input/interface/IInputBase
    * @public
    * @author Колесова П.С.
    */

   /**
    * @name Controls/Input/interface/IInputBase#fontStyle
    * @cfg {String} Fonts of the text in field.
    * @variant default - Font style in standard field.
    * @variant primary - Font style to attract attention.
    * @default default
    * @remark
    * The font style is selected depending on the context of the value in the field.
    * @example
    * In this example, we create a form for input passport data. Fields for entering your name have accent font.
    * <pre>
    *    <div class="form">
    *       <div class="fio">
    *          <Controls.Input.Text name="firstName" font="primary"/>
    *          <Controls.Input.Text name="lastName" font="primary"/>
    *       </div>
    *       <div class="residence">
    *          <Controls.Input.Text name="street"/>
    *       </div>
    *    </div>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/IInputBase#textAlign
    * @cfg {String} Horizontal alignment of the text in field.
    * @variant left - The text are aligned to the left edge of the line box.
    * @variant right - The text are aligned to the right edge of the line box.
    * @default left
    * @example
    * In this example, we align the text to the left.
    * <pre>
    *    <Controls.Input.Text textAlign="left"/>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/IInputBase#tooltip
    * @cfg {String} Text of the tooltip shown when the control is hovered over.
    * @remark
    * "Title" attribute added to the control's root node and default browser tooltip is shown on hover.
    * @example
    * In this example, when you hover over the field, "Enter your name" tooltip will be shown.
    * <pre>
    *    <Controls.Input.Text tooltip="Enter your name"/>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/IInputBase#selectOnClick
    * @cfg {Boolean} Determines whether text is selected when input is clicked.
    * @default false
    * @remark
    * This option can be used if you know that user clicking the field to enter a new value is a more frequent scenario
    * than user wanting to edit the current value. In that case, they will click on the field, text will get selected, a
    * nd they will be able to start entering new value immediately.
    * @example
    * In this example, when the field is clicked, all text in it will be selected.
    * <pre>
    *    <Controls.Input.Text selectOnClick={{true}}/>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/IInputBase#autoComplete
    * @cfg {Boolean} Determines whether to use browser-based auto-complete field.
    * @variant true The browser is allowed to automatically complete the input.
    * @variant false The browser is not permitted to automatically enter or select a value for this field.
    * @default false
    * @remark
    * Values for auto-complete are taken by the browser from its storage. The field name is used to access them. Therefore, to prevent values stored in one field from being applied to another, the fields must have different names. To do this, we proxy the name of the control to the name of the native field. Therefore, if you use true as the value of the option and do not want to cross the auto-completion values, specify the name of the control. Choose a name based on the scope of the field. For example, for a login and password registration form, it is preferable to use the login and password names.
    * @example
    * In this example, when the field is clicked, a browser menu appears with the previously entered values in this field.
    * <pre>
    *    <Controls.Input.Text autoComplete={{true}}/>
    * </pre>
    */

   /**
    * @name Controls/Input/interface/IInputBase#style
    * @cfg {String} Display style of the field.
    * @variant primary - display style to attract attention.
    * @variant success -  the display style of the field with success.
    * @variant warning -  the display style of the field with warning.
    * @variant danger - the display style of the field with danger.
    * @variant info - information field display style.
    * @default info
    * @remark
    * The choice of value depends on the context in which the field is used. Use the 'info' value to enter information that does not require attention. But if you want to draw the user's attention, use 'primary'. If the field is validated, use 'success' otherwise 'danger'. If the field is valid, but you want to show that the entered data can be dangerous, use the 'warning' value.
    * @example
    * In this example, we created form for register. Fields for entering name, login and password are mandatory. Fields for entering place of residence are additional and can remain unfilled. After entering the password, the field will change the display style depending on the entered value.
    * We draw the user's attention to the required fields, for this we use the style option in the 'primary' value. For additional fields used 'info' value. We subscribe to inputCompleted event and change password field's display style. If the value is not valid, set the style option to 'danger', otherwise 'success'. if the password equal login, then set 'warning'.
    * <pre>
    *    <div class="form">
    *       <div class="fio">
    *          <Controls.Input.Text name="firstName" style="primary" bind:value="_firstName"/>
    *          <Controls.Input.Text name="lastName" style="primary" bind:value="_lastName"/>
    *       </div>
    *       <div class="residence">
    *          <Controls.Input.Text name="street" style="info" bind:value="_street"/>
    *          <Controls.Input.Text name="houseNumber" style="info" bind:value="_houseNumber"/>
    *       </div>
    *       <Controls.Input.Text name="login" style="primary" bind:value="_login"/>
    *       Controls.Input.Password name="password" style="_passwordStyle" bind:value="_password" on:inputCompleted="_inputCompletedHandler()"/>
    *       <Controls.Button name="register" caption="register" on:click="_sendDataClick()"/>
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
});
