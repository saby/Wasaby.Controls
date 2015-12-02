/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [
   'js!SBIS3.CONTROLS.Data.ISerializable',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.CONTROLS.DataFactory',
   'js!SBIS3.CONTROLS.Data.ContextField'
], function (ISerializable, SerializableMixin, ArrayStrategy, DataFactory, ContextField) {
   'use strict';

   /**
    * Класс для работы с одной записью
    * @class SBIS3.CONTROLS.Record
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.ISerializable
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var Record =  $ws.proto.Abstract.extend([ISerializable, SerializableMixin], /** @lends SBIS3.CONTROLS.Record.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Record',
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
          * @var {Object} Объект содержащий экземпляры значений-объектов
          */
         _fieldsCache: {}
      },

      $constructor: function (cfg) {
         cfg = cfg || {};
         this._publish('onChange');
         this._strategy = cfg.strategy || new ArrayStrategy();
         this._raw = cfg.raw || {};
         this._isCreated = 'isCreated' in cfg ? cfg.isCreated : false;
         this._keyField = cfg.keyField || null;
         this._cid = $ws.helpers.randomId('c');
      },

      // region SBIS3.CONTROLS.Data.ISerializable

      _getSerializableState: function() {
         return $ws.core.merge(
            Record.superclass._getSerializableState.call(this), {
               _cid: this._cid,
               _isCreated: this._isCreated,
               _isDeleted: this._isDeleted,
               _isChanged: this._isChanged,
               _keyField: this._keyField,
               _raw: this._raw
            }
         );
      },

      // endregion SBIS3.CONTROLS.Data.ISerializable

      clone: function() {
         return new Record($ws.core.clone(this._options));
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
         this._fieldsCache = {};
         this._notify('onChange')

         return this;
      },

      /**
       * Возвращает признак наличия поля записи
       * @param {String} field Название поля
       * @returns {Boolean}
       */
      has: function (field) {
         return this._strategy.value(this._raw, field) !== undefined;
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
            value = DataFactory.cast(
               dataValue,
               data.type,
               this._strategy,
               data.meta
            );
         if (value && typeof value === 'object') {
            this._fieldsCache[field] = value;
         }
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
         if (value && typeof value === 'object') {
            this._fieldsCache[field] = value;
         }
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
       * Не использовать! Метод в кратчайшие сроки будет убран!
       * Устанавливает исходные "сырые" данные записи
       * todo Мальцев: придумать, как правильно мержить рекорды таким образом, чтобы один рекорд превращался в другой
       * @private
       * @returns {Object}
       */
      setRaw: function (raw) {
         this._options.raw = this._raw = raw;
         this._fieldsCache = {};
         this._notify('onChange');
      },

      /**
       * Возвращает исходные "сырые" данные записи
       * @returns {Object}
       */
      getRaw: function () {
         return this._raw;
      }

   });

   ContextField.registerRecord('ControlsFieldTypeRecord', Record, 'onChange');

   $ws.single.ioc.bind('SBIS3.CONTROLS.Record', function(config) {
      return new Record(config);
   });

   return Record;
});