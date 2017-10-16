define('js!SBIS3.SPEC.input.interface.IInputNumber', [
], function() {

   /**
    * Интерфейс работы числового поля ввода.
    * @mixin SBIS3.SPEC.input.interface.IInputNumber
    * @public
    */

   /**
    * @name SBIS3.SPEC.input.interface.IInputNumber#value
    * @cfg {Number} Значение поля.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputNumber#onValueChange Происходит при изменении числа в поле ввода.
    * @param {Number} value Новое значение поля.
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputNumber#onInputFinish Происходит при завершении ввода.
    * @param {Number} value Новое значение поля.
    */

});