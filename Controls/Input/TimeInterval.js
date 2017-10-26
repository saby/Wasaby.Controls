define('js!Controls/Input/TimeInterval', [
], function() {

   /**
    * Контрол предназначен для ввода информации о количестве времени с точностью от дня до минуты.
    * Можно вводить только значения особого формата даты ISO_8601 с точностью от дней до минут.
    * @class Controls/Input/TimeInterval
    * @extends Controls/Control
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/Input/interface/IInputTag
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name Controls/Input/TimeInterval#mask
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