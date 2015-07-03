/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';

   /**
    * Запись - обертка для данных
    * @author Мануйлов Андрей
    * @class SBIS3.CONTROLS.Record
    * @public
    */

   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Record.prototype */{
      $protected: {
         /**
          * @var {String|null} Клиентский идентификатор
          */
         _cid: null,

         /**
          * @var {Boolean} Признак, что запись вставлена в источник данных
          */
         _isCreated: false,

         /**
          * @var {Boolean} Признак, что запись удалена
          */
         _isDeleted: false,

         /**
          * @var {Boolean} Признак, что запись изменена
          */
         _isChanged: false,

         /**
          * @var {String} Поле, в котором хранится первичный ключ
          */
         _keyField: null,

         /**
          * @var {*} Данные записи в "сыром" виде
          */
         _raw: null,

         /**
          * @var {SBIS3.CONTROLS.IDataStrategy} Стратегия, обеспечивающая интерфейс доступа к "сырым" данным
          */
         _strategy: null,

         /**
          * @var {Function} Обрабочик, вызываемый при изменении данных записи
          */
         _onChangeHandler: null
      },

      $constructor: function (cfg) {
         this._strategy = cfg.strategy;
         this._raw = cfg.raw;
         this._isCreated = 'isCreated' in cfg ? cfg.isCreated : false;
         this._onChangeHandler = cfg.onChangeHandler;
         this._keyField = cfg.keyField || null;
         this._cid = $ws.helpers.randomId('c');
      },

      /**
       * Объединяет запись с данными и состоянием другой записи
       * @param {SBIS3.CONTROLS.Record} record Запись, с которой следует объединиться
       * @returns {SBIS3.CONTROLS.Record}
       */
      merge: function (record) {
         //FIXME: сейчас стратегии должны быть одинаковы. Сделать объединение _raw через стратегии.
         $ws.core.merge(this._raw, record._raw);
         this._isCreated = record._isCreated;
         this._isChanged = record._isChanged;
         this._isDeleted = record._isDeleted;
         //this._keyField = record._keyField;

         return this;
      },

      /**
       * Возвращает значение поля записи
       * @param {String} field Название поля
       * @returns {*}
       */
      get: function (field) {
         // с данными можем работать только через стратегию
         return this._strategy.value(this._raw, field);
      },

      /**
       * Устанавливает значение поля записи
       * @param {String} field Название поля
       * @param {*} value Новое значение
       */
      set: function (field, value) {
         // с данными можем работать только через стратегию
         this._raw = this._strategy.setValue(this._raw, field, value);
         this._isChanged = true;
         if (this._isChanged && this._onChangeHandler) {
            this._onChangeHandler(this);
         }
      },

      /**
       * Возвращает тип поля
       * @param {String} field Название поля
       * @returns {*}
       */
      getType: function (field) {
         return field ? this._strategy.type(this._raw, field) : '';
      },

      /**
       * Помечает запись, как вставленную в источник данных
       * @param {Boolean} created Запись вставлена
       */
      setCreated: function (created) {
         this._isCreated = created;
      },

      /**
       * Возвращает признак, что запись вставлена в источник данных
       * @returns {Boolean}
       */
      isCreated: function () {
         return this._isCreated;
      },

      /**
       * Помечает запись, как удаленную, либо снимает этот признак
       * @param {Boolean} deleted Запись удалена
       */
      setDeleted: function (deleted) {
         this._isDeleted = deleted;
      },

      /**
       * Возвращает признак, что запись удалена
       * @returns {Boolean}
       */
      isDeleted: function () {
         return this._isDeleted;
      },

      /**
       * Устанавливает признак, что запись изменена
       * @param {Boolean} changed Запись изменена
       * @returns {Boolean}
       */
      setChanged: function (changed) {
         this._isChanged = changed;
      },

      /**
       * Возвращает признак, что запись изменена
       * @returns {Boolean}
       */
      isChanged: function () {
         return this._isChanged;
      },

      /**
       * Возвращает значение первичного ключа записи
       * @returns {*}
       */
      getKey: function () {
         var key = this.get(this._keyField);
         // потому что БЛ возвращает массив для идентификатора
         if (key instanceof Array) {
            return key[0];
         }
         return key;
      },

      /**
       * Возвращает поле, в котором хранится первичный ключ записи
       * @returns {String}
       */
      getKeyField: function () {
         return this._keyField;
      },

      /**
       * Возвращает исходные "сырые" данные записи
       * @returns {Object}
       */
      getRaw: function () {
         return this._raw;
      }

   });
});