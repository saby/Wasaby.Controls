define('js!SBIS3.SPEC.input.DateTime', [
], function() {

   /**
    * Данный контрол предназначен для осуществления ввода информации о дате и времени.
    * В зависимости от {@link mask маски} возвожен ввод:
    * <ol>
    *    <li>только даты,</li>
    *    <li>только времени,</li>
    *    <li>даты и времени.</li>
    * </ol>
    * Осуществить ввод информации можно только с клавиатуры.
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.SPEC.input.DateTime
    * @extends SBIS3.SPEC.Control
    * @mixes SBIS3.SPEC.interface.IInputDateTime
    * @mixes SBIS3.SPEC.interface.IValidation
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.input.DateTime#mask
    * @cfg {String} Формат отображения данных
    * Необходимо выбрать одну из масок в массиве допустимых значений.
    * Допустимые символы в маске:
    * <ol>
    *    <li>D(day) - календарный день.</li>
    *    <li>M(month) - месяц.</li>
    *    <li>Y(year) - год.</li>
    *    <li>H(hour) - час.</li>
    *    <li>I - минута</li>
    *    <li>S(second) - секунда.</li>
    *    <li>U - доля секунды.</li>
    *    <li>".", "-", ":", "/" - разделители.</li>
    * </ol>
    * @variant 'DD.MM.YYYY'
    * @variant 'DD.MM.YY'
    * @variant 'DD.MM'
    * @variant 'YYYY-MM-DD'
    * @variant 'YY-MM-DD'
    * @variant 'HH:II:SS.UUU'
    * @variant 'HH:II:SS'
    * @variant 'HH:II'
    * @variant 'DD.MM.YYYY HH:II:SS.UUU'
    * @variant 'DD.MM.YYYY HH:II:SS'
    * @variant 'DD.MM.YYYY HH:II'
    * @variant 'DD.MM.YY HH:II:SS.UUU'
    * @variant 'DD.MM.YY HH:II:SS'
    * @variant 'DD.MM.YY HH:II'
    * @variant 'DD.MM HH:II:SS.UUU'
    * @variant 'DD.MM HH:II:SS'
    * @variant 'DD.MM HH:II'
    * @variant 'YYYY-MM-DD HH:II:SS.UUU'
    * @variant 'YYYY-MM-DD HH:II:SS'
    * @variant 'YYYY-MM-DD HH:II'
    * @variant 'YY-MM-DD HH:II:SS.UUU'
    * @variant 'YY-MM-DD HH:II:SS'
    * @variant 'YY-MM-DD HH:II'
    * @variant 'YYYY'
    * @variant 'MM/YYYY'
    */
});