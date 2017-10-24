define('js!SBIS3.SPEC.input.Area', [
], function() {

   /**
    *
    * Многострочное поле ввода - это текстовое поле с автовысотой.
    * Данное поле может автоматически менять высоту в зависимости от количества введённой информации.
    * @class SBIS3.SPEC.input.Area
    * @extends SBIS3.SPEC.input.Text
    * @control
    * @public
    * @category Inputs
    */

   /**
    * @name SBIS3.SPEC.input.Area#minLines
    * @cfg {Number} Минимальное количество строк
    */

   /**
    * @name SBIS3.SPEC.input.Area#maxLines
    * @cfg {Number} Максимальное количество строк
    */

   /**
    * @name SBIS3.SPEC.input.Area#newLineKey
    * @cfg {String} Сочетание клавиш, для перехода на новую строку
    * @variant enter По нажатию Enter
    * @variant ctrlEnter По нажатию Ctrl + Enter
    * @variant shiftEnter По нажатию Shift + Enter.
    */

});