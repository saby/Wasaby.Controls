/* global define */
define('WS.Data/Collection/RecordSet', [
   'WS.Data/Collection/ObservableList',
   'WS.Data/Entity/SerializableMixin',
   'WS.Data/Entity/FormattableMixin',
   'WS.Data/Collection/IBind',
   '/Entity/IObjectNotify',
   'WS.Data/Entity/IInstantiable',
   'WS.Data/Entity/IProducible',
   'WS.Data/Entity/InstantiableMixin',
   'WS.Data/Collection/ArrayEnumerator',
   'WS.Data/Collection/Indexer',
   'WS.Data/Di',
   'WS.Data/Utils',
   'WS.Data/Factory',
   'WS.Data/Entity/Record',
   'WS.Data/Entity/Model',
   'WS.Data/Adapter/Cow',
   'Core/core-instance',
   'Core/helpers/Object/isEqual'
], function (
   ObservableList,
   SerializableMixin,
   FormattableMixin,
   IBindCollection,
   IObjectNotify,
   IInstantiable,
   IProducible,
   InstantiableMixin,
   ArrayEnumerator,
   CollectionIndexer,
   Di,
   Utils,
   Factory,
   Record,
   Model,
   CowAdapter,
   coreInstance,
   isEqualObject
) {
   'use strict';

      /**
       *
       * @param item
       * @param idProperty
       */
      var checkNullId = function(value, idProperty) {
         if (developerMode && idProperty) {
            if (coreInstance.instanceOfModule(value, 'WS.Data/Entity/Model') && value.get(idProperty) === null) {
               Utils.logger.info('WS.Data/Collection/RecordSet: Id propery must not be null');
            } else if (coreInstance.instanceOfModule(value, 'WS.Data/Collection/RecordSet')) {
               value.each(function(item) {
                  checkNullId(item, idProperty);
               });
            }
         }
      },
      defaultModel = 'entity.model',
      developerMode = false,
      RecordState = Record.RecordState;

   /**
    * Рекордсет - список записей, имеющих общий формат полей.
    *
    * Основные аспекты рекордсета (дополнительно к аспектам {@link WS.Data/Collection/ObservableList}):
    * <ul>
    *    <li>манипуляции с форматом полей. За реализацию аспекта отвечает примесь {@link WS.Data/Entity/FormattableMixin};</li>
    *    <li>манипуляции с сырыми данными посредством адаптера. За реализацию аспекта отвечает примесь {@link WS.Data/Entity/FormattableMixin}.</li>
    * </ul>
    * Элементами рекордсета могут быть только {@link WS.Data/Entity/Record записи}, причем формат полей всех записей должен совпадать.
    *
    * Создадим рекордсет, в котором в качестве сырых данных используется JSON (адаптер для данных в таком формате используется по умолчанию):
    * <pre>
    *    require(['WS.Data/Collection/RecordSet'], function (RecordSet) {
    *       var characters = new RecordSet({
    *          rawData: [{
    *             id: 1,
    *             firstName: 'Tom',
    *             lastName: 'Sawyer'
    *          }, {
    *             id: 2,
    *             firstName: 'Huckleberry',
    *             lastName: 'Finn'
    *          }]
    *       });
    *       characters.at(0).get('firstName');//'Tom'
    *       characters.at(1).get('firstName');//'Huckleberry'
    *    });
    * </pre>
    * Создадим рекордсет, в котором в качестве сырых данных используется ответ БЛ СБИС (адаптер для данных в таком формате укажем явно):
    * <pre>
    *    require([
    *       'WS.Data/Collection/RecordSet',
    *       'WS.Data/Source/SbisService'
    *    ], function (RecordSet, SbisService) {
    *       var source = new SbisService({endpoint: 'Employee'});
    *       source.call('list', {department: 'designers'}).addCallback(function(response) {
    *          var designers = new RecordSet({
    *             rawData: response.getRawData(),
    *             adapter: response.getAdapter()
    *          });
    *          console.log(designers.getCount());
    *       });
    *    });
    * </pre>
    * @class WS.Data/Collection/RecordSet
    * @extends WS.Data/Collection/ObservableList
    * @implements /Entity/IObjectNotify
    * @implements WS.Data/Entity/IInstantiable
    * @implements WS.Data/Entity/IProducible
    * @mixes WS.Data/Entity/FormattableMixin
    * @mixes WS.Data/Entity/InstantiableMixin
    * @ignoreOptions items
    * @author Мальцев Алексей
    * @public
    */
   var RecordSet = ObservableList.extend([FormattableMixin, IObjectNotify, IInstantiable, IProducible, InstantiableMixin], /** @lends WS.Data/Collection/RecordSet.prototype */{
     /**
      * @typedef {Object} MergeOptions
      * @property {Boolean} [add=true] Добавлять новые записи.
      * @property {Boolean} [remove=true] Удалять отсутствующие записи.
      * @property {Boolean} [replace=true] Заменять одинаковые записи.
      * @property {Boolean} [inject=false] Заменять данные одинаковых записей.
      */

      _moduleName: 'WS.Data/Collection/RecordSet',
      _wsDataCollectionRecordSet: true,

      _instancePrefix: 'recordset-',

      /**
       * @cfg {String|Function} Конструктор записей, порождаемых рекордсетом. По умолчанию {@link WS.Data/Entity/Model}.
       * @name WS.Data/Collection/RecordSet#model
       * @see getModel
       * @see WS.Data/Entity/Record
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Внедрим конструктор пользовательской модели в виде названия зарегистрированной зависимости:
       * <pre>
       *    //User.js
       *    define('App/Models/User', [
       *       'WS.Data/Entity/Model',
       *       'WS.Data/Di'
       *    ], function (Model, Di) {
       *       var User = Model.extend({
       *          identify: function(login, password) {
       *             //...some logic here
       *          }
       *       });
       *       Di.register('app.models.user', User);
       *       return User;
       *    });
       *
       *    //UsersList.js
       *    require([
       *       'App/Models/User',
       *       'WS.Data/Collection/RecordSet'
       *    ], function (UserModel, RecordSet) {
       *       //...
       *       var users = new RecordSet({
       *          model: 'app.models.user'
       *          rawData: [{
       *             id: 1,
       *             login: 'editor'
       *          }]
       *       });
       *       users.at(0) instanceof UserModel;//true
       *    });
       * </pre>
       * Внедрим конструктор пользовательской модели в виде класса:
       * <pre>
       *    //User.js
       *    define('App/Models/User', [
       *       'WS.Data/Entity/Model',
       *       'WS.Data/Di'
       *    ], function (Model, Di) {
       *       var User = Model.extend({
       *          identify: function(login, password) {
       *             //...some logic here
       *          }
       *       });
       *       Di.register('app.models.user', User);
       *       return User;
       *    });
       *
       *    //UsersList.js
       *    require([
       *       'App/Models/User',
       *       'WS.Data/Collection/RecordSet'
       *    ], function (UserModel, RecordSet) {
       *       var users = new RecordSet({
       *          model: UserModel
       *          rawData: [{
       *             id: 1,
       *             login: 'editor'
       *          }]
       *       });
       *       users.at(0) instanceof UserModel;//true
       *    });
       * </pre>
       */
      _$model: defaultModel,

      /**
       * @cfg {String} Название свойства записи, содержащего первичный ключ.
       * @name WS.Data/Collection/RecordSet#idProperty
       * @see getIdProperty
       * @example
       * Создадим рекордсет, получим запись по первичному ключу:
       * <pre>
       *    require(['WS.Data/Collection/RecordSet'], function (RecordSet) {
       *       var users = new RecordSet({
       *          idProperty: 'id'
       *          rawData: [{
       *             id: 134,
       *             login: 'editor'
       *          }, {
       *             id: 257,
       *             login: 'shell'
       *          }]
       *       });
       *       users.getRecordById(257).get('login');//'shell'
       *    });
       * </pre>
       */
      _$idProperty: '',

      /**
       * @cfg {Object} Метаданные
       * @remark
       * Метаданные - это дополнительная информация, не связанная с RecordSet'ом напрямую.
       * Она используется механизмами списков для построения строки итогов, "хлебных крошек" и постраничной навигации.
       * Существуют три служебных поля в метаданных:
       * <ul>
       * <li>path - путь для "хлебных крошек", возвращается как {@link WS.Data/Collection/RecordSet};</li>
       * <li>results - строка итогов, возвращается как {@link WS.Data/Entity/Record}. Подробнее о конфигурации списков для отображения строки итогов читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ этом разделе};</li>
       * <li>more - Boolean - есть ли есть записи для подгрузки (используется для постраничной навигации).</li>
       * </ul>
       * @name WS.Data/Collection/RecordSet#metaData
       * @see getMetaData
       * @see setMetaData
       * @example
       * Создадим рекордсет c "хлебными крошками":
       * <pre>
       *    require(['WS.Data/Collection/RecordSet'], function (RecordSet) {
       *       var rs = new RecordSet({
       *          meta: {
       *             path: [{
       *                id: 1,
       *                name: 'Home'
       *             }, {
       *                id: 2,
       *                name: 'Catalogue'
       *             }]
       *          },
       *       });
       *
       *       var path = rs.getMetaData().path;
       *       path.at(0).get('name');//'Home'
       *    });
       * </pre>
       */
      _$metaData: null,

      constructor: function RecordSet(options) {
         if (options) {
            if ('items' in options) {
               Utils.logger.stack('WS.Data/Collection/RecordSet: option "items" give no effect. Use "rawData" instead.', 1);
            }
            if ('meta' in options) {
               this._$metaData = options.meta;
            }
         }

         this._$items = [];
         RecordSet.superclass.constructor.call(this, options);
         FormattableMixin.constructor.call(this, options);

         if (!this._$idProperty) {
            this._$idProperty = this._getAdapter().getKeyField(this._getRawData());
         }

         if (this._$rawData) {
            this._assignRawData(this._$rawData, true);
            this._initByRawData();
         }

         this._publish('onPropertyChange');
      },

      destroy: function() {
         this._$model = '';
         this._$metaData = null;

         RecordSet.superclass.destroy.call(this);
      },

      //region WS.Data/Mediator/IReceiver

      relationChanged: function (which, route) {
         var index = this.getIndex(which.target);
         if (index > -1) {
            //Apply record's raw data to the self raw data if necessary
            var adapter = this._getRawDataAdapter(),
               selfData = adapter.at(index),
               recordData = which.target.getRawData(true);
            if (selfData !== recordData) {
               this._getRawDataAdapter().replace(
                  recordData,
                  index
               );
            }
         }

         RecordSet.superclass.relationChanged.call(this, which, route);
      },

      //endregion WS.Data/Mediator/IReceiver

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state = RecordSet.superclass._getSerializableState.call(this, state);
         state = FormattableMixin._getSerializableState.call(this, state);
         state._instanceId = this.getInstanceId();
         delete state.$options.items;
         return state;
      },

      _setSerializableState: function(state) {
         var fromSuper = RecordSet.superclass._setSerializableState(state),
            fromFormattableMixin = FormattableMixin._setSerializableState(state);
         return function() {
            fromSuper.call(this);
            fromFormattableMixin.call(this);
            this._instanceId = state._instanceId;
         };
      },

      //endregion WS.Data/Entity/SerializableMixin

      //region WS.Data/Entity/ICloneable

      clone: function(shallow) {
         var clone = RecordSet.superclass.clone.call(this, shallow);
         if (shallow) {
            clone._$items = this._$items.slice();
         }
         return clone;
      },

      //endregion WS.Data/Entity/ICloneable

      //region WS.Data/Entity/FormattableMixin

      setRawData: function(data) {
         var oldItems = this._$items.slice();

         var eventsWasRaised = this._eventRaising;
         this._eventRaising = false;
         this.clear();
         this._eventRaising = eventsWasRaised;

         this._assignRawData(data);
         this._initByRawData();
         this._notifyCollectionChange(
            IBindCollection.ACTION_RESET,
            this._$items,
            0,
            oldItems,
            0
         );
      },

      addField: function(format, at, value) {
         format = this._buildField(format);
         FormattableMixin.addField.call(this, format, at);

         this._parentChanged('addField');
         if (value !== undefined) {
            var name = format.getName();
            this.each(function(record) {
               record.set(name, value);
            });
         }
         this._nextVersion();
      },

      removeField: function(name) {
         FormattableMixin.removeField.call(this, name);
         this._nextVersion();
         this._parentChanged('removeField');
      },

      removeFieldAt: function(at) {
         FormattableMixin.removeFieldAt.call(this, at);
         this._nextVersion();
         this._parentChanged('removeFieldAt');
      },

      /**
       * Создает адаптер для сырых данных
       * @return {WS.Data/Adapter/ITable}
       * @protected
       */
      _createRawDataAdapter: function () {
         return this._getAdapter().forTable(this._$rawData);
      },

      /**
       * Переустанавливает сырые данные
       * @param {Object} data Данные в "сыром" виде
       * @param {Boolean} [keepFormat=false] Сохранить формат
       * @protected
       */
      _assignRawData: function(data, keepFormat) {
         FormattableMixin.setRawData.call(this, data);
         this._clearIndexer();
         if (!keepFormat) {
            this._clearFormat();
         }
         this._nextVersion();
      },

      //endregion WS.Data/Entity/FormattableMixin

      //region WS.Data/Collection/IEnumerable

      /**
       * Возвращает энумератор для перебора записей рекордсета.
       * Пример использования можно посмотреть в модуле {@link WS.Data/Collection/IEnumerable}.
       * @param {WS.Data/Entity/Record/RecordState.typedef} [state] Состояние записей, которые требуется перебрать (по умолчанию перебираются все записи)
       * @return {WS.Data/Collection/ArrayEnumerator.<WS.Data/Entity/Record>}
       * @example
       * Получим сначала все, а затем - измененные записи:
       * <pre>
       *    require(['WS.Data/Entity/Record'], function(Record) {
       *       var fruits = new RecordSet({
       *             rawData: [
       *                {name: 'Apple'},
       *                {name: 'Banana'},
       *                {name: 'Orange'},
       *                {name: 'Strawberry'}
       *             ]
       *          }),
       *          fruit,
       *          enumerator;
       *
       *       fruits.at(0).set('name', 'Pineapple');
       *       fruits.at(2).set('name', 'Grapefruit');
       *
       *       enumerator = fruits.getEnumerator();
       *       while(enumerator.moveNext()) {
       *          fruit = enumerator.getCurrent();
       *          console.log(fruit.get('name'));
       *       }
       *       //output: 'Pineapple', 'Banana', 'Grapefruit', 'Strawberry'
       *
       *       enumerator = fruits.getEnumerator(Record.RecordState.CHANGED);
       *       while(enumerator.moveNext()) {
       *          fruit = enumerator.getCurrent();
       *          console.log(fruit.get('name'));
       *       }
       *       //output: 'Pineapple', 'Grapefruit'
       *    });
       * </pre>
       */
      getEnumerator: function (state) {
         var enumerator = new ArrayEnumerator(this._$items);

         enumerator.setResolver((function(index) {
            return this.at(index);
         }).bind(this));

         if (state) {
            enumerator.setFilter(function(record) {
               return record.getState() === state;
            });
         }

         return enumerator;
      },

      /**
       * Перебирает записи рекордсета.
       * @param {Function(WS.Data/Entity/Record, Number)} callback Функция обратного вызова, аргументами будут переданы запись и ее позиция.
       * @param {WS.Data/Entity/Record/RecordState.typedef} [state] Состояние записей, которые требуется перебрать (по умолчанию перебираются все записи)
       * @param {Object} [context] Контекст вызова callback
       * @example
       * Получим сначала все, а затем - измененные записи:
       * <pre>
       *    require([
       *       'WS.Data/Collection/RecordSet',
       *       'WS.Data/Entity/Record'
       *    ], function(RecordSet, Record) {
       *       var fruits = new RecordSet({
       *          rawData: [
       *             {name: 'Apple'},
       *             {name: 'Banana'},
       *             {name: 'Orange'},
       *             {name: 'Strawberry'}
       *          ]
       *       });
       *
       *       fruits.at(0).set('name', 'Pineapple');
       *       fruits.at(2).set('name', 'Grapefruit');
       *
       *       fruits.each(function(fruit) {
       *          console.log(fruit.get('name'));
       *       });
       *       //output: 'Pineapple', 'Banana', 'Grapefruit', 'Strawberry'
       *
       *       fruits.each(function(fruit) {
       *          console.log(fruit.get('name'));
       *       }, Record.RecordState.CHANGED);
       *       //output: 'Pineapple', 'Grapefruit'
       *    });
       * </pre>
       */
      each: function (callback, state, context) {
         if (state instanceof Object) {
            context = state;
            state = undefined;
         }
         context = context || this;

         var length = this.getCount(),
            index = 0,
            isMatching,
            record;
         for (var i = 0; i < length; i++) {
            record = this.at(i);
            if (state) {
               isMatching = record.getState() === state;
            } else {
               isMatching = true;
            }
            if (isMatching) {
               callback.call(
                  context,
                  record,
                  index++,
                  this
               );
            }
         }
      },

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Collection/List

      clear: function () {
         var item, i, count;
         for (i = 0, count = this._$items.length; i < count; i++) {
            item = this._$items[i];
            if (item) {
               item.detach();
            }
         }
         this._getRawDataAdapter().clear();
         RecordSet.superclass.clear.call(this);
      },

      /**
       * Добавляет запись в рекордсет путем создания новой записи, в качестве сырых данных для которой будут взяты сырые данные аргумента item.
       * Если формат созданной записи не совпадает с форматом рекордсета, то он будет приведен к нему принудительно: лишние поля будут отброшены, недостающие - проинициализированы значениями по умолчанию.
       * При недопустимом at генерируется исключение.
       * @param {WS.Data/Entity/Record} item Запись, из которой будут извлечены сырые данные.
       * @param {Number} [at] Позиция, в которую добавляется запись (по умолчанию - в конец)
       * @return {WS.Data/Entity/Record} Добавленная запись.
       * @see WS.Data/Collection/ObservableList#add
       * @example
       * Добавим запись в рекордсет:
       * <pre>
       *    require(['WS.Data/Collection/RecordSet', 'WS.Data/Entity/Record'], function(RecordSet, Record) {
       *       var rs = new RecordSet(),
       *          source = new Record({
       *             rawData: {foo: 'bar'}
       *          }),
       *          result;
       *
       *       result = rs.add(source);
       *
       *       result === source;//false
       *       result.get('foo') === source.get('foo);//true
       *
       *       source.getOwner() === rs;//false
       *       result.getOwner() === rs;//true
       *    });
       * </pre>
       */
      add: function (item, at) {
         item = this._normalizeItems([item], RecordState.ADDED)[0];
         this._getRawDataAdapter().add(item.getRawData(true), at);
         RecordSet.superclass.add.call(this, item, at);

         return item;
      },

      at: function (index) {
         return this._getRecord(index);
      },

      remove: function (item) {
         this._checkItem(item);
         return RecordSet.superclass.remove.call(this, item);
      },

      removeAt: function (index) {
         this._getRawDataAdapter().remove(index);

         var item = this._$items[index],
            result = RecordSet.superclass.removeAt.call(this, index);

         if (item) {
            item.detach();
         }

         return result;
      },

      /**
       * Заменяет запись в указанной позиции через создание новой записи, в качестве сырых данных для которой будут взяты сырые данные аргумента item.
       * Если формат созданной записи не совпадает с форматом рекордсета, то он будет приведен к нему принудительно: лишние поля будут отброшены, недостающие - проинициализированы значениями по умолчанию.
       * При недопустимом at генерируется исключение.
       * @param {WS.Data/Entity/Record} item Заменяющая запись, из которой будут извлечены сырые данные.
       * @param {Number} at Позиция, в которой будет произведена замена
       * @return {Array.<WS.Data/Entity/Record>} Добавленная запись
       * @see WS.Data/Collection/ObservableList#replace
       * @example
       * Заменим вторую запись:
       * <pre>
       *    require(['WS.Data/Collection/RecordSet', 'WS.Data/Entity/Record'], function(RecordSet, Record) {
       *       var rs = new RecordSet({
       *             rawData: [{
       *                id: 1,
       *                title: 'Water'
       *             }, {
       *                id: 2,
       *                title: 'Ice'
       *             }]
       *          }),
       *          source = new Record({
       *             rawData: {
       *                id: 3,
       *                title: 'Snow'
       *             }
       *          }),
       *          result;
       *
       *       rs.replace(source, 1);
       *       result = rs.at(1);
       *
       *       result === source;//false
       *       result.get('title') === source.get('title);//true
       *
       *       source.getOwner() === rs;//false
       *       result.getOwner() === rs;//true
       *    });
       * </pre>
       */
      replace: function (item, at) {
         item = this._normalizeItems([item], RecordState.CHANGED)[0];
         this._getRawDataAdapter().replace(item.getRawData(true), at);
         var oldItem = this._$items[at];
         RecordSet.superclass.replace.call(this, item, at);
         if (oldItem) {
            oldItem.detach();
         }

         return item;
      },

      move: function (from, to) {
         this._getRecord(from);//force create record instance
         this._getRawDataAdapter().move(from, to);
         RecordSet.superclass.move.call(this, from, to);
      },

      /**
       * Заменяет записи рекордсета копиями записей другой коллекции.
       * Если формат созданных копий не совпадает с форматом рекордсета, то он будет приведен к нему принудительно: лишние поля будут отброшены, недостающие - проинициализированы значениями по умолчанию.
       * @param {WS.Data/Collection/IEnumerable.<WS.Data/Entity/Record>|Array.<WS.Data/Entity/Record>} [items] Коллекция с записями для замены
       * @return {Array.<WS.Data/Entity/Record>} Добавленные записи
       * @see WS.Data/Collection/ObservableList#assign
       */
      assign: function (items) {
         if (items === this) {
            return [];
         }

         var oldItems = this._$items.slice(),
            result;

         if (items instanceof RecordSet) {
            this._$adapter = new CowAdapter(items.getAdapter());
            this._assignRawData(items.getRawData(true), this._hasFormat());
            result = new Array(items.getCount());
            RecordSet.superclass.assign.call(this, result);
         } else {
            items = this._itemsToArray(items);
            if (items.length && items[0] instanceof Record) {
               this._$adapter = new CowAdapter(items[0].getAdapter());
            }
            items = this._normalizeItems(items, RecordState.ADDED);
            this._assignRawData(null, this._hasFormat());
            items = this._addItemsToRawData(items);
            RecordSet.superclass.assign.call(this, items);
            result = items;
         }

         var item, i, count;
         for (i = 0, count = oldItems.length; i < count; i++) {
            item = oldItems[i];
            if (item) {
               item.detach();
            }
         }

         return result;
      },

      /**
       * Добавляет копии записей другой коллекции в конец рекордсета.
       * Если формат созданных копий не совпадает с форматом рекордсета, то он будет приведен к нему принудительно: лишние поля будут отброшены, недостающие - проинициализированы значениями по умолчанию.
       * @param {WS.Data/Collection/IEnumerable.<WS.Data/Entity/Record>|Array.<WS.Data/Entity/Record>} [items] Коллекция с записями для добавления
       * @return {Array.<WS.Data/Entity/Record>} Добавленные записи
       * @see WS.Data/Collection/ObservableList#append
       */
      append: function (items) {
         items = this._itemsToArray(items);
         items = this._normalizeItems(items, RecordState.ADDED);
         items = this._addItemsToRawData(items);
         RecordSet.superclass.append.call(this, items);

         return items;
      },

      /**
       * Добавляет копии записей другой коллекции в начало рекордсета.
       * Если формат созданных копий не совпадает с форматом рекордсета, то он будет приведен к нему принудительно: лишние поля будут отброшены, недостающие - проинициализированы значениями по умолчанию.
       * @param {WS.Data/Collection/IEnumerable.<WS.Data/Entity/Record>|Array.<WS.Data/Entity/Record>} [items] Коллекция с записями для добавления
       * @return {Array.<WS.Data/Entity/Record>} Добавленные записи
       * @see WS.Data/Collection/ObservableList#prepend
       */
      prepend: function (items) {
         items = this._itemsToArray(items);
         items = this._normalizeItems(items, RecordState.ADDED);
         items = this._addItemsToRawData(items, 0);
         RecordSet.superclass.prepend.call(this, items);

         return items;
      },

      toArray: function () {
         Utils.logger.stack(this._moduleName + '::toArray(): method is deprecated and will be removed in 3.7.6. Use WS.Data/Chain/Abstract::toArray() instead. See See https://wi.sbis.ru/docs/WS/Data/Chain/Abstract/methods/toArray/ for details.', 0, 'error');
         var items = [];
         this.each(function(item) {
            items.push(item);
         });
         return items;
      },

      /**
       * Возвращает индексатор коллекции
       * @return {WS.Data/Collection/Indexer}
       * @protected
       */
      _getIndexer: function () {
         if (this._indexer) {
            return this._indexer;
         }

         var indexer;

         //Custom model possible has different properties collection, this cause switch to the slow not lazy mode
         if (this._$model === defaultModel) {
            //Fast mode: indexing without record instances
            var adapter = this._getAdapter(),
               tableAdapter = this._getRawDataAdapter();

            indexer = new CollectionIndexer(
               this._getRawData(),
               function(items) {
                  return tableAdapter.getCount();
               },
               function(items, at) {
                  return tableAdapter.at(at);
               },
               function(item, property) {
                  return adapter.forRecord(item).get(property);
               }
            );
         } else {
            //Slow mode: indexing use record instances
            indexer = new CollectionIndexer(
               this._$items,
               function(items) {
                  return items.length;
               },
               (function(items, at) {
                  return this.at(at);
               }).bind(this),
               function(item, property) {
                  return item.get(property);
               }
            );
         }

         this._indexer = indexer;
         return indexer;
      },

      //endregion WS.Data/Collection/List

      //endregion WS.Data/Collection/ObservableList

      _itemsSlice: function (begin, end) {
         if (this._isNeedNotifyCollectionChange()) {
            if (begin === undefined) {
               begin = 0;
            }
            if (end === undefined) {
               end = this._$items.length;
            }
            //Force create records for event handler
            for (var i = begin; i < end; i++) {
               this._getRecord(i);
            }
         }

         return RecordSet.superclass._itemsSlice.apply(this, arguments);
      },

      //endregion WS.Data/Collection/ObservableList

      //region WS.Data/Entity/IProducible

      produceInstance: function(data, options) {
         var instanceOptions = {
            rawData: data
         };
         if (options) {
            if (options.adapter) {
               instanceOptions.adapter = options.adapter;
            }
            if (options.model) {
               instanceOptions.model = options.model;
            }
         }
         return new this(instanceOptions);
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
         if (!(to instanceof RecordSet)) {
            return false;
         }
         //TODO: когда появятся форматы, сделать через сравнение форматов и записей
         return isEqualObject(
            this._getRawData(),
            to.getRawData(true)
         );
      },

      //endregion WS.Data/Entity/IEquatable

      //region Public methods

      /**
       * Возвращает конструктор записей, порождаемых рекордсетом.
       * @return {String|Function}
       * @see model
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Получим конструктор записепй, внедренный в рекордсет в виде названия зарегистрированной зависимости:
       * <pre>
       *    var User = Model.extend({});
       *    Di.register('model.user', User);
       *    //...
       *    var users = new RecordSet({
       *       model: 'model.user'
       *    });
       *    users.getModel() === 'model.user';//true
       * </pre>
       * Получим конструктор записепй, внедренный в рекордсет в виде класса:
       * <pre>
       *    var User = Model.extend({});
       *    //...
       *    var users = new RecordSet({
       *       model: User
       *    });
       *    users.getModel() === User;//true
       * </pre>
       */
      getModel: function () {
         return this._$model;
      },

      /**
       * Подтверждает изменения всех записей с момента предыдущего вызова acceptChanges().
       * Обрабатывает {@link state} записей следующим образом:
       * <ul>
       *    <li>Changed и Added - меняют state на Unchanged;</li>
       *    <li>Deleted - удаляются из рекордсета, а их state становится Detached;</li>
       *    <li>остальные не меняются.</li>
       * </ul>
       * @example
       * Подтвердим измененную запись:
       * <pre>
       *    require(['WS.Data/Entity/Record'], function(Record) {
       *       var fruits = new RecordSet({
       *             rawData: [
       *                {name: 'Apple'},
       *                {name: 'Banana'}
       *             ]
       *          }),
       *          RecordState = Record.RecordState,
       *          apple = fruits.at(0);
       *
       *       apple.set('name', 'Pineapple');
       *       apple.getState() === RecordState.CHANGED;//true
       *
       *       fruits.acceptChanges();
       *       apple.getState() === RecordState.UNCHANGED;//true
       *    });
       * </pre>
       * Подтвердим добавленную запись:
       * <pre>
       *    require(['WS.Data/Entity/Record'], function(Record) {
       *       var fruits = new RecordSet({
       *             rawData: [
       *                {name: 'Apple'}
       *             ]
       *          }),
       *          RecordState = Record.RecordState,
       *          banana = new Record({
       *             rawData: {name: 'Banana'}
       *          });
       *
       *       fruits.add(banana);
       *       banana.getState() === RecordState.ADDED;//true
       *
       *       fruits.acceptChanges();
       *       banana.getState() === RecordState.UNCHANGED;//true
       *    });
       * </pre>
       * Подтвердим удаленную запись:
       * <pre>
       *    require(['WS.Data/Entity/Record'], function(Record) {
       *       var fruits = new RecordSet({
       *             rawData: [
       *                {name: 'Apple'},
       *                {name: 'Banana'}
       *             ]
       *          }),
       *          RecordState = Record.RecordState,
       *          apple = fruits.at(0);
       *
       *       apple.setState(RecordState.DELETED);
       *       fruits.getCount();//2
       *       fruits.at(0).get('name');//'Apple'
       *
       *       fruits.acceptChanges();
       *       apple.getState() === RecordState.DETACHED;//true
       *       fruits.getCount();//1
       *       fruits.at(0).get('name');//'Banana'
       *    });
       * </pre>
       */
      acceptChanges: function() {
         var toRemove = [];
         this.each(function(record, index) {
            switch (record.getState()) {
               case RecordState.DELETED:
                  toRemove.push(index);
                  break;
            }
            record.acceptChanges();
         });

         for (var index = toRemove.length - 1; index >= 0; index--) {
            this.removeAt(toRemove[index]);
         }
      },

      /**
       * Возвращает название свойства записи, содержащего первичный ключ
       * @return {String}
       * @see setIdProperty
       * @see idProperty
       * @example
       * Получим название свойства, содержащего первичный ключ:
       * <pre>
       *    var users = new RecordSet({
       *       idProperty: 'id'
       *    });
       *    users.getIdProperty();//'id'
       * </pre>
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Устанавливает название свойства записи, содержащего первичный ключ
       * @param {String} name
       * @see getIdProperty
       * @see idProperty
       * @example
       * Установим название свойства, содержащего первичный ключ:
       * <pre>
       *    var users = new RecordSet({
       *       rawData: [{
       *          id: 134,
       *          login: 'editor',
       *       }, {
       *          id: 257,
       *          login: 'shell',
       *       }]
       *    });
       *    users.setIdProperty('id');
       *    users.getRecordById(257).get('login');//'shell'
       * </pre>
       */
      setIdProperty: function (name) {
         if (this._$idProperty === name) {
            return;
         }

         this._$idProperty = name;
         this.each(function(record) {
            if (record.setIdProperty) {
               record.setIdProperty(name);
            }
         });
         this._notify('onPropertyChange', {idProperty: this._$idProperty});
      },

      /**
       * Возвращает запись по ключу.
       * Если записи с таким ключом нет - возвращает undefined.
       * @param {String|Number} id Значение первичного ключа.
       * @return {WS.Data/Entity/Record}
       * @example
       * Создадим рекордсет, получим запись по первичному ключу:
       * <pre>
       *    var users = new RecordSet({
       *       idProperty: 'id'
       *       rawData: [{
       *          id: 134,
       *          login: 'editor',
       *       }, {
       *          id: 257,
       *          login: 'shell',
       *       }]
       *    });
       *    users.getRecordById(257).get('login');//'shell'
       * </pre>
       */
      getRecordById: function (id) {
         return this.at(
            this.getIndexByValue(this._$idProperty, id)
         );
      },

      /**
       * Возвращает метаданные RecordSet'а.
       * Подробнее о метаданных смотрите в описании опции {@link meta}.
       * @return {Object} Метаданные.
       * @see meta
       * @see setMetaData
       */
      getMetaData: function () {
         if (!this._$metaData) {
            this._$metaData = {};

            var adapter = this._getRawDataAdapter();
            if (adapter._wsDataAdapterIMetaData) {//implements WS.Data/Adapter/IMetaData
               var meta = this._$metaData = {};
               adapter.getMetaDataDescriptor().forEach(function(format) {
                  var name = format.getName();
                  meta[name] = Factory.cast(
                     adapter.getMetaData(name),
                     this._getFieldType(format),
                     {
                        format: format,
                        adapter: this._getAdapter(),
                        idProperty: this._$idProperty
                     }
                  );
               }.bind(this));
            }
         }

         return this._$metaData;
      },

      /**
       * Устанавливает метаданные RecordSet'а.
       * Подробнее о метаданных смотрите в описании опции {@link meta}.
       * <ul>
       * <li>path - путь для хлебных крошек, возвращается как {@link WS.Data/Collection/RecordSet};</li>
       * <li>results - строка итогов, возвращается как {@link WS.Data/Entity/Record}. Подробнее о конфигурации списков для отображения строки итогов читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ этом разделе};</li>
       * <li>more - Boolean - есть ли есть записи для подгрузки (используется для постраничной навигации).</li>
       * </ul>
       * @param {Object} meta Метаданные.
       * @see meta
       * @see getMetaData
       */
      setMetaData: function (meta) {
         this._$metaData = meta;

         if (meta instanceof Object) {
            var adapter = this._getRawDataAdapter();
            if (adapter._wsDataAdapterIMetaData) {//implements WS.Data/Adapter/IMetaData
               adapter.getMetaDataDescriptor().forEach(function(format) {
                  var name = format.getName();
                  adapter.setMetaData(
                     name,
                     Factory.serialize(
                        meta[name],
                        {
                           format: format,
                           adapter: this.getAdapter()
                        }
                     )
                  );
               }.bind(this));
            }
         }

         this._notify('onPropertyChange', {metaData: meta});
      },

      /**
       * Объединяет два рекордсета.
       * @param {WS.Data/Collection/RecordSet} recordSet Рекордсет, с которым объединить
       * @param {MergeOptions} options Опции операций
       * @see assign
       * @see append
       * @see prepend
       * @see add
       * @see replace
       * @see remove
       */
      merge: function (recordSet, options) {
         //Backward compatibility for 'merge'
         if (options instanceof Object && options.hasOwnProperty('merge') && !options.hasOwnProperty('replace')) {
            options.replace = options.merge;
         }

         options = Object.assign({
            add: true,
            remove: true,
            replace: true,
            inject: false
         }, options || {});

         var count = recordSet.getCount(),
            idProperty = this._$idProperty,
            existsIdMap = {},
            newIdMap = {},
            toAdd = [],
            toReplace = [],
            toInject = [],
            record,
            id,
            index,
            i;

         this.each(function(record, index) {
            existsIdMap[record.get(idProperty)] = index;
         });

         for (i = 0; i < count; i++) {
            record = recordSet.at(i);
            id = record.get(idProperty);

            if (i === 0) {
               this._checkItem(record);
            }

            if (existsIdMap.hasOwnProperty(id)) {
               if (options.inject) {
                  index = existsIdMap[id];
                  if (!record.isEqual(this.at(index))) {
                     toInject.push([record, index]);
                  }
               } else if (options.replace) {
                  index = existsIdMap[id];
                  if (!record.isEqual(this.at(index))) {
                     toReplace.push([record, index]);
                  }
               }
            } else {
               if (options.add) {
                  toAdd.push(record);
               }
            }

            if (options.remove) {
               newIdMap[id] = true;
            }
         }

         if (toReplace.length) {
            for (i = 0; i < toReplace.length; i++) {
               this.replace(toReplace[i][0], toReplace[i][1]);
            }
         }

         if (toInject.length) {
            for (i = 0; i < toInject.length; i++) {
               record = this.at(toInject[i][1]);
               record.setRawData(toInject[i][0].getRawData());
            }
         }

         if (toAdd.length) {
            this.append(toAdd);
         }

         if (options.remove) {
            var toRemove = [];
            this.each(function (record, index) {
               if (!newIdMap.hasOwnProperty(record.get(idProperty))) {
                  toRemove.push(index);
               }
            });

            for (i = toRemove.length - 1; i >= 0; i--) {
               this.removeAt(toRemove[i]);
            }
         }
      },

      //endregion Public methods

      //region Deprecated methods

      /**
       * Возвращает отфильтрованный рекордсет.
       * @param {Function} filterCallback Функция обратного вызова, аргументом будет передана запись, для которой нужно вернуть признак true (запись прошла фильтр) или false (не прошла)
       * @return {WS.Data/Collection/RecordSet}
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.6, используйте {@link WS.Data/Chain/Abstract#filter}.
       */
      filter: function (filterCallback) {
         Utils.logger.stack(this._moduleName + '::filter(): method is deprecated and will be removed in 3.7.6. Use WS.Data/Chain/Abstract::filter() instead. See https://wi.sbis.ru/docs/WS/Data/Chain/Abstract/methods/filter/ for details.', 0, 'error');

         var filterDataSet = new RecordSet({
            adapter: this._$adapter,
            idProperty: this._$idProperty
         });

         this.each(function (record) {
            if (filterCallback(record)) {
               filterDataSet.add(record);
            }
         });

         return filterDataSet.clone();
      },

      //endregion Deprecated methods

      //region Protected methods

      /**
       * Вставляет сырые данные записей в сырые данные рекордсета
       * @param {WS.Data/Collection/IEnumerable|Array} items Коллекция записей
       * @param {Number} [at] Позиция вставки
       * @return {Array}
       * @protected
       */
      _addItemsToRawData: function (items, at) {
         var adapter = this._getRawDataAdapter(),
            item;

         items = this._itemsToArray(items);
         for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            adapter.add(
               item.getRawData(true),
               at === undefined ? undefined : at + i
            );
         }

         return items;
      },

      /**
       * Нормализует записи при добавлении в рекордсет: клонирует и приводит к формату рекордсета
       * @param {Array.<WS.Data/Entity/Record>} items Записи
       * @param {RecordState} [state] С каким состояним создать
       * @return {Array.<WS.Data/Entity/Record>}
       * @protected
       */
      _normalizeItems: function(items, state) {
         var formatDefined = this._hasFormat(),
            format,
            result = [],
            resultItem,
            item,
            i;
         for (i = 0; i < items.length; i++) {
            item = items[i];
            this._checkItem(item);

            if (!formatDefined && this.getCount() === 0) {
               format = item.getFormat(true);
            } else if (!format) {
               format = this._getFormat(true);
            }
            resultItem = this._normalizeItemData(item, format);

            if (state) {
               resultItem.setState(state);
            }

            result.push(resultItem);
         }

         return result;
      },

      /**
       * Возращает копию записи с сырыми данными, приведенными к нужному формату
       * @param {Array.<WS.Data/Entity/Record>} item Запись
       * @param {WS.Data/Format/Format} format Формат, к которому следует привести данные
       * @return {Array.<WS.Data/Entity/Record>}
       * @protected
       */
      _normalizeItemData: function(item, format) {
         var itemFormat = item.getFormat(true),
            result;

         if (format.isEqual(itemFormat)) {
            result = this._buildRecord(
               item.getRawData(true),
               new CowAdapter(this.getAdapter())
            );
         } else {
            var adapter = this.getAdapter().forRecord(null, this._getRawData()),
               itemAdapter = item.getAdapter().forRecord(
                  item.getRawData(true)
               );

            format.each(function(field, index) {
               var name = field.getName();
               adapter.addField(field, index);
               adapter.set(name, itemAdapter.get(name));
            });
            result = this._buildRecord(
               adapter.getData(),
               this.getAdapter()
            );
         }

         return result;
      },

      /**
       * Проверяет, что переданный элемент - это запись с идентичным форматом
       * @param {*} item Запись
       * @protected
       */
      _checkItem: function (item) {
         if (!item || !(item instanceof Record)) {
            throw new TypeError('Item should be an instance of WS.Data/Entity/Record');
         }
         checkNullId(item, this.getIdProperty());
         this._checkAdapterCompatibility(item.getAdapter());
      },

      /**
       * Создает новый экземпляр модели
       * @param {*} data Данные модели
       * @param {WS.Data/Adapter/IAdapter}|{String} [adapter] Какой адаптер использовать
       * @return {WS.Data/Entity/Record}
       * @protected
       */
      _buildRecord: function (data, adapter) {
         var record = Di.create(this._$model, {
            owner: this,
            writable: this.writable,
            state: RecordState.UNCHANGED,
            adapter: adapter || this._getAdapter(),
            rawData: data,
            idProperty: this._$idProperty
         });
         return record;
      },

      /**
       * Возвращает запись по индексу
       * @param {Number} at Индекс
       * @return {WS.Data/Entity/Record}
       * @protected
       */
      _getRecord: function (at) {
         if (at < 0 || at >= this._$items.length) {
            return undefined;
         }

         var record = this._$items[at];
         if (!record) {
            var adapter = this._getRawDataAdapter();
            record = this._$items[at] = this._buildRecord(
               adapter.at(at)
            );
            this._addChild(record);
            checkNullId(record, this.getIdProperty());
         }

         return record;
      },

      /**
       * Пересоздает элементы из сырых данных
       * @param {Object} data Сырые данные
       * @protected
       */
      _initByRawData: function() {
         var adapter = this._getRawDataAdapter();
         this._$items.length = 0;
         this._$items.length = adapter.getCount();
      }

      //endregion Protected methods
   });

   //Statics

   /**
    * Создает из рекордсета патч - запись с измененными, добавленными записями и ключами удаленных записей.
    * @param {WS.Data/Collection/RecordSet} items Исходный рекордсет
    * @param {Array.<String>} [names] Имена полей результирующей записи, по умолчанию ['changed', 'added', 'removed']
    * @return {WS.Data/Entity/Record} Патч
    */
   RecordSet.patch = function(items, names) {
      names = names || ['changed', 'added', 'removed'];

      var filter = function(state) {
            var result = new RecordSet({
               adapter: items.getAdapter(),
               idProperty: items.getIdProperty()
            });

            items.each(function(item) {
               result.add(item);
            }, state);

            return result;
         },
         getIds = function(items) {
            var result = [],
               idProperty = items.getIdProperty();

            items.each(function(item) {
               result.push(item.get(idProperty));
            });

            return result;
         },
         RecordState = Record.RecordState;

      var result = new Record({
         format: [
            {name: names[0], type: 'recordset'},
            {name: names[1], type: 'recordset'},
            {name: names[2], type: 'array', kind: 'string'}
         ],
         adapter: items.getAdapter()
      });
      result.set(names[0], filter(RecordState.CHANGED));
      result.set(names[1], filter(RecordState.ADDED));
      result.set(names[2], getIds(filter(RecordState.DELETED)));
      result.acceptChanges();

      return result;
   };

   //Aliases
   RecordSet.prototype.forEach = RecordSet.prototype.each;

   Di.register('collection.$recordset', RecordSet, {instantiate: false});
   Di.register('collection.recordset', RecordSet);

   return RecordSet;
});
