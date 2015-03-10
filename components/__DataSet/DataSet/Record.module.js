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
         _cid: null, //клиентский идентификатор
         _isDeleted: false,
         _isChanged: false,
         _keyField: null,
         _raw: null,
         _strategy: null
      },
      $constructor: function (cfg) {
         this._strategy = cfg.strategy;
         this._raw = cfg.raw;
         this._keyField = cfg.keyField || null;
         this._cid = $ws.helpers.randomId('c');
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
         this._isChanged = true;
      },

      toggleStateDeleted: function () {
         if (arguments[0] === undefined) {
            this._isDeleted = !this._isDeleted;
         }
         else if (typeof arguments[0] == 'boolean') {
            this._isDeleted = arguments[0];
         }
      },

      getMarkDeleted: function () {
         return this._isDeleted;
      },

      getMarkChanged: function () {
         return this._isChanged;
      },

      getMarkStatus: function () {
         if (this._isDeleted) {
            return 'deleted';
         }
         if (this._isChanged) {
            return 'changed';
         }
         return 'normal';
      },

      getKey: function () {
         var key = this.get(this._keyField);
         // потому что БЛ возвращает массив для идентификатора
         if (key instanceof Array) {
            return key[0];
         }
         return key;
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