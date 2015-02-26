/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';

   /**
    * Обертка для данных
    */

   return $ws.core.extend({}, {
      $protected: {
         _raw: undefined,
         _strategy: undefined
      },
      $constructor: function (cfg) {
         this._strategy = cfg.strategy;
         this._raw = cfg.raw;
      },

      /**
       * Получить значение по наименованию поля
       * @param {String} field
       * @returns {*}
       */
      get: function (field) {
         // с данными можем работать только через стратегию
         return this._strategy.value(this._raw, field);
      },

      /**
       * Установить значение поля записи
       * @param {String} field название поля
       * @param value новое значение
       */
      set: function (field, value) {
         // с данными можем работать только через стратегию
         this._raw = this._strategy.setValue(this._raw, field, value);
      },

      /**
       * Получить исходные "сырые" данные для записи
       * @returns {Object}
       */
      getRaw: function () {
         return this._raw;
      }

   });
});