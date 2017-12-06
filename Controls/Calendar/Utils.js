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
         }
      };
      
      return Utils;
   }
);