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
      isYearStateEnabled: function(options) {
         var quantum = options.quantum;
         return isEmpty(quantum) || 'months' in quantum ||'quarters' in quantum || 'halfyears' in quantum || 'years' in quantum;
      },
      /**
        * Возвращает может ли отображаться режим месяца
        * @returns {Boolean}
        */
      isMonthStateEnabled: function(options) {
         var quantum = options.quantum;
         return (isEmpty(quantum) && options.minQuantum === 'day') || 'days' in quantum || 'weeks' in quantum;
      },
      /**
        * Возвращает может ли отображаться кнопка переключения режима месяца и года
        * @returns {Boolean}
        */
      isStateButtonDisplayed: function(options) {
         return this.isYearStateEnabled(options) && this.isMonthStateEnabled(options);
      }
   };

   return Utils;
});