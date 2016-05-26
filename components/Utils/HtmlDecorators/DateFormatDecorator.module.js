define('js!SBIS3.CONTROLS.Utils.HtmlDecorators.DateFormatDecorator', [
   'js!SBIS3.CONTROLS.Utils.HtmlDecorators.AbstractDecorator'
], function (AbstractDecorator) {
   'use strict';

   /**
    * Декоратор текста, обеспечивающий отметку цветом
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators.DateFormatDecorator
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var DateFormatDecorator = AbstractDecorator.extend(/** @lends SBIS3.CONTROLS.Utils.HtmlDecorators.DateFormatDecorator.prototype */{
      $protected: {
         _options: {
         }
      },

      $constructor: function () {
      },

      /**
       * Применяет декоратор
       * @param {Date} date Дата для декорирования
       * @param {String} mask маска для даты
       * @returns {*}
       */
      apply: function (date, mask) {
         return this._dateToMask(date, mask);
      },

      _dateToMask: function(date, mask){
         var string = mask.replace(/YYYY/g, date.getFullYear())
                          .replace(/YY/g, String(date.getFullYear()).substr(2, 2))
                          .replace(/MM/g, this._prependLeftZero(date.getMonth() + 1, 2))
                          .replace(/DD/g, this._prependLeftZero(date.getDate(), 2));
         return string;
      },

      _prependLeftZero: function(value, size){
         value = value.toString();
         while (value.length < size) {
            value = '0' + value;
         }
         return value;
      }

   });

   return DateFormatDecorator;
});
