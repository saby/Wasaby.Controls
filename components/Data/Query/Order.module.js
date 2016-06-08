/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.Order', [
], function () {
   'use strict';

   /**
    * Способ сортировки
    * @class SBIS3.CONTROLS.Data.Query.Order
    * @public
    * @author Мальцев Алексей
    */

   var Order = $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Query.Order.prototype */{
      /**
       * @typedef {Boolean} Order
       * @variant false По возрастанию
       * @variant true По убыванию
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Query.Order',
      $protected: {
         _options: {
            /**
             * @cfg {String} Объект сортировки
             */
            selector: '',

            /**
             * @cfg {Order} Порядок сортировки
             */
            order: false
         }
      },

      $constructor: function () {
         var order = this._options.order;
         if (typeof order === 'string') {
            order = order.toUpperCase();
         }
         switch (order) {
            case Order.SORT_DESC:
            case Order.SORT_DESC_STR:
               this._options.order = Order.SORT_DESC;
               break;
            default:
               this._options.order = Order.SORT_ASC;
         }
      },

      /**
       * Возвращает Объект сортировки
       * @returns {String}
       */
      getSelector: function () {
         return this._options.selector;
      },

      /**
       * Возвращает порядок сортировки
       * @returns {Order}
       */
      getOrder: function () {
         return this._options.order;
      }
   });

   /**
    * @const {Boolean} Сортировка по возрастанию
    */
   Order.SORT_ASC = false;

   /**
    * @const {Boolean} Сортировка по убыванию
    */
   Order.SORT_DESC = true;

   /**
    * @const {String} Сортировка по возрастанию (для строки)
    */
   Order.SORT_ASC_STR = 'ASC';

   /**
    * @const {String} Сортировка по убыванию (для строки)
    */
   Order.SORT_DESC_STR = 'DESC';

   return Order;
});
