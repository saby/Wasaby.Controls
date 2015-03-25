define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', 'html!SBIS3.CONTROLS.FormattedTextBox'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
    * @demo SBIS3.Demo.Control.MyFormattedTextBox
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.FormattedTextBox' style="width:150px;">
    * </component>
    * @category Inputs
    * @ignoreOptions independentContext contextRestriction extendedTooltip
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    */

   var FormattedTextBox = FormattedTextBoxBase.extend(/** @lends SBIS3.CONTROLS.FormattedTextBox.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {String} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал.
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
            mask: ''
         }
      },

      $constructor: function () {

      },

      /**
       * Получить маску. Переопределённый метод
       * @returns {*}
       * @private
       */
      _getMask: function () {
         return this._options.mask;
      },

      /**
       * Обновляяет значение this._options.text (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
       * null если есть хотя бы одно незаполненное место ( плэйсхолдер )
       * @private
       */
      _updateText:function(){
         var text = $(this._inputField.get(0)).text();

         var expr = new RegExp( '(' + this._placeholder + ')', 'ig' );
         // если есть плейсхолдеры (т.е. незаполненные места), то опция text = null
         if ( expr.test(text) ){
            this._options.text = '';
         }
         else {
            this._options.text = text;
         }
      },
       /**
        * Установить активность контрола, которая определяется свойством {@link $ws.proto.Control#enabled}.
        * @param enabled Признак активности: true - контрол активен, false - не активен.
        * @example
        * <pre>
        *    if (age >= 18) {
        *       TextBox.setEnabled(true);
        *    }
        * </pre>
        * @see $ws.proto.Control#enabled
        */
      setEnabled: function(enabled){
         FormattedTextBoxBase.superclass.setEnabled.call(this, enabled);
         this._inputField.attr('contenteditable', enabled);
      }
});

   return FormattedTextBox;
});