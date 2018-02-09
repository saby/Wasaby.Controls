define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/Utils',[
   'Core/helpers/Object/isEmpty'
], function(isEmpty) {
   'use strict';
   /**
    * @class SBIS3.CONTROLS/Date/RangeBigChoose/resources/Utils
    */
   var Utils = /** @lends SBIS3.CONTROLS/Date/DateRangeBigChoose/resources/Utils.prototype */{
       /**
        * Возвращает может ли отображаться режим года
        * @returns {Boolean}
        */
      isYearStateEnabled: function(quantum) {
         return isEmpty(quantum) || 'months' in quantum ||'quarters' in quantum || 'halfyears' in quantum || 'years' in quantum;
      },
      /**
        * Возвращает может ли отображаться режим месяца
        * @returns {Boolean}
        */
      isMonthStateEnabled: function(quantum) {
         return isEmpty(quantum) || 'days' in quantum || 'weeks' in quantum;
      },
      /**
        * Возвращает может ли отображаться кнопка переключения режима месяца и года
        * @returns {Boolean}
        */
      isStateButtonDisplayed: function(quantum) {
         return this.isYearStateEnabled(quantum) && this.isMonthStateEnabled(quantum);
      },
   };

   return Utils;
});