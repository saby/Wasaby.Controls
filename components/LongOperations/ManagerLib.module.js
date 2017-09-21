/**
 * Библиотека постзагружаемых методов для менеджера длительных операций
 *
 * @class SBIS3.CONTROLS.LongOperations.ManagerLib
 * @public
 */
define('js!SBIS3.CONTROLS.LongOperations.ManagerLib',
   [
   ],

   function () {
      'use strict';

      var protectedOf;

      var managerLib = {
         fetch: function (options) {
            // Хотя здесь "проситься" использовать экземпляр WS.Data/Query/Query в качестве аргумента, однако WS.Data/Query/Query имеет избыточную
            // здесь функциональность, в том числе возможность использовать функции для where, содержит другие члены, кроме where, orderBy, offset
            // и limit, имеет другие дополнительные возможности. Поддержка всего этого тут не нужна (и скорее обременительна), поэтому ограничимся
            // более простыми типами
            if (_isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            var query = {
               where: null,
               orderBy: DEFAULT_FETCH_SORTING,
               offset: 0,
               limit: DEFAULT_FETCH_LIMIT,
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
            if (!_fetchCalls.has(query)) {
               // Если нет уже выполняющегося запроса
               var hasProducers = !!Object.keys(_producers).length;
               var hasTabManagers = !!Object.keys(_tabManagers).length;
               if (hasProducers || hasTabManagers) {
                  var useOffsets = 0 < query.offset;
                  var offsetPattern = {where:query.where, orderBy:query.orderBy, limit:query.limit};
                  var offsetIds;
                  if (useOffsets) {
                     offsetIds = _offsetBunch.searchIds(offsetPattern);
                     //var prevOffset = offsetIds && offsetIds.length ? _offsetBunch.listByIds(offsetIds).reduce(function (r, v) { r += v; return r; }, 0) : 0;
                  }
                  else {
                     _offsetBunch.removeAll(offsetPattern);
                  }
                  if (hasProducers) {
                     for (var n in _producers) {
                        var member = {tab:_tabKey, producer:n};
                        _fetchCalls.add(query, member, _producers[n].fetch(useOffsets ? ObjectAssign({}, query, {offset:_offsetBunch.search(member, offsetIds).shift() || 0}) : query));
                     }
                  }
                  if (hasTabManagers) {
                     var targets;
                     for (var tabKey in _tabManagers) {
                        targets = _tabTargets(targets, tabKey, _tabManagers[tabKey]);
                     }
                     if (targets) {
                        var promises;
                        if (useOffsets) {
                           promises = [];
                           for (var tabKey in targets) {
                              for (var list = targets[tabKey], i = 0; i < list.length; i++) {
                                 var n = list[i];
                                 var member = {tab:tabKey, producer:n};
                                 promises.push(_tabCalls.call(tabKey, n, 'fetch', [ObjectAssign({}, query, {offset:_offsetBunch.search(member, offsetIds).shift() || 0})], LongOperationEntry));
                              }
                           }
                        }
                        else {
                           promises = _tabCalls.callBatch(targets, 'fetch', [query], LongOperationEntry);
                        }
                        _fetchCalls.addList(query, _expandTargets(targets), promises);
                     }
                  }
               }
            }
            if (_fetchCalls.has(query)) {
               // Если теперь есть
               return _fetchCalls.getResult(query, false);
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
            if (_isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            if (!tabKey || tabKey === _tabKey) {
               var producer = _producers[prodName];
               if (!producer) {
                  throw new Error('Producer not found');
               }
               return producer.callAction(action, operationId);
            }
            else {
               if (!(tabKey in _tabManagers && prodName in _tabManagers[tabKey])) {
                  throw new Error('Producer not found');
               }
               // Если вкладка не закрыта и продюсер не раз-регистрирован
               return _tabCalls.call(tabKey, prodName, 'callAction', [action, operationId], null);
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
            if (_isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            if (!tabKey || tabKey === _tabKey) {
               var producer = _producers[prodName];
               if (!producer) {
                  throw new Error('Producer not found');
               }
               if (!_canHasHistory(producer)) {
                  throw new Error('Producer is not supported history');
               }
               return producer.history(operationId, count, filter);
            }
            else
            if (tabKey in _tabManagers && prodName in _tabManagers[tabKey]) {
               // Если вкладка не закрыта и продюсер не раз-регистрирован
               return _tabCalls.call(tabKey, prodName, 'history', filter ? [operationId, count, filter] : [operationId, count], LongOperationHistoryItem);
            }
            return Deferred.fail('Not available');
         }
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
