/**
 * Created by is.protasov on 06.04.2015.
 */
define('SBIS3.CONTROLS/Utils/DateUtil', [
   'Core/core-merge',
   'Controls/Utils/Date'
], function(
   coreMerge,
   utils
) {
   'use strict';
   /**
    * @class SBIS3.CONTROLS/Utils/DateUtil
    * @author Крайнов Д.О.
    * @public
    */
   var DateUtil = /** @lends SBIS3.CONTROLS/Utils/DateUtil.prototype */ coreMerge(coreMerge({}, utils), {
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
       * Возвращает месяц в нормальном виде(с датой 1 и обнуленным временем)
       * @param month {Date|String} дата на основе которой будет создана новая дата с обнуленными днем, и временем.
       * @returns {Date} дата с обнуленными днем и временем
       * @private
       */
      normalizeMonth: function (month) {
         return utils.normalizeMonth(DateUtil.valueToDate(month));
      },

      normalizeDate: function (month) {
         return utils.normalizeDate(DateUtil.valueToDate(month));
      }
   });

   return DateUtil;
});