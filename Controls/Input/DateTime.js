define('js!Controls/Input/DateTime', [
], function() {

   /**
    * Данный контрол предназначен для ввода даты и времени.
    * В зависимости от {@link mask маски} возможен ввод:
    * <ol>
    *    <li>только даты,</li>
    *    <li>только времени,</li>
    *    <li>даты и времени.</li>
    * </ol>
    * @class Controls/Input/DateTime
    * @extends Controls/Control
    * @mixes Controls/Input/interface/IInputDateTime
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/Input/interface/IInputTag
    * @control
    * @public
    * @category Input
    */

   /**
    * @name Controls/Input/DateTime#mask
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