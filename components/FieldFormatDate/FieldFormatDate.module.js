define('js!SBIS3.CONTROLS.FieldFormatDate', ['js!SBIS3.CONTROLS.FieldFormatBase', '!html!SBIS3.CONTROLS.FieldFormatDate', 'css!SBIS3.CONTROLS.FieldFormatDate'], function (FieldFormatBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FieldFormatDate
    * @extends SBIS3.CORE.Control
    * @control
    */

   var FieldFormatDate = FieldFormatBase.extend(/** @lends SBIS3.CONTROLS.FieldFormatDate.prototype */{
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
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {RegExp} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             */
            mask: 'DD:MM:YY'
         }
      },

      $constructor: function () {
         this._initializeComponents();
      }
   });

   return FieldFormatDate;
});