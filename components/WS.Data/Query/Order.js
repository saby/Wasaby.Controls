/* global define */
define('js!WS.Data/Query/Order', [
   'Core/core-extend',
   'js!WS.Data/Entity/OptionsMixin'
], function (
   CoreExtend,
   OptionsMixin
) {
   'use strict';

   /**
    * Объект, задающий способ сортировки множества
    * @class WS.Data/Query/Order
    * @mixes WS.Data/Entity/OptionsMixin
    * @public
    * @author Мальцев Алексей
    */

   var Order = CoreExtend.extend([OptionsMixin], /** @lends WS.Data/Query/Order.prototype */{
      /**
       * @typedef {Boolean} Order
       * @variant false По возрастанию
       * @variant true По убыванию
       */

      _moduleName: 'WS.Data/Query/Order',

      /**
       * @cfg {String} Объект сортировки
       * @name WS.Data/Query/Order#selector
       */
      _$selector: '',

      /**
       * @cfg {Order} Порядок сортировки
       * @name WS.Data/Query/Order#order
       */
      _$order: false,

      constructor: function $Order(options) {
         Order.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);

         var order = this._$order;
         if (typeof order === 'string') {
            order = order.toUpperCase();
         }
         switch (order) {
            case Order.SORT_DESC:
            case Order.SORT_DESC_STR:
               this._$order = Order.SORT_DESC;
               break;
            default:
               this._$order = Order.SORT_ASC;
         }
      },

      /**
       * Возвращает Объект сортировки
       * @return {String}
       */
      getSelector: function () {
         return this._$selector;
      },

      /**
       * Возвращает порядок сортировки
       * @return {Order}
       */
      getOrder: function () {
         return this._$order;
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
