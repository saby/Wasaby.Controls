define('js!Controls/Input/Password',
    [
        'Core/Control',
        'tmpl!Controls/Input/Password/Password',
        'WS.Data/Type/descriptor',
        'css!Controls/Input/Password/Password'
    ],

function(Control, template, types) {

   /**
    * Поле ввода пароля.
    * @class Controls/Input/Password
    * @extends Controls/Control
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IValidationError
    * @mixes Controls/Input/interface/IInputTag
    * @control
    * @public
    * @category Input
    * @author Золотова Э.Е.
    */

    'use strict';

    var PasswordInput = Control.extend({
        _template: template,
        _passwordVisible: false,

        _toggleVisibilityHandler: function() {
            this._passwordVisible = !this._passwordVisible;
        }

    });

    PasswordInput.getOptionTypes = function getOptionsTypes() {
        return {
            placeholder: types(String)
        };
    };

    PasswordInput.getDefaultOptions = function getDefaultOptions() {
        return {
            placeholder: rk('Пароль')
        };
    };

    return PasswordInput;
});