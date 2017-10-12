define('js!SBIS3.SPEC.input.TimeInterval', [
], function() {

   /**
    * Контрол предназначен для ввода информации о количестве времени с точностью от дня до минуты.
    * Можно вводить только значения особого формата даты ISO_8601 с точностью от дней до минут.
    * @class SBIS3.SPEC.input.TimeInterval
    * @extends SBIS3.SPEC.Control
    * @mixes SBIS3.SPEC.interface.IInputText
    * @mixes SBIS3.SPEC.interface.IValidation
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.input.TimeInterval#mask
    * @cfg {String} Формат ввода значения временного интервала.
    * Допустимые символы в маске:
    * <ol>
    *    <li>D(day) - календарный день.</li>
    *    <li>H(hour) - час.</li>
    *    <li>I - минута.</li>
    *    <li>":" - используется в качестве разделителя.</li>
    * </ol>
    * @example
    * <pre>
    *     <option name="mask">DD:HH:II</option>
    * </pre>
    * @variant 'DD:HH:II'
    * @variant 'DD:HH'
    * @variant 'HH:II'
    * @variant 'DDDD:HH:II'
    * @variant 'DDD:HH:II'
    * @variant 'HHHH:II'
    * @variant 'HHH:II'
    * @variant 'DDDD:HH'
    * @variant 'DDD:HH'
    */

});