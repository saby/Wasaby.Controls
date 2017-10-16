define('js!SBIS3.SPEC.input.interface.IInputText', [
], function() {

   /**
    * Интерфейс работы текстового поля ввода.
    *
    * @mixin SBIS3.SPEC.input.interface.IInputText
    * @public
    */

   /**
    * @name SBIS3.SPEC.input.interface.IInputText#value
    * @cfg {String} Значение поля.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputText#onValueChange Происходит при изменении текста в поле ввода.
    * @param {String} value Новое значение поля.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputText#onInputFinish Происходит при завершении ввода.
    * @param {String} value Новое значение поля.
    */
});