/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [
], function () {
   'use strict';

   /**
    * Класс для работы с одной записью
    * @class SBIS3.CONTROLS.Record
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   /**
    * @faq Почему я вижу ошибки от $ws.single.ioc?
    * Для корректной работы с зависимости снала надо загрузить {@link SBIS3.CONTROLS.DataFactory}, а уже потом {@link SBIS3.CONTROLS.Record}
    */

   var Record =  $ws.proto.Abstract.extend( /** @lends SBIS3.CONTROLS.Record.prototype */{
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
          * @var {Object} Объект содержащий приведенные значения модели
          */
         _fieldsCache: {}
      },

      $constructor: function (cfg) {
         this._publish('onChange');
         this._strategy = cfg.strategy;
         this._raw = cfg.raw || {};
         this._isCreated = 'isCreated' in cfg ? cfg.isCreated : false;
         this._keyField = cfg.keyField || null;
         this._cid = $ws.helpers.randomId('c');
      },

      clone: function() {
         return new Record(this._options);
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
         if (this._fieldsCache.hasOwnProperty(field)) {
            return this._fieldsCache[field];
         }
         
         var dataValue = this._strategy.value(this._raw, field),
            data = this._strategy.getFullFieldData(this._raw, field),
            value = $ws.single.ioc.resolve('SBIS3.CONTROLS.DataFactory').cast(
               dataValue,
               data.type,
               this._strategy,
               data.meta
            );
         this._fieldsCache[field] = value;
         return value;
      },

      /**
       * Устанавливает значение поля записи
       * @param {String} field Название поля
       * @param {*} value Новое значение
       */
      set: function (field, value) {
         if (!field) {
            $ws.single.ioc.resolve('ILogger').error('Record', 'Field name is empty');
         }
         // с данными можем работать только через стратегию
         this._raw = this._strategy.setValue(this._raw, field, value);
         delete this._fieldsCache[field];
         this._isChanged = true;
         if (this._isChanged) {
            this._notify('onChange', field);
         }
      },

      /**
       * Возвращает тип поля
       * @param {String} field Название поля
       * @returns {*}
       */
      getType: function (field) {
         return field ? this._strategy.type(this._raw, field) : undefined;
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
         if (!this._keyField) {
            $ws.single.ioc.resolve('ILogger').error('Record', 'Key field is not defined');
         }
         var key = this.get(this._keyField);
         // потому что БЛ возвращает массив для идентификатора
         if (key instanceof Array) {
            return key.length > 1 ? key.join(',') : key[0];
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

   return Record;
});