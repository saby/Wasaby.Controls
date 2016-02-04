/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.Join', [
], function () {
   'use strict';

   /**
    * Способ объединения
    * @class SBIS3.CONTROLS.Data.Query.Join
    * @public
    * @author Мальцев Алексей
    */

   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Query.Join.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Query.Join',
      $protected: {
         _options: {
            /**
             * @cfg {String} Правое множество
             */
            resource: '',

            /**
             * @cfg {String} Синоним правого множества
             */
            as: '',

            /**
             * @cfg {Object} Правило объединения
             */
            on: {},

            /**
             * @cfg {Object} Выбираемые поля
             */
            select: {},

            /**
             * @cfg {Boolean} Внутреннее объединение
             */
            inner: true
         }
      },

      /**
       * Возвращает правое множество
       * @returns {String}
       */
      getResource: function () {
         return this._options.resource;
      },

      /**
       * Возвращает синоним правого множества
       * @returns {String}
       */
      getAs: function () {
         return this._options.as;
      },

      /**
       * Возвращает правило объеднения
       * @returns {Object}
       */
      getOn: function () {
         return this._options.on;
      },

      /**
       * Возвращает правило объеднения
       * @returns {Object}
       */
      getSelect: function () {
         return this._options.select;
      },

      /**
       * Это внутреннее объединение
       * @returns {Boolean}
       */
      isInner: function () {
         return this._options.inner;
      }
   });
});
