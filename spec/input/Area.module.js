define('js!SBIS3.SPEC.input.Area', [
], function() {
   /**
    *
    * Многострочное поле ввода - это текстовое поле с автовысотой.
    * Данное поле может автоматически менять высоту в зависимости от количества введённой информации.
    * @class SBIS3.SPEC.input.Area
    * @extends SBIS3.SPEC.input.Text
    * @mixes SBIS3.SPEC.interface.IValidation
    * @mixes SBIS3.SPEC.interface.IInputTag
    * @control
    * @public
    * @category Inputs
   */

   /**
    * @name SBIS3.SPEC.input.Area#minLinesCount
    * @cfg {Number} Минимальное количество строк
    */

    /**
     * @name SBIS3.SPEC.input.Area#maxLinesCount
     * @cfg {Number} Максимальное количество строк
     */

    /**
    * @name SBIS3.SPEC.input.Area#newLineMode
    * @cfg {String} Сочетание клавиш, для перехода на новую строку
    * @variant enter По нажатию Enter
    * @variant shiftEnter По нажатию Shift + Enter.
    */


});