define('js!SBIS3.SPEC.Input.Money', [
], function() {

   /**
    * Поле ввода денежных единиц.
    * @class SBIS3.SPEC.Input.Money
    * @extends SBIS3.SPEC.Control
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.Input.Money#value
    * @cfg {String} Устанавливает денежную еденицу.
    */

   /**
    * @event SBIS3.SPEC.Input.Money#onValueChange Происходит при изменении значения денежной еденицы.
    * @param {String} value Денежная единица.
    */

   /**
    * @event SBIS3.SPEC.Input.Money#onInputFinish Происходит при завершении ввода.
    * @param {String} value Денежная единица.
    */

});