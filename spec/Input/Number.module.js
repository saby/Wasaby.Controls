define('js!SBIS3.SPEC.Input.Number', [
], function() {

   /**
    * Поле ввода числа.
    * @class SBIS3.SPEC.Input.Number
    * @extends SBIS3.SPEC.Control
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.Input.Number#value
    * @cfg {Number} Устанавливает число.
    */

   /**
    * @name SBIS3.SPEC.Input.Number#decimals
    * @cfg {Number} Количество знаков после запятой
    */

   /**
    * @name SBIS3.SPEC.Input.Number#onlyPositive
    * @cfg {Boolean} Ввод только положительных чисел
    */

   /**
    * @name SBIS3.SPEC.Input.Number#onlyInteger
    * @cfg {Boolean} Ввод только целых чисел
    */

   /**
    * @name SBIS3.SPEC.Input.Number#integers
    * @cfg {Number} Количество знаков до запятой
    */

   /**
    * @name SBIS3.SPEC.Input.Number#showEmptyDecimals
    * @cfg {Boolean} Показывать ненулевую дробную часть
    */

   /**
    * @event SBIS3.SPEC.Input.Number#onValueChange Происходит при изменении числа в поле ввода.
    * @param {Number} value Число.
    */

   /**
    * @event SBIS3.SPEC.Input.Number#onInputFinish Происходит при завершении ввода.
    * @param {Number} value Число.
    */

});