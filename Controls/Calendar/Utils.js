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
         getWeeksInMonth: function(year, month){
            var
               days = this.getDaysInMonth(year, month),
               offset = this.getFirstDayOffset(year, month);
            
            return Math.ceil((days + offset) / 7)
         }
         
      };
      
      return Utils;
   }
);