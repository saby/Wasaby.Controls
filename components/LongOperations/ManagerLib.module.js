/**
 * Библиотека постзагружаемых методов для менеджера длительных операций
 *
 * @class SBIS3.CONTROLS.LongOperations.ManagerLib
 * @public
 */
define('js!SBIS3.CONTROLS.LongOperations.ManagerLib',
   [
      'WS.Data/Chain',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Source/DataSet',
      'js!SBIS3.CONTROLS.LongOperations.Const',
      'js!SBIS3.CONTROLS.LongOperations.Entry',
      'js!SBIS3.CONTROLS.LongOperations.HistoryItem',
      'js!SBIS3.CONTROLS.LongOperations.Tools.Bunch',
      'js!SBIS3.CONTROLS.LongOperations.Tools.CallsPool',
      'js!SBIS3.CONTROLS.LongOperations.Tools.TabCalls',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model'
   ],

   function (Chain, RecordSet, DataSet, LongOperationsConst, LongOperationEntry, LongOperationHistoryItem, LongOperationsBunch, LongOperationsCallsPool, LongOperationsTabCalls, Model) {
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
            var inner = protectedOf(this);
            if (inner._isDestroyed) {
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
            if (!inner._fetchCalls) {
               _init(this);
            }
            if (!inner._fetchCalls.has(query)) {
               // Если нет уже выполняющегося запроса
               var hasProducers = !!Object.keys(inner._producers).length;
               var hasTabManagers = !!Object.keys(inner._tabManagers).length;
               if (hasProducers || hasTabManagers) {
                  var useOffsets = 0 < query.offset;
                  var offsetPattern = {where:query.where, orderBy:query.orderBy, limit:query.limit};
                  var offsetIds;
                  if (useOffsets) {
                     offsetIds = inner._offsetBunch.searchIds(offsetPattern);
                     //var prevOffset = offsetIds && offsetIds.length ? inner._offsetBunch.listByIds(offsetIds).reduce(function (r, v) { r += v; return r; }, 0) : 0;
                  }
                  else {
                     inner._offsetBunch.removeAll(offsetPattern);
                  }
                  if (hasProducers) {
                     for (var n in inner._producers) {
                        var member = {tab:inner._tabKey, producer:n};
                        inner._fetchCalls.add(query, member, inner._producers[n].fetch(useOffsets ? ObjectAssign({}, query, {offset:inner._offsetBunch.search(member, offsetIds).shift() || 0}) : query));
                     }
                  }
                  if (hasTabManagers) {
                     var targets;
                     for (var tabKey in inner._tabManagers) {
                        targets = inner._tabTargets(targets, tabKey, inner._tabManagers[tabKey]);
                     }
                     if (targets) {
                        /*^^^var promises;
                        if (useOffsets) {
                           promises = [];
                           for (var tabKey in targets) {
                              for (var list = targets[tabKey], i = 0; i < list.length; i++) {
                                 var n = list[i];
                                 var member = {tab:tabKey, producer:n};
                                 promises.push(inner._tabCalls.call(tabKey, n, 'fetch', [ObjectAssign({}, query, {offset:inner._offsetBunch.search(member, offsetIds).shift() || 0})], LongOperationEntry));
                              }
                           }
                        }
                        else {
                           promises = inner._tabCalls.callBatch(targets, 'fetch', [query], LongOperationEntry);
                        }*/
                        var promises = inner._fetchFromTabs(targets, query, true);
                        inner._fetchCalls.addList(query, inner._expandTargets(targets), promises);
                     }
                  }
               }
            }
            if (inner._fetchCalls.has(query)) {
               // Если теперь есть
               return inner._fetchCalls.getResult(query, false);
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
            var inner = protectedOf(this);
            if (inner._isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            if (!tabKey || tabKey === inner._tabKey) {
               var producer = inner._producers[prodName];
               if (!producer) {
                  throw new Error('Producer not found');
               }
               return producer.callAction(action, operationId);
            }
            else {
               if (!(tabKey in inner._tabManagers && prodName in inner._tabManagers[tabKey])) {
                  throw new Error('Producer not found');
               }
               if (!inner._tabCalls) {
                  _init(this);
               }
               // Если вкладка не закрыта и продюсер не раз-регистрирован
               return inner._tabCalls.call(tabKey, prodName, 'callAction', [action, operationId], null);
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
            var inner = protectedOf(this);
            if (inner._isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            if (!tabKey || tabKey === inner._tabKey) {
               var producer = inner._producers[prodName];
               if (!producer) {
                  throw new Error('Producer not found');
               }
               if (!inner._canHasHistory(producer)) {
                  throw new Error('Producer is not supported history');
               }
               return producer.history(operationId, count, filter);
            }
            else
            if (tabKey in inner._tabManagers && prodName in inner._tabManagers[tabKey]) {
               if (!inner._tabCalls) {
                  _init(this);
               }
               // Если вкладка не закрыта и продюсер не раз-регистрирован
               return inner._tabCalls.call(tabKey, prodName, 'history', filter ? [operationId, count, filter] : [operationId, count], LongOperationHistoryItem);
            }
            return Deferred.fail('Not available');
         }
      };



      /**
       * Инициализировать
       * @param {object} self Этот объект
       * @protected
       */
      var _init = function (self) {
         /**
          * Объект для выполнения методов менеджеров в других вкладках
          * @protected
          * @type {SBIS3.CONTROLS.LongOperations.TabCalls}
          */
         protectedOf(self)._tabCalls = new LongOperationsTabCalls(
            /*tabKey:*/protectedOf(self)._tabKey,
            /*router:*/self.getByName.bind(self),
            /*packer:*/function (v) {
               // Упаковщик для отправки. Ожидается, что все объекты будут экземплярами SBIS3.CONTROLS.LongOperations.Entry
               return v && typeof v.toSnapshot === 'function' ? v.toSnapshot() : v;
            },
            /*channel:*/protectedOf(self)._tabChannel
         );

         /**
          * Пул вызовов методов fetch
          * @protected
          * @type {SBIS3.CONTROLS.LongOperations.CallsPool}
          */
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
               var inner = protectedOf(self);
               // Проверить, что продюсер есть и не был раз-регистрирован за время ожидания
               var prodName = (member.tab === inner._tabKey ? inner._producers[member.producer] : member.tab in inner._tabManagers && member.producer in inner._tabManagers[member.tab]) ? member.producer : null;
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
                     var useMemberTab = member.tab === inner._tabKey ? !inner._producers[member.producer].hasCrossTabData() : !inner._producers[member.producer] || !inner._tabManagers[member.tab][member.producer].hasCrossTabData();
                     values[iterate](function (v) {
                        // Значение должно быть экземпляром SBIS3.CONTROLS.LongOperations.Entry и иметь правилное имя продюсера
                        if (!(v instanceof LongOperationEntry && v.producer === prodName)) {
                           throw new Error('Invalid result');
                        }
                        if (v.tabKey) {
                           if (v.tabKey !== inner._tabKey && !(inner._tabManagers[v.tabKey] && inner._tabManagers[v.tabKey][member.producer])) {
                              v.tabKey = null;
                           }
                        }
                        else
                        if (useMemberTab) {
                           v.tabKey = member.tab;
                        }
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
                           if (/*^^^(!prev.canSuspend && op.canSuspend) || (!prev.canDelete && op.canDelete) ||*/ (!prev.tabKey && op.tabKey)) {
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
                        var inner = protectedOf(self);
                        obKey.tab = v.tabKey || inner._tabKey;
                        obKey.producer = v.producer;
                        inner._offsetBunch.set(obKey, (inner._offsetBunch.get(obKey) || 0) + 1);
                        return new Model({rawData: v, idProperty: 'fullId'});
                     })
                     .value()
                  );
                  results.setMetaData({more:query.limit <= count});
               }
               return results;
            }
         );

         /**
          * Счётчики текщих отступов по продюсерам
          * @protected
          * @type {SBIS3.CONTROLS.LongOperations.Bunch}
          */
         protectedOf(self)._offsetBunch = new LongOperationsBunch();

         /**
          * Выполнить запрос к продюсерам во вкладках
          * @protected
          * @praram {object} targets Объект с целями для запроса
          * @praram {object} query Объект с параметрами запроса
          * @praram {boolean} useOffsets Использовать поиск отступа в _offsetBunch
          * @return {Core/Deferred[]}
          */
         protectedOf(self)._fetchFromTabs = function (targets, query, useBunch) {
            var inner = protectedOf(this);
            if (0 < query.offset) {
               var promises = [];
               for (var tabKey in targets) {
                  for (var list = targets[tabKey], i = 0; i < list.length; i++) {
                     var n = list[i];
                     var offset = useBunch ? inner._offsetBunch.search({tab:tabKey, producer:n}, offsetIds).shift() || 0 : 0;
                     promises.push(inner._tabCalls.call(tabKey, n, 'fetch', [ObjectAssign({}, query, {offset:offset})], LongOperationEntry));
                  }
               }
               return promises;
            }
            else {
               return inner._tabCalls.callBatch(targets, 'fetch', [query], LongOperationEntry);
            }
         }.bind(self);
      };

      var ObjectAssign = Object.assign || function(d){return [].slice.call(arguments,1).reduce(function(r,s){return Object.keys(s).reduce(function(o,n){o[n]=s[n];return o},r)},d)};



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
