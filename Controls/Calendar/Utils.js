define('Controls/Calendar/Utils', [], function() {
      
   'use strict';
      
   var Utils = {
         
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
       * @returns {Array}
       */
      getWeeksArray: function(date) {
         var
            weeksArray = [],
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            weeksInMonth = this.getWeeksInMonth(year, month),
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
