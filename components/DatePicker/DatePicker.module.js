define('js!SBIS3.CONTROLS.DatePicker', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', '!html!SBIS3.CONTROLS.DatePicker', 'css!SBIS3.CONTROLS.DatePicker'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.CONTROLS.DatePicker
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @control
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
            'DD.MM.YYYY',
            'DD.MM',
            'DD.MM.YY',
            'YY-MM-DD',
            'YYYY-MM-DD'
         ],
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {RegExp} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             */
            mask: 'DD.MM.YY'
         }
      },

      $constructor: function () {
         this._initializeComponents();
      }
   });

   return DatePicker;
});