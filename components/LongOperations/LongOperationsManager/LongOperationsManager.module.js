/**
 * Менеджер длительных операций
 *
 * @class SBIS3.CONTROLS.LongOperationsManager
 * @public
 *
 * @description file ../doc/LongOperations.md
 *
 * @demo SBIS3.CONTROLS.Demo.MyLongOperations
 * @demo SBIS3.CONTROLS.Demo.MyLongOperationsSvc
 */
define('js!SBIS3.CONTROLS.LongOperationsManager',
   [
      'Core/core-instance',
      'Core/Deferred',
      'Core/EventBus',
      'js!SBIS3.CORE.TabMessage',
      'js!WS.Data/Source/DataSet',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Chain',
      'js!SBIS3.CONTROLS.LongOperationsConst',
      'js!SBIS3.CONTROLS.LongOperationsTabCalls',
      'js!SBIS3.CONTROLS.LongOperationsCallsPool',
      'js!SBIS3.CONTROLS.LongOperationsBunch',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.LongOperationHistoryItem',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model'
   ],

   function (CoreInstance, Deferred, EventBus, TabMessage, DataSet, RecordSet, Chain, LongOperationsConst, LongOperationsTabCalls, LongOperationsCallsPool, LongOperationsBunch, LongOperationEntry, LongOperationHistoryItem, Model) {
      'use strict';

      /**
       * "Константа" - сортировка возвращаемых методом fetch элементов по умолчанию
       * @protected
       * @type {number}
       */
      var DEFAULT_FETCH_SORTING = {status:true, startedAt:false};

      /**
       * "Константа" - максимальное количество возвращаемых методом fetch элементов по умолчанию
       * @protected
       * @type {number}
       */
      var DEFAULT_FETCH_LIMIT = 10;

      /**
       * Список продюсеров длительных операций
       * @protected
       * @type {object{SBIS3.CONTROLS.ILongOperationsProducer}}
       */
      var _producers = {};

      /**
       * Канал событий
       * @protected
       * @type {Core/EventBusChannel}
       */
      var _channel;

      /**
       * Канал событий вкладок
       * @protected
       * @type {SBIS3.CORE.TabMessage}
       */
      var _tabChannel;

      /**
       * Ключ текущей вкладки
       * @protected
       * @type {string}
       */
      var _tabKey;

      /**
       * Информация о менеджерах в других вкладках
       * @protected
       * @type {object}
       */
      var _tabManagers = {};

      /**
       * Объект для выполнения методов менеджеров в других вкладках
       * @protected
       * @type {SBIS3.CONTROLS.LongOperationsTabCalls}
       */
      var _tabCalls;

      /**
       * Объект для сбора данных от разных продюсеров и менеджеров при выполнения методов fetch
       * @protected
       * @type {SBIS3.CONTROLS.LongOperationsCallsPool}
       */
      var _fetchCalls;

      /**
       * Счётчики текщих отступов по продюсерам
       * @protected
       * @type {SBIS3.CONTROLS.LongOperationsBunch}
       */
      var _offsetBunch;

      /**
       * Признак того, что менеджер ликвидирован
       * @protected
       * @type {boolean}
       */
      var _isDestroyed;

      /**
       * Класс менеджера длительных операций
       * @public
       *
       * @author Спирин Виктор Алексеевич
       *
       * @type {SBIS3.CONTROLS.LongOperationsManager}
       */
      var manager = /*CoreExtend.extend*/(/** @lends SBIS3.CONTROLS.LongOperationsManager.prototype */{
         _moduleName: 'SBIS3.CONTROLS.LongOperationsManager',

         // Раскрыть константы
         DEFAULT_FETCH_SORTING: DEFAULT_FETCH_SORTING,
         DEFAULT_FETCH_LIMIT: DEFAULT_FETCH_LIMIT,

         /**
          * Получить ключ текущей вкладки
          * @public
          * @return {string}
          */
         getTabKey: function () {
            return _tabKey;
         },

         /**
          * Получить зарегистрированный продюсер длительных операций по его имени
          * @public
          * @param {string} prodName Имя продюсера длительных операций
          * @return {SBIS3.CONTROLS.ILongOperationsProducer}
          */
         getByName: function (prodName) {
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
            if (!_isDestroyed) {
               return _producers[prodName];
            }
         },

         /**
          * Зарегистрировать продюсер длительных операций
          * @public
          * @param {SBIS3.CONTROLS.ILongOperationsProducer} producer Продюсер длительных операций
          */
         register: function (producer) {
            if (!_isDestroyed) {
               _register(producer);
            }
         },

         /**
          * Удалить продюсер длительных операций из списка зарегистрированных. Возвращает значение, показывающее удалось ли раз-регистрировать
          * @public
          * @param {SBIS3.CONTROLS.ILongOperationsProducer|string} producer Продюсер длительных операций или его имя
          * @return {boolean}
          */
         unregister: function (producer) {
            if (!_isDestroyed) {
               return _unregister(producer);
            }
         },

         /**
          * Выяснить, зарегистрирован ли указанный продюсер длительных операций
          * @public
          * @param {SBIS3.CONTROLS.ILongOperationsProducer|string} producer Продюсер длительных операций или его имя
          * @return {boolean}
          */
         isRegistered: function (producer) {
            if (!producer || !(typeof producer === 'string' || CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.ILongOperationsProducer'))) {
               throw new TypeError('Argument "producer" must be string or  SBIS3.CONTROLS.ILongOperationsProducer');
            }
            if (!_isDestroyed) {
               return typeof producer === 'string' ? !!_producers[producer] : !!_searchName(producer);
            }
         },

         /**
          * Запросить набор последних длительных операций из всех зарегистрированных продюсеров. В качестве аргумента принимает (опционально) запрос
          * в виде простого объекта, либо запрос может быть указан (строго) четырьмя отдельными аргументами в последовательности:
          * where, orderBy, offset и limit
          * @public
          * @param {object} [options] Параметры запроса (опционально)
          * @param {object} [options.where] Параметры фильтрации. По умолчанию null (опционально)
          * @param {object} [options.orderBy] Параметры сортировки. По умолчанию будет использована константа DEFAULT_FETCH_SORTING (опционально)
          * @param {number} [options.offset] Количество пропущенных элементов в начале. По умолчанию 0 (опционально)
          * @param {number} [options.limit] Максимальное количество возвращаемых элементов. По умолчанию будет использована константа DEFAULT_FETCH_LIMIT (опционально)
          * @param {object} [options.extra] Дополнительные параметры, если есть (опционально)
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperationEntry>>}
          */
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

         /**
          * Запросить указанный продюсер выполнить указанное действие с указанным элементом
          * @public
          * @param {string} action Название действия
          * @param {string} tabKey Ключ вкладки
          * @param {string} prodName Имя продюсера
          * @param {string|number} operationId Идентификатор длительной операции
          * @return {Core/Deferred}
          */
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

         /**
          * Проверить, поддерживается ли история длительных операций указанным продюсером
          * @public
          * @param {string} tabKey Ключ вкладки
          * @param {string} prodName Имя продюсера
          * @return {boolean}
          */
         canHasHistory: function (tabKey, prodName) {
            if (tabKey && typeof tabKey !== 'string') {
               throw new TypeError('Argument "tabKey" must be a string');
            }
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
            if (!_isDestroyed) {
               if (!tabKey || tabKey === _tabKey) {
                  var producer = _producers[prodName];
                  if (!producer) {
                     throw new Error('Producer not found');
                  }
                  return _canHasHistory(producer);
               }
               else
               if (tabKey in _tabManagers && prodName in _tabManagers[tabKey]) {
                  // Если вкладка не закрыта и продюсер не раз-регистрирован
                  return _tabManagers[tabKey][prodName].canHasHistory;
               }
               return false;
            }
         },

         /**
          * Запросить историю указанной длительной операции
          * При имплементации в возвращаем Deferrred-е нужно использовать опцию cancelCallback, если это применимо с точки зрения природы данных
          * @public
          * @param {string} tabKey Ключ вкладки
          * @param {string} prodName Имя продюсера
          * @param {string|number} operationId Идентификатор длительной операции
          * @param {number} count Максимальное количество возвращаемых элементов
          * @param {object} [filter] Фильтр для получения не всех элементов истроии
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperationHistoryItem>>}
          */
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
         },

         /**
          * Подписаться на получение события
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          * @param {Object} [ctx] Контекст выполнения
          */
         subscribe: function (eventType, listener, ctx) {
            if (!_isDestroyed) {
               _channel.subscribe(eventType, listener, ctx);
            }
         },

         /**
          * Отписаться от получения события
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          * @param {Object} [ctx] Контекст выполнения
          */
         unsubscribe: function (eventType, listener, ctx) {
            if (!_isDestroyed) {
               _channel.unsubscribe(eventType, listener, ctx);
            }
         },

         /**
          * Проверить, можно ли в данный момент ликвидировать экземпляр класса без необратимой потери данных
          * @public
          * @return {boolean}
          */
         canDestroySafely: function () {
            if (!_isDestroyed) {
               for (var n in _producers) {
                  if (_producers[n].canDestroySafely &&//TODO: ### Это переходный код, удалить позднее
                        !_producers[n].canDestroySafely()) {
                     return false;
                  }
               }
            }
            return true;
         },

         /**
          * Ликвидировать экземпляр класса
          * @public
          */
         destroy: function () {
            if (!_isDestroyed) {
               _isDestroyed = true;
               for (var n in _producers) {
                  _producers[n].destroy();
                  _unregister(n);
               }
               if (_channel) {
                  _channel.notifyWithTarget('ondestroy', manager);
                  _channel.unsubscribeAll();
                  _channel.destroy();
                  _channel = null;
               }
               if (_tabChannel) {
                  _tabChannel.notify('LongOperations:Manager:onActivity', {type:'die', tab:_tabKey});
                  _tabChannel.unsubscribe('LongOperations:Manager:onActivity', _tabListener);
                  _tabChannel.destroy();
                  _tabChannel = null;
               }
               _tabCalls.destroy();
               _tabCalls = null;
            }
         }
      });

      /**
       * Набор защищённых методов модуля
       */

      /**
       * Зарегистрировать продюсер длительных операций
       * @protected
       * @param {SBIS3.CONTROLS.ILongOperationsProducer} producer Продюсер длительных операций
       */
      var _register = function (producer) {
         if (!producer || !CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.ILongOperationsProducer')) {
            throw new TypeError('Argument "producer" must be SBIS3.CONTROLS.ILongOperationsProducer');
         }
         var name = producer.getName();
         if (!name) {
            throw new Error('Producer has no name');
         }
         var inf = _checkProducerName(name);
         var module = inf && requirejs.defined(inf.module) ? require(inf.module) : null;
         if (!module || !(typeof module === 'function' ? producer instanceof module : producer === module)) {
            throw new Error('Producer name is invalid');
         }
         var already = _producers[name] === producer;
         if (!already) {
            if (_producers[name]) {
               throw new Error('Other producer with such name already registered');
            }
            if (_searchName(producer)) {
               throw new Error('This producer with other name already registered');
            }
            // Добавить в список
            _producers[name] = producer;
            // Подписаться на события
            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted'].forEach(function (eventType) {
               producer.subscribe(eventType, _eventListener);
            });
             // Уведомить другие вкладки
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:'register', tab:_tabKey, producer:name, isCrossTab:producer.hasCrossTabData(), hasHistory:_canHasHistory(producer)});
            // Если есть уже выполняющиеся запросы данных - присоединиться к ним
            var queries = _fetchCalls.listPools();
            for (var i = 0; i < queries.length; i++) {
               var q = queries[i];
               _fetchCalls.add(q, {tab:_tabKey, producer:name}, _producers[name].fetch(q.where, q.orderBy, q.offset, q.limit, q.extra));
            }
            // И уведомить своих подписчиков
            _channel.notifyWithTarget('onproducerregistered', manager);
         }
      };

      /**
       * Удалить продюсер длительных операций из списка зарегистрированных
       * @protected
       * @param {SBIS3.CONTROLS.ILongOperationsProducer|string} producer Продюсер длительных операций или его имя
       * @return {boolean}
       */
      var _unregister = function (producer) {
         if (!producer || (typeof producer !== 'string' && !CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.ILongOperationsProducer'))) {
            throw new TypeError('Argument "producer" must be SBIS3.CONTROLS.ILongOperationsProducer or string');
         }
         var name;
         if (typeof producer === 'string') {
            name = producer;
            if (!_producers[name]) {
               return false;
            }
         }
         else {
            name = producer.getName();
            if (!name || _producers[name] !== producer) {
               name =  _searchName(producer);
            }
         }
         var done = false;
         if (name) {
            // Отцепить события
            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted'].forEach(function (eventType) {
               _producers[name].unsubscribe(eventType, _eventListener);
            });
            // Если есть выполняющийся запрос данных - отсоединиться от него
            _fetchCalls.remove(null, {tab:_tabKey, producer:name});
            // Удалить из списка
            delete _producers[name];
            // Почистить _offsetBunch
            _offsetBunch.removeAll({tab:_tabKey, producer:name});
            done = true;
            // Уведомить другие вкладки
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:'unregister', tab:_tabKey, producer:name});
            // И уведомить своих подписчиков
            if (!_isDestroyed) {
               _channel.notifyWithTarget('onproducerunregistered', manager);
            }
         }
         return done;
      };

      /**
       * Проверить правильность имени продюсера
       * Указанное имя продюсера должно быть или непосредственно именем модуля, или именем модуля и следующей после него через ":" опциональной инициализирующей строкой
       * Возвращает объект, содержащий имя модуля и строку инициализатора если она есть
       * @protected
       * @param {string} prodName Имя продюсера длительных операций
       * @return {object}
       */
      var _checkProducerName = function (prodName) {
         var i = prodName.indexOf(':');
         var modName = i !== -1 ? prodName.substring(0, i) : prodName;
         var mods = require('Core/constants').jsModules;
         return modName in mods ? {module:'js!' + modName, initer:i !== -1 ? prodName.substring(i + 1) : null} : null;
      };

      /**
       * Трансформировать аргумент в верблюжью нотацию
       * @protected
       * @param {string} name Имя с дефисом в качестве разделителя
       * @return {string}
       */
      /*var _dashed2Camel = function (name) {
         return name.split('-').map(function (v) { return v.charAt(0).toUpperCase() + v.substring(1); }).join('');
      };*/

      /**
       * Найти под каким именем зарегистрирован продюсер
       * @protected
       * @param {SBIS3.CONTROLS.ILongOperationsProducer} producer Продюсер длительных операций
       * @return {string}
       */
      var _searchName = function (producer) {
         for (var n in _producers) {
            if (producer === _producers[n]) {
               return n;
            }
         }
      };

      /**
       * Определить, может ли продюсер иметь историю
       * @protected
       * @param {SBIS3.CONTROLS.ILongOperationsProducer} producer Продюсер длительных операций
       * @return {boolean}
       */
      var _canHasHistory = function (producer) {
         return CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.ILongOperationsHistoricalProducer');
      };

      /**
       * Собрать объект с целями для запросов в другие вкладки
       * @protected
       * @param {object} targets Списки имён продюсеров по вкладкам
       * @param {string} tabKey Ключ вкладки
       * @param {object} prodInfo Объект, содержащий данные по нескольким продюсерам
       * @return {object}
       */
      var _tabTargets = function (targets, tabKey, prodInfo) {
         for (var prodName in prodInfo) {
            // Если продюсер во вкладке имеет не cross-tab данные - использовать его
            // или имеет cross-tab данные, но не зарегистрирован в текущей вкладке
            if (!_tabManagers[tabKey][prodName].hasCrossTabData || !_producers[prodName]) {
               if (!targets) {
                  targets = {};
               }
               if (!(tabKey in targets)) {
                  targets[tabKey] = [];
               }
               targets[tabKey].push(prodName);
            }
         }
         return targets;
      };

      /**
       * ###
       * @protected
       * @param {object} targets Списки имён продюсеров по вкладкам
       * @return {object[]}
       */
      var _expandTargets = function (targets) {
         var list = [];
         for (var tabKey in targets) {
            list.push.apply(list, targets[tabKey].map(function (v) { return {tab:tabKey, producer:v}; }));
         }
         return list;
      };

      /**
       * Слушатель событий продюсеров
       * @protected
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {object} data Данные события
       * @param {boolean} dontCrossTab Не распространять событие по вкладкам
       */
      var _eventListener = function (evtName, data, dontCrossTab) {
         if (_isDestroyed) {
            return;
         }
         var producer;
         if (!dontCrossTab) {
            if (!data.producer || typeof data.producer !== 'string') {
               throw new TypeError('Unknown event');
            }
            producer = _producers[data.producer];
            if (!producer) {
               throw new Error('Unknown event');
            }
            // Если произошло событие в продюсере и есть выполняющиеся fetch запросы - выполнить запросы к этому продюсеру повторно
            // (все - и завершённые, и даже не завершённые, так как не завершённые уже могут быть "на подходе" со старыми данными)
            // TODO: ### Для уменьшения количества запросов можно попробовать рассмотреть компромисный вариант - переспрашивать только если уже прошло достаточно много времени
            var member = {tab:_tabKey, producer:data.producer};
            var queries = _fetchCalls.listPools(member/*, true*/);
            if (queries && queries.length) {
               for (var i = 0; i < queries.length; i++) {
                  var query = queries[i];
                  _fetchCalls.replace(query, member, producer.fetch(query));
               }
            }
         }
         var eventType = typeof evtName === 'object' ? evtName.name : evtName;
         _channel.notifyWithTarget(eventType, manager, !dontCrossTab ? (data ? ObjectAssign({tabKey:_tabKey}, data) : {tabKey:_tabKey}) : data);
         if (!dontCrossTab && !producer.hasCrossTabEvents()) {
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:eventType, tab:_tabKey, isCrossTab:producer.hasCrossTabData(), hasHistory:_canHasHistory(producer), data:data});
         }
      };

      /**
       * Слушатель извещений об изменениях из менеджеров в других вкладках
       * @protected
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {object} evt Cобытие полностью
       */
      var _tabListener = function (evtName, evt) {
         if (!(evt && typeof evt === 'object'
            && evt.type && typeof evt.type === 'string'
            && evt.tab && typeof evt.tab === 'string')) {
            throw new TypeError('Unknown event');
         }
         var type = evt.type;
         var tab = evt.tab;
         switch (type) {
            case 'born':
               _tabManagers[tab] = {};
               var prodData = {};
               for (var n in _producers) {
                  prodData[n] = {isCrossTab:_producers[n].hasCrossTabData(), hasHistory:_canHasHistory(_producers[n])};
               }
               _tabChannel.notify('LongOperations:Manager:onActivity', {type:'handshake', tab:_tabKey, producers:prodData});
               break;
            case 'handshake':
               if (!(evt.producers && typeof evt.producers === 'object')) {
                  throw new Error('Unknown event');
               }
               _regTabProducer(tab, evt.producers);
               break;
            case 'die':
               _unregTabProducer(tab);
               break;

            case 'register':
               if (!(evt.producer && typeof evt.producer === 'string' && 'isCrossTab' in evt && typeof evt.isCrossTab === 'boolean' && 'hasHistory' in evt && typeof evt.hasHistory === 'boolean')) {
                  throw new Error('Unknown event');
               }
               _regTabProducer(tab, evt.producer, evt.isCrossTab, evt.hasHistory);
               break;
            case 'unregister':
               if (!(evt.producer && typeof evt.producer === 'string')) {
                  throw new Error('Unknown event');
               }
               _unregTabProducer(tab, evt.producer);
               break;

            case 'onlongoperationstarted':
            case 'onlongoperationchanged':
            case 'onlongoperationended':
            case 'onlongoperationdeleted':
               var data = evt.data;
               if (!(data && typeof data === 'object' && data.producer && typeof data.producer === 'string' && 'isCrossTab' in evt && typeof evt.isCrossTab === 'boolean' && 'hasHistory' in evt && typeof evt.hasHistory === 'boolean')) {
                  throw new Error('Unknown event');
               }
               _regTabProducer(tab, data.producer, evt.isCrossTab, evt.hasHistory);
               _eventListener(type, ObjectAssign({tabKey:tab}, data), true);
               break;
         }
      };

      /**
       * Зарегистрировать продюсер(ы) из другой вкладки (если он ещё не зарегистрирован)
       * @protected
       * @param {string} tabKey Ключ вкладки
       * @param {string|object} prodInfo Имя продюсера или объект, содержащий данные по нескольким продюсерам
       * @param {boolean} isCrossTab Имеет ли продюсер cross-tab данные
       * @param {boolean} hasHistory Может ли продюсер иметь историю
       */
      var _regTabProducer = function (tabKey, prodInfo, isCrossTab, hasHistory) {
         if (!(tabKey in _tabManagers)) {
            _tabManagers[tabKey] = {};
         }
         var tabProds = _tabManagers[tabKey];
         var newProds;
         if (typeof prodInfo == 'object' && Object.keys(prodInfo).length) {
            newProds = {};
            for (var n in prodInfo) {
               if (!(n in tabProds)) {
                  var inf = prodInfo[n];
                  tabProds[n] = newProds[n] = {hasCrossTabData:inf.isCrossTab, canHasHistory:inf.hasHistory};
               }
            }
         }
         else
         if (!(prodInfo in tabProds)) {
            newProds = {};
            tabProds[prodInfo] = newProds[prodInfo] = {hasCrossTabData:isCrossTab, canHasHistory:hasHistory};
         }
         if (newProds) {
            // Если есть уже выполняющиеся запросы данных - присоединиться к ним
            var queries = _fetchCalls.listPools();
            if (queries.length) {
               var targets = _tabTargets(null, tabKey, newProds);
               if (targets) {
                  var members = _expandTargets(targets);
                  for (var i = 0; i < queries.length; i++) {
                     var q = queries[i];
                     var promises;
                     if (0 < q.offset) {
                        promises = [];
                        for (var list = targets[tabKey], i = 0; i < list.length; i++) {
                           promises.push(_tabCalls.call(tabKey, list[i], 'fetch', [ObjectAssign({}, q, {offset:0})], LongOperationEntry));
                        }
                     }
                     else {
                        promises = _tabCalls.callBatch(targets, 'fetch', [q], LongOperationEntry);
                     }
                     _fetchCalls.addList(q, members, promises);
                  }
               }
            }
            // Уведомить своих подписчиков
            _channel.notifyWithTarget('onproducerregistered', manager);
         }
      };

      /**
       * Раз-регистрировать указанный продюсер (или все, если не указан) из другой вкладки
       * @protected
       * @param {string} tabKey Ключ вкладки
       * @param {string} [prodName] Имя продюсера (опционально)
       */
      var _unregTabProducer = function (tabKey, prodName) {
         if (tabKey in _tabManagers) {
            // Если есть выполняющийся запрос данных - отсоединиться от него
            _fetchCalls.remove(null, prodName ? {tab:tabKey, producer:prodName} : {tab:tabKey});
            if (prodName) {
               delete _tabManagers[tabKey][prodName];
            }
            else {
               delete _tabManagers[tabKey];
            }
            // Почистить _offsetBunch
            _offsetBunch.removeAll(prodName ? {tab:tabKey, producer:prodName} : {tab:tabKey});
            // Уведомить своих подписчиков
            //TODO: ### Если продюсер не отображаемый, можно (нужно?) игнорировать
            _channel.notifyWithTarget('onproducerunregistered', manager);
         }
      };



      /**
       * Сгенерировать случайную hex-строку указанной длины
       * @protected
       * @param {number} n Длина строки
       * @return {string}
       */
      var _uniqueHex = function(n){var l=[];for(var i=0;i<n;i++){l[i]=Math.round(15*Math.random()).toString(16)}return l.join('')};
      //var _uniqueHex = function(n){return Math.round((Math.pow(16,n)-1)*Math.random()).toString(16).padStart(n,'0')};

      var ObjectAssign = Object.assign || function(d){return [].slice.call(arguments,1).reduce(function(r,s){return Object.keys(s).reduce(function(o,n){o[n]=s[n];return o},r)},d)};



      // Установить ключ вкладки
      _tabKey = _uniqueHex(50);

      // Создать каналы событий
      _channel = EventBus.channel();
      _tabChannel = new TabMessage();

      // Создать объект межвкладочных вызовов
      var _tabCalls = new LongOperationsTabCalls(
         /*tabKey:*/_tabKey,
         /*router:*/manager.getByName,
         /*packer:*/function (v) {
            // Упаковщик для отправки. Ожидается, что все объекты будут экземплярами SBIS3.CONTROLS.LongOperationEntry
            return v && typeof v.toSnapshot === 'function' ? v.toSnapshot() : v;
         },
         /*channel:*/_tabChannel
      );

      // Создать пул вызовов методов fetch
      var _fetchCalls = new LongOperationsCallsPool(
         /*fields:*/['tab', 'producer'],
         /**
          * Обработчик одиночного результата вызова метода fetch локального продюсера или продюсера во вкладке
          * @param {object} query Параметры выполнявшегося запроса
          * @param {object} member Объект с идентифицирующими параметрами вызова - tab и producer
          * @param {SBIS3.CONTROLS.LongOperationEntry[]|WS.Data/Source/DataSet|WS.Data/Collection/RecordSet} result Полученный результат
          * @return {SBIS3.CONTROLS.LongOperationEntry[]}
          */
         /*handlePartial:*/function (query, member, result) {
            if (!(result == null || Array.isArray(result) || result instanceof DataSet || result instanceof RecordSet)) {
               throw new Error('Unknown result type');
            }
            // Проверить, что продюсер есть и не был раз-регистрирован за время ожидания
            var prodName = (member.tab === _tabKey ? _producers[member.producer] : member.tab in _tabManagers && member.producer in _tabManagers[member.tab]) ? member.producer : null;
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
                  var memberTab = (member.tab === _tabKey ? !_producers[member.producer].hasCrossTabData() : !_producers[member.producer] || !_tabManagers[member.tab][member.producer].hasCrossTabData) ? member.tab : null;
                  values[iterate](function (v) {
                     // Значение должно быть экземпляром SBIS3.CONTROLS.LongOperationEntry и иметь правилное имя продюсера
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
          * @param {SBIS3.CONTROLS.LongOperationEntry[][]} resultList Список результатов обработки одиночных результатов
          * @return {WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperationEntry>}
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
                     obKey.tab = v.tabKey || _tabKey;
                     obKey.producer = v.producer;
                     _offsetBunch.set(obKey, (_offsetBunch.get(obKey) || 0) + 1);
                     return new Model({rawData: v, idProperty: 'fullId'});
                  })
                  .value()
               );
               results.setMetaData({more:query.limit <= count});
            }
            return results;
         }
      );

      _offsetBunch = new LongOperationsBunch();

      // Опубликовать свои события
      _channel.publish('onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted');

      // И подписаться на события во вкладках
      _tabChannel.subscribe('LongOperations:Manager:onActivity', _tabListener);
      _tabChannel.notify('LongOperations:Manager:onActivity', {type: 'born', tab: _tabKey});

      if (typeof window !== 'undefined') {
         // Добавить обработчик перед выгрузкой для уведомеления пользователя (если нужно)
         window.addEventListener('beforeunload', function (evt) {
            if (!manager.canDestroySafely()) {
               // Единственное, что сейчас нам дают сделать браузеры и стандарты - показать пользователю стандартное окно браузера
               // с уведомлением, что при перезагрузке что-то может не сохраниться. Текст сообщения в большинсве случаев будет заменён
               // на браузерный стандартный, однако если он может быть где-то показан, то пусть будет.
               evt.returnValue = LongOperationsConst.MSG_UNLOAD;
               return LongOperationsConst.MSG_UNLOAD;
            }
         });

         // Добавить обработчик на выгрузку для запуска метода destroy
         window.addEventListener('unload', function () {
            manager.destroy();
         });
      }

      return manager;
   }
);
