/**
 * Менеджер длительных операций
 *
 * @class SBIS3.CONTROLS.LongOperationsManager
 * @public
 *
 * @description file LongOperations.md
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
      'js!WS.Data/Query/Query',
      'js!SBIS3.CONTROLS.LongOperationsTabCalls',
      'js!SBIS3.CONTROLS.LongOperationsCallsPool',
      'js!SBIS3.CONTROLS.ILongOperationsProducer',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.LongOperationHistoryItem',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model'
   ],

   function (CoreInstance, Deferred, EventBus, TabMessage, DataSet, RecordSet, Chain, Query, LongOperationsTabCalls, LongOperationsCallsPool, ILongOperationsProducer, LongOperationEntry, LongOperationHistoryItem, Model) {
      'use strict';

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
       * Признак того, что менеджер ликвидирован
       * @protected
       * @type {boolean}
       */
      var _isDestroyed;

      /**
       * Класс менеджера длительных операций
       * @public
       * @type {SBIS3.CONTROLS.LongOperationsManager}
       */
      var manager = /*CoreExtend.extend*/(/** @lends SBIS3.CONTROLS.LongOperationsManager.prototype */{
         _moduleName: 'SBIS3.CONTROLS.LongOperationsManager',

         /**
          * Получить зарегистрированный продюсер длительных операций по его имени
          * @public
          * @param {string} prodName Имя продюсера длительных операций
          * @return {SBIS3.CONTROLS.ILongOperationsProducer}
          */
         getByName: function (prodName) {
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
            return _producers[prodName];
         },

         /**
          * Зарегистрировать продюсер длительных операций
          * @public
          * @param {SBIS3.CONTROLS.ILongOperationsProducer} producer Продюсер длительных операций
          */
         register: function (producer) {
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            _register(producer);
         },

         /**
          * Удалить продюсер длительных операций из списка зарегистрированных. Возвращает значение, показывающее удалось ли раз-регистрировать
          * @public
          * @param {SBIS3.CONTROLS.ILongOperationsProducer|string} producer Продюсер длительных операций или его имя
          * @return {boolean}
          */
         unregister: function (producer) {
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            return _unregister(producer);
         },

         /**
          * Выяснить, зарегистрирован ли указанный продюсер длительных операций
          * @public
          * @param {SBIS3.CONTROLS.ILongOperationsProducer|string} producer Продюсер длительных операций или его имя
          * @return {boolean}
          */
         isRegistered: function (producer) {
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            if (!producer || !(typeof producer === 'string' || CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.ILongOperationsProducer'))) {
               throw new TypeError('Argument "producer" must be string or  SBIS3.CONTROLS.ILongOperationsProducer');
            }
            return typeof producer === 'string' ? !!_producers[producer] : !!_searchName(producer);
         },

         /**
          * Запросить набор последних длительных операций из всех зарегистрированных продюсеров
          * @public
          * @param {object|WS.Data/Query/Query} [options] Параметры запроса (опционально)
          * @param {object} [options.where] Параметры фильтрации (опционально)
          * @param {string[]|WS.Data/Query/Order[]} [options.orderBy] Параметры сортировки. По умолчанию используется обратный хронологический порядок (опционально)
          * @param {number} [options.offset] Количество пропущенных элементов в начале. По умолчанию 0 (опционально)
          * @param {number} [options.limit] Максимальное количество возвращаемых элементов. По умолчанию ^^^10 (опционально)
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperationEntry>>}
          */
         fetch: function (options) {
            //////////////////////////////////////////////////
            console.log('DBG: LO_Man.fetch: options=', options, ';');
            //////////////////////////////////////////////////
            if (_isDestroyed) {
               return Deferred.fail('User left the page');
            }
            if (options && typeof options !== 'object') {
               throw new TypeError('Argument "options" must be an object if present');
            }
            if (!(options instanceof Query)) {
               if (options.where && typeof options.where !== 'object') {
                  throw new TypeError('Argument "options.where" must be an object');
               }
               if ('orderBy' in options && !Array.isArray(options.orderBy)) {
                  throw new TypeError('Argument "options.orderBy" must be an array');
               }
               if ('offset' in options && !(typeof options.offset === 'number' && 0 <= options.offset)) {
                  throw new TypeError('Argument "options.offset" must be not negative number');
               }
               if ('limit' in options && !(typeof options.limit === 'number' && 0 < options.limit)) {
                  throw new TypeError('Argument "options.limit" must be positive number');
               }
            }
            //////////////////////////////////////////////////
            var count = options.limit || 10;//^^^
            //////////////////////////////////////////////////
            if (!_fetchCalls.has(count)) {
               // Если нет уже выполняющегося запроса
               if (Object.keys(_producers).length) {
                  for (var n in _producers) {
                     _fetchCalls.add(count, {tab:_tabKey, producer:n}, _producers[n].fetch(count));
                  }
               }
               if (Object.keys(_tabManagers).length) {
                  var targets;
                  for (var tabKey in _tabManagers) {
                     targets = _tabTargets(targets, tabKey, _tabManagers[tabKey]);
                  }
                  if (targets) {
                     _fetchCalls.addList(count, _expandTargets(targets), _tabCalls.callBatch(targets, 'fetch', [count], LongOperationEntry));
                  }
               }
            }
            if (_fetchCalls.has(count)) {
               // Если теперь есть
               return _fetchCalls.getResult(count);
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
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
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
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            if (tabKey && typeof tabKey !== 'string') {
               throw new TypeError('Argument "tabKey" must be a string');
            }
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
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
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
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
            if (!(typeof count === 'number' && 0 < count)) {
               throw new TypeError('Argument "count" must be positive number');
            }
            if (filter && typeof filter !== 'object') {
               throw new TypeError('Argument "filter" must be an object if present');
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
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            _channel.subscribe(eventType, listener, ctx);
         },

         /**
          * Отписаться от получения события
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          * @param {Object} [ctx] Контекст выполнения
          */
         unsubscribe: function (eventType, listener, ctx) {
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            _channel.unsubscribe(eventType, listener, ctx);
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
            var counts = _fetchCalls.listGroups();
            for (var i = 0; i < counts; i++) {
               _fetchCalls.add(counts[i], {tab:_tabKey, producer:name}, _producers[name].fetch(counts[i]));
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
            done = true;
            // Уведомить другие вкладки
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:'unregister', tab:_tabKey, producer:name});
            // И уведомить своих подписчиков
            _channel.notifyWithTarget('onproducerunregistered', manager);
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
         }
         var eventType = typeof evtName === 'object' ? evtName.name : evtName;
         if (data) {
            _channel.notifyWithTarget(eventType, manager, data);
         }
         else {
            _channel.notifyWithTarget(eventType, manager);
         }
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
               _eventListener(type, data, true);
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
            var counts = _fetchCalls.listGroups();
            if (counts.length) {
               var targets = _tabTargets(null, tabKey, newProds);
               if (targets) {
                  var params = _expandTargets(targets);
                  for (var i = 0; i < counts; i++) {
                     _fetchCalls.addList(counts[i], params, _tabCalls.callBatch(targets, 'fetch', [counts[i]], LongOperationEntry));
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

      if (typeof window !== "undefined") {

         // Установить ключ вкладки
         _tabKey = _uniqueHex(50);

         // Добавить обработчик на выгрузку для запуска метода destroy
         window.addEventListener('beforeunload', function () {
            manager.destroy();
         });

         // Создать каналы событий
         _channel = EventBus.channel();
         _tabChannel = new TabMessage();

         // Создать объект межвкладочных вызовов
         var _tabCalls = new LongOperationsTabCalls(_tabKey, manager.getByName, function (v) {
            return typeof v.toSnapshot === 'function' ? v.toSnapshot() : v;
            /*###^^^*/
         }, _tabChannel);

         // Создать пул вызовов методов fetch
         var _fetchCalls = new LongOperationsCallsPool(
            ['tab', 'producer'],
            /**
             * Обработчик одиночного результата вызова метода fetch локального продюсера или продюсера во вкладке
             * @param {number} count Максимальное количество возвращаемых элементов
             * @param {object} params Объект с идентифицирующими параметрами вызова - tab и producer
             * @param {SBIS3.CONTROLS.LongOperationEntry[]|WS.Data/Source/DataSet|WS.Data/Collection/RecordSet} result Полученный результат
             * @return {SBIS3.CONTROLS.LongOperationEntry[]}
             */
            function (count, params, result) {
               if (!(result == null || Array.isArray(result) || result instanceof DataSet || result instanceof RecordSet)) {
                  throw new Error('Unknown result type');
               }
               // Проверить, что продюсер есть и не был раз-регистрирован за время ожидания
               var prodName = (params.tab === _tabKey ? _producers[params.producer] : params.tab in _tabManagers) ? params.producer : null;
               // Если продюсер найден
               if (prodName) {
                  var values = result instanceof DataSet ? result.getAll() : result;
                  var iterate;
                  var len;
                  if (Array.isArray(values)) {
                     iterate = 'forEach';
                     len = values.length;
                  }
                  else if (values instanceof RecordSet) {
                     iterate = 'each';
                     len = values.getCount();
                  }
                  if (!iterate) {
                     throw new Error('Unknown result type');
                  }
                  if (len) {
                     var tabKey = params.tab !== _tabKey ? params.tab : null;
                     values[iterate](function (v) {
                        // Значение должно быть экземпляром SBIS3.CONTROLS.LongOperationEntry и иметь правилное имя продюсера
                        if (!(v instanceof LongOperationEntry && v.producer === prodName)) {
                           throw new Error('Invalid result');
                        }
                        v.tabKey = tabKey;
                     });
                     return values;
                  }
               }
               return null;
            },
            /**
             * Обработчик полного результата
             * @param {number} count Максимальное количество возвращаемых элементов
             * @param {SBIS3.CONTROLS.LongOperationEntry[][]} resultList Список результатов обработки одиночных результатов
             * @return {WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperationEntry>}
             */
            function (count, resultList) {
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
                           // Есть одна и та же операция от разных продюсеров - выбрать
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
                  for (var p in operations) {
                     var list = operations[p];
                     list = Object.keys(list).map(function (v) {
                        return list[v];
                     });
                     chain = !chain ? Chain(list) : chain.concat(list);
                  }
                  var STATUSES = LongOperationEntry.STATUSES;
                  results.assign(chain
                     .sort(function (a, b) {
                        var s1 = a.status === STATUSES.running || a.status === STATUSES.suspended,
                           s2 = b.status === STATUSES.running || b.status === STATUSES.suspended;
                        if (s1 !== s2) {
                           return s1 ? -1 : 1;
                        }
                        var a1 = a.startedAt,
                           b1 = b.startedAt;
                        return a1 < b1 ? 1 : (a1 === b1 ? 0 : -1);
                     })
                     .first(count)
                     .map(function (v) {
                        return new Model({rawData: v, idProperty: 'fullId'});
                     })
                     .value()
                  );
               }
               return results;
            }
         );

         // Опубликовать свои события
         _channel.publish('onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted');

         // И подписаться на события во вкладках
         _tabChannel.subscribe('LongOperations:Manager:onActivity', _tabListener);
         _tabChannel.notify('LongOperations:Manager:onActivity', {type: 'born', tab: _tabKey});
         
      }

      return manager;
   }
);
