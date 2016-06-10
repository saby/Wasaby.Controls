/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.RecordSet', [
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.FormattableMixin',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Model'
], function (
   ObservableList,
   SerializableMixin,
   FormattableMixin,
   Di,
   Utils
) {
   'use strict';

   /**
    * Список записей, имеющих общий формат полей.
    * @class SBIS3.CONTROLS.Data.Collection.RecordSet
    * @extends SBIS3.CONTROLS.Data.Collection.ObservableList
    * @mixes SBIS3.CONTROLS.Data.FormattableMixin
    * @ignoreOptions items
    * @author Мальцев Алексей
    * @public
    */

   var RecordSet = ObservableList.extend([FormattableMixin], /** @lends SBIS3.CONTROLS.Data.Collection.RecordSet.prototype */{
     /**
      * @typedef {Object} OperationOptions
      * @property {Boolean} [add=true] Добавлять новые записи.
      * @property {Boolean} [remove=false] Удалять отсутствующие записи.
      * @property {Boolean} [merge=true] Объединять одинаковые записи.
      */

     /**
      * @typedef {String} RecordStatus
      * @variant actual В переборе функции {@link each} будут использованы только актуальные записи RecordSet'а.
      * @variant all В переборе функции {@link each} будут использованы все записи RecordSet'а.
      * @variant created В переборе функции {@link each} будут использованы только новые записи RecordSet'а.
      * @variant deleted В переборе функции {@link each} будут использованы только удалённые записи RecordSet'а. Статус удалённых записей устанавливают с помощью метода {@link removeRecords}.
      * @variant changed В переборе функции {@link each} будут использованы только изменённые записи RecordSet'а.
      */

      _moduleName: 'SBIS3.CONTROLS.Data.Collection.RecordSet',

      _compatibleConstructor: true,//Чтобы в наследниках с "old style extend" звался нативный constructor()

      /**
       * @cfg {String|Function} Конструктор модели
       * @name SBIS3.CONTROLS.Data.Collection.RecordSet#model
       * @see getModel
       * @see SBIS3.CONTROLS.Data.Record
       * @see SBIS3.CONTROLS.Data.Model
       * @see SBIS3.CONTROLS.Data.Di
       * @example
       * <pre>
       *    var User = Model.extend({
       *       identify: function(login, password) {
       *       }
       *    });
       *    Di.register('model.user', User);
       *    //...
       *    var user = new RecordSet({
       *       model: 'model.user'
       *    });
       * </pre>
       * @example
       * <pre>
       *    var User = Model.extend({
       *       identify: function(login, password) {
       *       }
       *    });
       *    //...
       *    var user = new RecordSet({
       *       model: User
       *    });
       * </pre>
       */
      _$model: 'model',

      /**
       * @cfg {String} Поле модели, содержащее первичный ключ
       * @name SBIS3.CONTROLS.Data.Collection.RecordSet#idProperty
       * @see getIdProperty
       * @example
       * <pre>
       *    var dataSource = new RecordSet({
       *       idProperty: 'primaryId'
       *    });
       * </pre>
       */
      _$idProperty: '',

      /**
       * @cfg {Object} Метаданные
       * @name SBIS3.CONTROLS.Data.Collection.RecordSet#meta
       * @see getMetaData
       * @see setMetaData
       */
      _$meta: null,

      /**
       * @member {Object} индексы
       */
      _indexTree: null,

     /**
      * //TODO надо убрать в 3.7.4
      * @member флаг  показывает проверять ли формат при изменении рекордсета
      */
     _doNotFormatCheck: false,

      constructor: function $RecordSet(options) {
         if (options) {
            if ('data' in options && !('rawData' in options)) {
               this._$rawData = options.data;
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "data" is deprecated and will be removed in 3.7.4. Use "rawData" instead.', 1);
            }
            if ('strategy' in options && !('adapter' in options)) {
               this._$adapter = options.strategy;
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.', 1);
            }
            if ('keyField' in options && !('idProperty' in options)) {
               this._$idProperty = options.keyField;
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.', 1);
            }
            if ('items' in options) {
               Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet: option "items" is not acceptable. Use "rawData" instead.', 1);
            }
         }

         RecordSet.superclass.constructor.call(this, options);
         FormattableMixin.constructor.call(this, options);

         if (!this._$idProperty) {
            this._$idProperty = this.getAdapter().getKeyField(this._$rawData);
         }
         this._indexTree = {};
         this._$meta = this._$meta || {};
         if (this._$rawData) {
            this._assignRawData(this._$rawData, true);
            this._createFromRawData();
         }
      },

      // region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function(state) {
         state = RecordSet.superclass._getSerializableState.call(this, state);
         state = FormattableMixin._getSerializableState.call(this, state);
         delete state.$options.items;
         return state;
      },

      _setSerializableState: function(state) {
         return RecordSet.superclass._setSerializableState(state)
            .callNext(
               FormattableMixin._setSerializableState(state)
            )
            .callNext(function() {
               this._clearServiceEnumerator();
            });
      },

      //endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region SBIS3.CONTROLS.Data.FormattableMixin

      setRawData: function(data) {
         this._assignRawData(data);
         this._createFromRawData();
      },

      addField: function(format, at, value) {
         format = this._buildField(format);
         FormattableMixin.addField.call(this, format, at);

         var name = format.getName(),
            methodName = 'addField';
         this.each(function(record) {
            record.notifyFormatChanged(methodName, arguments);
            if (value !== undefined) {
               record.set(name, value);
            }
         });
      },

      removeField: function(name) {
         FormattableMixin.removeField.call(this, name);

         var methodName = 'removeField';
         this.each(function(record) {
            record.notifyFormatChanged(methodName, arguments);
         });
      },

      removeFieldAt: function(at) {
         FormattableMixin.removeFieldAt.call(this, at);

         var methodName = 'removeFieldAt';
         this.each(function(record) {
            record.notifyFormatChanged(methodName, arguments);
         });
      },

      /**
       * Создает адаптер для сырых данных
       * @returns {SBIS3.CONTROLS.Data.Adapter.ITable}
       * @protected
       */
      _createRawDataAdapter: function () {
         return this.getAdapter().forTable(this._$rawData);
      },

      /**
       * Переустанавливает сырые данные
       * @param {Object} data Данные в "сыром" виде
       * @param {Boolean} [keepFormat=false] Сохранить формат
       * @protected
       */
      _assignRawData: function(data, keepFormat) {
         FormattableMixin.setRawData.call(this, data);
         if (!keepFormat) {
            this._clearFormat();
         }
      },

      //endregion SBIS3.CONTROLS.Data.FormattableMixin

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      /**
       * Перебирает все записи рекордсета.
       * @param {Function} iterateCallback Функция обратного вызова, аргументами будут  переданы запись и ее позиция.
       * @param {RecordStatus} [status=actual] Селектор состояния выбираемых записей.
       */
      each: function (iterateCallback, status) {
         var length = this.getCount();
         for (var i = 0; i < length; i++) {
            var record = this.at(i);
            switch (status) {
               case 'all':
                  iterateCallback.call(this, record, i);
                  break;
               case 'created':
                  if (record.isCreated()) {
                     iterateCallback.call(this, record, i);
                  }
                  break;
               case 'deleted':
                  if (record.isDeleted()) {
                     iterateCallback.call(this, record, i);
                  }
                  break;
               case 'changed':
                  if (record.isChanged()) {
                     iterateCallback.call(this, record, i);
                  }
                  break;
               default :
                  if (!record.isDeleted()) {
                     iterateCallback.call(this, record, i);
                  }
            }
         }
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region Public methods

      /**
       * Синхронизирует изменения в RecordSet'е с источником данных.
       * @remark
       * Синхронизация производится по следующим правилам:
       * <ul>
       * <li>Записи, отмеченные удаленными через {@link removeRecord}, будут удалены в источнике данных;</li>
       * <li>Обновленные записи будут обновлены в источнике данных;</li>
       * <li>Добавленные записи будут добавлены в источник данных.</li>
       * </ul>
       * @param {SBIS3.CONTROLS.Data.Source.ISource} dataSource Источник данных.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения.
       * @deprecated Метод будет удалён в версии платформы СБИС 3.7.4.
       */
      saveChanges: function(dataSource) {
         //TODO: refactor after migration to SBIS3.CONTROLS.Data.Source.ISource
         var syncCompleteDef = new $ws.proto.ParallelDeferred(),
            self = this,
            position = 0,
            willRemove = [];
         this.each(function(record) {
            if (record.isDeleted() && !record.isSynced()) {
               record.setSynced(true);
               syncCompleteDef.push(dataSource.destroy(record.get(self._$idProperty)).addCallback(function() {
                  willRemove.push(record);
                  return record;
               }));
            } else if (record.isChanged() || (!record.isStored() && !record.isSynced())) {
               syncCompleteDef.push(dataSource.update(record).addCallback(function() {
                  record.applyChanges();
                  record.setStored(true);
                  return record;
               }));
            }
            position++;
         }, 'all');

         syncCompleteDef.done(true);
         return syncCompleteDef.getResult(true).addCallback(function(){
            $ws.helpers.map(willRemove, self.remove, self);
            self._getServiceEnumerator().reIndex();
         });
      },

      /**
       * Возвращает конструктор модели
       * @returns {String|Function}
       * @see model
       * @see SBIS3.CONTROLS.Data.Model
       * @see SBIS3.CONTROLS.Data.Di
       */
      getModel: function () {
         return this._$model;
      },

      /**
       * Возвращает свойство модели, содержащее первичный ключ
       * @returns {String}
       * @see setIdProperty
       * @see idProperty
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Устанавливает свойство модели, содержащее первичный ключ
       * @param {String} name
       * @see getIdProperty
       * @see idProperty
       */
      setIdProperty: function (name) {
         this._$idProperty = name;
      },

      /**
       * Возвращает запись по ключу.
       * @param {String|Number} id Первичный ключ записи.
       * @returns {SBIS3.CONTROLS.Data.Model}
       */
      getRecordById: function (id) {
         return this.at(
            this.getIndexByValue(this._$idProperty, id)
         );
      },

      /**
       * Возвращает запись по ключу
       * @param {String|Number} key Первичный ключ записи.
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @see getRecordById
       * @deprecated Метод будет удалён в версии платформы СБИС 3.7.4. Используйте метод getRecordById.
       */
      getRecordByKey: function (key) {
         return this.getRecordById(key);
      },

      /**
       * Проверяет эквивалентность формата и записей другого рекордсета (должны совпадать данные каждой записи).
       * @param {SBIS3.CONTROLS.Data.Collection.RecordSet} recordset Рекордсет, эквивалентность которого проверяется
       * @returns {Boolean}
       */
      isEqual: function (recordset) {
         if (recordset === this) {
            return true;
         }
         if (!recordset) {
            return false;
         }
         if (!$ws.helpers.instanceOfModule(recordset, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            return false;
         }
         //TODO: когда появятся форматы, сделать через сравнение форматов и записей
         return $ws.helpers.isEqualObject(
            this.getRawData(),
            recordset.getRawData()
         );
      },

      /**
       * Возвращает метаданные RecordSet'а.
       * @remark
       * Метаданные - это дополнительная информация, не связанная с RecordSet'ом напрямую.
       * Она используется механизмами списков для построения строки итогов, хлебных крошек и постраничной навигации.
       * Существуют три служебных поля в метаданных:
       * <ul>
       * <li>path - путь для хлебных крошек, возвращается как {@link SBIS3.CONTROLS.Data.Collection.RecordSet};</li>
       * <li>results - строка итогов, возвращается как {@link SBIS3.CONTROLS.Data.Model}. Подробнее о конфигурации списков для отображения строки итогов читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ этом разделе};</li>
       * <li>more - Boolean - есть ли есть записи для подгрузки (используется для постраничной навигации).</li>
       * </ul>
       * @returns {Object} Метаданные.
       * @see meta
       * @see setMetaData
       */
      getMetaData: function () {
         if (this._$meta &&
            this._$meta.path &&
            !$ws.helpers.instanceOfModule(this._$meta.path, 'SBIS3.CONTROLS.Data.Collection.RecordSet')
         ) {
            this._$meta.path = new RecordSet({
               adapter: this.getAdapter(),
               rawData: this._$meta.path,
               idProperty: this._$idProperty
            });
         }

         if (this._$meta &&
            this._$meta.results &&
            !$ws.helpers.instanceOfModule(this._$meta.results, 'SBIS3.CONTROLS.Data.Model')
         ) {
            this._$meta.results = Di.resolve('model', {
               adapter: this.getAdapter(),
               rawData: this._$meta.results,
               idProperty: this._$idProperty
            });
         }

         return this._$meta;
      },

      /**
       * Устанавливает метаданные RecordSet'а.
       * @remark
       * Метаданные - это дополнительная информация, не связанная с RecordSet'ом напрямую.
       * Она используется механизмами списков для построения строки итогов, хлебных крошек и постраничной навигации.
       * Существуют три служебных поля в метаданных:
       * <ul>
       * <li>path - путь для хлебных крошек, возвращается как {@link SBIS3.CONTROLS.Data.Collection.RecordSet};</li>
       * <li>results - строка итогов, возвращается как {@link SBIS3.CONTROLS.Data.Model}. Подробнее о конфигурации списков для отображения строки итогов читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-visual-display/results/ этом разделе};</li>
       * <li>more - Boolean - есть ли есть записи для подгрузки (используется для постраничной навигации).</li>
       * </ul>
       * @param {Object} meta Метаданные.
       * @see meta
       * @see getMetaData
       */
      setMetaData: function (meta) {
         this._$meta = meta;
      },

      //endregion Public methods

      //region Deprecated methods

      /**
       * Помечает запись, как удаленную, но не производит её удаление из RecordSet. Помеченная таким образом запись не будет доступна в методе {@link each}, вызванном с аргументами по умолчанию.
       * @param {String|Number} key Первичный ключ записи.
       * @deprecated Метод будет удалён в версии платформы СБИС 3.7.4.
       */
      removeRecord: function (key) {
         var self = this;
         var mark = function (key) {
            var record = self.getRecordById(key);
            if (record) {
               record.setDeleted(true);
            }
         };

         if (key instanceof Array) {
            var length = key.length;
            for (var i = 0; i < length; i++) {
               mark(key[i]);
            }
         } else {
            mark(key);
         }
      },

      /**
       * Возвращает индекс элемента по ключу
       * @param id
       * @returns {*}
       * @deprecated метод будет удален в 3.7.4 используйте getIndex(getRecordById())
       */
      getIndexById: function (id) {
         return this.getIndexByValue(this._$idProperty, id);
      },

      /**
       * Возвращает ключ записи по ее порядковому номеру в RecordSet'е.
       * @param {Number} index Порядковый номер записи в RecordSet.
       * @returns {String|Number} Первичный ключ записи.
       * @see at
       * @see getId
       * @deprecated Метод будет удалён в версии платформы СБИС 3.7.4. Вместо него используйте at().getId().
       */
      getRecordKeyByIndex: function (index) {
         var item = this.at(index);
         return item && $ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Record') ? item.get(this._$idProperty) : undefined;
      },

      /**
       * Возвращает стратегию работы с сырыми данными.
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @see getAdapter
       * @see rawData
       * @deprecated метод будет удален в 3.7.4 используйте getAdapter()
       */
      getStrategy: function () {
         Utils.logger.stack('SBIS3.CONTROLS.Data.Collection.RecordSet:getStrategy(): method is deprecated and will be removed in 3.7.4. Use "getAdapter()" instead.');
         return this.getAdapter();
      },

      /**
       * Объединяет два рекордсета.
       * @param {SBIS3.CONTROLS.Data.Collection.RecordSet} recordSetMergeFrom
       * @param {OperationOptions} options Опции операций
       * @see add
       * @see replace
       * @see remove
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.4. Используйте метод add, replace, remove
       */
      merge: function (recordSetMergeFrom, options) {
         this._setRecords(recordSetMergeFrom._getRecords(), options);
      },

      /**
       * Добавляет запись в рекордсет
       * @param {SBIS3.CONTROLS.Data.Model} record
       * @deprecated метод будет удален в 3.7.4, используйте add()
       */
      push: function (record) {
         if (!$ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Record')) {
            record = this._getModelInstance(record);
         }
         this.add(record);
      },

      /**
       * Вставляет запись в RecordSet. Если запись с таким ключем существует, то старая будет заменена.
       * @param {SBIS3.CONTROLS.Data.Model} record
       * @param {Number} at Позиция вставки
       * @see add
       * @see replace
       * @deprecated  Метод будет удален в версии платформы СБИС 3.7.4. Используйте методы add или replace.
       */
      insert: function (record, at) {
         var existsAt = this.getIndex(record);
         if (existsAt === -1) {
            this.add(record, at);
         } else {
            this.replace(record, existsAt);
         }
      },

      /**
       * Возвращает иерархический индекс для указанного поля.
       * При вызове с принудительной переиндескации будет выполнен полный обход данных для построения нового индекса.
       * @param {String} field Имя поля, по которому строится иерархия
       * @param {Boolean} [reindex=false] Принудительно переиндексировать
       * @returns {Object.<String|Number, Array.<String|Number>>}
       * @see SBIS3.CONTROLS.Data.Projection.Tree#getChildren
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.4. Используйте SBIS3.CONTROLS.Data.Projection.Tree::getChildren()
       */
      getTreeIndex: function(field, reindex){
         if (reindex || (Object.isEmpty(this._indexTree) && field)){
            this._reindexTree(field);
         }
         return this._indexTree;
      },

      /**
       * Возвращает набор дочерних элементов для указанного родителя.
       * @param {String|Number} parentId Идентификатор родителя.
       * @param {Boolean} getFullBranch Выбирать рекурсивно (в ответ попадут все потомки ветки дерева с указанным parentId).
       * @param {String} field Имя поля, по которому строится иерархия.
       * @returns {Array.<String|Number>}
       * @see SBIS3.CONTROLS.Data.Projection.Tree#getChildren
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.4. Используйте SBIS3.CONTROLS.Data.Projection.Tree::getChildren()
       */
      getChildItems: function (parentId, getFullBranch, field) {
         if(Object.isEmpty(this._indexTree)) {
            this._reindexTree(field);
         }
         parentId = parentId === undefined ? null : parentId;
         if (this._indexTree.hasOwnProperty(parentId)) {
            if (getFullBranch) {
               var fillChildren = function (newParent) {
                     parents.push(newParent);
                     childs.push(newParent);
                  },
                  curParent = parentId,
                  parents = [],
                  childs = [];

               do {
                  $ws.helpers.forEach(this._indexTree[curParent], fillChildren);
                  if (parents.length) {
                     curParent = Array.remove(parents, 0);
                  } else {
                     curParent = null;
                  }
               } while (curParent);
               return childs;
            }
            return this._indexTree[parentId];
         } else {
            return [];
         }
      },

      /**
       * Возвращает признак наличия дочерних записей.
       * @param {String|Number} parentId Идентификатор записи, для которой производится проверка наличия дочерних записей.
       * @param {String} field Имя поля, по которому строится иерархия
       * @returns {Boolean}
       * @see SBIS3.CONTROLS.Data.Projection.Tree#getChildren
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.4. Используйте SBIS3.CONTROLS.Data.Projection.Tree::getChildren()
       */
      hasChild: function (parentKey, field) {
         if(Object.isEmpty(this._indexTree)) {
            this._reindexTree(field);
         }
         return this._indexTree.hasOwnProperty(parentKey);
      },

      /**
       * Возвращает идентификатор родителя.
       * @param {SBIS3.CONTROLS.Data.Model} record Запись, для которой нужно получить идентфикатор родителя
       * @param {String} field Имя поля, по которому строится иерархия
       * @returns {String|Number}
       * @see SBIS3.CONTROLS.Data.Projection.Tree#getParent
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.4. Используйте SBIS3.CONTROLS.Data.Projection.TreeItem::getParent()
       */
      getParentKey: function (record, field) {
         return record.get(field);
      },

      /**
       * Возвращает отфильтрованный рекордсет.
       * @param {Function} filterCallback Функция обратного вызова, аргументом будет передана запись, для которой нужно вернуть признак true (запись прошла фильтр) или false (не прошла)
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet}
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.4.
       */
      filter: function (filterCallback) {
         var filterDataSet = new RecordSet({
            adapter: this._$adapter,
            idProperty: this._$idProperty
         });

         this.each(function (record) {
            if (filterCallback(record)) {
               filterDataSet.push(record);
            }
         });

         return filterDataSet;
      },

      /**
       * Возвращает массив записей
       * @returns {Array.<SBIS3.CONTROLS.Data.Model>}
       * @protected
       * @deprecated метод будет удален в 3.7.4 используйте each()
       */
      _getRecords: function() {
         return this.toArray();
      },

      /**
       * Устанавливает новые записи
       * @param {Array.<SBIS3.CONTROLS.Data.Model>} records Новые записи
       * @param {OperationOptions} options Опции операций
       * @protected
       * @deprecated метод будет удален в 3.7.4
       */
      _setRecords: function (records, options) {
         options = $ws.core.merge(options || {}, {add: true, remove: true, merge: true}, {preferSource: true});

         var id, i, length,
            recordsMap = {},
            toAdd = [],
            toReplace = {};
         var l = 0, l1 = 0;
         for (i = 0, length = records.length; i < length; i++) {
            if (i === 0) {
               //todo проверяем формат только первого элемента надо убрать в 3.7.4
               this._checkItem(records[i]);
               this._doNotFormatCheck = true;
            }
            id = records[i].get(this._$idProperty);
            recordsMap[id] = true;
            var index = this.getIndexByValue(this._$idProperty, id);
            if (index > -1) {
               toReplace[index] = records[i];
               l++;
            } else {
               toAdd.push(records[i]);
               l1++;
            }
         }
         if(options.merge) {
            for(i in toReplace){
               if (toReplace.hasOwnProperty(i)) {
                  this.replace(toReplace[i], +i, false);
               }
            }
         }
         if (options.add) {
            this.append(toAdd);
         }
         if (options.remove) {
            var self = this,
               newItems = [];
            this.each(function (record) {
               var key = record.get(self._$idProperty);
               if (recordsMap[key]) {
                  newItems.push(record);
               }
            }, 'all');
            if(newItems.length < this.getCount()) {
               this.assign(newItems);
            }
         }
         this._doNotFormatCheck = false;
      },

      /**
       * Переиндесирует иерархию
       * @param {String} field Имя поля, по которому строится иерархия
       * @protected
       * @deprecated метод будет удален в 3.7.4
       */
      _reindexTree: function (field) {
         this._reindex();
         var self = this,
            parentKey,
            childKey;
         if (field === this.getIdProperty()) {
            throw new Error('Hierarchy field "' + field + '" can\'t be same as primary key field.');
         }
         this.each(function (record) {
            parentKey = null;
            if (field) {
               parentKey = self.getParentKey(record, field);
               if (parentKey === undefined) {
                  parentKey = null;
               }
            }
            if (!this._indexTree.hasOwnProperty(parentKey)) {
               this._indexTree[parentKey] = [];
            }
            childKey = record.get(self._$idProperty);
            if (parentKey === childKey) {
               throw new Error('Record with hierarchy field "' + field + '" = ' + parentKey + ' is related to itself.');
            }
            this._indexTree[parentKey].push(childKey);
         }, 'all');
      },

      //endregion Deprecated methods

      //region SBIS3.CONTROLS.Data.Collection.List

      clear: function () {
         for (var i = 0, count = this._$items.length; i < count; i++) {
            this._$items[i].setOwner(null);
         }
         this._getRawDataAdapter().clear();
         RecordSet.superclass.clear.call(this);
         this._indexTree = {};
      },

      add: function (item, at) {
         this._checkItem(item, !!this._$format || this.getCount() > 0);
         this._getRawDataAdapter().add(item.getRawData(), at);
         RecordSet.superclass.add.call(this, item, at);
         item.setOwner(this);
         this._indexTree = {};
      },

      remove: function (item) {
         this._checkItem(item, false);
         item.setOwner(null);
         this._indexTree = {};
         return RecordSet.superclass.remove.call(this, item);
      },

      removeAt: function (index) {
         this._getRawDataAdapter().remove(index);
         var item = this._$items[index];
         if (item) {
            item.setOwner(null);
         }
         RecordSet.superclass.removeAt.call(this, index);
         this._indexTree = {};
      },

      replace: function (item, at, checkFormat) {
         this._checkItem(item, checkFormat);
         item.setOwner(this);
         this._getRawDataAdapter().replace(item.getRawData(), at);
         RecordSet.superclass.replace.call(this, item, at);
         this._indexTree = {};
      },

      assign: function (items) {
         this._resetRawDataAdapter();
         this._$rawData = null;
         items = this._addItemsToRawData(items, undefined, true);
         RecordSet.superclass.assign.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
         this._indexTree = {};
      },

      append: function (items) {
         items = this._addItemsToRawData(items);
         RecordSet.superclass.append.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
         this._indexTree = {};
      },

      prepend: function (items) {
         items = this._addItemsToRawData(items, 0);
         RecordSet.superclass.prepend.call(this, items);
         for (var i = 0, count = items.length; i < count; i++) {
            items[i].setOwner(this);
         }
         this._indexTree = {};
      },

      //endregion SBIS3.CONTROLS.Data.Collection.List

      //region Protected methods

      /**
       * Вставляет сырые данные записей в сырые данные рекордсета
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable|Array} items Коллекция записей
       * @param {Number} [at] Позиция вставки
       * @param {Boolean} [replace=false] Режим полной замены
       * @returns {Array}
       * @protected
       */
      _addItemsToRawData: function (items, at, replace) {
         var isRecordSet  = items && $ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Collection.RecordSet'),
            isEqualFormat = this._isEqualItemsFormat(items, replace),
            hasFormat = !!this._$format,
            hasItems = replace ? false : this.getCount() > 0,
            adapter = this._getRawDataAdapter(),
            item;

         items = this._itemsToArray(items);
         for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (!isRecordSet && !isEqualFormat) {
               this._checkItem(
                  item,
                  hasFormat || hasItems || i > 0
               );

            }
            adapter.add(
               item.getRawData(),
               at === undefined ? undefined : at + i
            );
         }

         return items;
      },

      /**
       * Возвращает признак, что коллекция является рекордсетом с эквивалентным форматом
       * @param {SBIS3.CONTROLS.Data.Collection.IEnumerable|Array} [items] Коллекция
       * @param {Boolean} [replace=false] Режим полной замены
       * @returns {Boolean}
       * @protected
       */
      _isEqualItemsFormat: function (items, replace) {
         if (items && $ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            if (replace) {
               return true;
            }
            if (this._getFormat().isEqual(items.getFormat())) {
               return true;
            }
            Utils.logger.info(this._moduleName +': the outer recordset format is not equal to the recordset format');
         }
         return false;
      },

      /**
       * Проверяет, что переданный элемент - это запись с идентичным форматом
       * @param {*} item Запись
       * @param {Boolean} [checkFormat=true] Проверять формат
       * @protected
       */
      _checkItem: function (item, checkFormat) {
         if (!item || !$ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Record')) {
            throw new Error('Item should be an instance of SBIS3.CONTROLS.Data.Record');
         }
         if ((checkFormat === undefined || checkFormat === true) &&
            !this._doNotFormatCheck &&
            !this._getFormat().isEqual(item.getFormat())
         ) {
            Utils.logger.info(this._moduleName + ': the record format is not equal to the recordset format');
         }
      },

      /**
       * Создает новый экземпляр модели
       * @param {*} data Данные модели
       * @returns {SBIS3.CONTROLS.Data.Record}
       * @protected
       */
      _getModelInstance: function (data) {
         var model = Di.resolve(this._$model, {
            owner: this,
            adapter: this.getAdapter(),
            rawData: data,
            idProperty: this._$idProperty
         });
         model.setStored(true);
         return model;
      },

      /**
       * Пересоздает элементы из сырых данных
       * @param {Object} data Сырые данные
       * @protected
       */
      _createFromRawData: function() {
         RecordSet.superclass.clear.call(this);
         var adapter = this._getRawDataAdapter(),
            count = adapter.getCount(),
            record;
         for (var i = 0; i < count; i++) {
            record = this._getModelInstance(adapter.at(i));
            RecordSet.superclass.add.call(this, record);
         }
         this._resetIndexTree();
      },

      _reindex: function() {
         this._resetIndexTree();
         RecordSet.superclass._reindex.call(this);
      },

      /**
       * сбрасывает индекс
       */
      _resetIndexTree: function(){
         this._indexTree = {};
      }
      //endregion Protected methods
   });

   SerializableMixin._checkExtender(RecordSet);

   Di.register('collection.recordset', RecordSet);

   return RecordSet;
});
