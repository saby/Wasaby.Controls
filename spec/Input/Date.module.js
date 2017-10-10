define('js!SBIS3.SPEC.Input.Date', [
], function() {

   /**
    * Поле ввода даты.
    * @class SBIS3.SPEC.Input.Date
    * @extends SBIS3.SPEC.Control
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.Input.Date#value
    * @cfg {String} Устанавливает значение даты в поле ввода.
    */

   /**
    * @name SBIS3.SPEC.Input.Date#mask
    * @cfg {String} Формат отображения данных
    * @remark
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
    * @see date
    * @see isCalendarIconShow
    */
   /**
    * @event SBIS3.SPEC.Input.Date#onValueChange Происходит при изменении даты в поле ввода.
    * @param {Date} value Дата.
    */

   /**
    * @event SBIS3.SPEC.Input.Date#onInputFinish Происходит при завершении ввода.
    * @param {Date} value Дата.
    */
});