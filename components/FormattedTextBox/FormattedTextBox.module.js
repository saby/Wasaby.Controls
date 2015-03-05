define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', 'html!SBIS3.CONTROLS.FormattedTextBox'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.FormattedTextBox' style="width:150px;">
    * </component>
    * @category Inputs
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
             * будет определён весь функционал
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

      setEnabled: function(enabled){
         FormattedTextBoxBase.superclass.setEnabled.call(this, enabled);
         this._inputField.attr('contenteditable', enabled);
      }
});

   return FormattedTextBox;
});