/**
 * Менеджер длительных операций
 *
 * Операции, требующие для своёго выполнения длительного времени должны отображаться пользователю не блокирующим способом. За ходом выполнения
 * длительных операций пользователь может следить в специализированных компонентах, таких как SBIS3.CONTROLS.LongOperationsPopup (информационное окно
 * длительных операций), SBIS3.CONTROLS.LongOperationsRegistry (реестр длительных операций) и других. Длительные операции могут иметь разную природу
 * и выполняться в разных программных модулях, как на стороне сервера, так и в браузере. Менеджер длительных операций
 * (SBIS3.CONTROLS.LongOperationsManager) собирает эту разнородную информацию и предоставляет её визуальным компонентам в унифицированном виде.
 * <br/>
 * Менеджер генерирует события обо всех известных ему изменениях в ходе выполнения длительных операций где-либо. Подписываясь на эти события
 * визуальные компоненты могут отображать эти изменения пользователю.
 * <br/>
 * Для получения списка текущих длительных операций от менеджера визуальные компоненты используют вызов его метода fetch. При обработке действий
 * пользователя с отображаемыми длительными операциями, такими как приостановить/возобновить выполнение операции или удалить операцию, визуальные
 * компоненты обращаются к методу менеджера callAction. При отображении истории выполнения какой-либо длительной операции визуальные компоненты
 * используют методы менеджера canHasHistory и history.
 * <br/>
 * Для сбора информации о длительных операциях и выполнения действий с ними менеджер использует продюсеры длительных операций. Продюсер длительных
 * операций - объект, реализующий интерфейс SBIS3.CONTROLS.ILongOperationsProducer. Каждый продюсер обычно отвечает за работу с длительными операциями
 * в какой-либо одной узкой предметной области. Например продусер SBIS3.Engine.RemoteSbisLongOperationsProducer предоставляет доступ к длительным
 * операциям, с которыми работает сервис LRS (/long-requests/service/). Другие продюсеры работают с длительными операциями иного характрера.
 * <br/>
 * Исключение составляет типовой продюсер (SBIS3.CONTROLS.GenericLongOperationsProducer), предоставляющий (несколько ограниченную) функциональность
 * для работы с любыми длительными операциями, когда более вдумчивая/строгая/аккуратная/глубокая работа не требуется.
 *
 * Для того, чтобы менеджер начал работу с каким-нибудь продюсером, этот продюсер должен быть зарегистрирован в менеджере с использованием его метода
 * register или registerByName. Метод register регистрирует уже созданный экземпляр продюсера. Метод registerByName сначала попытается создать
 * экземпляр продюсера, и если это поличилось - зарегистрирует его. До тех пор, пока зарегистрированный продюсер не будет раз-регистрирован с помощью
 * метода unregister, менеджер будет "видеть" его длительные операции и работать с ними. Раз-регистрация производится также либо непосредственно по
 * экземпляру продюсера, либо по имени.
 * <br/>
 *
 * @class SBIS3.CONTROLS.LongOperationsManager
 * @public
 *
 * @demo SBIS3.CONTROLS.Demo.MyLongOperations
 * @demo SBIS3.CONTROLS.Demo.MyLongOperationsSvc
 */

define('js!SBIS3.CONTROLS.LongOperationsManager',
   [
      'Core/core-instance',
      'Core/Deferred',
      'Core/ParallelDeferred',
      'Core/EventBus',
      'js!SBIS3.CORE.TabMessage',
      'js!WS.Data/Source/DataSet',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Adapter/Sbis',
      'js!WS.Data/Chain',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.LongOperationHistoryItem',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model',
      'js!SBIS3.CONTROLS.ILongOperationsProducer'
   ],

   function (CoreInstance, Deferred, ParallelDeferred, EventBus, TabMessage, DataSet, RecordSet, AdapterSbis, Chain, LongOperationEntry, LongOperationHistoryItem, Model, ILongOperationsProducer) {
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
          * Зарегистрировать продюсер(ы) длительных операций по его имени(именам)
          * @public
          * @param {string|string[]} prodName Имя(имена) продюсера(ов) длительных операций
          * @return {Core/Deferred<object>}
          */
         registerByName: function (prodName) {
            if (_isDestroyed) {
               throw new Error('Manager is destroyed');
            }
            var prodNames = prodName ? (Array.isArray(prodName) ? prodName : [prodName]) : null;
            if (!prodNames) {
               throw new TypeError('Argument "prodName" must be a string or string array');
            }
            var dfr = new Deferred();
            var dfrs = new ParallelDeferred({maxRunningCount:prodNames.length, stopOnFirstError:true});
            for (var i = 0; i < prodNames.length; i++) {
               var n = prodNames[i];
               dfrs.push(_registerByName(n), n);
            }
            dfrs.done().getResult().addCallback(dfr.callback.bind(dfr));
            return dfr;
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
          * Запросить набор последних длительных операций (отсортированных в обратном хронологическом порядке) из всех зарегистрированных продюсеров
          * @public
          * @param {number} count Максимальное количество возвращаемых элементов
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperationEntry>>}
          */
         fetch: function (count) {
            if (_isDestroyed) {
               return Deferred.fail('User left the page');
            }
            if (!(typeof count === 'number' && 0 < count)) {
               throw new TypeError('Argument "count" must be positive number' );
            }
            var features = {count:count};
            if (!_fetchCalls.has(features)) {
               // Если нет уже выполняющегося запроса
               if (Object.keys(_producers).length) {
                  for (var n in _producers) {
                     _fetchCalls.add(_tabKey, n, count, _producers[n].fetch(count));
                  }
               }
               if (Object.keys(_tabManagers).length) {
                  var targets;
                  for (var tabKey in _tabManagers) {
                     targets = _tabTargets(targets, tabKey, _tabManagers[tabKey]);
                  }
                  if (targets) {
                     _fetchCalls.addBatch(targets, count, _tabCalls.callBatch(targets, 'fetch', [count], LongOperationEntry));
                  }
               }
            }
            if (_fetchCalls.has(features)) {
               // Если теперь есть
               return _fetchCalls.onResult(count);
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
            else
            if (tabKey in _tabManagers && prodName in _tabManagers[tabKey]) {
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
               throw new TypeError('Argument "count" must be positive number' );
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
                  _tabChannel.unsubscribe('LongOperations:Manager:onCall', _tabCalls.onCall_b);
                  _tabChannel.unsubscribe('LongOperations:Manager:onResult', _tabCalls.onResult_b);
                  _tabChannel.unsubscribe('LongOperations:Manager:onActivity', _tabListener);
                  _tabChannel.destroy();
                  _tabChannel = null;
               }
            }
         }
      });

      /**
       * Набор защищённых методов модуля
       */

      /**
       * Зарегистрировать продюсер длительных операций по его имени
       * @public
       * @param {string} prodName Имя продюсера длительных операций
       * @return {Core/Deferred<SBIS3.CONTROLS.ILongOperationsProducer>}
       */
      var _registerByName = function (prodName) {
         if (!prodName || typeof prodName !== 'string') {
            throw new TypeError('Argument "prodName" must be a string');
         }
         var inf = _checkProducerName(prodName);
         if (!inf) {
            throw new Error('Producer module not found');
         }
         var dfr = new Deferred();
         require([inf.module], function (module) {
            var producer;
            switch (typeof module) {
               case 'function':
                  producer = new module(inf.initer);
                  break;
               case 'object':
                  if (!inf.initer) {
                     producer = module;
                  }
                  break;
            }
            dfr[producer && producer.getName() === prodName ? 'callback' : 'errback'](producer || 'Unable to create producer')
         });
         return dfr.addCallback(function (producer) {
            _register(producer, true);
            return producer;
         });
      };

      /**
       * Зарегистрировать продюсер длительных операций
       * @protected
       * @param {SBIS3.CONTROLS.ILongOperationsProducer} producer Продюсер длительных операций
       * @param {boolean} dontCheckName Не проверять имя продюсера
       */
      var _register = function (producer, dontCheckName) {
         if (!producer || !CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.ILongOperationsProducer')) {
            throw new TypeError('Argument "producer" must be SBIS3.CONTROLS.ILongOperationsProducer');
         }
         var name = producer.getName();
         if (!name) {
            throw new Error('Producer has no name');
         }
         if (!dontCheckName) {
            var inf = _checkProducerName(name);
            var module = inf && requirejs.defined(inf.module) ? require(inf.module) : null;
            if (!module || !(typeof module === 'function' ? producer instanceof module : producer === module)) {
               throw new Error('Producer name is invalid');
            }
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
            ['onstarted', 'onchanged', 'onended', 'ondeleted'].forEach(function (eventType) {
               producer.subscribe(eventType, _eventListener);
            });
             // Уведомить другие вкладки
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:'register', tab:_tabKey, producer:name, isCrossTab:producer.hasCrossTabData(), hasHistory:_canHasHistory(producer)});
            // Если есть уже выполняющиеся запросы данных - присоединиться к ним
            var counts = _fetchCalls.listCounts();
            for (var i = 0; i < counts; i++) {
               _fetchCalls.add(_tabKey, name, counts[i], _producers[name].fetch(counts[i]));
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
            ['onstarted', 'onchanged', 'onended', 'ondeleted'].forEach(function (eventType) {
               _producers[name].unsubscribe(eventType, _eventListener);
            });
            // Если есть выполняющийся запрос данных - отсоединиться от него
            _fetchCalls.remove({tab:_tabKey, producer:name});
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
       * Найти имя модуля продюсера и проверить однозначность его определения.
       * Указанное имя продюсера должно быть или непосредственно именем модуля, или быть его укороченным вариантом (возможно, с дефисами в качестве
       * разделителей). Если указано укороченное имя, то искомое имя модуля должно ему соответствовать, а также содержать подстроки "LongOperations"
       * и "Producer" (не зависимо от регистра) и быть единственным вариантом среди всех известных модулей, удовлетворяющим этим трём требованиям.
       * Возвращает объект, содержащий имя модуля и строку инициализатора
       * @protected
       * @param {string} prodName Имя продюсера длительных операций
       * @return {object}
       */
      var _checkProducerName = function (prodName) {
         //TODO: ### Возможно, стоит кэшировать результаты в массив ?
         var i = prodName.indexOf(':');
         // Извлечь (возможно укороченное) имя модуля
         var modName = i !== -1 ? prodName.substring(0, i) : prodName;
         var initer = i !== -1 ? prodName.substring(i + 1) : null;
         var mods = require('Core/constants').jsModules;
         if (modName in mods) {
            // Модуль есть в списке - больше ничего не надо
            return {module:modName, initer:initer};
         }
         // Если modName не оказался полным именем модуля
         var patterns = [(modName.indexOf('.') === -1 ? 'controls.' : '') + modName.replace(/[_\-]+/, '').toLowerCase(), 'longoperations', 'producer'];
         //###var patterns = [_dashed2Camel(modName).toLowerCase(), 'longoperations', 'producer'];
         var list = Object.keys(mods).filter(function (v1) { var v2 = v1.toLowerCase(); return patterns.every(function (v3) { return v2.indexOf(v3) !== -1; }); });
         return list.length === 1 ? {module:'js!' + list[0], initer:initer} : null;
      };

      /**
       * Трансформировать аргумент в верблюжью нотацию
       * @protected
       * @param {string} name Имя с дефисом в качестве разделителя
       * @return {string}
       */
      var _dashed2Camel = function (name) {
         return name.split('-').map(function (v) { return v.charAt(0).toUpperCase() + v.substring(1); }).join('');
      };

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
         var eventType = {
            onstarted: 'onoperationstarted',
            onchanged: 'onoperationchanged',
            onended: 'onoperationended',
            ondeleted: 'onoperationdeleted'
         }[typeof evtName === 'object' ? evtName.name : evtName];
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

            case 'onoperationstarted':
            case 'onoperationchanged':
            case 'onoperationended':
            case 'onoperationdeleted':
               var data = evt.data;
               if (!(data && typeof data === 'object' && data.producer && typeof data.producer === 'string' && 'isCrossTab' in evt && typeof evt.isCrossTab === 'boolean' && 'hasHistory' in evt && typeof evt.hasHistory === 'boolean')) {
                  throw new Error('Unknown event');
               }
               _regTabProducer(tab, data.producer, evt.isCrossTab, evt.hasHistory);
               _eventListener({
                  onoperationstarted: 'onstarted',
                  onoperationchanged: 'onchanged',
                  onoperationended: 'onended',
                  onoperationdeleted: 'ondeleted'
               }[type], data, true);
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
            var counts = _fetchCalls.listCounts();
            if (counts.length) {
               var targets = _tabTargets(null, tabKey, newProds);
               if (targets) {
                  for (var i = 0; i < counts; i++) {
                     _fetchCalls.addBatch(targets, counts[i], _tabCalls.callBatch(targets, 'fetch', [counts[i]], LongOperationEntry));
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
            _fetchCalls.remove(prodName ? {tab:tabKey, producer:prodName} : {tab:tabKey});
            if (prodName) {
               delete _tabManagers[tabKey][prodName];
            }
            else {
               delete _tabManagers[tabKey];
            }
            // Уведомить своих подписчиков
            _channel.notifyWithTarget('onproducerunregistered', manager);
         }
      };



      /**
       * Подкласс с набором методов для выполнения методов менеджеров в других вкладках
       * @protected
       * @type {object}
       */
      var _tabCalls = {
         /**
          * Запросить выполнение метода у нескольких менеджеров во вкладках. Возвращает массив обещаний результатов
          * @public
          * @param {object} targets Списки имён продюсеров по вкладкам
          * @param {string} method Имя вызываемого метода
          * @param {any[]} [args] Массив аргументов вызова
          * @param {function} [resultClass] Класс ожидаемого результата
          * @return {Core/Deferred<any>[]}
          */
         callBatch: function (targets, method, args, resultClass) {
            var calls = [];
            var promises = [];
            for (var tabKey in targets) {
               var prodNames = targets[tabKey];
               for (var i = 0; i < prodNames.length; i++) {
                  var call = {tab:tabKey, producer:prodNames[i], method:method, args:args, resultClass:resultClass, promise:new Deferred()};
                  calls.push(call);
                  promises.push(call.promise);
               }
            }
            if (calls.length) {
               this._list.push.apply(this._list, calls);
               _tabChannel.notify('LongOperations:Manager:onCall', {from:_tabKey, targets:targets, method:method, args:args});
            }
            return promises;
         },

         /**
          * Запросить выполнение метода у менеджера во вкладке. Возвращает обещание результата
          * @protected
          * @param {string} tabKey Ключ вкладки
          * @param {string} prodName Имя продюсера
          * @param {string} method Имя вызываемого метода
          * @param {any[]} [args] Массив аргументов вызова
          * @param {function} [resultClass] Класс ожидаемого результата
          * @return {Core/Deferred<any>}
          */
         call: function (tabKey, prodName, method, args, resultClass) {
            var call = {tab:tabKey, producer:prodName, method:method, args:args, resultClass:resultClass, promise:new Deferred()};
            this._list.push(call);
            var targets = {};
            targets[tabKey] = [prodName];
            _tabChannel.notify('LongOperations:Manager:onCall', {from:_tabKey, targets:targets, method:method, args:args});
            return call.promise;
         },

         /**
          * Слушатель извещений о запросах из менеджеров в других вкладках
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} evt Cобытие полностью
          */
         onCall: function (evtName, evt) {
            if (!(evt && typeof evt === 'object'
               && evt.from && typeof evt.from === 'string'
               && evt.targets && typeof evt.targets === 'object'
               && evt.method && typeof evt.method === 'string')) {
               throw new TypeError('Unknown event');
            }
            if (_tabKey in evt.targets) {
               var from = evt.from;
               var method = evt.method;
               var args = evt.args;
               var prodNames = evt.targets[_tabKey];
               for (var i = 0; i < prodNames.length; i++) {
                  var prodName = prodNames[i];
                  var err = null;
                  if (prodName in _producers) {
                     var producer = _producers[prodName];
                     if (method in producer) {
                        try {
                           producer[method].apply(producer, args && Array.isArray(args) ? args : []).addBoth(
                              function (result) {
                                 var answer = {from:_tabKey, target:from, producer:prodName, method:method, args:args};
                                 if (result instanceof Error) {
                                    answer.error = result.message || '' + result;
                                 }
                                 else {
                                    if (result && typeof result === 'object') {
                                       var pack = function (v) { return typeof v.toSnapshot === 'function' ? v.toSnapshot() : v; };//###^^^
                                       if (result instanceof DataSet) {
                                          result = result.getAll();
                                       }
                                       if (result instanceof RecordSet) {
                                          result = Chain(result).map(pack).values();
                                       }
                                       else
                                       if (Array.isArray(result)) {
                                          result = result.map(pack);
                                       }
                                       else {
                                          result = pack(result);
                                       }
                                    }
                                    answer.result = result;
                                 }
                                 _tabChannel.notify('LongOperations:Manager:onResult', answer);
                              }
                           );
                        }
                        catch (ex) {
                           err = ex.message || '' + ex;
                        }
                     }
                     else {
                        err = 'Method not found'
                     }
                  }
                  else {
                     err = 'Producer not found';
                  }
                  if (err) {
                     _tabChannel.notify('LongOperations:Manager:onResult', {from:_tabKey, target:from, producer:prodName, method:method, args:args, error:err});
                  }
               }
            }
         },

         /**
          * Слушатель извещений о получении результата запроса из менеджеров в других вкладках
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} evt Cобытие полностью
          */
         onResult: function (evtName, evt) {
            if (!(evt && typeof evt === 'object'
               && evt.from && typeof evt.from === 'string'
               && evt.target && typeof evt.target === 'string'
               && evt.producer && typeof evt.producer === 'string'
               && evt.method && typeof evt.method === 'string'
               && (!evt.error || typeof evt.error === 'string'))) {
               throw new TypeError('Unknown event');
            }
            if (evt.target === _tabKey) {
               var call = this._get(evt.from, evt.producer, evt.method, evt.args, true);
               if (!call) {
                  throw new Error('Not found');
               }
               if (!evt.error) {
                  var result = evt.result;
                  var ctor = call.resultClass;
                  if (ctor) {
                     if (!result || typeof result !== 'object') {
                        throw new Error('Result required');
                     }
                     var unpack = function (v) { return new ctor(v); };
                     result = Array.isArray(result) ? result.map(unpack) : unpack(result);
                  }
                  call.promise.callback(result);
               }
               else {
                  call.promise.errback(new Error(evt.error));
               }
            }
         },

         /**
          * Получить запрос из списка выполняющихся во вкладках запросов
          * @protected
          * @param {string} tabKey Ключ вкладки
          * @param {string} prodName Имя продюсера
          * @param {string} method Имя вызываемого метода
          * @param {object} args Аргументы вызова
          * @param {boolean} andRemove Удалить возвращаемый запрос из списка
          */
         _get: function (tabKey, prodName, method, args, andRemove) {
            for (var i = 0; i < this._list.length; i++) {
               var call = this._list[i];
               if (call.tab === tabKey && call.producer === prodName && call.method === method && this._isEq(call.args, args)) {
                  if (andRemove) {
                     this._list.splice(i, 1);
                  }
                  return call;
               }
            }
         },

         /**
          * Проверить на равенство два значения
          * @protected
          * @param {object} v1 Сравниваемое значение
          * @param {object} v2 Сравниваемое значение
          * @return {boolean}
          */
         _isEq: function (v1, v2) {
            if (v1 == null && v2 == null) {
               return true;
            }
            if (!(v1 && typeof v1 === 'object' && v2 && typeof v2 === 'object')) {
               return v1 === v2;
            }
            if (Array.isArray(v1)) {
               if (!Array.isArray(v2) || v1.length !== v2.length) {
                  return false;
               }
               for (var i = 0; i < v1.length; i++) {
                  if (!this._isEq(v1[i], v2[i])) {
                     return false;
                  }
               }
            }
            else {
               if (Array.isArray(v2)) {
                  return false;
               }
               var ns = Object.keys(v1);
               if (ns.length != Object.keys(v2).length) {
                  return false;
               }
               for (var i = 0; i < ns.length; i++) {
                  var n = ns[i];
                  if (!this._isEq(v1[n], v2[n])) {
                     return false;
                  }
               }
            }
            return true;
         },

         /**
          * Список вызовов
          * @protected
          * @type {object[]}
          */
         _list: []
      };



      /**
       * Подкласс с набором методов для сбора данных от разных продюсеров и менеджеров при выполнения методов fetch. Содержит элементы в виде {tab, producer, count, promise}
       * @protected
       * @type {object}
       */
      var _fetchCalls = {
         /**
          * Добавить пакет запросов в список выполняющихся запросов. Возвращает список созданных элементов
          * @public
          * @param {object} targets Списки имён продюсеров по вкладкам
          * @param {number} count Количество запрошеных элементов
          * @param {Core/Deferred[]} promises Массив обещаний результатов
          */
         addBatch: function (targets, count, promises) {
            var j = 0;
            for (var tabKey in targets) {
               var tabProds = targets[tabKey];
               for (var i = 0; i < tabProds.length; i++) {
                  var prodName = tabProds[i];
                  var call = {tab:tabKey, producer:prodName, count:count};
                  if (this.has(call)) {
                     throw new Error('Already exists');
                  }
                  if (promises.length <= j) {
                     throw new Error('Out of bounds');
                  }
                  call.promise = promises[j++];
                  call.promise.addBoth(this._onPartial.bind(this, call));
                  this._calls.push(call);
               }
            }
            if (j !== promises.length) {
               throw new Error('Out of bounds');
            }

         },

         /**
          * Добавить запрос в список выполняющихся запросов. Возвращает созданный элемент
          * @public
          * @param {string} tabKey Ключ вкладки
          * @param {string} prodName Имя продюсера
          * @param {number} count Количество запрошеных элементов
          * @param {Core/Deferred} promise Обещание результата
          */
         add: function (tabKey, prodName, count, promise) {
            var call = {tab:tabKey, producer:prodName, count:count};
            if (this.has(call)) {
               throw new Error('Already exists');
            }
            call.promise = promise;
            call.promise.addBoth(this._onPartial.bind(this, call));
            this._calls.push(call);
         },

         /**
          * Добавить обещание, ожидающее результат
          * @public
          * @param {number} count Количество запрошеных элементов
          * @return {Core/Deferred<WS.Data/Collection/RecordSet>}
          */
         onResult: function (count) {
            var dfr = new Deferred();
            if (!(count in this._promises)) {
               this._promises[count] = [];
            }
            this._promises[count].push(dfr);
            // Проверить, возможно все результаты уже получены сразу
            if (this._isComplete(count)) {
               // Все результаты теперь есть
               this._onComplete(count);
            }
            return dfr;
         },

         /**
          * Найти все запросы по критериям в списке выполняющихся запросов. Возвращает список найденных элементов
          * @protected
          * @param {object} features Критерии
          * @return {object[]}
          */
         _search: function (features) {
            var list = [];
            for (var i = 0; i < this._calls.length; i++) {
               var fc = this._calls[i];
               if (this._hasProps(fc, features)) {
                  list.push(fc);
               }
            }
            return list;
         },

         /**
          * Проверить, есть ли удовлетворяющие критериям запросы в списке выполняющихся запросов
          * @public
          * @param {object} features Критерии
          * @return {boolean}
          */
         has: function (features) {
            for (var i = 0; i < this._calls.length; i++) {
               if (this._hasProps(this._calls[i], features)) {
                  return true;
               }
            }
            return false;
         },

         /**
          * Удалить удовлетворяющие критериям запросы из списка выполняющихся запросов
          * @public
          * @param {object} features Критерии
          */
         remove: function (features) {
            for (var i = this._calls.length - 1; 0 <= i; i--) {
               var fc = this._calls[i];
               if (this._hasProps(fc, features)) {
                  // Удалить из списка
                  this._calls.splice(i, 1);
                  if (fc.promise && fc.promise.cancel) {
                     fc.promise.cancel();
                  }
               }
            }
         },

         /**
          * Перечислить все количества, встречающиеся в списке выполняющихся запросов
          * @public
          * @return {number[]}
          */
         listCounts: function () {
            var list = [];
            for (var i = 0; i < this._calls.length; i++) {
               var value = this._calls[i].count;
               if (list.indexOf(value) === -1) {
                  list.push(value);
               }
            }
            return list;
         },

         /**
          * Проверить, имеет ли указанный объект все указанные значения свойств
          * @protected
          * @param {object} obj Тестируемый объект
          * @param {object} props Свойства
          * @return {boolean}
          */
         _hasProps: function (obj, props) {
            for (var n in props) {
               if (!(n in obj && props[n] === obj[n])) {
                  return false;
               }
            }
            return true;
         },

         /**
          * Обработчик одиночного результата
          * @public
          * @param {object} call Элемент
          * @param {SBIS3.CONTROLS.LongOperationEntry[]|WS.Data/Source/DataSet|WS.Data/Collection/RecordSet|Error} result Результат или ошибка
          */
         _onPartial: function (call, result) {
            if (!(result == null || Array.isArray(result) || result instanceof DataSet || result instanceof RecordSet || result instanceof Error)) {
               throw new Error('Unknown result type');
            }
            delete call.promise;
            if (result instanceof Error) {
               call.error = result;
            }
            else {
               call.result = null;
               // Проверить, что продюсер есть и не был раз-регистрирован за время ожидания
               var prodName = (call.tab === _tabKey ? _producers[call.producer] : call.tab in _tabManagers) ? call.producer : null;
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
                     var tabKey = call.tab !== _tabKey ? call.tab : null;
                     values[iterate](function (v) {
                        // Значение должно быть экземпляром SBIS3.CONTROLS.LongOperationEntry и иметь правилное имя продюсера
                        if (!(v instanceof LongOperationEntry && v.producer === prodName)) {
                           throw new Error('Invalid result');
                        }
                        v.tabKey = tabKey;
                     });
                     call.result = values;
                  }
               }
            }
            var count = call.count;
            // Если результат уже ожидается
            // - проверить, все ли результаты получены или нужно ждать дальше
            if (this._isComplete(count)) {
               // Все результаты теперь есть
               this._onComplete(count);
            }
         },

         /**
          * Проверить, все ли результаты получены или нужно ждать дальше
          * @public
          * @param {number} count Максимальное количество возвращаемых элементов
          * @return {boolean}
          */
         _isComplete: function (count) {
            if (count in this._promises && this._promises[count].length) {
               for (var i = 0; i < this._calls.length; i++) {
                  var fc = this._calls[i];
                  if (fc.count === count && fc.promise) {
                     return false;
                  }
               }
               // Все результаты есть
               return true;
            }
            return false;
         },

         /**
          * Объединяет и сортирует полученные результаты и отправляет всем ожидающим рекордсет, содержащий указанное количество элементов
          * @protected
          * @param {number} count Максимальное количество возвращаемых элементов
          */
         _onComplete: function (count) {
            var operations;
            var calls = this._search({count:count});
            var promises = this._promises[count];
            this.remove({count:count});
            delete this._promises[count];
            for (var i = 0; i < calls.length; i++) {
               var call = calls[i];
               if (call.error || !call.result) {
                  continue;
               }
               for (var j = 0, list = call.result; j < list.length; j++) {
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
            var results = new RecordSet({
               model: Model,
               idProperty: 'fullId'
            });
            if (operations) {
               var chain;
               for (var p in operations) {
                  var list = operations[p];
                  list = Object.keys(list).map(function (v) { return list[v]; });
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
                  .map(function (v) { return new Model({rawData:v, idProperty: 'fullId'}); })
                  .value()
               );
            }
            if (promises) {
               for (var i = 0; i < promises.length; i++) {
                  promises[i].callback(results);
               }
            }
         },

         /**
          * Список выполняющихся запросов в виде {tab, producer, count, promise}
          * @protected
          * @type {object[]}
          */
         _calls: [],

         /**
          * Список обещаний, ожидающих результаты
          * @protected
          * @type {object}
          */
         _promises: {}
      };



      /**
       * Сгенерировать случайную hex-строку указанной длины
       * @protected
       * @param {number} n Длина строки
       * @return {string}
       */
      var _uniqueHex = function(n){var l=[];for(var i=0;i<n;i++){l[i]=Math.round(15*Math.random()).toString(16)}return l.join('')};
      //var _uniqueHex = function(n){return Math.round((Math.pow(16,n)-1)*Math.random()).toString(16).padStart(n,'0')};



      // Установить ключ вкладки
      _tabKey = _uniqueHex(50);

      // Добавить обработчик на выгрузку для запуска метода destroy
      window.addEventListener('beforeunload', function () {
         manager.destroy();
      });

      // Создать каналы событий
      _channel = EventBus.channel();
      _tabChannel = new TabMessage();

      // Опубликовать свои события
      _channel.publish('onoperationstarted', 'onoperationchanged', 'onoperationended', 'onoperationdeleted');

      // И подписаться на события во вкладках
      _tabChannel.subscribe('LongOperations:Manager:onCall', _tabCalls.onCall_b = _tabCalls.onCall.bind(_tabCalls));
      _tabChannel.subscribe('LongOperations:Manager:onResult', _tabCalls.onResult_b = _tabCalls.onResult.bind(_tabCalls));
      _tabChannel.subscribe('LongOperations:Manager:onActivity', _tabListener);
      _tabChannel.notify('LongOperations:Manager:onActivity', {type:'born', tab:_tabKey});



      return manager;
   }
);
