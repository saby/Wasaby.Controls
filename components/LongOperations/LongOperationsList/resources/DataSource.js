/**
 * Простая оболочка над SBIS3.CONTROLS.LongOperationsManager для имплементации интерфейса WS.Data/Source/ISource
 *
 * @class SBIS3.CONTROLS.LongOperationsListDataSource
 * @implements WS.Data/Source/ISource
 * @public
 */

define('js!SBIS3.CONTROLS.LongOperationsList/resources/DataSource',
   [
      'Core/core-extend',
      'js!WS.Data/Source/ISource',
      'js!WS.Data/Source/DataSet',
      'js!SBIS3.CONTROLS.LongOperationsManager',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'Core/TimeInterval'
   ],

   function (CoreExtend, ISource, DataSet, longOperationsManager, LongOperationEntry, TimeInterval) {
      'use strict';

      /**
       * Простая оболочка над SBIS3.CONTROLS.LongOperationsManager для имплементации интерфейса WS.Data/Source/ISource
       * @public
       * @type {object}
       */
      var LongOperationsListDataSource = CoreExtend.extend({}, [ISource], /** @lends SBIS3.CONTROLS.LongOperationsListDataSource.prototype */{
         _moduleName: 'SBIS3.CONTROLS.LongOperationsList/resources/DataSource',

         /*_$options: {
         },*/

         /**
          * Конструктор
          * @public
          */
         $constructor: function $LongOperationsListDataSource () {
         },



         /**
          * Возвращает конечную точку, обеспечивающую доступ клиента к функциональным возможностям источника данных.
          * @return {Endpoint}
          */
         /*###getEndpoint: function () {
         },*/

         /**
          * Возвращает соответствие методов CRUD+ контракту.
          * @return {Binding}
          */
         /*###getBinding: function () {
         },*/

         /**
          * Устанавливает соответствие методов CRUD+ контракту.
          * @param {Binding} binding
          */
         /*###setBinding: function (binding) {
         },*/

         /**
          * Возвращает адаптер для работы с данными.
          * @return {WS.Data/Adapter/IAdapter}
          */
         /*###getAdapter: function () {
         },*/

         /**
          * Устанавливает адаптер для работы с данными.
          * @param {String|WS.Data/Adapter/IAdapter} adapter
          */
         /*###setAdapter: function (adapter) {
         },*/

         /**
          * Возвращает конструктор записей, порождаемых источником данных.
          * @return {String|Function}
          */
         /*###getModel: function () {
         },*/

         /**
          * Устанавливает конструктор записей, порождаемых источником данных.
          * @param {String|Function} model
          */
         /*###setModel: function (model) {
         },*/

         /**
          * Возвращает конструктор рекордсетов, порождаемых источником данных.
          * @return {String|Function}
          */
         /*###getListModule: function () {
         },*/

         /**
          * Устанавливает конструктор списка моделей
          * @param {String|Function} listModule
          */
         /*###setListModule: function (listModule) {
         },*/

         /**
          * Возвращает название свойства модели, содержащего первичный ключ
          * @return {String}
          */
         /*###getIdProperty: function () {
         },*/

         /**
          * Устанавливает название свойства модели, содержащего первичный ключ
          * @param {String} name
          */
         /*###setIdProperty: function (name) {
         },*/

         /**
          * Возвращает имя поля, по которому по умолчанию сортируются записи выборки.
          * @return {String}
          */
         /*###getOrderProperty: function () {
         },*/

         /**
          * Устанавливает имя поля, по которому по умолчанию сортируются записи выборки.
          * @param {String} name
          */
         /*###setOrderProperty: function (name) {
         },*/

         /**
          * Возвращает дополнительные настройки источника данных.
          * @return {Object}
          */
         getOptions: function () {
            return {
               navigationType: 'Page'
            };
         },

         /**
          * Устанавливает дополнительные настройки источника данных.
          * @param {Object} options
          */
         /*###setOptions: function (options) {
         },*/

         /**
          * Создает пустую модель через источник данных (при этом она не сохраняется в хранилище)
          * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные, которые могут понадобиться для создания модели
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model}.
          */
         /*###create: function (meta) {
         },*/

         /**
          * Читает модель из источника данных
          * @param {String} key Первичный ключ модели
          * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model}.
          */
         /*###read: function (key, meta) {
         },*/

         /**
          * Обновляет модель в источнике данных
          * @param {WS.Data/Entity/Model|WS.Data/Collection/RecordSet} data Обновляемая запись или рекордсет
          * @param {Object} [meta] Дополнительные мета данные
          * @return {Core/Deferred} Асинхронный результат выполнения
          */
         /*###update: function (data, meta) {
         },*/

         /**
          * Удаляет модель из источника данных
          * @param {String|Array} keys Первичный ключ, или массив первичных ключей модели
          * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные
          * @return {Core/Deferred} Асинхронный результат выполнения
          */
         /*###destroy: function (keys, meta) {
         },*/

         /**
          * Объединяет одну модель с другой
          * @param {String} from Первичный ключ модели-источника (при успешном объедининии модель будет удалена)
          * @param {String} to Первичный ключ модели-приёмника
          * @return {Core/Deferred} Асинхронный результат выполнения
          */
         /*###merge: function (from, to) {
         },*/

         /**
          * Создает копию модели
          * @param {String} key Первичный ключ модели
          * @param {Object} [meta] Дополнительные мета данные
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model копия модели}.
          */
         /*###copy: function (key, meta) {
         },*/

         /**
          * Выполняет запрос на выборку
          * @param {WS.Data/Query/Query} [query] Запрос
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
          */
         query: function (query) {
            var options = {};
            var filter = query.getWhere();
            if (filter) {
               var where = {};
               if (filter.status) {
                  var STATUSES = LongOperationEntry.STATUSES;
                  switch (filter.status) {
                     case 'running':
                     case 'suspended':
                     case 'ended':
                        where.status = STATUSES[filter.status];
                        break;
                     case 'not-suspended':
                        where.status = [STATUSES.running, STATUSES.ended];
                        break;
                     case 'success-ended':
                        where.status = STATUSES.ended;
                        where.isFailed = null;
                        break;
                     case 'error-ended':
                        where.status = STATUSES.ended;
                        where.isFailed = true;
                        break;
                  }
               }
               if (filter.period) {
                  where.startedAt = {condition:'>=', value:(new TimeInterval(filter.period)).subFromDate(new Date())};
               }
               if (filter.duration) {
                  where.timeSpent = {condition:'>=', value:(new TimeInterval(filter.duration)).getTotalMilliseconds()};
               }
               if (filter['СтрокаПоиска']) {
                  where.title = {condition:'contains', value:filter['СтрокаПоиска'], sensitive:false};
                  /*if (filter.usePages) {
                  }*/
               }
               if (filter.UserId) {
                  where.userId = filter.UserId;
               }
               if (Object.keys(where).length) {
                  options.where = where;
               }
            }
            var sorting = query.getOrderBy();
            if (sorting && sorting.length) {
               options.orderBy = sorting;
            }
            var offset = query.getOffset();
            if (0 <= offset) {
               options.offset = offset;
            }
            var limit = query.getLimit();
            if (0 < limit) {
               options.limit = limit;
            }
            if (filter.needUserInfo) {
               options.extra = {needUserInfo:true};
            }
            return longOperationsManager.fetch(Object.keys(options).length ? options : null).addCallback(function (recordSet) {
               var meta = recordSet.getMetaData()
               var dataSet = new DataSet({
                  rawData: {
                     items: recordSet.getRawData(),
                     more: meta && meta.more
                  },
                  idProperty: recordSet.getIdProperty(),
                  itemsProperty: 'items',
                  totalProperty: 'more',
                  model: recordSet.getModel()
               });
               return dataSet;
            });
         }//###,

         /**
          *
          * Вызывает метод (только для RPC источников)
          * @param {String} command Имя метода
          * @param {Object} [data] Аргументы
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
          */
         /*###call: function (command, data) {
         },*/

         /**
          * Производит перемещение записи.
          * @param {Array} items Перемещаемая модель.
          * @param {String} target Идентификатор целевой записи, относительно которой позиционируются перемещаемые.
          * @param {MoveMetaConfig} [meta] Дополнительные мета данные.
          * @return {Core/Deferred} Асинхронный результат выполнения.
          */
         /*###remove: function (items, target, meta) {
         }*/
      });



      return LongOperationsListDataSource;
   }
);
