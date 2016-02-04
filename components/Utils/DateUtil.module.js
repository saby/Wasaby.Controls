/**
 * Created by is.protasov on 06.04.2015.
 */
define('js!SBIS3.CONTROLS.Utils.DateUtil',[], function () {
   'use strict';
   /**
    *
    */
   var DateUtil = {
      dateFromIsoString: function (isoDate) {
         if ($ws._const.browser.isIE8) {
            return this._isoStringToDate(isoDate); //IE8 only
         } else {
            return new Date(isoDate);              //don't work in IE8
         }
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
         var dateRE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,
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
      }

   };

   return DateUtil;
});