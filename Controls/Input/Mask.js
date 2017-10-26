define('js!Controls/Input/Mask', [
], function() {

   /**
    * Поле ввода строки заранее определенного формата.
    * В поле уже заранее будут введены символы, определяющие формат, и останется ввести только недостающие символы.
    * @class Controls/Input/Mask
    * @extends Controls/Control
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/Input/interface/IInputTag
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name Controls/Input/Mask#mask
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