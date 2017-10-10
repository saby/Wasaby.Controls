define('js!SBIS3.SPEC.Input.TextMixin', [
], function() {

   /**
    * Интерфейс работы текстового поля ввода.
    * @mixin SBIS3.SPEC.Input.TextMixin
    * @public
    */

   /**
    * @name SBIS3.SPEC.Input.Text#value
    * @cfg {String} Устанавливает текстовое значение в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.Input.Text#onValueChange Происходит при изменении текста в поле ввода.
    * @param {String} value Текст в поле ввода.
    */

   /**
    * @event SBIS3.SPEC.Input.Text#onInputFinish Происходит при завершении ввода.
    * @param {String} value Текст в поле ввода.
    */
});