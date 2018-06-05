define('Controls/Calendar/Utils', [
   'Core/helpers/i18n/locales'
], function(locales) {
      
   'use strict';

   var locale = locales.current;

   var Utils = {

      /**
        * Returns the list of days of the week
        * @returns {Array}
        */
      getWeekdaysCaptions: function() {
         var days = locale.config.daysSmall.slice(1);
         days.push(locale.config.daysSmall[0]);

         return days.map(function(value, index) {
            return {caption: value, weekend: index === 5 || index === 6};
         });
      },

      /**
          * Получить смещение первого дня месяца (количество дней перед первым числом)
          * @param {Number} year год
          * @param {Number} month месяц
          * @returns {Number}
          */
      getFirstDayOffset: function(year, month) {
         var
            date = new Date(year, month ? month - 1 : 0),
            day = date.getDay();
            
         return day ? day - 1 : 6; // Воскресенье 0-й день
      },
         
      /**
          * Получить количество дней в месяце
          * @param {Number} year год
          * @param {Number} month месяц
          * @returns {Number}
          */
      getDaysInMonth: function(year, month) {
         return new Date(year, month, 0).getDate();
      },
         
      /**
          * Получить количство всех недель в месяце
          * @param {Number} year
          * @param {Number} month
          * @returns {Number}
          */
      getWeeksInMonth: function(year, month) {
         var
            days = this.getDaysInMonth(year, month),
            offset = this.getFirstDayOffset(year, month);
            
         return Math.ceil((days + offset) / 7);
      },
         
      /**
       * Получить массив недель (строка) с массивом дней (ячейка) для MonthTableBody
       * @param {Date} date месяц
       * @param {String} mode
       * @variant current Returns only the current month
       * @variant extended Returns 6 weeks. Returns the first week of the current complete month,
       * the last complete week and if the current month includes less than 6 weeks, then the weeks
       * of the next month.
       * @returns {Array}
       */
      getWeeksArray: function(date, mode) {
         var
            weeksArray = [],
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            weeksInMonth = mode === 'extended' ? 6 : this.getWeeksInMonth(year, month),
            monthDate = this.getFirstDayOffset(year, month) * -1 + 1;


         for (var w = 0; w < weeksInMonth; w++) {
            var daysArray = [];

            for (var d = 0; d < 7; d++) {
               daysArray.push(new Date(year, month - 1, monthDate));
               monthDate++;
            }
            weeksArray.push(daysArray);
         }

         return weeksArray;
      }
   };

   return Utils;
});
