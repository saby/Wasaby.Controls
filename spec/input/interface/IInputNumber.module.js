define('js!SBIS3.SPEC.interface.IInputNumber', [
], function() {

   /**
    * Интерфейс работы текстового числового ввода.
    * @mixin SBIS3.SPEC.interface.IInputNumber
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IInputNumber#value
    * @cfg {Number} Устанавливает число.
    */

   /**
    * @event SBIS3.SPEC.interface.IInputNumber#onValueChange Происходит при изменении числа в поле ввода.
    * @param {Number} value Число.
    */

   /**
    * @event SBIS3.SPEC.interface.IInputNumber#onInputFinish Происходит при завершении ввода.
    * @param {Number} value Число.
    */

});