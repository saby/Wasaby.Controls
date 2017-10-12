define('js!SBIS3.SPEC.Input.IInputText', [
], function() {

   /**
    * Интерфейс работы текстового поля ввода.
    * @mixin SBIS3.SPEC.Input.IInputText
    * @public
    */

   /**
    * @name SBIS3.SPEC.Input.IInputText#value
    * @cfg {String} Устанавливает текстовое значение в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.Input.IInputText#onValueChange Происходит при изменении текста в поле ввода.
    * @param {String} value Текст в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.Input.IInputText#onInputFinish Происходит при завершении ввода.
    * @param {String} value Текст в поле ввода.
    */
});