define('js!SBIS3.SPEC.input.interface.IInputDateTime', [
], function() {

   /**
    * Интерфейс работы поля ввода даты и времени.
    * @mixin SBIS3.SPEC.input.interface.IInputDateTime
    * @public
    */

   /**
    * @name SBIS3.SPEC.input.interface.IInputDateTime#value
    * @cfg {Date} Значение поля.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputDateTime#onValueChange Происходит при изменении числа в поле ввода.
    * @param {Date} value Новое значение поля.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputDateTime#onInputFinish Происходит при завершении ввода.
    * @param {Date} value Новое значение поля.
    */

});