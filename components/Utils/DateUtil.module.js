/**
 * Created by is.protasov on 06.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DateUtil',[
   "Core/constants"
], function( constants) {
   'use strict';
   /**
    *
    */
   var DateUtil = {
      dateFromIsoString: function (isoDate) {
         if (
            // не поддерживает даты с часовым пояслм вида '2016-07-31 22:10:01+03'
               constants.browser.firefox
            // не поддерживает даты с часовым поясом и разделитель в виде пробела '2016-07-31 22:10:01+03'
            || constants.browser.safari
            // на ios все браузеры работают через Apple UIWebView и ведут себя так же как safari
            || constants.browser.isMobileIOS
         ) {
            return this._isoStringToDate(isoDate); //IE8 only
         } else {
            return new Date(isoDate);              //don't work in IE8
         }
      },
      /**
       * Получение строки из даты в ISO-формате.
       * ужна для IE8, т.к. в нём нет метода toISOString.
       * @param date
       * @returns {string}
       */
      dateToIsoString: function (date) {
         if(!(date instanceof Date)) {
            return false;
         }
         return date.toISOString();
      },

      _dateToIsoString: function(date) {
         function pad(number) {
            if (number < 10) {
               return '0' + number;
            }
            return number;
         }

         return date.getUTCFullYear() +
             '-' + pad(date.getUTCMonth() + 1) +
             '-' + pad(date.getUTCDate()) +
             'T' + pad(date.getUTCHours()) +
             ':' + pad(date.getUTCMinutes()) +
             ':' + pad(date.getUTCSeconds()) +
             '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
             'Z';
      },

      /**
       * Получение даты из строки в ISO-формате. Нужна для IE8, т.к. в нём не работает конструктор Date со строкой в ISO-формате
       * @param isoDate
       * @variant 'YYYY',
       * @variant 'YYYY-ММ',
       * @variant 'YYYY-ММ-DD',
       * @variant 'YYYY-MM-DDTHH:II',
       * @variant 'YYYY-MM-DDTHH:II:SS',
       * @variant 'YYYY-MM-DDTHH:II:SS.UUU',
       * @variant 'YYYY-MM-DDTHH:II:SS.UUUZ',
       * @variant 'YYYY-MM-DDTHH:II:SS.UUU+HH:SS',
       * @variant 'YYYY-MM-DDTHH:II:SS.UUU-HH:SS'
       * @returns {Date}
       * @see date
       */
      _isoStringToDate: function (isoDate) {
         //              1 YYYY     2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
         var dateRE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,
            nums = isoDate.match(dateRE),
            minutesOffset = 0,
            numericKeys = [1, 4, 5, 6, 7, 10, 11];
         if (nums) {
            for (var i = 0; i < numericKeys.length; i++) {
               var k = numericKeys[i];
               nums[k] = parseInt(nums[k], 10) || 0;
            }
            //month
            nums[2] = (parseInt(nums[2], 10) || 1) - 1;
            //days
            nums[3] = parseInt(nums[3], 10) || 1;
            //minute offset for timezone
            if (nums[8] !== 'Z' && nums[9] !== undefined) {
               minutesOffset = nums[10] * 60 + nums[11];
               if (nums[9] === '+') {
                  minutesOffset = 0 - minutesOffset;
               }
            }
            return new Date(Date.UTC(nums[1], nums[2], nums[3], nums[4], nums[5] + minutesOffset, nums[6], nums[7]));
         }
      },

      /**
       * Проверяем корректность даты
       * @param Date
       * @returns {Boolean}
       * Возможные значения:
       * <ul>
       *    <li>true - дата корректна;</li>
       *    <li>false - дата некорректна</li>
       * </ul>
       */
      isValidDate: function( date ) {
         //Если date это Invalid Date, то instanceof Date вернёт true, поэтому проверяем getTime.
         return date instanceof Date  &&  !isNaN(date.getTime());
      },

      /**
       * Преобразует значение в объект Date
       * @param {Date|String} value объект даты, либо дата строкой в формате ISO, например 2015-12-20
       * @return {Date|null} вернет Date если успешно, либо null если дата некорректна
       */
      valueToDate: function(value) {
         var date = null;
         if (value instanceof Date) {
            date = value;
         } else if (typeof value === 'string') {
            //convert ISO-date to Date
            date = this.dateFromIsoString(value);
         }
         if ( ! DateUtil.isValidDate(date)) {
            date = null;
         }
         return date;
      },
      /**
       * Возвращает true если переданное число является началом месяца
       * @param date
       * @return {boolean}
       */
      isStartOfMonth: function (date) {
         return date.getDate() === 1;
      },
      /**
       * Возвращает true если переданное число является концом месяца
       * @param date
       * @return {boolean}
       */
      isEndOfMonth: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfMonth(d);
      },
      /**
       * Возвращает дату соответсвующую началу месяца по переданной дате
       * @param date
       * @return {Date}
       */
      getStartOfMonth: function (date) {
         return new Date(date.getFullYear(), date.getMonth(), 1);
      },
      /**
       * Возвращает дату соответсвующую концу месяца по переданной дате
       * @param date
       * @return {Date}
       */
      getEndOfMonth: function (date) {
         return new Date(date.getFullYear(), date.getMonth() + 1, 0);
      },
      /**
       * Возвращает true если переданное число является началом квартала
       * @param date
       * @return {boolean}
       */
      isStartOfQuarter: function (date) {
         return this.isStartOfMonth(date) && date.getMonth()%3 === 0;
      },
      /**
       * Возвращает true если переданное число является концом квартала
       * @param date
       * @return {boolean}
       */
      isEndOfQuarter: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfQuarter(d);
      },
      /**
       * Возвращает дату соответсвующую началу квартала по переданной дате
       * @param date
       * @return {Date}
       */
      getStartOfQuarter: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/3))*3, 1);
      },
      /**
       * Возвращает дату соответсвующую концу квартала по переданной дате
       * @param date
       * @return {Date}
       */
      getEndOfQuarter: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/3) + 1)*3, 0);
      },
      /**
       * Возвращает true если переданное число является началом полугодия
       * @param date
       * @return {boolean}
       */
      isStartOfHalfyear: function (date) {
         return this.getStartOfMonth(date) && date.getMonth()%6 === 0;
      },
      /**
       * Возвращает true если переданное число является концом полугодия
       * @param date
       * @return {boolean}
       */
      isEndOfHalfyear: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfHalfyear(d);
      },
      /**
       * Возвращает дату соответсвующую началу полугодия по переданной дате
       * @param date
       * @return {Date}
       */
      getStartOfHalfyear: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/6))*6, 1);
      },
      /**
       * Возвращает дату соответсвующую концу полугодия по переданной дате
       * @param date
       * @return {Date}
       */
      getEndOfHalfyear: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/6) + 1)*6, 0);
      },
      /**
       * Возвращает true если переданное число является началом года
       * @param date
       * @return {boolean}
       */
      isStartOfYear: function (date) {
         return date.getDate() === 1 && date.getMonth() === 0;
      },
      /**
       * Возвращает true если переданное число является концом года
       * @param date
       * @return {boolean}
       */
      isEndOfYear: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfYear(d);
      },
      /**
       * Возвращает дату соответсвующую началу года по переданной дате
       * @param date
       * @return {Date}
       */
      getStartOfYear: function (date) {
         return new Date(date.getFullYear(), 0, 1);
      },
      /**
       * Возвращает дату соответсвующую началу года по переданной дате
       * @param date
       * @return {Date}
       */
      getEndOfYear: function (date) {
         return new Date(date.getFullYear(), 12, 0);
      }
   };

   return DateUtil;
});