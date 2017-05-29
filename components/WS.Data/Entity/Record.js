/* global define */
define('js!WS.Data/Entity/Record', [
   'js!WS.Data/Entity/IObject',
   'js!WS.Data/Entity/ICloneable',
   'js!WS.Data/Entity/IProducible',
   'js!WS.Data/Entity/IEquatable',
   'js!WS.Data/Collection/IEnumerable',
   'js!WS.Data/Mediator/IReceiver',
   'js!WS.Data/Entity/IVersionable',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Entity/ObservableMixin',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Entity/CloneableMixin',
   'js!WS.Data/Entity/OneToManyMixin',
   'js!WS.Data/Entity/FormattableMixin',
   'js!WS.Data/Entity/VersionableMixin',
   'js!WS.Data/Collection/ArrayEnumerator',
   'js!WS.Data/Types/Flags',
   'js!WS.Data/Types/Enum',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'js!WS.Data/Factory',
   'js!WS.Data/Format/StringField',
   'js!WS.Data/ContextField/Record',
   'Core/core-instance',
   'Core/Context'
], function (
   IObject,
   ICloneable,
   IProducible,
   IEquatable,
   IEnumerable,
   IMediatorReceiver,
   IVersionable,
   Abstract,
   OptionsMixin,
   ObservableMixin,
   SerializableMixin,
   CloneableMixin,
   OneToManyMixin,
   FormattableMixin,
   VersionableMixin,
   ArrayEnumerator,
   Flags,
   Enum,
   Di,
   Utils,
   Factory,
   StringField,
   ContextFieldRecord,
   CoreInstance,
   CoreContext
) {
   'use strict';

   /**
    * Запись - обертка над данными, которые представлены в виде строки таблицы (объект с набором полей и их значений).
    *
    * Основные аспекты записи:
    * <ul>
    *    <li>одинаковый интерфейс доступа к данным в различных форматах (так называемые {@link rawData "сырые данные"}), например таких как JSON, СБИС-JSON или XML. За определение аспекта отвечает интерфейс {@link WS.Data/Entity/IObject};</li>
    *    <li>одинаковый интерфейс доступа к набору полей. За определение аспекта отвечает интерфейс {@link WS.Data/Collection/IEnumerable};</li>
    *    <li>манипуляции с форматом полей. За реализацию аспекта отвечает примесь {@link WS.Data/Entity/FormattableMixin};</li>
    *    <li>манипуляции с сырыми данными посредством адаптера. За реализацию аспекта отвечает примесь {@link WS.Data/Entity/FormattableMixin}.</li>
    * </ul>
    *
    * Создадим запись, в которой в качестве сырых данных используется plain JSON (адаптер для данных в таком формате используется по умолчанию):
    * <pre>
    *    var employee = new Record({
    *       rawData: {
    *          id: 1,
    *          firstName: 'John',
    *          lastName: 'Smith'
    *       }
    *    });
    *    employee.get('id');//1
    *    employee.get('firstName');//John
    * </pre>
    * Создадим запись, в которой в качестве сырых данных используется ответ БЛ СБИС (адаптер для данных в таком формате укажем явно):
    * <pre>
    *    define(['js!WS.Data/Adapter/Sbis'], function () {
    *       var employee = new Record({
    *          rawData: {
    *             _type: 'record',
    *             d: [1, 'John', 'Smith'],
    *             s: [
    *                {n: 'id', t: 'Число целое'},
    *                {n: 'firstName', t: 'Строка'},
    *                {n: 'lastName', t: 'Строка'}
    *             ]
    *          },
    *          adapter: 'adapter.sbis'
    *       });
    *       employee.get('id');//1
    *       employee.get('firstName');//John
    *    });
    * </pre>
    * @class WS.Data/Entity/Record
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Entity/IObject
    * @implements WS.Data/Entity/ICloneable
    * @implements WS.Data/Entity/IProducible
    * @implements WS.Data/Entity/IEquatable
    * @implements WS.Data/Collection/IEnumerable
    * @implements WS.Data/Mediator/IReceiver
    * @implements WS.Data/Entity/IVersionable
    * @mixes WS.Data/Entity/OptionsMixin
    * @mixes WS.Data/Entity/ObservableMixin
    * @mixes WS.Data/Entity/SerializableMixin
    * @mixes WS.Data/Entity/CloneableMixin
    * @mixes WS.Data/Entity/FormattableMixin
    * @mixes WS.Data/Entity/VersionableMixin
    * @ignoreOptions owner
    * @ignoreMethods detach
    * @public
    * @author Мальцев Алексей
    */

   var Record,
      _recordState = {
         ADDED: 'Added',
         DELETED: 'Deleted',
         CHANGED: 'Changed',
         UNCHANGED: 'Unchanged',
         DETACHED: 'Detached'
      },
      _fieldRelationPrefix = 'field.';

   Record = Abstract.extend([IObject, ICloneable, IProducible, IEquatable, IEnumerable, IMediatorReceiver, IVersionable, OptionsMixin, ObservableMixin, SerializableMixin, CloneableMixin, OneToManyMixin, FormattableMixin, VersionableMixin], /** @lends WS.Data/Entity/Record.prototype */{
      /**
       * @typedef {String} RecordState
       * @variant Added Запись была добавлена в рекордсет, но метод {@link acceptChanges} не был вызыван.
       * @variant Deleted Запись была отмечена удаленной с использованием метода {@link setState}, но метод {@link acceptChanges} не был вызван.
       * @variant Changed Запись была изменена, но метод {@link acceptChanges} не был вызван. Автоматически переходит в это состояние при изменении любого поля, если до этого состояние было Unchanged.
       * @variant Unchanged С момента последнего вызова {@link acceptChanges} запись не была изменена.
       * @variant Detached Запись не была вставлена ни в один рекордсет, либо запись была удалена из рекордсета.
       */

      _moduleName: 'WS.Data/Entity/Record',

      /**
       * @cfg {RecordState} Текущее состояние записи по отношению к рекордсету: отражает факт принадлежности записи к рекордсету и сценарий, в результате которого эта принадлежность была сформирована.
       * @name WS.Data/Entity/Record#state
       * @see getState
       * @see setState
       * @see getOwner
       */
      _$state: _recordState.DETACHED,

      /**
       * @cfg {WS.Data/Collection/RecordSet} Рекордсет, которому принадлежит запись
       * @name WS.Data/Entity/Record#owner
       */
      _$owner: null,

      /**
       * @member {RecordState} Состояние записи после последнего вызова {@link acceptChanges}
       */
      _acceptedState: undefined,

      /**
       * @member {Object.<String, *>} Измененные поля и оригинальные значения
       */
      _changedFields: null,

      /**
       * @member {Object} Объект содержащий закэшированные инстансы значений-объектов
       */
      _propertiesCache: null,

      constructor: function $Record(options) {
         if (options && options.owner && !options.owner._wsDataCollectionRecordSet) {
            throw new TypeError('Record owner should be an instance of WS.Data/Collection/RecordSet');
         }
         this._changedFields = {};
         Record.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
         ObservableMixin.constructor.call(this, options);
         FormattableMixin.constructor.call(this, options);
         this._acceptedState = this._$state;

         this._publish('onPropertyChange');
      },

      destroy: function() {
         this._changedFields = null;
         this._propertiesCache = null;

         ObservableMixin.destroy.call(this);
         OneToManyMixin.destroy.call(this);
         Record.superclass.destroy.call(this);
      },

      //region WS.Data/Entity/IObject

      get: function (name) {
         if (this._hasInPropertiesCache(name)) {
            return this._getFromPropertiesCache(name);
         }

         var value = this._getRawDataValue(name);
         if (this._isFieldValueCacheable(value)) {
            this._addChild(value, this._getRelationNameForField(name));
            this._setToPropertiesCache(name, value);
         }

         return value;
      },
      
      set: function (name, value) {
         var map = this._getHashMap(name, value),
            changed,
            errors = [],
            key,
            oldValue,
            i;

         for (key in map) {
            if (!map.hasOwnProperty(key)) {
               continue;
            }
            if (!key) {
                Utils.logger.stack('WS.Data/Entity/Record::set(): property name is empty, value can\'t be set.');
            }

            value = map[key];
            oldValue = this.get(key);
            if (this._getValueOf(oldValue) === this._getValueOf(value)) {
               if (typeof value === 'object') {
                  this._setRawDataValue(key, value);
               }
            } else {
               try {
                  this._removeChild(oldValue);
                  this._setRawDataValue(key, value);
                  this._addChild(value, this._getRelationNameForField(key));

                  if (!this.has(key)) {
                     this._addRawDataField(key);
                  }

                  if (!changed) {
                     changed = {};
                  }
                  changed[key] = value;
                  this._setChanged(key, oldValue);

                  if (this._isFieldValueCacheable(value)) {
                     this._setToPropertiesCache(key, value);
                  } else {
                     this._unsetFromPropertiesCache(key);
                  }
               } catch (e) {
                  errors.push(e); //Собираем ошибки в копилку чтобы проставить значения всем кому возможно
               }
            }
         }

         if (changed) {
            this._notifyChange(changed);
         }

         if (errors.length) {
            //Минимальным будет простой Error, выбираем его, потому что выплюнуть можно только одну ошибку.
            var error = errors[0];
            for (i = errors.length; i > 0; i--) {
               if (error > errors[i]) {
                  error = errors[i];
               }
            }
            throw error;
         }
      },

      has: function (name) {
         return this._getRawDataFields().indexOf(name) > -1;
      },

      //endregion WS.Data/Entity/IObject

      //region WS.Data/Collection/IEnumerable

      /**
       * Возвращает энумератор для перебора названий полей записи
       * @return {WS.Data/Collection/ArrayEnumerator}
       * @example
       * Переберем все поля записи:
       * <pre>
       *    var user = new Record({
       *          rawData: {
       *             id: 1,
       *             login: 'dummy',
       *             group_id: 7
       *          }
       *       }),
       *       enumerator = user.getEnumerator(),
       *       fields = [];
       *
       *    while (enumerator.moveNext()) {
       *       fields.push(enumerator.getCurrent());
       *    }
       *    fields.join(', ');//'id, login, group_id'
       * </pre>
       */
      getEnumerator: function () {
         return new ArrayEnumerator(this._getRawDataFields());
      },

      /**
       * Перебирает все поля записи
       * @param {Function(String, *)} callback Ф-я обратного вызова для каждого поля. Первым аргументом придет название поля, вторым - его значение.
       * @param {Object} [context] Контекст вызова callback.
       * @example
       * Переберем все поля записи:
       * <pre>
       *    var user = new Record({
       *          rawData: {
       *             id: 1,
       *             login: 'dummy',
       *             group_id: 7
       *          }
       *       }),
       *       fields = [];
       *
       *    user.each(function(field) {
       *       fields.push(field);
       *    });
       *    fields.join(', ');//'id, login, group_id'
       * </pre>
       */
      each: function (callback, context) {
         var enumerator = this.getEnumerator(),
            name;
         while (enumerator.moveNext()) {
            name = enumerator.getCurrent();
            callback.call(
               context || this,
               name,
               this.get(name)
            );
         }
      },

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Mediator/IReceiver

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
            var adapter = this._getRawDataAdapter(),
               hasInRawData = adapter.has(fieldName),
               map = {};

            //Apply child's raw data to the self raw data if necessary
            if (hasInRawData) {
               this._setRawDataValue(fieldName, which, true);
            }

            this._setChanged(fieldName, which);
            map[fieldName] = which;
            this._notify('onPropertyChange', map);
         }
      },

      //endregion WS.Data/Mediator/IReceiver

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state = SerializableMixin._getSerializableState.call(this, state);
         state = FormattableMixin._getSerializableState.call(this, state);
         delete state.$options.owner;
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

      //endregion WS.Data/Entity/SerializableMixin

      //region WS.Data/Entity/FormattableMixin

      setRawData: function(rawData) {
         FormattableMixin.setRawData.call(this, rawData);
         this._nextVersion();
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
         this._nextVersion();
         if (value !== undefined) {
            this.set(format.getName(), value);
         }
      },

      removeField: function(name) {
         this._checkFormatIsWritable();
         this._nextVersion();
         FormattableMixin.removeField.call(this, name);
      },

      removeFieldAt: function(at) {
         this._checkFormatIsWritable();
         this._nextVersion();
         FormattableMixin.removeFieldAt.call(this, at);
      },

      _hasFormat: function () {
         var owner = this.getOwner();
         if (owner) {
            return owner._hasFormat();
         } else {
            return FormattableMixin._hasFormat.call(this);
         }
      },

      _getFormat: function (build) {
         var owner = this.getOwner();
         if (owner) {
            return owner._getFormat(build);
         } else {
            return FormattableMixin._getFormat.call(this, build);
         }
      },

      _getFieldFormat: function(name, adapter) {
         var owner = this.getOwner();
         if (owner) {
            return owner._getFieldFormat(name, adapter);
         } else {
            return FormattableMixin._getFieldFormat.call(this, name, adapter);
         }
      },

      /**
       * Создает адаптер для сырых данных
       * @return {WS.Data/Adapter/IRecord}
       * @protected
       */
      _createRawDataAdapter: function () {
         return this._getAdapter().forRecord(this._$rawData);
      },

      /**
       * Проверяет, что формат записи доступен для записи
       * @protected
       */
      _checkFormatIsWritable: function() {
         var owner = this.getOwner();
         if (owner) {
            throw new Error('Record format has read only access if record belongs to recordset. You should change recordset format instead.');
         }
      },

      //endregion WS.Data/Entity/FormattableMixin

      //region WS.Data/Entity/IProducible

      produceInstance: function(data, options) {
         return new this.constructor({
            rawData: data,
            adapter: options.adapter
         });
      },

      //endregion WS.Data/Entity/IProducible

      //region WS.Data/Entity/IEquatable

      isEqual: function (to) {
         if (to === this) {
            return true;
         }
         if (!to) {
            return false;
         }
         if (!(to instanceof Record)) {
            return false;
         }
         //TODO: когда появятся форматы, сделать через сравнение форматов
         return JSON.stringify(this._getRawData()) === JSON.stringify(to.getRawData(true));
      },

      //endregion WS.Data/Entity/IEquatable

      //region Public methods

      /**
       * Возвращает признак, что поле с указанным именем было изменено.
       * Если name не передано, то проверяет, что изменено хотя бы одно поле.
       * @param {String} [name] Имя поля
       * @return {Boolean}
       * @example
       * Проверим изменилось ли поле title:
       * <pre>
       *    var article = new Record({
       *       rawData: {
       *          id: 1,
       *          title: 'Initial Title'
       *       }
       *    });
       *    article.isChanged('title');//false
       *    article.set('title', 'New Title');
       *    article.isChanged('title');//true
       * </pre>
       * Проверим изменилось ли какое-нибудь поле:
       * <pre>
       *    var article = new Record({
       *       rawData: {
       *          id: 1,
       *          title: 'Initial Title'
       *       }
       *    });
       *    article.isChanged();//false
       *    article.set('title', 'New Title');
       *    article.isChanged();//true
       * </pre>
       */
      isChanged: function (name) {
         return name ?
            this._changedFields.hasOwnProperty(name) :
            !Object.isEmpty(this._changedFields);
      },

      /**
       * Возвращает рекордсет, которому принадлежит запись. Может не принадлежать рекордсету.
       * @return {WS.Data/Collection/RecordSet|null}
       * @example
       * Проверим владельца записи до и после вставки в рекордсет:
       * <pre>
       *    var record = new Record(),
       *       rs1 = new RecordSet(),
       *       rs2 = new RecordSet();
       *
       *    record.getOwner();//null
       *
       *    rs1.add(record);
       *    record.getOwner() === null;//true
       *    rs1.at(0) === record;//false
       *    rs1.at(0).getOwner() === rs1;//true
       *
       *    rs2.add(record);
       *    record.getOwner() === null;//true
       *    rs2.at(0).getOwner() === rs2;//true
       * </pre>
       */
      getOwner: function() {
         return this._$owner;
      },

      /**
       * Отвязывает запись от рекордсета: сбрасывает ссылку на владельца и устанавливает состояние detached.
       */
      detach: function() {
         this._$owner = null;
         this.setState(_recordState.DETACHED);
      },

      /**
       * Возвращает текущее состояние записи.
       * @return {RecordState}
       * @see state
       * @see setState
       * @example
       * Проверим состояние записи до и после вставки в рекордсет, а также после удаления из рекордсета:
       * <pre>
       *    var record = new Record(),
       *       RecordState = Record.RecordState,
       *       rs = new RecordSet();
       *
       *    record.getState() === RecordState.DETACHED;//true
       *
       *    rs.add(record);
       *    record.getState() === RecordState.ADDED;//true
       *
       *    rs.remove(record);
       *    record.getState() === RecordState.DETACHED;//true
       * </pre>
       */
      getState: function() {
         return this._$state;
      },

      /**
       * Устанавливает текущее состояние записи.
       * @param {RecordState} state Новое состояние записи.
       * @see state
       * @see getState
       * @example
       * Пометитм запись, как удаленную:
       * <pre>
       *    var record = new Record();
       *    record.setState(Record.RecordState.DELETED);
       * </pre>
       */
      setState: function(state) {
         this._$state = state;
      },

      /**
       * Возвращает массив названий измененных полей.
       * @return {Array}
       * @example
       * Получим список изменненых полей статьи:
       * <pre>
       *    var article = new Record({
       *       rawData: {
       *          id: 1,
       *          date: new Date(2012, 12, 12),
       *          title: 'Initial Title'
       *       }
       *    });
       *
       *    article.getChanged();//[]
       *
       *    article.set({
       *       date: new Date(),
       *       title: 'New Title'
       *    });
       *    article.getChanged();//['date', 'title']
       * </pre>
       */
      getChanged: function() {
         return Object.keys(this._changedFields);
      },

      /**
       * Подтверждает изменения состояния записи в с момента предыдущего вызова acceptChanges():
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
       * Если передан аргумент fields, то подтверждаются изменения только указанного набора полей. {@link state State} в этом случае меняется только если fields включает в себя весь набор измененных полей.
       * @param {Array.<String>} [fields] Поля, в которых подтвердить изменения.
       * @example
       * Подтвердим изменения в записи:
       * <pre>
       *    var article = new Record({
       *       rawData: {
       *          id: 1,
       *          title: 'Initial Title'
       *       }
       *    });
       *
       *    article.set('title', 'New Title');
       *    article.getChanged();//['title']
       *    article.setState(Record.RecordState.DELETED);
       *
       *    article.acceptChanges();
       *    article.getChanged();//[]
       *    article.getState() === RecordState.DETACHED;//true
       * </pre>
       * Подтвердим изменение поля password:
       * <pre>
       *    var account = new Record({
       *       rawData: {
       *          id: 1,
       *          login: 'root'
       *          password: '123'
       *       }
       *    });
       *
       *    article.set({
       *       login: 'admin',
       *       password: '321'
       *    });
       *
       *    article.acceptChanges(['password']);
       *    article.getChanged();//['login']
       *    article.getState() === RecordState.CHANGED;//true
       * </pre>
       */
      acceptChanges: function(fields) {
         if (fields instanceof Array) {
            fields.forEach(function(field) {
               this._unsetChanged(field);
            }.bind(this));
         } else {
            this._changedFields = {};
         }

         if (Object.keys(this._changedFields).length === 0) {
            switch (this._$state) {
               case _recordState.ADDED:
               case _recordState.CHANGED:
                  this._$state = _recordState.UNCHANGED;
                  break;
               case _recordState.DELETED:
                  this._$state = _recordState.DETACHED;
                  break;
            }
         }

         this._acceptedState = this._$state;
      },

      /**
       * Возвращает запись к состоянию, в котором она была с момента последнего вызова acceptChanges:
       * <ul>
       *    <li>Отменяются изменения всех полей;
       *    <li>{@link state State} возвращается к состоянию, в котором он был сразу после вызова acceptChanges.</li>
       * </ul>
       * Если передан аргумент fields, то откатываются изменения только указанного набора полей. {@link state State} в этом случае меняется только если fields включает в себя весь набор измененных полей.
       * @param {Array.<String>} [fields] Поля, в которых подтвердить изменения.
       * @example
       * Отменим изменения в записи:
       * <pre>
       *    var article = new Record({
       *       rawData: {
       *          id: 1,
       *          title: 'Initial Title'
       *       }
       *    });
       *
       *    article.set('title', 'New Title');
       *    article.getChanged();//['title']
       *    article.setState(Record.RecordState.DELETED);
       *
       *    article.rejectChanges();
       *    article.getChanged();//[]
       *    article.getState() === RecordState.DETACHED;//true
       *    article.get('title');//'Initial Title'
       * </pre>
       * Отменим изменение поля password:
       * <pre>
       *    var account = new Record({
       *       rawData: {
       *          id: 1,
       *          login: 'root'
       *          password: '123'
       *       }
       *    });
       *
       *    article.set({
       *       login: 'admin',
       *       password: '321'
       *    });
       *
       *    article.rejectChanges(['password']);
       *    article.getChanged();//['login']
       *    article.get('login');//'admin'
       *    article.get('password');//'123'
       * </pre>
       */
      rejectChanges: function(fields) {
         var toSet = {},
            name;
         if (fields instanceof Array) {
            fields.forEach(function(field) {
               toSet[field] = this._changedFields[field][0];
            }.bind(this));
         } else {
            for (name in this._changedFields) {
               if (this._changedFields.hasOwnProperty(name)) {
                  toSet[name] = this._changedFields[name][0];
               }
            }
         }
         this.set(toSet);
         for (name in toSet) {
            if (toSet.hasOwnProperty(name)) {
               delete this._changedFields[name];
            }
         }

         if (Object.keys(this._changedFields).length === 0) {
            this._$state = this._acceptedState;
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
       * Возвращает hash map
       * @param {String|Object} name Название поля или набор полей
       * @param {String} [value] Значение поля
       * @return {Object.<String, *>}
       * @protected
       */
      _getHashMap: function (name, value) {
         var map = name;
         if (!(map instanceof Object)) {
            map = {};
            map[name] = value;
         }
         return map;
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
            delete this._propertiesCache[name];
         }
      },

      /**
       * Обнуляет кэш значений полей
       * @protected
       */
      _clearPropertiesCache: function () {
         this._propertiesCache = null;
      },

      /**
       * Возвращает признак, что значение поля кэшируемое
       * @return {Boolean}
       * @protected
       */
      _isFieldValueCacheable: function(value) {
         return value instanceof Object;
      },

      /**
       * Возвращает значение поля из "сырых" данных, прогнанное через фабрику
       * @param {String} name Название поля
       * @return {*}
       * @protected
       */
      _getRawDataValue: function(name) {
         var adapter = this._getRawDataAdapter();
         if (!adapter.has(name)) {
            return;
         }

         var value = adapter.get(name),
            format = this._getFieldFormat(name, adapter);

         return Factory.cast(
            value,
            this._getFieldType(format),
            {
               format: format,
               adapter: this._getAdapter()
            }
         );
      },

      /**
       * Прогоняет значение поля через фабрику и сохраняет его в "сырых" данных
       * @param {String} name Название поля
       * @param {*} value Значение поля
       * @param {Boolean} [compatible=false] Значение поля совместимо по типу
       * @protected
       */
      _setRawDataValue: function(name, value, compatible) {
         if (!compatible && value && value._wsDataEntityFormattableMixin) {//it's equal to CoreInstance.instanceOfMixin(value, 'WS.Data/Entity/FormattableMixin')
            this._checkAdapterCompatibility(value.getAdapter());
         }

         var adapter = this._getRawDataAdapter(),
            format = this._getFieldFormat(name, adapter);

         adapter.set(
            name,
            Factory.serialize(
               value,
               {
                  format: format,
                  adapter: this.getAdapter()
               }
            )
         );
      },

      /**
       * Уведомляет об изменении полей записи
       * @param {Object.<String, *)} [map] Измененные поля
       * @protected
       */
      _notifyChange: function(map) {
         map = map || {};
         this._childChanged(map);
         this._nextVersion();
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
            case _recordState.UNCHANGED:
               this._$state = _recordState.CHANGED;
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
      },

      /**
       * Возвращает valueOf от объекта,либо value если это не объект
       * @param {*} value
       * @return {*}
       * @protected
       */
      _getValueOf: function (value) {
         if (value !== null && typeof value === 'object' && value !== value.valueOf()) {
            return value.valueOf();
         }
         return value;
      }
      //endregion Protected methods
   });

   /**
    *
    * Создает запись по объекту c учетом типов значений полей. Поля добавляются в запись в алфавитном порядке.
    * @example
    * <pre>
    * var record = Record.fromObject({
    *       id: 1,
    *       title: 'title'
    *    }, 'adapter.json'),
    *    format = record.getFormat();
    * format.each(function(field) {
    *    console.log(field.getName() + ': ' + field.getType());
    * });
    * //output: 'id: Integer', 'title: String'
    * </pre>
    * @param {Object} data Объект вида "имя поля" -> "значение поля"
    * @param {String|WS.Data/Adapter/IAdapter} [adapter='adapter.json'] Адаптер для сырых данных
    * @return {WS.Data/Entity/Record}
    * @static
    */
   Record.fromObject = function(data, adapter) {
      if (data === null) {
         return data;
      }
      if (data && (data instanceof Record)) {
         return data;
      }

      var record = new Record({
            adapter: adapter || 'adapter.json',
            format: []
         }),
         name,
         value,
         sortNames = [];

      for (name in data) {
         if (data.hasOwnProperty(name)) {
            sortNames.push(name);
         }
      }
      sortNames = sortNames.sort();

      for (var i = 0, len = sortNames.length; i < len; i++) {
         name = sortNames[i];
         value = data[name];

         if (value === undefined) {
            continue;
         }

         Record.addFieldTo(record, name, value);
      }

      return record;
   };

   /**
    *
    * Добавляет поле в запись. Если формат не указан, то он строится по типу значения поля.
    * @param {WS.Data/Entity/Record} record Запись
    * @param {String} name Имя поля
    * @param {*} value Значение поля
    * @param {Object} [format] Формат поля
    * @static
    */
   Record.addFieldTo = function(record, name, value, format) {
      if (!format) {
         format = Record._getValueType(value);
         if (!(format instanceof Object)) {
            format = {type: format};
         }
         format.name = name;
      }

      record.addField(format, undefined, value);
   };

   /**
    * Возвращает тип значения
    * @param {*} val Значение
    * @return {String|Object}
    * @protected
    * @static
    */
   Record._getValueType = function(value) {
      switch (typeof value) {
         case 'boolean':
            return 'boolean';

         case 'number':
            if (value % 1 === 0) {
               return 'integer';
            }
            return 'real';

         case 'object':
            if (value === null) {
               return 'string';
            } else if (value instanceof Record) {
               return 'record';
            } else if (value && value._wsDataCollectionRecordSet) {
               return 'recordset';
            } else if (value instanceof Date) {
               if (value.hasOwnProperty('_serializeMode')) {
                  switch (value.getSQLSerializationMode()) {
                     case Date.SQL_SERIALIZE_MODE_DATE:
                        return 'date';
                     case Date.SQL_SERIALIZE_MODE_TIME:
                        return 'time';
                  }
               }
               return 'datetime';
            } else if (value instanceof Array) {
               return {
                  type: 'array',
                  kind: Record._getValueType(value[0])
               };
            }
            return 'object';

         default:
            return 'string';
      }
   };

   /**
    *
    * Создает запись c набором полей, ограниченным фильтром.
    * @static
    * @param {WS.Data/Entity/Record} record Исходная запись
    * @param {Function(String, *): Boolean} callback Функция фильтрации полей, аргументами приходят имя поля и его значение. Должна вернуть boolean - прошло ли поле фильтр.
    * @return {WS.Data/Entity/Record}
    */
   Record.filter = function(record, callback) {
      var result = new Record({
            adapter: record.getAdapter()
         }),
         format = record.getFormat();

      format.each(function(field) {
         var name = field.getName(),
            value = record.get(name);
         if (!callback || callback(name, value)) {
            result.addField(field);
            result.set(name, value);
         }
      });

      result.acceptChanges();

      return result;
   };

   /**
    *
    * Создает запись c указанным набором полей
    * @static
    * @param {WS.Data/Entity/Record} record Исходная запись
    * @param {Array.<String>} fields Набор полей, которые следует оставить в записи
    * @return {WS.Data/Entity/Record}
    */
   Record.filterFields = function(record, fields) {
      if (!(fields instanceof Array)) {
         throw new TypeError('Argument "fields" should be an instance of Array');
      }

      return Record.filter(record, function(name) {
         return fields.indexOf(name) > -1;
      });
   };

   Record.RecordState = _recordState;

   Di.register('entity.$record', Record, {instantiate: false});
   Di.register('entity.record', Record);

   CoreContext.registerFieldType(new ContextFieldRecord(Record));

   return Record;
});
