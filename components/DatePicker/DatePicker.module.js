define('js!SBIS3.CONTROLS.DatePicker', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', '!html!SBIS3.CONTROLS.DatePicker'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.CONTROLS.DatePicker
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    */

   var DatePicker = FormattedTextBoxBase.extend(/** @lends SBIS3.CONTROLS.DatePicker.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         /**
          * Допустимые управляющие символы в маске.
          * Условные обозначения:
          *     1. D(day) -  Календарный день
          *     2. M(month) - Месяц
          *     3. Y(year) - Год
          *     4. H(hour) - Час
          *     5. I - Минута
          *     6. S(second) - Секунда
          *     7. U - Доля секунды
          */
         _controlCharactersSet: {
            'D' : 'd',
            'M' : 'd',
            'Y' : 'd',
            'H' : 'd',
            'I' : 'd',
            'S' : 'd',
            'U' : 'd'
         },
         /**
          * Допустимые при создании контролла маски.
          * I. Маски для отображения даты:
          *     1. DD.MM.YYYY
          *     2. DD.MM
          *     3. DD.MM.YY
          *     4. YY-MM-DD
          *     5. YYYY-MM-DD
          */
         _possibleMasks: [
            'DD.MM.YY',
            'DD.MM.YYYY',
            'DD.MM',
            'YY-MM-DD',
            'YYYY-MM-DD'
         ],
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {String} Формат отображения даты, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             * <wiTag group="Отображение" page=1>
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM'
             * @variant 'YY-MM-DD'
             * @variant 'YYYY-MM-DD'
             */
            mask: 'DD.MM.YY'
         }
      },

      $constructor: function () {
      },

      _getMask: function () {
         this._checkPossibleMask();
         return this._options.mask;
      },

      _checkPossibleMask: function(){
         if (this._possibleMasks.length !== 0){
            if (Array.indexOf(this._possibleMasks, this._options.mask) == -1){
               throw new Error('Маска не удовлетворяет ни одной допустимой маске данного контролла');
            }
         }
      }

   });

   return DatePicker;
});