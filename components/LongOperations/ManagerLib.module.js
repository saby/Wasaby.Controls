/**
 * Библиотека постзагружаемых методов для менеджера длительных операций
 *
 * @class SBIS3.CONTROLS.LongOperations.ManagerLib
 * @public
 */
define('js!SBIS3.CONTROLS.LongOperations.ManagerLib',
   [
      'js!WS.Data/Chain',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Source/DataSet',
      'js!SBIS3.CONTROLS.LongOperations.Entry',
      'js!SBIS3.CONTROLS.LongOperations.HistoryItem',
      'js!SBIS3.CONTROLS.LongOperations.Tools.CallsPool',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model'
   ],

   function (Chain, RecordSet, DataSet, LongOperationEntry, LongOperationHistoryItem, LongOperationsCallsPool, Model) {
      'use strict';

      /**
       * Геттер защищённых членов класса
       * @protected
       * @type {function}
       */
      var protectedOf;

      /**
       * Объект, содержащий постзагружаемые методы
       * @protected
       * @type {object}
       */
      var managerLib = {
         fetch: function (options) {
            // Хотя здесь "проситься" использовать экземпляр WS.Data/Query/Query в качестве аргумента, однако WS.Data/Query/Query имеет избыточную
            // здесь функциональность, в том числе возможность использовать функции для where, содержит другие члены, кроме where, orderBy, offset
            // и limit, имеет другие дополнительные возможности. Поддержка всего этого тут не нужна (и скорее обременительна), поэтому ограничимся
            // более простыми типами
            if (protectedOf(this)._isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            var query = {
               where: null,
               orderBy: this.DEFAULT_FETCH_SORTING,
               offset: 0,
               limit: this.DEFAULT_FETCH_LIMIT,
               extra: null
            };
            var names = Object.keys(query);
            var len = arguments.length;
            if (4 <= len) {
               var args = arguments;
               names.forEach(function (v, i) { if (ars[i]) query[v] = ars[i]; });
            }
            else
            if (len === 1) {
               if (options) {
                  if (typeof options !== 'object') {
                     throw new TypeError('Argument "options" must be an object if present');
                  }
                  names.forEach(function (v) { if (options[v]) query[v] = options[v]; });
               }
            }
            else
            if (len !== 0) {
               throw new Error('Wrong arguments number');
            }

            if (query.where != null && typeof query.where !== 'object') {
               throw new TypeError('Argument "where" must be an object');
            }
            if (query.orderBy != null && (typeof query.orderBy !== 'object'
               && Object.keys(query.orderBy).every(function (v) { var b = query.orderBy[v]; return b == null || typeof b === 'boolean'; }))) {
               throw new TypeError('Argument "orderBy" must be an array');
            }
            if (!(typeof query.offset === 'number' && 0 <= query.offset)) {
               throw new TypeError('Argument "offset" must be not negative number');
            }
            if (!(typeof query.limit === 'number' && 0 < query.limit)) {
               throw new TypeError('Argument "limit" must be positive number');
            }
            if (query.extra != null && typeof query.extra !== 'object') {
               throw new TypeError('Argument "extra" must be an object');
            }
            if (!protectedOf(this)._fetchCalls) {
               _createFetchCalls(this);
            }
            if (!protectedOf(this)._fetchCalls.has(query)) {
               // Если нет уже выполняющегося запроса
               var hasProducers = !!Object.keys(protectedOf(this)._producers).length;
               var hasTabManagers = !!Object.keys(protectedOf(this)._tabManagers).length;
               if (hasProducers || hasTabManagers) {
                  var useOffsets = 0 < query.offset;
                  var offsetPattern = {where:query.where, orderBy:query.orderBy, limit:query.limit};
                  var offsetIds;
                  if (useOffsets) {
                     offsetIds = protectedOf(this)._offsetBunch.searchIds(offsetPattern);
                     //var prevOffset = offsetIds && offsetIds.length ? protectedOf(this)._offsetBunch.listByIds(offsetIds).reduce(function (r, v) { r += v; return r; }, 0) : 0;
                  }
                  else {
                     protectedOf(this)._offsetBunch.removeAll(offsetPattern);
                  }
                  if (hasProducers) {
                     for (var n in protectedOf(this)._producers) {
                        var member = {tab:protectedOf(this)._tabKey, producer:n};
                        protectedOf(this)._fetchCalls.add(query, member, protectedOf(this)._producers[n].fetch(useOffsets ? ObjectAssign({}, query, {offset:protectedOf(this)._offsetBunch.search(member, offsetIds).shift() || 0}) : query));
                     }
                  }
                  if (hasTabManagers) {
                     var targets;
                     for (var tabKey in protectedOf(this)._tabManagers) {
                        targets = protectedOf(this)._tabTargets(targets, tabKey, protectedOf(this)._tabManagers[tabKey]);
                     }
                     if (targets) {
                        var promises;
                        if (useOffsets) {
                           promises = [];
                           for (var tabKey in targets) {
                              for (var list = targets[tabKey], i = 0; i < list.length; i++) {
                                 var n = list[i];
                                 var member = {tab:tabKey, producer:n};
                                 promises.push(protectedOf(this)._tabCalls.call(tabKey, n, 'fetch', [ObjectAssign({}, query, {offset:protectedOf(this)._offsetBunch.search(member, offsetIds).shift() || 0})], LongOperationEntry));
                              }
                           }
                        }
                        else {
                           promises = protectedOf(this)._tabCalls.callBatch(targets, 'fetch', [query], LongOperationEntry);
                        }
                        protectedOf(this)._fetchCalls.addList(query, protectedOf(this)._expandTargets(targets), promises);
                     }
                  }
               }
            }
            if (protectedOf(this)._fetchCalls.has(query)) {
               // Если теперь есть
               return protectedOf(this)._fetchCalls.getResult(query, false);
            }
            else {
               return Deferred.success(null);
            }
         },

         callAction: function (action, tabKey, prodName, operationId) {
            if (!action || typeof action !== 'string') {
               throw new TypeError('Argument "action" must be a string');
            }
            if (tabKey && typeof tabKey !== 'string') {
               throw new TypeError('Argument "tabKey" must be a string');
            }
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
            if (!operationId || !(typeof operationId === 'string' || typeof operationId === 'number')) {
               throw new TypeError('Argument "operationId" must be string or number');
            }
            if (protectedOf(this)._isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            if (!tabKey || tabKey === protectedOf(this)._tabKey) {
               var producer = protectedOf(this)._producers[prodName];
               if (!producer) {
                  throw new Error('Producer not found');
               }
               return producer.callAction(action, operationId);
            }
            else {
               if (!(tabKey in protectedOf(this)._tabManagers && prodName in protectedOf(this)._tabManagers[tabKey])) {
                  throw new Error('Producer not found');
               }
               // Если вкладка не закрыта и продюсер не раз-регистрирован
               return protectedOf(this)._tabCalls.call(tabKey, prodName, 'callAction', [action, operationId], null);
            }
         },

         history: function (tabKey, prodName, operationId, count, filter) {
            if (tabKey && typeof tabKey !== 'string') {
               throw new TypeError('Argument "tabKey" must be a string');
            }
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
            if (!operationId || !(typeof operationId === 'string' || typeof operationId === 'number')) {
               throw new TypeError('Argument "operationId" must be string or number');
            }
            if (!(typeof count === 'number' && 0 < count)) {
               throw new TypeError('Argument "count" must be positive number');
            }
            if (filter && typeof filter !== 'object') {
               throw new TypeError('Argument "filter" must be an object if present');
            }
            if (protectedOf(this)._isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            if (!tabKey || tabKey === protectedOf(this)._tabKey) {
               var producer = protectedOf(this)._producers[prodName];
               if (!producer) {
                  throw new Error('Producer not found');
               }
               if (!_canHasHistory(producer)) {
                  throw new Error('Producer is not supported history');
               }
               return producer.history(operationId, count, filter);
            }
            else
            if (tabKey in protectedOf(this)._tabManagers && prodName in protectedOf(this)._tabManagers[tabKey]) {
               // Если вкладка не закрыта и продюсер не раз-регистрирован
               return protectedOf(this)._tabCalls.call(tabKey, prodName, 'history', filter ? [operationId, count, filter] : [operationId, count], LongOperationHistoryItem);
            }
            return Deferred.fail('Not available');
         }
      };

      /**
       * Создать пул вызовов методов fetch
       * @param {object} self Этот объект
       * @protected
       */
      var _createFetchCalls = function (self) {
         protectedOf(self)._fetchCalls = new LongOperationsCallsPool(
            /*fields:*/['tab', 'producer'],
            /**
             * Обработчик одиночного результата вызова метода fetch локального продюсера или продюсера во вкладке
             * @param {object} query Параметры выполнявшегося запроса
             * @param {object} member Объект с идентифицирующими параметрами вызова - tab и producer
             * @param {SBIS3.CONTROLS.LongOperations.Entry[]|WS.Data/Source/DataSet|WS.Data/Collection/RecordSet} result Полученный результат
             * @return {SBIS3.CONTROLS.LongOperations.Entry[]}
             */
            /*handlePartial:*/function (query, member, result) {
               if (!(result == null || Array.isArray(result) || result instanceof DataSet || result instanceof RecordSet)) {
                  throw new Error('Unknown result type');
               }
               // Проверить, что продюсер есть и не был раз-регистрирован за время ожидания
               var prodName = (member.tab === protectedOf(self)._tabKey ? protectedOf(self)._producers[member.producer] : member.tab in protectedOf(self)._tabManagers && member.producer in protectedOf(self)._tabManagers[member.tab]) ? member.producer : null;
               // Если продюсер найден
               if (prodName) {
                  var values = result instanceof DataSet ? result.getAll() : result;
                  var iterate;
                  var len;
                  if (Array.isArray(values)) {
                     iterate = 'forEach';
                     len = values.length;
                  }
                  else
                  if (values instanceof RecordSet) {
                     iterate = 'each';
                     len = values.getCount();
                  }
                  if (!iterate) {
                     throw new Error('Unknown result type');
                  }
                  if (len) {
                     var memberTab = (member.tab === protectedOf(self)._tabKey ? !protectedOf(self)._producers[member.producer].hasCrossTabData() : !protectedOf(self)._producers[member.producer] || !protectedOf(self)._tabManagers[member.tab][member.producer].hasCrossTabData) ? member.tab : null;
                     values[iterate](function (v) {
                        // Значение должно быть экземпляром SBIS3.CONTROLS.LongOperations.Entry и иметь правилное имя продюсера
                        if (!(v instanceof LongOperationEntry && v.producer === prodName)) {
                           throw new Error('Invalid result');
                        }
                        v.tabKey = memberTab;
                     });
                     return values;
                  }
               }
               return null;
            },
            /**
             * Обработчик полного результата
             * @param {object} query Параметры выполнявшегося запроса
             * @param {SBIS3.CONTROLS.LongOperations.Entry[][]} resultList Список результатов обработки одиночных результатов
             * @return {WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperations.Entry>}
             */
            /*handleComplete:*/function (query, resultList) {
               var operations;
               if (resultList && resultList.length) {
                  for (var i = 0; i < resultList.length; i++) {
                     var result = resultList[i];
                     for (var j = 0, list = resultList[i]; j < list.length; j++) {
                        var op = list[j];
                        if (!operations) {
                           operations = {};
                        }
                        if (!(op.producer in operations)) {
                           operations[op.producer] = {};
                        }
                        if (op.id in operations[op.producer]) {
                           // Есть одна и та же операция от разных вкладок - выбрать
                           var prev = operations[op.producer][op.id];
                           if ((!prev.canSuspend && op.canSuspend) || (!prev.canDelete && op.canDelete)) {
                              operations[op.producer][op.id] = op;
                           }
                        }
                        else {
                           operations[op.producer][op.id] = op;
                        }
                     }
                  }
               }
               var results = new RecordSet({
                  model: Model,
                  idProperty: 'fullId'
               });
               if (operations) {
                  var chain;
                  var count = 0;
                  for (var p in operations) {
                     var list = operations[p];
                     list = Object.keys(list).map(function (v) {
                        return list[v];
                     });
                     chain = !chain ? Chain(list) : chain.concat(list);
                     count += list.length;
                  }
                  if (query.orderBy) {
                     var sorter = query.orderBy;
                     chain = chain.sort(function (a, b) {
                        for (var p in sorter) {
                           var va = a[p];
                           var vb = b[p];
                           // Для сравниваемых значений могут иметь смысл операции < и >, но не иметь смысла != и ==, как например для Date. Поэтому:
                           if (va < vb) {
                              return sorter[p] ? -1 : +1;
                           }
                           else
                           if (vb < va) {
                              return sorter[p] ? +1 : -1;
                           }
                        }
                        return 0;
                     });
                  }
                  var obKey = {where:query.where, orderBy:query.orderBy, limit:query.limit, tab:null, producer:null};
                  results.assign(chain
                     .first(query.limit)
                     .map(function (v) {
                        obKey.tab = v.tabKey || protectedOf(self)._tabKey;
                        obKey.producer = v.producer;
                        protectedOf(self)._offsetBunch.set(obKey, (protectedOf(self)._offsetBunch.get(obKey) || 0) + 1);
                        return new Model({rawData: v, idProperty: 'fullId'});
                     })
                     .value()
                  );
                  results.setMetaData({more:query.limit <= count});
               }
               return results;
            }
         );
      };



      /**
       * Возвратить функцию, возвращающую объект библиотеки после инициализации
       * @public
       * @param {any} initer Инициализатор
       * @return {object}
       */
      return function (initer) {
         protectedOf = initer;
         return managerLib;
      };
   }
);
