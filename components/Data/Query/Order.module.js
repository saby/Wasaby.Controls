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
      _moduleName: 'SBIS3.CONTROLS.Data.Query.Order',
      $protected: {
         _options: {
            /**
             * @cfg {String} Объект сортировки
             */
            selector: '',

            /**
             * @cfg {Boolean} Порядок сортировки (true - по возрастанию)
             */
            order: true
         }
      },

      $constructor: function () {
         switch (this._options.order) {
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
       * Возвращает порядок сортировки (true - по возрастанию, false - по убыванию)
       * @returns {Boolean}
       */
      getOrder: function () {
         return this._options.order;
      }
   });

   /**
    * @const {Boolean} Сортировка по возрастанию
    */
   Order.SORT_ASC = true;

   /**
    * @const {Boolean} Сортировка по убыванию
    */
   Order.SORT_DESC = false;

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
