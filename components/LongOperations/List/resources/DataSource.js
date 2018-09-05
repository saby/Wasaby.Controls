/**
 * Простая оболочка над SBIS3.CONTROLS/LongOperations/Manager для имплементации интерфейса WS.Data/Source/ISource
 *
 * @class SBIS3.CONTROLS/LongOperations/List/resources/DataSource
 * @implements WS.Data/Source/ISource
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/LongOperations/List/resources/DataSource',
   [
      'Core/core-extend',
      'Core/Deferred',
      'WS.Data/Source/ISource',
      'WS.Data/Entity/ObservableMixin',
      'WS.Data/Source/DataSet',
      'SBIS3.CONTROLS/LongOperations/Manager',
      'SBIS3.CONTROLS/LongOperations/Entry',
      'Core/TimeInterval'
   ],

   function (CoreExtend, Deferred, ISource, ObservableMixin, DataSet, longOperationsManager, LongOperationEntry, TimeInterval) {
      'use strict';



      /**
       * Увеличение лимита при наличии предусловий
       * @private
       * @type {number}
       */
      var _CUSTOM_CONDITION_EXTENSION = 4;

      /**
       * Простая оболочка над SBIS3.CONTROLS/LongOperations/Manager для имплементации интерфейса WS.Data/Source/ISource
       * @public
       * @type {WS.Data/Source/ISource}
       */
      var LongOperationsListDataSource = CoreExtend.extend({}, [ISource, ObservableMixin], /** @lends SBIS3.CONTROLS/LongOperations/List/resources/DataSource.prototype */{
         _moduleName: 'SBIS3.CONTROLS/LongOperations/List/resources/DataSource',

         $protected: {
            _options: {
               customConditions: [],
               navigationType: 'Page'
            },
            // Очередь незавершённых запросов
            _queue: []
         },

         $constructor: function $LongOperationsListDataSource () {
            this._publish('onBeforeProviderCall');
         },

         /**
          * Возвращает дополнительные настройки источника данных.
          * @return {Object}
          */
         getOptions: function () {
            return this._options;
         },

         /**
          * Возвращает дополнительные настройки источника данных.
          * @param {Object}
          */
         setOptions: function (options) {
            this._options = options;
         },

         /**
          * Выполняет запрос на выборку
          * @param {WS.Data/Query/Query} [query] Запрос
          * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
          */
         query: function (query) {
            var queue = this._queue;
            var queueItem = {
               query: query,
               //callPromise: undefined,
               resultPromise: new Deferred()
            };
            queue.push(queueItem);
            if (queue.length === 1) {
               this._nextQuery();
            }
            return queueItem.resultPromise;
         },

         _nextQuery: function () {
            var queue = this._queue;
            if (queue.length) {
               var lastItem = queue[queue.length - 1];
               var promise = lastItem.callPromise = this._query(lastItem.query);
               delete lastItem.query;
               promise.addCallbacks(
                  this._onQueryDone.bind(this, promise, true),
                  this._onQueryDone.bind(this, promise, false)
               );
            }
         },

         _query: function (query) {
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
               if (filter.Domain) {
                  where.domain = filter.Domain;
               }
               if (Object.keys(where).length) {
                  options.where = where;
               }
            }
            var customConditions = this._options.customConditions;
            var hasCustomConditions = !!(customConditions && customConditions.length);
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
               options.limit = hasCustomConditions ? limit + customConditions.length*_CUSTOM_CONDITION_EXTENSION : limit;
            }
            if (filter.needUserInfo) {
               options.extra = {needUserInfo:true};
            }
            this._notify('onBeforeProviderCall');
            var promise = new Deferred();
            this._queryCall(promise, options, hasCustomConditions ? customConditions : null, limit, 0);
            return promise;
         },

         _queryCall: function (promise, options, customConditions, origLimit, retryCounter) {
            longOperationsManager.fetch(Object.keys(options).length ? options : null).addCallbacks(function (recordSet) {
               var meta = recordSet.getMetaData();
               var items = recordSet.getRawData() || [];
               if (customConditions && items.length) {
                  items = items.filter(function (operation) {
                     var custom = operation.custom;
                     return !custom || !customConditions.some(function (cond) { return Object.keys(cond).every(function (name) { return cond[name] === custom[name]; }); });
                  });
                  if (0 < origLimit && !options.offset) {
                     items = items.slice(0, origLimit);
                  }
               }
               promise.callback(new DataSet({
                  rawData: {
                     items: items,
                     more: meta && meta.more
                  },
                  idProperty: recordSet.getIdProperty(),
                  itemsProperty: 'items',
                  totalProperty: 'more',
                  model: recordSet.getModel()
               }));
            }.bind(this),
            function (err) {
               promise.errback(err);
            }.bind(this));
         },

         _onQueryDone: function (callPromise, isSuccess, result) {
            var queue = this._queue;
            var index; queue.some(function (v, i) { if (v.callPromise === callPromise) { index = i; return true; } });
            var list = queue.splice(0, index + 1);
            for (var i = 0; i < list.length; i++) {
               var resultPromise = list[i].resultPromise;
               if (!resultPromise.isReady()) {
                  // Только если обещание ещё не разрешено. Обещание может быть разрешено снаружи отказом ожидать дальше
                  if (isSuccess) {
                     resultPromise.callback(result);
                  }
                  else {
                     //Не нужно пропускать ошибку в ListView - вылетет алерт, не нужно посылать пустой результат - закроется попап
                     //resultPromise.errback(result);
                  }
               }
            }
            this._nextQuery();
            return result;
         }
      });



      return LongOperationsListDataSource;
   }
);
