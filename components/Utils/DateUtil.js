/**
 * Created by is.protasov on 06.04.2015.
 */
define('SBIS3.CONTROLS/Utils/DateUtil',[], function() {
   'use strict';
   /**
    * @class SBIS3.CONTROLS/Utils/DateUtil
    * @author Крайнов Д.О.
    * @public
    */
   var DateUtil = /** @lends SBIS3.CONTROLS/Utils/DateUtil.prototype */{
       /**
        * Возвращает экземпляр объекта {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date/ Date}, созданный из строки формата ISO 8601
        * @param {Core/Date} isoDate дата в формате ISO 8601
        * @returns {Core/Date}
        */
      dateFromIsoString: function (isoDate) {
         // Ни один браузер не поддерживает даты в конструкторе Date в iso8601 только со временем без года, месяца и даты
         return this._isoStringToDate(isoDate);
      },
      /**
       * Получение строки из даты в ISO-формате.
       * ужна для IE8, т.к. в нём нет метода toISOString.
       * @param {Core/Date} date
       * @returns {String}
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
         //              1 YYYY        2 MM       3 DD                 4 HH    5 mm       6 ss        7 msec       8 Z   9 ±   10 tzHH    11 tzmm
         var dateRE = /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:[T ]?(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,

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

            // Теперь при создании дат в v8 часовой пояс - это функция от даты/времени даже когда в конструктор передан
            // таймстемп(раньше такое поведение было только, если в конструктор передавались части даты по отдельности).
            // Учитываем это поведение.
            // В браузерах отличных от хрома часовой пояс при создании - это часовой пояс в данный момент
            // установленный на компьютере;
            return new Date(nums[1], nums[2], nums[3], nums[4], nums[5] + minutesOffset - (new Date()).getTimezoneOffset(), nums[6], nums[7]);
         }
      },

      /**
       * Проверяем корректность даты
       * @param {Core/Date} Date
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
       * @param {Core/Date|String} value объект даты, либо дата строкой в формате ISO, например 2015-12-20
       * @return {Core/Date|null} вернет Date если успешно, либо null если дата некорректна
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
       * Проверяет однаковые ли даты
       * @param date1 первая дата
       * @param date2 вторая дата
       * @returns {boolean} если даты одинаковые, то возвращает true, иначе false
       */
      isDatesEqual: function (date1, date2) {
         return date1 === date2 || (date1 instanceof Date && date2 instanceof Date && date1.getTime() === date2.getTime());
      },
      /**
       * Проверяет однаковые ли года в датах
       * @param date1 первая дата
       * @param date2 вторая дата
       * @returns {boolean} если года одинаковые, то возвращает true, иначе false
       */
      isYearsEqual: function (date1, date2) {
         return date1 === date2 || (date1 && date2 && date1.getYear() === date2.getYear());
      },
      /**
       * Проверяет однаковые ли года и месяцы в датах
       * @param date1 первая дата
       * @param date2 вторая дата
       * @returns {boolean} если месяцы одинаковые, то возвращает true, иначе false
       */
      isMonthsEqual: function (date1, date2) {
         return date1 === date2 || (date1 && date2 && date1.getYear() === date2.getYear() && date1.getMonth() === date2.getMonth());
      },

      /**
       * Возвращает дату соответсвующую началу недели по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getStartOfWeek: function (date) {
         date = new Date(date);
         var day = date.getDay(),
            diff = date.getDate() - day + (day === 0 ? -6:1);
         return new Date(date.setDate(diff));
      },
      /**
       * Возвращает дату соответсвующую концу недели по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getEndOfWeek: function (date) {
         date = new Date(date);
         var day = date.getDay(),
            diff = date.getDate() - day + (day === 0 ? 0:7);
         return new Date(date.setDate(diff));
      },

      /**
       * Возвращает true если переданное число является началом месяца
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isStartOfMonth: function (date) {
         return date.getDate() === 1;
      },
      /**
       * Возвращает true если переданное число является концом месяца
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isEndOfMonth: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfMonth(d);
      },
      /**
       * Возвращает дату соответсвующую началу месяца по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getStartOfMonth: function (date) {
         return new Date(date.getFullYear(), date.getMonth(), 1);
      },
      /**
       * Возвращает дату соответсвующую концу месяца по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getEndOfMonth: function (date) {
         return new Date(date.getFullYear(), date.getMonth() + 1, 0);
      },
      /**
       * Возвращает true если переданное число является началом квартала
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isStartOfQuarter: function (date) {
         return this.isStartOfMonth(date) && date.getMonth()%3 === 0;
      },
      /**
       * Возвращает true если переданное число является концом квартала
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isEndOfQuarter: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfQuarter(d);
      },
      /**
       * Возвращает дату соответсвующую началу квартала по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getStartOfQuarter: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/3))*3, 1);
      },
      /**
       * Возвращает дату соответсвующую концу квартала по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getEndOfQuarter: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/3) + 1)*3, 0);
      },
      /**
       * Возвращает true если переданное число является началом полугодия
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isStartOfHalfyear: function (date) {
         return this.getStartOfMonth(date) && date.getMonth()%6 === 0;
      },
      /**
       * Возвращает true если переданное число является концом полугодия
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isEndOfHalfyear: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfHalfyear(d);
      },
      /**
       * Возвращает дату соответсвующую началу полугодия по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getStartOfHalfyear: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/6))*6, 1);
      },
      /**
       * Возвращает дату соответсвующую концу полугодия по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getEndOfHalfyear: function (date) {
         return new Date(date.getFullYear(), (Math.floor(date.getMonth()/6) + 1)*6, 0);
      },
      /**
       * Возвращает true если переданное число является началом года
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isStartOfYear: function (date) {
         return date.getDate() === 1 && date.getMonth() === 0;
      },
      /**
       * Возвращает true если переданное число является концом года
       * @param {Core/Date} date
       * @return {Boolean}
       */
      isEndOfYear: function (date) {
         var d = new Date(date);
         d.setDate(d.getDate() + 1);
         return this.isStartOfYear(d);
      },
      /**
       * Возвращает дату соответсвующую началу года по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getStartOfYear: function (date) {
         return new Date(date.getFullYear(), 0, 1);
      },
      /**
       * Возвращает дату соответсвующую началу года по переданной дате
       * @param {Core/Date} date
       * @return {Core/Date}
       */
      getEndOfYear: function (date) {
         return new Date(date.getFullYear(), 12, 0);
      },
      /**
       * Возвращает месяц в нормальном виде(с датой 1 и обнуленным временем)
       * @param month {Date|String} дата на основе которой будет создана новая дата с обнуленными днем, и временем.
       * @returns {Date} дата с обнуленными днем и временем
       * @private
       */
      normalizeMonth: function (month) {
         month = DateUtil.valueToDate(month);
         if(!(month instanceof Date)) {
            return null;
         }
         return new Date(month.getFullYear(), month.getMonth(), 1);
      },

      normalizeDate: function (month) {
         month = DateUtil.valueToDate(month);
         if(!(month instanceof Date)) {
            return null;
         }
         return new Date(month.getFullYear(), month.getMonth(), month.getDate());
      },

      getDaysByRange: function (date1, date2) {
         var oneDay = 24*60*60*1000;
         return Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));
      },

      isRangesOverlaps: function (startDate1, endDate1, startDate2, endDate2) {
         if (!startDate1 || !endDate1 || !startDate2 || !endDate2) {
            return false;
         }

         startDate1 = startDate1 instanceof Date ? startDate1.getTime() : startDate1;
         endDate1 = endDate1 instanceof Date ? endDate1.getTime() : endDate1;
         startDate2 = startDate2 instanceof Date ? startDate2.getTime() : startDate2;
         endDate2 = endDate2 instanceof Date ? endDate2.getTime() : endDate2;

         return Math.max(startDate1, startDate2) <= Math.min(endDate1, endDate2);
      }
   };

   return DateUtil;
});