define('js!SBIS3.SPEC.input.interface.IInputText', [
], function() {

   /**
    * Интерфейс работы текстового поля ввода.
    * @mixin SBIS3.SPEC.input.interface.IInputText
    * @public
    */

   /**
    * @name SBIS3.SPEC.input.interface.IInputText#value
    * @cfg {String} Текстовое значение в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputText#onValueChange Происходит при изменении текста в поле ввода.
    * @param {String} value Текст в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputText#onInputFinish Происходит при завершении ввода.
    * @param {String} value Текст в поле ввода.
    */
});