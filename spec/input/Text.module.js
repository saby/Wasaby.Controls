define('js!SBIS3.SPEC.Input.Text', [
], function() {

   /**
    * Однострочное текстовое поле ввода.
    * @class SBIS3.SPEC.Input.Text
    * @extends SBIS3.SPEC.Control
    * @mixes SBIS3.SPEC.interface.IInputText
    * @mixes SBIS3.SPEC.interface.IInputPlaceholder
    * @mixes SBIS3.SPEC.interface.IValidation
    * @control
    * @public
    * @category Inputs
    */


   /**
    * @name SBIS3.SPEC.Input.Text#maxLength
    * @cfg {Number} Устанавливает максимальное количество символов, которое может содержать поле ввода.
    */

   /**
    * @name SBIS3.SPEC.Input.Text#trim
    * @cfg {Boolean} Устанавливает режим обрезки пробелов в начале и конце добавляемого текста.
    * @variant true Обрезать пробелы.
    * @variant false Не обрезать пробелы.
    */


   /**
    * @name SBIS3.SPEC.Input.Text#selectOnClick
    * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
    * @variant true Выделять текст.
    * @variant false Не выделять текст.
    */

   /**
    * @name SBIS3.SPEC.Input.Text#inputRegExp
    * @cfg {String} Устанавливает регулярное выражение, в соответствии с которым будет осуществляться валидация вводимых символов.
    */


});