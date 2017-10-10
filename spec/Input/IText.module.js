define('js!SBIS3.SPEC.Input.IText', [
], function() {

   /**
    * Интерфейс работы текстового поля ввода.
    * @mixin SBIS3.SPEC.Input.IText
    * @public
    */

   /**
    * @name SBIS3.SPEC.Input.IText#value
    * @cfg {String} Устанавливает текстовое значение в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.Input.IText#onValueChange Происходит при изменении текста в поле ввода.
    * @param {String} value Текст в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.Input.IText#onInputFinish Происходит при завершении ввода.
    * @param {String} value Текст в поле ввода.
    */
});