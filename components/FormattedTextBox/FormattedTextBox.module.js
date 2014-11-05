define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', '!html!SBIS3.CONTROLS.FormattedTextBox'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
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
            mask: 'd(ddd)ddd-dd-dd'
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
         return this._options.mask ? this._options.mask : '';
      },

      /**
       * Установить значение в поле. Значение вводится без разделяющих символов
       * Пример. Если маска 'd(ddd)ddd-dd-dd', то setText('81118881188')
       * @param text Строка нового значения
       */
      setText: function(text){
         var self = this,
            newText = '';

         var
            regexp = new RegExp('[' + self._controlCharacters + ']+', 'g'),
            availCharsArray = self._primalMask.match(regexp);

         var regExpForMask = '';

         for (var i = 0; i < availCharsArray.length; i++) {
            regExpForMask += availCharsArray[i];
         }

         var maskLength = regExpForMask.length;
         var textLength = text.length;

         var min = (maskLength <= textLength) ? maskLength : textLength;

         for (var j = 0; j < min; j++) {
            var character = text.charAt(j);
            var maskChar = regExpForMask[j];
            var controlCharacter = self._controlCharactersSet[maskChar];
            if (self._charToRegExp(controlCharacter).test(character)) {
               if (controlCharacter == 'L') {
                  character = character.toUpperCase();
               } else if (controlCharacter == 'l') {
                  character = character.toLowerCase();
               }
               newText += character;
            } else {
               throw new Error('Устанавливаемое значение не удовлетворяет допустимой маске данного контролла');
            }
         }
         this._inputField.html(this._getHtmlMask(newText));
         FormattedTextBoxBase.superclass.setText.call(self, newText);
      },

      /**
       * Обновляяет значение this._options.text (вызывается в _replaceCharacter из FormattedTextBoxBase). Переопределённый метод.
       * null если есть хотя бы одно незаполненное место ( плэйсхолдер )
       * ВАЖНО: Значение хранится без разделяющих символов
       * Пример. Если маска 'd(ddd)ddd-dd-dd' (телефон), и поле полностью заполнено 8(111)888-11-88,
       * то в this._options.text хранится 81118881188
       * @private
       */
      _updateText:function(){
         var text = '';
         $('.controls-FormattedTextBox__field-placeholder', this.getContainer()).each(function(){
            text += $(this).text();
         });

         var expr = new RegExp( '(' + this._placeholder + ')', 'ig' );
         // если есть плейсхолдеры (т.е. незаполненные места), то опция text = null
         if ( expr.test(text) ){
            this._options.text = null;
         }
         else {
            this._options.text = text;
         }
      }
});

   return FormattedTextBox;
});