define('js!SBIS3.SPEC.TextBox', [
], function() {

   /**
    * Однострочное текстовое поле ввода.
    * @class SBIS3.SPEC.TextBox
    * @extends Core/Control
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.TextBox#value
    * @cfg {String} Устанавливает текстовое значение в поле ввода.
    */

   /**
    * @name SBIS3.SPEC.TextBox#maxLength
    * @cfg {Number} Устанавливает максимальное количество символов, которое может содержать поле ввода.
    */

   /**
    * @name SBIS3.SPEC.TextBox#trim
    * @cfg {Boolean} Устанавливает режим обрезки пробелов в начале и конце добавляемого текста.
    * @variant true Обрезать пробелы.
    * @variant false Не обрезать пробелы.
    */

   /**
    * @name SBIS3.SPEC.TextBox#placeholder
    * @cfg {String} Устанавливает текст подсказки внутри поля ввода.
    */

   /**
    * @name SBIS3.SPEC.TextBox#selectOnClick
    * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
    * @variant true Выделять текст.
    * @variant false Не выделять текст.
    */

   /**
    * @name SBIS3.SPEC.TextBox#inputRegExp
    * @cfg {String} Устанавливает регулярное выражение, в соответствии с которым будет осуществляться валидация вводимых символов.
    */

   /**
    * @event SBIS3.SPEC.TextBox#onValueChange Происходит при изменении текста в поле ввода.
    * @param {Core/EventObject} eventObject Дескриптор события.
    * @param {String} value Текст в поле ввода.
    */

});