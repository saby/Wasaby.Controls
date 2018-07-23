/**
 * Менеджер длительных операций
 *
 * @class SBIS3.CONTROLS/LongOperations/Manager
 * @author Спирин В.А.
 * @public
 *
 * @description file LongOperations.md
 *
 * @demo Examples/LongOperations/MyLongOperations/MyLongOperations
 * @demo Examples/LongOperations/MyLongOperationsSvc/MyLongOperationsSvc
 */
define('SBIS3.CONTROLS/LongOperations/Manager',
   [
      'Core/core-instance',
      'Core/EventBus',
      'Lib/Tab/Message',
      'SBIS3.CONTROLS/LongOperations/Const',
      'SBIS3.CONTROLS/LongOperations/TabKey',
      'SBIS3.CONTROLS/LongOperations/Tools/Postloader',
      'SBIS3.CONTROLS/Utils/ProtectedScope'
   ],

   function (CoreInstance, EventBus, TabMessage, LongOperationsConst, TabKey, Postloader, ProtectedScope) {
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
       * Геттер защищённых членов класса
       * @protected
       * @type {function}
       */
      var protectedOf = ProtectedScope.create();

      /**
       * Постзагрузчик методов
       * @protected
       * @type {object{SBIS3.CONTROLS/LongOperations/Postloader}}
       */
      var _postloader = new Postloader('SBIS3.CONTROLS/LongOperations/ManagerLib', [protectedOf]);

      /**
       * Список продюсеров длительных операций
       * @protected
       * @type {object{SBIS3.CONTROLS/LongOperations/IProducer}}
       */
      //var _producers = {};

      /**
       * Канал событий
       * @protected
       * @type {Core/EventBusChannel}
       */
      var _channel;

      /**
       * Канал событий вкладок
       * @protected
       * @type {Lib/Tab/Message}
       */
      //var _tabChannel;

      /**
       * Ключ текущей вкладки
       * @protected
       * @type {string}
       */
      //var _tabKey;

      /**
       * Информация о менеджерах в других вкладках
       * @protected
       * @type {object}
       */
      //var _tabManagers = {};

      /**
       * Объект для выполнения методов менеджеров в других вкладках
       * @protected
       * @type {SBIS3.CONTROLS/LongOperations/Tools/TabCalls}
       */
      //var _tabCalls;

      /**
       * Пул вызовов методов fetch
       * @protected
       * @type {SBIS3.CONTROLS/LongOperations/Tools/CallsPool}
       */
      //var _fetchCalls;

      /**
       * Счётчики текщих отступов по продюсерам
       * @protected
       * @type {SBIS3.CONTROLS/LongOperations/Tools/Bunch}
       */
      //var _offsetBunch;

      /**
       * Признак того, что менеджер ликвидирован
       * @protected
       * @type {boolean}
       */
      //var _isDestroyed;

      /**
       * Класс менеджера длительных операций
       * @public
       *
       * @author Спирин В.А.
       *
       * @type {SBIS3.CONTROLS/LongOperations/Manager}
       */
      var manager = /*CoreExtend.extend*/(/** @lends SBIS3.CONTROLS/LongOperations/Manager.prototype */{
         _moduleName: 'SBIS3.CONTROLS/LongOperations/Manager',

         /**
          * @event onlongoperationstarted Происходит при начале исполнения новой длительной операции
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS/LongOperations/IProducer
          *
          * @event onlongoperationchanged Происходит при изменении свойств длительной операции в процесе исполнения
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS/LongOperations/IProducer
          *
          * @event onlongoperationended Происходит при завершении длительной операции по любой причине. При завершении вследствие ошибки
          * предоставляется информация об ошибке в свойстве data.error
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS/LongOperations/IProducer
          *
          * @event onlongoperationdeleted При удалении длительной операции
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS/LongOperations/IProducer
          *
          * @event onproducerregistered При регистрации продюсера длительных операций в менеджере
          * @param {Core/EventObject} evtName Дескриптор события
          *
          * @event onproducerunregistered При снятии с регистрации продюсера длительных операций в менеджере
          * @param {Core/EventObject} evtName Дескриптор события
          *
          * @event ondestroy При уничтожении менеджера
          * @param {Core/EventObject} evtName Дескриптор события
          */

         /**
          * Получить ключ текущей вкладки
          * @public
          * @return {string}
          */
         getTabKey: function () {
            return protectedOf(this)._tabKey;
         },

         /**
          * Получить зарегистрированный продюсер длительных операций по его имени
          * @public
          * @param {string} prodName Имя продюсера длительных операций
          * @return {SBIS3.CONTROLS/LongOperations/IProducer}
          */
         getByName: function (prodName) {
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
            var inner = protectedOf(this);
            if (!inner._isDestroyed) {
               return inner._producers[prodName];
            }
         },

         /**
          * Зарегистрировать продюсер длительных операций
          * @public
          * @param {SBIS3.CONTROLS/LongOperations/IProducer} producer Продюсер длительных операций
          */
         register: function (producer) {
            if (!protectedOf(this)._isDestroyed) {
               _register(producer);
            }
         },

         /**
          * Удалить продюсер длительных операций из списка зарегистрированных. Возвращает значение, показывающее удалось ли раз-регистрировать
          * @public
          * @param {SBIS3.CONTROLS/LongOperations/IProducer|string} producer Продюсер длительных операций или его имя
          * @return {boolean}
          */
         unregister: function (producer) {
            if (!protectedOf(this)._isDestroyed) {
               return _unregister(producer);
            }
         },

         /**
          * Выяснить, зарегистрирован ли указанный продюсер длительных операций
          * @public
          * @param {SBIS3.CONTROLS/LongOperations/IProducer|string} producer Продюсер длительных операций или его имя
          * @return {boolean}
          */
         isRegistered: function (producer) {
            if (!producer || !(typeof producer === 'string' || CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS/LongOperations/IProducer'))) {
               throw new TypeError('Argument "producer" must be string or  SBIS3.CONTROLS/LongOperations/IProducer');
            }
            var inner = protectedOf(this);
            if (!inner._isDestroyed) {
               return typeof producer === 'string' ? !!inner._producers[producer] : !!_searchName(producer);
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
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS/LongOperations/Entry>>}
          */
         fetch: _postloader.method('fetch'),//Загрузить при использовании

         /**
          * Запросить указанный продюсер выполнить указанное действие с указанным элементом
          * @public
          * @param {string} action Название действия
          * @param {string} tabKey Ключ вкладки
          * @param {string} prodName Имя продюсера
          * @param {string|number} operationId Идентификатор длительной операции
          * @return {Core/Deferred}
          */
         callAction: _postloader.method('callAction'),//Загрузить при использовании

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
            var inner = protectedOf(this);
            if (!inner._isDestroyed) {
               if (!tabKey || tabKey === inner._tabKey) {
                  var producer = inner._producers[prodName];
                  if (!producer) {
                     throw new Error('Producer not found');
                  }
                  return inner._canHasHistory(producer);
               }
               else {
                  var tabManager = inner._tabManagers[tabKey];
                  if (tabManager && prodName in tabManager.producers) {
                     // Если вкладка не закрыта и продюсер не раз-регистрирован
                     return tabManager.producers[prodName].canHasHistory;
                  }
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
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS/LongOperations/HistoryItem>>}
          */
         history: _postloader.method('history'),//Загрузить при использовании

         /**
          * Подписаться на получение события
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          * @param {Object} [ctx] Контекст выполнения
          */
         subscribe: function (eventType, listener, ctx) {
            if (!protectedOf(this)._isDestroyed) {
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
            if (!protectedOf(this)._isDestroyed) {
               _channel.unsubscribe(eventType, listener, ctx);
            }
         },

         /**
          * Проверить, можно ли в данный момент ликвидировать экземпляр класса без необратимой потери данных
          * @public
          * @return {boolean}
          */
         canDestroySafely: function () {
            var inner = protectedOf(this);
            if (!inner._isDestroyed) {
               for (var n in inner._producers) {
                  if (inner._producers[n].canDestroySafely &&//TODO: ### Это переходный код, удалить позднее
                        !inner._producers[n].canDestroySafely()) {
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
            var inner = protectedOf(this);
            if (!inner._isDestroyed) {
               inner._isDestroyed = true;
               for (var n in inner._producers) {
                  inner._producers[n].destroy();
                  _unregister(n);
               }
               if (_channel) {
                  _channel.notifyWithTarget('ondestroy', manager);
                  _channel.unsubscribeAll();
                  _channel.destroy();
                  _channel = null;
               }
               if (inner._tabChannel) {
                  inner._tabChannel.notify('LongOperations:Manager:onActivity', {type:'die', tab:inner._tabKey});
                  inner._tabChannel.unsubscribe('LongOperations:Manager:onActivity', _tabListener);
                  inner._tabChannel.destroy();
                  inner._tabChannel = null;
               }
               if (inner._tabCalls) {
                  inner._tabCalls.destroy();
                  inner._tabCalls = null;
               }
            }
         }
      });

      // Раскрыть константы
      Object.defineProperty(manager, 'DEFAULT_FETCH_SORTING', {value:DEFAULT_FETCH_SORTING, /*writable:false,*/ enumerable:true});
      Object.defineProperty(manager, 'DEFAULT_FETCH_LIMIT', {value:DEFAULT_FETCH_LIMIT, /*writable:false,*/ enumerable:true});



      /**
       * Набор защищённых методов модуля
       */

      /**
       * Зарегистрировать продюсер длительных операций
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/IProducer} producer Продюсер длительных операций
       */
      var _register = function (producer) {
         if (!producer || !CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS/LongOperations/IProducer')) {
            throw new TypeError('Argument "producer" must be SBIS3.CONTROLS/LongOperations/IProducer');
         }
         var name = producer.getName();
         if (!name) {
            throw new Error('Producer has no name');
         }
         if (!_checkProducerName(producer)) {
            throw new Error('Producer name is invalid');
         }
         var inner = protectedOf(manager);
         var already = inner._producers[name] === producer;
         if (!already) {
            if (inner._producers[name]) {
               throw new Error('Other producer with such name already registered');
            }
            if (_searchName(producer)) {
               throw new Error('This producer with other name already registered');
            }
            // Добавить в список
            inner._producers[name] = producer;
            // Подписаться на события
            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted'].forEach(function (eventType) {
               producer.subscribe(eventType, _eventListener);
            });
             // Уведомить другие вкладки
            inner._tabChannel.notify('LongOperations:Manager:onActivity', {type:'register', tab:inner._tabKey, producer:name, isCrossTab:producer.hasCrossTabData(), hasHistory:inner._canHasHistory(producer)});
            // Если есть уже выполняющиеся запросы данных - присоединиться к ним
            if (inner._fetchCalls) {
               var queries = inner._fetchCalls.listPools();
               for (var i = 0; i < queries.length; i++) {
                  var q = queries[i];
                  inner._fetchCalls.add(q, {tab:inner._tabKey, producer:name}, inner._producers[name].fetch(q.where, q.orderBy, q.offset, q.limit, q.extra));
               }
            }
            // И уведомить своих подписчиков
            _channel.notifyWithTarget('onproducerregistered', manager);
         }
      };

      /**
       * Удалить продюсер длительных операций из списка зарегистрированных
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/IProducer|string} producer Продюсер длительных операций или его имя
       * @return {boolean}
       */
      var _unregister = function (producer) {
         if (!producer || (typeof producer !== 'string' && !CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS/LongOperations/IProducer'))) {
            throw new TypeError('Argument "producer" must be SBIS3.CONTROLS/LongOperations/IProducer or string');
         }
         var inner = protectedOf(manager);
         var name;
         if (typeof producer === 'string') {
            name = producer;
            if (!inner._producers[name]) {
               return false;
            }
         }
         else {
            name = producer.getName();
            if (!name || inner._producers[name] !== producer) {
               name =  _searchName(producer);
            }
         }
         var done = false;
         if (name) {
            // Отцепить события
            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted'].forEach(function (eventType) {
               inner._producers[name].unsubscribe(eventType, _eventListener);
            });
            // Если есть выполняющийся запрос данных - отсоединиться от него
            if (inner._fetchCalls) {
               inner._fetchCalls.remove(null, {tab:inner._tabKey, producer:name});
            }
            // Удалить из списка
            delete inner._producers[name];
            // Почистить _offsetBunch
            if (inner._offsetBunch) {
               inner._offsetBunch.removeAll({tab:inner._tabKey, producer:name});
            }
            done = true;
            // Уведомить другие вкладки
            inner._tabChannel.notify('LongOperations:Manager:onActivity', {type:'unregister', tab:inner._tabKey, producer:name});
            // И уведомить своих подписчиков
            if (!inner._isDestroyed) {
               _channel.notifyWithTarget('onproducerunregistered', manager);
            }
         }
         return done;
      };

      /**
       * Проверить правильность имени продюсера
       * Указанное имя продюсера должно быть или непосредственно именем модуля, или именем модуля и следующей после него через ":" опциональной инициализирующей строкой
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/IProducer} producer Продюсер длительных операций
       * @return {boolean}
       */
      var _checkProducerName = function (producer) {
         var prodName = producer.getName();
         var i = prodName.indexOf(':');
         var modName = i !== -1 ? prodName.substring(0, i) : prodName;
         var module = requirejs.defined(modName) ? require(modName) : (modName.substring(0, 3) !== 'js!' && requirejs.defined('js!' + modName) ? require('js!' + modName) : null);
         return !!module && (typeof module === 'function' ? producer instanceof module : producer === module);
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
       * @param {SBIS3.CONTROLS/LongOperations/IProducer} producer Продюсер длительных операций
       * @return {string}
       */
      var _searchName = function (producer) {
         var inner = protectedOf(manager);
         for (var n in inner._producers) {
            if (producer === inner._producers[n]) {
               return n;
            }
         }
      };

      /**
       * Определить, может ли продюсер иметь историю
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/IProducer} producer Продюсер длительных операций
       * @return {boolean}
       */
      protectedOf(manager)._canHasHistory = function (producer) {
         return CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS/LongOperations/IHistoricalProducer');
      };

      /**
       * Собрать объект с целями для запросов в другие вкладки
       * @protected
       * @param {object} targets Списки имён продюсеров по вкладкам
       * @param {string} tabKey Ключ вкладки
       * @param {object} prodInfo Объект, содержащий данные по нескольким продюсерам
       * @return {object}
       */
      protectedOf(manager)._tabTargets = function (targets, tabKey, prodInfo) {
         var inner = protectedOf(manager);
         for (var prodName in prodInfo) {
            // Если продюсер во вкладке имеет не cross-tab данные - использовать его
            // или имеет cross-tab данные, но не зарегистрирован в текущей вкладке
            if (!inner._tabManagers[tabKey].producers[prodName].hasCrossTabData || !inner._producers[prodName]) {
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
      protectedOf(manager)._expandTargets = function (targets) {
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
         var inner = protectedOf(manager);
         if (inner._isDestroyed) {
            return;
         }
         var producer;
         if (!dontCrossTab) {
            if (!data.producer || typeof data.producer !== 'string') {
               throw new TypeError('Unknown event');
            }
            producer = inner._producers[data.producer];
            if (!producer) {
               throw new Error('Unknown event');
            }
            var eventType = typeof evtName === 'object' ? evtName.name : evtName;
            if (inner._fetchCalls) {
               var isFullDataEvent = eventType === 'onlongoperationchanged' && data.changed === 'progress';
               if (!isFullDataEvent) {
                  // Если произошло событие в продюсере, которое не несёт полной информации о состоянии операции, и есть выполняющиеся fetch запросы -
                  // выполнить запросы к этому продюсеру повторно (все - и завершённые, и даже не завершённые, так как не завершённые уже могут быть
                  // "на подходе" со старыми данными)
                  // TODO: ### Для уменьшения количества запросов можно попробовать рассмотреть компромисный вариант - переспрашивать только если уже прошло достаточно много времени
                  var member = {tab:inner._tabKey, producer:data.producer};
                  var queries = inner._fetchCalls.listPools(member/*, true*/);
                  for (var i = 0; i < queries.length; i++) {
                     var query = queries[i];
                     inner._fetchCalls.replace(query, member, producer.fetch(query));
                  }
               }
            }
         }
         _channel.notifyWithTarget(eventType, manager, !dontCrossTab ? (data ? ObjectAssign({tabKey:inner._tabKey}, data) : {tabKey:inner._tabKey}) : data);
         if (!dontCrossTab && !producer.hasCrossTabEvents()) {
            inner._tabChannel.notify('LongOperations:Manager:onActivity', {type:eventType, tab:inner._tabKey, isCrossTab:producer.hasCrossTabData(), hasHistory:inner._canHasHistory(producer), data:data});
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
               var inner = protectedOf(manager);
               inner._tabManagers[tab] = {producers:{}, isFulloperational:false};
               var prodData = {};
               for (var n in inner._producers) {
                  prodData[n] = {isCrossTab:inner._producers[n].hasCrossTabData(), hasHistory:inner._canHasHistory(inner._producers[n])};
               }
               inner._tabChannel.notify('LongOperations:Manager:onActivity', {type:'handshake', tab:inner._tabKey, producers:prodData, isFulloperational:inner._isFulloperational});
               break;
            case 'handshake':
               if (!(evt.producers && typeof evt.producers === 'object')) {
                  throw new Error('Unknown event');
               }
               _regTabProducer(tab, evt.producers, evt.isFulloperational);
               break;
            case 'die':
               _unregTabProducer(tab);
               break;

            case 'register':
               if (!(evt.producer && typeof evt.producer === 'string' && 'isCrossTab' in evt && typeof evt.isCrossTab === 'boolean' && 'hasHistory' in evt && typeof evt.hasHistory === 'boolean')) {
                  throw new Error('Unknown event');
               }
               var prodInfo = {}; prodInfo[evt.producer] = {isCrossTab:evt.isCrossTab, hasHistory:evt.hasHistory};
               _regTabProducer(tab, prodInfo, false);
               break;
            case 'unregister':
               if (!(evt.producer && typeof evt.producer === 'string')) {
                  throw new Error('Unknown event');
               }
               _unregTabProducer(tab, evt.producer);
               break;

            case 'fulloperational':
               var tabManagers = protectedOf(manager)._tabManagers;
               if (!(tab in tabManagers)) {
                  tabManagers[tab] = {producers:{}, isFulloperational:false};
               }
               tabManagers[tab].isFulloperational = true;
               // И уведомить своих подписчиков
               _channel.notifyWithTarget('fulloperational', manager);
               break;

            case 'onlongoperationstarted':
            case 'onlongoperationchanged':
            case 'onlongoperationended':
            case 'onlongoperationdeleted':
               var data = evt.data;
               if (!(data && typeof data === 'object' && data.producer && typeof data.producer === 'string' && 'isCrossTab' in evt && typeof evt.isCrossTab === 'boolean' && 'hasHistory' in evt && typeof evt.hasHistory === 'boolean')) {
                  throw new Error('Unknown event');
               }
               var prodInfo = {}; prodInfo[data.producer] = {isCrossTab:evt.isCrossTab, hasHistory:evt.hasHistory};
               _regTabProducer(tab, prodInfo, true);
               _eventListener(type, ObjectAssign({tabKey:tab}, data), true);
               break;
         }
      };

      /**
       * Зарегистрировать продюсер(ы) из другой вкладки (если он ещё не зарегистрирован)
       * @protected
       * @param {string} tabKey Ключ вкладки
       * @param {object} prodInfo Объект, содержащий данные по нескольким продюсерам
       * @param {boolean} isFulloperational Менеджер в другой вкладке полностью функционален
       */
      var _regTabProducer = function (tabKey, prodInfo, isFulloperational) {
         var inner = protectedOf(manager);
         var tabManagers = inner._tabManagers;
         if (!(tabKey in tabManagers)) {
            tabManagers[tabKey] = {producers:{}, isFulloperational:isFulloperational};
         }
         var tabManager = tabManagers[tabKey];
         var tabProducers = tabManager.producers;
         var newProds;
         if (Object.keys(prodInfo).length) {
            newProds = {};
            for (var n in prodInfo) {
               if (!(n in tabProducers)) {
                  var inf = prodInfo[n];
                  tabProducers[n] = newProds[n] = {hasCrossTabData:inf.isCrossTab, canHasHistory:inf.hasHistory};
               }
            }
         }
         // Если есть новые продюсерв и если менеджер в другой вкладке полностью функционален
         if (newProds && tabManager.isFulloperational) {
            // Если есть уже выполняющиеся запросы данных - присоединиться к ним
            if (inner._fetchCalls) {
               var queries = inner._fetchCalls.listPools();
               if (queries.length) {
                  var targets = inner._tabTargets(null, tabKey, newProds);
                  if (targets) {
                     var members = inner._expandTargets(targets);
                     for (var i = 0; i < queries.length; i++) {
                        var q = queries[i];
                        /*^^^var promises;
                        if (0 < q.offset) {
                           promises = [];
                           for (var list = targets[tabKey], i = 0; i < list.length; i++) {
                              promises.push(inner._tabCalls.call(tabKey, list[i], 'fetch', [ObjectAssign({}, q, {offset:0})], LongOperationEntry));
                           }
                        }
                        else {
                           promises = inner._tabCalls.callBatch(targets, 'fetch', [q], LongOperationEntry);
                        }*/
                        var promises = inner._fetchFromTabs(targets, q, false);
                        inner._fetchCalls.addList(q, members, promises);
                     }
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
         var inner = protectedOf(manager);
         var tabManagers = inner._tabManagers;
         if (tabKey in tabManagers) {
            // Если есть выполняющийся запрос данных - отсоединиться от него
            if (inner._fetchCalls) {
               inner._fetchCalls.remove(null, prodName ? {tab:tabKey, producer:prodName} : {tab:tabKey});
            }
            if (prodName) {
               delete tabManagers[tabKey].producers[prodName];
            }
            else {
               delete tabManagers[tabKey];
            }
            // Почистить _offsetBunch
            if (inner._offsetBunch) {
               inner._offsetBunch.removeAll(prodName ? {tab:tabKey, producer:prodName} : {tab:tabKey});
            }
            // Уведомить своих подписчиков
            //TODO: ### Если продюсер не отображаемый, можно (нужно?) игнорировать
            _channel.notifyWithTarget('onproducerunregistered', manager);
         }
      };



      var ObjectAssign = Object.assign || function(d){return [].slice.call(arguments,1).reduce(function(r,s){return Object.keys(s).reduce(function(o,n){o[n]=s[n];return o},r)},d)};



      // Инициализировать
      protectedOf(manager)._producers = {};
      protectedOf(manager)._tabManagers = {};

      // Установить ключ вкладки
      protectedOf(manager)._tabKey = TabKey;//^^^Обдумать, не убрать ли из приватных свойств

      // Создать каналы событий
      _channel = EventBus.channel();
      protectedOf(manager)._tabChannel = new TabMessage();

      // Опубликовать свои события
      _channel.publish('onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted', 'onproducerregistered', 'onproducerunregistered', 'ondestroy');

      // И подписаться на события во вкладках
      protectedOf(manager)._tabChannel.subscribe('LongOperations:Manager:onActivity', _tabListener);
      protectedOf(manager)._tabChannel.notify('LongOperations:Manager:onActivity', {type: 'born', tab: protectedOf(manager)._tabKey});

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
         window.addEventListener('unload', manager.destroy.bind(manager));
      }

      return manager;
   }
);
