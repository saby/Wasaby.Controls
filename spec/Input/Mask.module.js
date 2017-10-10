define('js!SBIS3.SPEC.Input.Mask', [
], function() {

   /**
    * Форматное поле ввода.
    * @class SBIS3.SPEC.Input.Mask
    * @extends SBIS3.SPEC.Control
    * @mixes SBIS3.SPEC.Input.TextMixin
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.Input.Mask#mask
    * @cfg {String} Формат ввода текстового значения.
    * Маска вида: "Lll:xdd", где
    * <ul>
    *    <li>L - заглавная буква (русский/английский алфавит),</li>
    *    <li>l - строчная буква,</li>
    *    <li>d - цифра,</li>
    *    <li>x - буква или цифра,</li>
    *    <li>все остальные символы являются разделителями.</li>
    * </ul>
    * @example
    * <pre>
    *     mask: 'dd ddd dddd/dd'
    * </pre>
    */

});