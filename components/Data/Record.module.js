/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Record', [
   'js!SBIS3.CONTROLS.Data.IObject',
   'js!SBIS3.CONTROLS.Data.ICloneable',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Mediator.IReceiver',
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Entity.OptionsMixin',
   'js!SBIS3.CONTROLS.Data.Entity.ObservableMixin',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.CloneableMixin',
   'js!SBIS3.CONTROLS.Data.OneToManyMixin',
   'js!SBIS3.CONTROLS.Data.FormattableMixin',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.Format.StringField',
   'js!SBIS3.CONTROLS.Data.ContextField.Record'
], function (
   IObject,
   ICloneable,
   IEnumerable,
   IMediatorReceiver,
   Abstract,
   OptionsMixin,
   ObservableMixin,
   SerializableMixin,
   CloneableMixin,
   OneToManyMixin,
   FormattableMixin,
   ArrayEnumerator,
   Di,
   Utils,
   Factory,
   StringField,
   ContextFieldRecord
) {
   'use strict';

   /**
    * Запись - обертка над данными.
    * @class SBIS3.CONTROLS.Data.Record
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.IObject
    * @mixes SBIS3.CONTROLS.Data.ICloneable
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @mixes SBIS3.CONTROLS.Data.Mediator.IReceiver
    * @mixes SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @mixes SBIS3.CONTROLS.Data.Entity.ObservableMixin
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @mixes SBIS3.CONTROLS.Data.CloneableMixin
    * @mixes SBIS3.CONTROLS.Data.FormattableMixin
    * @public
    * @author Мальцев Алексей
    */

   var RecordState = {
      ADDED: 'Added',
      DELETED: 'Deleted',
      CHANGED: 'Changed',
      UNCHANGED: 'Unchanged',
      DETACHED: 'Detached'
   };

   var Record = Abstract.extend([IObject, ICloneable, IEnumerable, IMediatorReceiver, OptionsMixin, ObservableMixin, SerializableMixin, CloneableMixin, OneToManyMixin, FormattableMixin], /** @lends SBIS3.CONTROLS.Data.Record.prototype */{
      /**
       * @typedef {String} RecordState
       * @variant Added Запись была добавлена в рекордсет, но метод Record::acceptChanges() не был вызыван.
       * @variant Deleted Запись была удалена из рекордсета с использованием метода Record::delete().
       * @variant Changed Запись была изменена, но метод Record::acceptChanges() не был вызван. Автоматически переходит в это состояние при изменении любого поля, если до этого оно (состояние) было Unchanged или Detached.
       * @variant Unchanged С момента последнего вызова Record::acceptChanges() запись не была изменена.
       * @variant Detached Запись не была вставлена ни в один рекордсет, либо запись была удалена из рекордсета.
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Record',

      _compatibleConstructor: true,//Чтобы в наследниках с "old style extend" звался нативный constructor()

      /**
       * @cfg {RecordState} Текущее состояние записи.
       * @name SBIS3.CONTROLS.Data.Record#state
       * @see getState
       * @see setState
       * @see getOwner
       */
      _$state: RecordState.DETACHED,

      /**
       * @member {Object.<String, *>} Измененные поля и оригинальные значения
       */
      _changedFields: null,

      /**
       * @member {Object} Объект содержащий закэшированные инстансы значений-объектов
       */
      _propertiesCache: null,

      constructor: function $Record(options) {
         if (options) {
            if ('data' in options && !('rawData' in options)) {
               options.rawData = options.data;
               Utils.logger.stack(this._moduleName + '::constructor(): option "data" is deprecated and will be removed in 3.7.4. Use "rawData" instead.', 1);
            }
         }

         this._changedFields = {};
         Record.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
         FormattableMixin.constructor.call(this, options);
         this._publish('onPropertyChange');
         this.setRawData(this._$rawData);
      },

      //region SBIS3.CONTROLS.Data.IObject

      get: function (name) {
         if (this._hasInPropertiesCache(name)) {
            return this._getFromPropertiesCache(name);
         }

         var hasValue = this._getRawDataAdapter().has(name),
            value = hasValue ? this._getRawDataValue(name) : undefined;

         if (this._isFieldValueCacheable(value)) {
            this._setToPropertiesCache(name, value);
         }

         return value;
      },

      set: function (name, value) {
         if (!name) {
            Utils.logger.stack('SBIS3.CONTROLS.Data.Record::set(): property name is empty, value can\'t be setted.');
         }

         var map = name,
            equals = [],
            oldValue;
         if (!(map instanceof Object)) {
            map = {};
            map[name] = value;
         }

         for (name in map) {
            if (!map.hasOwnProperty(name)) {
               continue;
            }
            value = map[name];
            oldValue = this._getRawDataValue(name);
            if (this._isEqualValues(oldValue, value)) {
               equals.push(name);
            } else {
               this._setRawDataValue(name, value);
               if (!this.has(name)) {
                  this._addRawDataField(name);
               }
               this._setChanged(name, oldValue);
               if (this._hasInPropertiesCache(name) &&
                  value !== this._getFromPropertiesCache(name)
               ) {
                  this._unsetFromPropertiesCache(name);
               }
            }
         }

         for (var i = 0; i < equals.length; i++) {
            delete map[equals[i]];
         }
         if (!Object.isEmpty(map)) {
            this._notifyChange(map);
         }
      },

      has: function (name) {
         return Array.indexOf(this._getRawDataFields(), name) > -1;
      },

      //endregion SBIS3.CONTROLS.Data.IObject

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Возвращает энумератор для перебора названий полей записи
       * @returns {SBIS3.CONTROLS.Data.Collection.ArrayEnumerator}
       */
      getEnumerator: function () {
         return new ArrayEnumerator(this._getRawDataFields());
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

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region SBIS3.CONTROLS.Data.Mediator.IReceiver

      relationChanged: function (which, name, data) {
         var fieldName;
         if (name === 'owner') {
            switch (data) {
               case 'addField':
               case 'removeField':
               case 'removeFieldAt':
                  this._resetRawDataAdapter();
                  this._resetRawDataFields();
                  break;
            }
         } else if ((fieldName = this._getFieldFromRelationName(name))) {
            var fieldValue = this.get(fieldName),
               map = {};
            this._setChanged(fieldName, fieldValue);
            map[fieldName] = fieldValue;
            this._notify('onPropertyChange', map);
         }
      },

      //endregion SBIS3.CONTROLS.Data.Mediator.IReceiver

      //region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function(state) {
         state = SerializableMixin._getSerializableState.call(this, state);
         state = FormattableMixin._getSerializableState.call(this, state);
         state._changedFields = this._changedFields;
         return state;
      },

      _setSerializableState: function(state) {
         return SerializableMixin._setSerializableState(state)
            .callNext(
               FormattableMixin._setSerializableState(state)
            )
            .callNext(function() {
               this._changedFields = state._changedFields;
            });
      },

      //endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region SBIS3.CONTROLS.Data.FormattableMixin

      setRawData: function(rawData) {
         FormattableMixin.setRawData.call(this, rawData);
         this._clearPropertiesCache();
         this._notifyChange();
      },

      setAdapter: function (adapter) {
         FormattableMixin.setAdapter.call(this, adapter);
         this._clearPropertiesCache();
      },

      addField: function(format, at, value) {
         this._checkFormatIsWritable();
         format = this._buildField(format);
         FormattableMixin.addField.call(this, format, at);

         if (value !== undefined) {
            this.set(format.getName(), value);
         }
      },

      removeField: function(name) {
         this._checkFormatIsWritable();
         FormattableMixin.removeField.call(this, name);
      },

      removeFieldAt: function(at) {
         this._checkFormatIsWritable();
         FormattableMixin.removeFieldAt.call(this, at);
      },

      /**
       * Создает адаптер для сырых данных
       * @returns {SBIS3.CONTROLS.Data.Adapter.IRecord}
       * @protected
       */
      _createRawDataAdapter: function () {
         return this.getAdapter().forRecord(this._$rawData);
      },

      /**
       * Проверяет, что формат записи доступен для записи
       * @protected
       */
      _checkFormatIsWritable: function() {
         if (this.getOwner()) {
            throw new Error('Record format has read only access if record belongs to recordset. You should change recordset format instead.');
         }
      },

      //endregion SBIS3.CONTROLS.Data.FormattableMixin

      //region Public methods

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
       * Проверяет эквивалентность формата и данных другой записи.
       * @param {SBIS3.CONTROLS.Data.Record} record Запись, эквивалентность которой проверяется
       * @returns {Boolean}
       */
      isEqual: function (record) {
         if (record === this) {
            return true;
         }
         if (!record) {
            return false;
         }
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Record')) {
            return false;
         }
         //TODO: когда появятся форматы, сделать через сравнение форматов
         return $ws.helpers.isEqualObject(
            this.getRawData(),
            record.getRawData()
         );
      },

      /**
       * Возвращает рекордсет, которому принадлежит запись. Может не принадлежать рекордсету.
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       */
      getOwner: function() {
         return this._getMediator().getParent(this) || null;
      },

      /**
       * Возвращает текущее состояние записи.
       * @returns {RecordState}
       * @see state
       * @see setState
       */
      getState: function() {
         return this._$state;
      },

      /**
       * Устанавливает текущее состояние записи.
       * @param {RecordState} state Новое состояние записи.
       * @see state
       * @see getState
       */
      setState: function(state) {
         this._$state = state;
      },

      /**
       *  Возвращает массив названий измененных полей.
       *  @returns {Array}
       */
      getChanged: function() {
         return Object.keys(this._changedFields);
      },

      /**
       * Забывает измененные поля.
       * @see acceptChanges
       * @deprecated Метод будет удалён в версии платформы СБИС 3.7.4. Используйте acceptChanges()
       */
      applyChanges: function() {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet::applyChanges() - method is deprecated and will be removed in 3.7.4. Use acceptChanges() instead.', 1);
         this.acceptChanges();
      },

      /**
       * Подтверждает изменения состояния записи в с момента предыдущего вызова acceptChanges()
       * <ul>
       *    <li>Сбрасывает признак изменения для всех измененных полей;
       *    <li>Меняет {@link state} следующим образом:
       *       <ul>
       *          <li>Added или Changed становится Unchanged;</li>
       *          <li>Deleted становится Detached;</li>
       *          <li>остальные не меняются.</li>
       *       </ul>
       *    </li>
       * </ul>
       */
      acceptChanges: function() {
         this._changedFields = {};

         switch (this._$state) {
            case RecordState.ADDED:
            case RecordState.CHANGED:
               this._$state = RecordState.UNCHANGED;
               break;
            case RecordState.DELETED:
               this._$state = RecordState.DETACHED;
               break;
         }
      },

      //endregion Public methods

      //region Protected methods

      _getRelationNameForField: function(name) {
         return _fieldRelationPrefix + name;
      },

      _getFieldFromRelationName: function(name) {
         name += '';
         if (name.substr(0, _fieldRelationPrefix.length) === _fieldRelationPrefix) {
            return name.substr(_fieldRelationPrefix.length);
         }
      },

      /**
       * Проверяет наличие закэшированного значения поля
       * @param {String} name Название поля
       * @return {Boolean}
       * @protected
       */
      _hasInPropertiesCache: function (name) {
         return this._propertiesCache && this._propertiesCache.hasOwnProperty(name);
      },

      /**
       * Возвращает закэшированноое значение поля
       * @param {String} name Название поля
       * @return {Object}
       * @protected
       */
      _getFromPropertiesCache: function (name) {
         return this._propertiesCache ? this._propertiesCache[name] : undefined;
      },

      /**
       * Кэширует значение поля
       * @param {String} name Название поля
       * @param {Object} value Значение поля
       * @protected
       */
      _setToPropertiesCache: function (name, value) {
         if (this._propertiesCache === null) {
            this._propertiesCache = {};
         }
         this._propertiesCache[name] = value;
      },

      /**
       * Удаляет закэшированноое значение поля
       * @param {String} name Название поля
       * @protected
       */
      _unsetFromPropertiesCache: function (name) {
         if (this._propertiesCache) {
            this._removeChild(this._propertiesCache[name]);
            delete this._propertiesCache[name];
         }
      },

      /**
       * Обнуляет кэш значений полей
       * @protected
       */
      _clearPropertiesCache: function () {
         if (this._propertiesCache) {
            for (var name in this._propertiesCache) {
               if (this._propertiesCache.hasOwnProperty(name)) {
                  this._removeChild(this._propertiesCache[name]);
               }
            }
         }
         this._propertiesCache = null;
      },

      /**
       * Возвращает признак, что значение поля кэшируемое
       * @returns {Boolean}
       * @protected
       */
      _isFieldValueCacheable: function(value) {
         return value && value instanceof Object;
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
         var adapter = this._getRawDataAdapter();

         try {
            var result = Factory.cast(
               adapter.get(name),
               adapter.getSharedFormat(name),
               this.getAdapter()
            );
            this._addChild(result, this._getRelationNameForField(name));
            return result;
         } catch (e) {
            return undefined;
         }
      },

      /**
       * Прогоняет значение поля через фабрику и сохраняет его в "сырых" данных
       * @param {String} name Название поля
       * @param {*} value Значение поля
       * @protected
       */
      _setRawDataValue: function(name, value) {
         var adapter = this._getRawDataAdapter(),
            format;
         try {
            format = adapter.getSharedFormat(name);
         } catch (e) {
            if (!(e instanceof ReferenceError)) {
               throw e;
            }
            format = 'String';
         }

         adapter.set(
            name,
            Factory.serialize(
               value,
               format,
               this.getAdapter()
            )
         );
         this._addChild(value, this._getRelationNameForField(name));

         if (!(this._$rawData instanceof Object)) {
            this._$rawData = adapter.getData();
         }
      },

      /**
       * Сравнивает два значения на эквивалентность (в том числе через интерфейс сравнения)
       * @param {Boolean} a Значение A
       * @param {Boolean} b Значение B
       * @returns {Boolean}
       * @protected
       */
      _isEqualValues: function(a, b) {
         if (a === b) {
            return true;
         }

         if (this._isComparable(a) && this._isComparable(b)) {
            return a.isEqual(b);
         }

         if (a && $ws.helpers.instanceOfModule(a, 'SBIS3.CONTROLS.Data.Types.Enum') &&
            b && $ws.helpers.instanceOfModule(b, 'SBIS3.CONTROLS.Data.Types.Enum')
         ) {
            return a.isEqual(b);
         }

         if (a && $ws.helpers.instanceOfModule(a, 'SBIS3.CONTROLS.Data.Types.Flags') &&
            b && $ws.helpers.instanceOfModule(b, 'SBIS3.CONTROLS.Data.Types.Flags')
         ) {
            return a.isEqual(b);
         }

         return false;
      },

      /**
       * Проверяет наличие интерфейса сравнения у объекта
       * @param {Object} value
       * @returns {Boolean}
       * @protected
       */
      _isComparable: function(value) {
         if (!value) {
            return false;
         }
         return $ws.helpers.instanceOfModule(value, 'SBIS3.CONTROLS.Data.Record');
      },

      /**
       * Уведомляет об изменении полей записи
       * @param {Object.<String, *)} [map] Измененные поля
       * @protected
       */
      _notifyChange: function(map) {
         this._childChanged(map);
         this._notify('onPropertyChange', map);
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
         switch (this._$state) {
            case RecordState.DETACHED:
            case RecordState.UNCHANGED:
               this._$state = RecordState.CHANGED;
               break;
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

   var _fieldRelationPrefix = 'field.';

   Record.RecordState = RecordState;

   SerializableMixin._checkExtender(Record);

   Di.register('record', Record);

   $ws.proto.Context.registerFieldType(new ContextFieldRecord({module: Record}));

   return Record;
});
