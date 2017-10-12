define('js!SBIS3.SPEC.interface.IInputText', [
], function() {

   /**
    * Интерфейс работы текстового поля ввода.
    * @mixin SBIS3.SPEC.interface.IInputText
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IInputText#value
    * @cfg {String} Устанавливает текстовое значение в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.interface.IInputText#onValueChange Происходит при изменении текста в поле ввода.
    * @param {String} value Текст в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.interface.IInputText#onInputFinish Происходит при завершении ввода.
    * @param {String} value Текст в поле ввода.
    */
});