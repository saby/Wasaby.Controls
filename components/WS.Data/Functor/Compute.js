/* global define, require */
define('js!WS.Data/Functor/Compute', [
], function (
) {
   'use strict';

   /**
    * Функтор, хранящий информацию о свойствах, от значения которых зависит результат вычислений.
    * Создадим и выполним функтор, вычисляющий 20% налог на заказ в магазине:
    * <pre>
    *    requirejs(['js!WS.Data/Functor/Compute'], function(ComputeFunctor) {
    *       var getTax = new ComputeFunctor(function(totals, percent) {
    *             return totals.amount * percent / 100;
    *          }, ['amount']),
    *          tax;
    *
    *       tax = getTax({
    *          count: 5,
    *          amount: 250
    *       }, 20);
    *       console.log(tax);//50
    *       console.log(getTax.properties);//['amount']
    *    });
    * </pre>
    * @class WS.Data/Functor/Compute
    * @public
    * @author Мальцев Алексей
    */

   /**
    * Конструктор
    * @param {Function} fn Функция, производящая вычисления
    * @param {Array.<String>} [properties] Свойства, от которых зависит результат вычисления
    * @return {Function}
    * @protected
    */
   var Compute = function(fn, properties) {
      properties = properties || [];
      if (!(fn instanceof Function)) {
         throw new TypeError('Argument "fn" be an instance of Function');
      }
      if (!(properties instanceof Array)) {
         throw new TypeError('Argument "properties" be an instance of Array');
      }

      if (Object.defineProperty) {
         Object.defineProperty(fn, 'functor', {
            get: function() {
               return Compute;
            }
         });
         Object.defineProperty(fn, 'properties', {
            get: function() {
               return properties;
            }
         });
      } else {
         fn.functor = Compute;
         fn.properties = properties;
      }

      return fn;

   };

   return Compute;
});
