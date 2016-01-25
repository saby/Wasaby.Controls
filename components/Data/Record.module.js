/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Record', [
   'js!SBIS3.CONTROLS.Data.IPropertyAccess',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.Serializer',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.ContextField',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (IPropertyAccess, IEnumerable, ArrayEnumerator, SerializableMixin, Serializer, Di, Factory, ContextField) {
   'use strict';

   /**
    * Запись - обертка над данными.
    * @class SBIS3.CONTROLS.Data.Record
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.IPropertyAccess
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Record = $ws.proto.Abstract.extend([IPropertyAccess, IEnumerable, SerializableMixin], /** @lends SBIS3.CONTROLS.Data.Record.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Record',
      $protected: {
         _options: {
            /**
             * @cfg {Object} Данные в "сыром" виде
             * @example
             * <pre>
             *    var user = new Record({
             *       rawData: {
             *          id: 1,
             *          firstName: 'John',
             *          lastName: 'Smith'
             *       }
             *    });
             *    user.get('id');//5
             *    user.get('firstName');//John
             * </pre>
             * @see getRawData
             * @see setRawData
             */
            rawData: null,

            /**
             * @cfg {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными в "сыром" виде, по умолчанию {@link SBIS3.CONTROLS.Data.Adapter.Json}
             * @example
             * <pre>
             *    var user = new Record({
             *       adapter: 'adapter.sbis'
             *    });
             * </pre>
             * @see getAdapter
             * @see setAdapter
             */
            adapter: ''
         },

         /**
          * @var {SBIS3.CONTROLS.Data.Adapter.IRecord} Адаптер для записи
          */
         _recordAdapter: null,

         /**
          * @var {Array} Описание всех полей, полученных из данных в "сыром" виде
          */
         _fields: null,

         /**
          * @var {Object.<String, *>} Измененные поля и оригинальные значения
          */
         _changedFields: {},

         /**
          * @var {Object} Объект содержащий закэшированные инстансы значений-объектов
          */
         _propertiesCache: {}
      },

      $constructor: function (cfg) {
         cfg = cfg || {};
         this._publish('onPropertyChange');

         if ('data' in cfg && !('rawData' in cfg)) {
            this._options.rawData = cfg.data;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Record', 'option "data" is deprecated and will be removed in 3.7.4. Use "rawData" instead.');
         }
         this.setRawData(this._options.rawData);
      },

      // region SBIS3.CONTROLS.Data.IPropertyAccess

      get: function (name) {
         if (this._propertiesCache.hasOwnProperty(name)) {
            return this._propertiesCache[name];
         }

         var hasValue = this._getRecordAdapter().has(name),
            value = hasValue ? this._getRawDataValue(name) : undefined;

         if (this._isFieldValueCacheable(value)) {
            this._propertiesCache[name] = value;
         }

         return value;
      },

      set: function (name, value) {
         if (!name) {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Record::set()', 'Property name is empty');
         }

         var oldValue = this._getRawDataValue(name);
         if (oldValue !== value) {
            this._setRawDataValue(name, value);
            if (!this.has(name)) {
               this._addRawDataField(name);
            }
            this._setChanged(name, oldValue);
            if (name in this._propertiesCache &&
               value !== this._propertiesCache[name]
            ) {
               delete this._propertiesCache[name];
            }
            this._notify('onPropertyChange', name, value);
         }
      },

      has: function (name) {
         return Array.indexOf(this._getRawDataFields(), name) > -1;
      },

      // endregion SBIS3.CONTROLS.Data.IPropertyAccess

      // region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора названий полей записи
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator({
            items: this._getRawDataFields()
         });
      },

      /**
       * Перебирает все поля записи
       * @param {Function(String, *)} callback Ф-я обратного вызова для каждого поля. Первым аргументом придет название поля, вторым - его значение.
       * @param {Object} [context] Контекст вызова callback.
       */
      each: function (callback, context) {
         var enumerator = this.getEnumerator(),
            name;
         while ((name = enumerator.getNext())) {
            callback.call(
               context || this,
               name,
               this.get(name)
            );
         }
      },

      // endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function() {
         return $ws.core.merge(
            Record.superclass._getSerializableState.call(this), {
               _changedFields: this._changedFields
            }
         );
      },

      _setSerializableState: function(state) {
         return Record.superclass._setSerializableState(state).callNext(function() {
            this._changedFields = state._changedFields;
         });
      },

      // endregion SBIS3.CONTROLS.Data.SerializableMixin

      // region Public methods

      /**
       * Возвращает адаптер для работы с данными в "сыром" виде
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @see adapter
       * @see setAdapter
       */
      getAdapter: function () {
         if (!this._options.adapter) {
            this._options.adapter = this._getDefaultAdapter();
         }
         if (typeof this._options.adapter === 'string') {
            this._options.adapter = Di.resolve(this._options.adapter);
         }
         return this._options.adapter;
      },

      /**
       * Устанавливает адаптер для работы с данными в "сыром" виде
       * @param {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter
       * @see adapter
       * @see getAdapter
       */
      setAdapter: function (adapter) {
         this._options.adapter = adapter;
         this._propertiesCache = {};
      },

      /**
       * Возвращает признак, что поле с указанным именем было изменено.
       * Если name не передано, то проверяет, что изменено хотя бы одно поле.
       * @param {String} [name] Имя поля
       * @returns {Boolean}
       */
      isChanged: function (name) {
         return name ?
            this._changedFields.hasOwnProperty(name) :
            !Object.isEmpty(this._changedFields);
      },

      /**
       * Клонирует запись
       * @returns {SBIS3.CONTROLS.Data.Record}
       */
      clone: function() {
         var serializer = new Serializer();
         return JSON.parse(
            JSON.stringify(this, serializer.serialize),
            serializer.deserialize
         );
      },

      /**
       * Возвращает "сырые" данные записи
       * @returns {Object}
       */
      getRawData: function () {
         return this._options.rawData;
      },

      /**
       * Устанавливает "сырые" данные записи
       * @param {Object} rawData Данные в "сыром" виде
       */
      setRawData: function (rawData) {
         this._options.rawData = rawData;
         this._recordAdapter = null;
         this._propertiesCache = {};
         this._notify('onPropertyChange');
      },

      // endregion Public methods

      //region Protected methods

      /**
       * Возвращает адаптер по-умолчанию (можно переопределять в наследниках)
       * @private
       * @deprecated Метод _getDefaultAdapter() не рекомендуется к использованию и будет удален в 3.7.4. Используйте опцию adapter.
       */
      _getDefaultAdapter: function() {
         if (Record.prototype._getDefaultAdapter !== this._getDefaultAdapter) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Record', 'Method _getDefaultAdapter() is deprecated and will be removed in 3.7.4. Use \'adapter\' option instead.');
         }
         return 'adapter.json';
      },

      /**
       * Возвращает адаптер для работы с записью
       * @returns {SBIS3.CONTROLS.Data.Adapter.IRecord}
       * @protected
       */
      _getRecordAdapter: function () {
         return this._recordAdapter || (this._recordAdapter = this.getAdapter().forRecord(this._options.rawData));
      },

      /**
       * Возвращает список полей записи, полученный из "сырых" данных
       * @returns {Array.<String>}
       * @protected
       */
      _getRawDataFields: function () {
         return this._fields || (this._fields = this._getRecordAdapter().getFields());
      },

      /**
       * Добавляет поле в список полей
       * @param {String} name Название поля
       * @protected
       */
      _addRawDataField: function(name) {
         this._getRawDataFields().push(name);
      },

      /**
       * Возвращает значение поля из "сырых" данных, прогнанное через фабрику
       * @param {String} name Название поля
       * @returns {*}
       * @protected
       */
      _getRawDataValue: function(name) {
         var adapter = this._getRecordAdapter(),
            rawValue = adapter.get(name),
            fieldInfo = adapter.getInfo(name);

         return Factory.cast(
            rawValue,
            fieldInfo.type,
            this.getAdapter(),
            fieldInfo.meta
         );
      },

      /**
       * Прогоняет значение поля через фабрику и сохраняет его в "сырых" данных
       * @param {String} name Название поля
       * @param {*} value Значение поля
       * @protected
       */
      _setRawDataValue: function(name, value) {
         var adapter = this._getRecordAdapter(),
            fieldInfo = adapter.getInfo(name);

         adapter.set(
            name,
            Factory.serialize(
               value,
               fieldInfo.type,
               this.getAdapter(),
               fieldInfo.meta
            )
         );

         if (!(this._options.rawData instanceof Object)) {
            this._options.rawData = adapter.getData();
         }
      },

      /**
       * Возвращает признак, что значение поля кэшируемое
       * @returns {Boolean}
       * @protected
       */
      _isFieldValueCacheable: function(value) {
         return value && typeof value === 'object';
      },

      /**
       * Устанавливает признак изменения поля
       * @param {String} name Название поля
       * @param {Boolean} value Старое значение поля
       * @protected
       */
      _setChanged: function (name, value) {
         if (!this._changedFields.hasOwnProperty(name)) {
            this._changedFields[name] = [value];
         }
      },

      /**
       * Снимает признак изменения поля
       * @param {String} name Название поля
       * @protected
       */
      _unsetChanged: function (name) {
         delete this._changedFields[name];
      }

      //endregion Protected methods
   });

   Di.register('record', Record);

   ContextField.registerRecord('ControlsDataRecord', Record, 'onPropertyChange');

   return Record;
});
