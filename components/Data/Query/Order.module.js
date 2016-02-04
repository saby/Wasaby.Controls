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

   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Query.Order.prototype */{
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
         this._options.order = this._options.order ? true : false;
      },

      /**
       * Возвращает Объект сортировки
       * @returns {String}
       */
      getSelector: function () {
         return this._options.selector;
      },

      /**
       * Возвращает порядок сортировки (true - по возрастанию)
       * @returns {Boolean}
       */
      getOrder: function () {
         return this._options.order;
      }
   });
});
