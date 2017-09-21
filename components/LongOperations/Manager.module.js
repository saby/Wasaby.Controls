/**
 * Менеджер длительных операций
 *
 * @class SBIS3.CONTROLS.LongOperations.Manager
 * @public
 *
 * @description file LongOperations.md
 *
 * @demo SBIS3.CONTROLS.Demo.MyLongOperations
 * @demo SBIS3.CONTROLS.Demo.MyLongOperationsSvc
 */
define('js!SBIS3.CONTROLS.LongOperations.Manager',
   [
      'Core/core-instance',
      'Core/Deferred',
      'Core/EventBus',
      'js!SBIS3.CORE.TabMessage',
      'js!SBIS3.CONTROLS.LongOperations.Const',
      'js!SBIS3.CONTROLS.LongOperations.Tools.TabCalls',
      'js!SBIS3.CONTROLS.LongOperations.Tools.Bunch',
      'js!SBIS3.CONTROLS.LongOperations.Tools.Postloader',
      'js!SBIS3.CONTROLS.LongOperations.Tools.ProtectedScope',
      'js!SBIS3.CONTROLS.LongOperations.Entry'//^^^ Убрать ?
   ],

   function (CoreInstance, Deferred, EventBus, TabMessage, LongOperationsConst, LongOperationsTabCalls, LongOperationsBunch, Postloader, ProtectedScope, LongOperationEntry) {
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
       * @type {object{SBIS3.CONTROLS.LongOperations.Postloader}}
       */
      var _postloader = new Postloader('js!SBIS3.CONTROLS.LongOperations.ManagerLib', [protectedOf]);

      /**
       * Список продюсеров длительных операций
       * @protected
       * @type {object{SBIS3.CONTROLS.LongOperations.IProducer}}
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
       * @type {SBIS3.CORE.TabMessage}
       */
      var _tabChannel;

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
       * @type {SBIS3.CONTROLS.LongOperations.Tools.TabCalls}
       */
      //var _tabCalls;

      /**
       * Объект для сбора данных от разных продюсеров и менеджеров при выполнения методов fetch
       * @protected
       * @type {SBIS3.CONTROLS.LongOperations.Tools.CallsPool}
       */
      //var _fetchCalls;

      /**
       * Счётчики текщих отступов по продюсерам
       * @protected
       * @type {SBIS3.CONTROLS.LongOperations.Tools.Bunch}
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
       * @author Спирин Виктор Алексеевич
       *
       * @type {SBIS3.CONTROLS.LongOperations.Manager}
       */
      var manager = /*CoreExtend.extend*/(/** @lends SBIS3.CONTROLS.LongOperations.Manager.prototype */{
         _moduleName: 'SBIS3.CONTROLS.LongOperations.Manager',

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
          * @return {SBIS3.CONTROLS.LongOperations.IProducer}
          */
         getByName: function (prodName) {
            if (!prodName || typeof prodName !== 'string') {
               throw new TypeError('Argument "prodName" must be a string');
            }
            if (!protectedOf(this)._isDestroyed) {
               return protectedOf(this)._producers[prodName];
            }
         },

         /**
          * Зарегистрировать продюсер длительных операций
          * @public
          * @param {SBIS3.CONTROLS.LongOperations.IProducer} producer Продюсер длительных операций
          */
         register: function (producer) {
            if (!protectedOf(this)._isDestroyed) {
               _register(producer);
            }
         },

         /**
          * Удалить продюсер длительных операций из списка зарегистрированных. Возвращает значение, показывающее удалось ли раз-регистрировать
          * @public
          * @param {SBIS3.CONTROLS.LongOperations.IProducer|string} producer Продюсер длительных операций или его имя
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
          * @param {SBIS3.CONTROLS.LongOperations.IProducer|string} producer Продюсер длительных операций или его имя
          * @return {boolean}
          */
         isRegistered: function (producer) {
            if (!producer || !(typeof producer === 'string' || CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.LongOperations.IProducer'))) {
               throw new TypeError('Argument "producer" must be string or  SBIS3.CONTROLS.LongOperations.IProducer');
            }
            if (!protectedOf(this)._isDestroyed) {
               return typeof producer === 'string' ? !!protectedOf(this)._producers[producer] : !!_searchName(producer);
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
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperations.Entry>>}
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
            if (!protectedOf(this)._isDestroyed) {
               if (!tabKey || tabKey === protectedOf(this)._tabKey) {
                  var producer = protectedOf(this)._producers[prodName];
                  if (!producer) {
                     throw new Error('Producer not found');
                  }
                  return _canHasHistory(producer);
               }
               else
               if (tabKey in protectedOf(this)._tabManagers && prodName in protectedOf(this)._tabManagers[tabKey]) {
                  // Если вкладка не закрыта и продюсер не раз-регистрирован
                  return protectedOf(this)._tabManagers[tabKey][prodName].canHasHistory;
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
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperations.HistoryItem>>}
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
            if (!protectedOf(this)._isDestroyed) {
               for (var n in protectedOf(this)._producers) {
                  if (protectedOf(this)._producers[n].canDestroySafely &&//TODO: ### Это переходный код, удалить позднее
                        !protectedOf(this)._producers[n].canDestroySafely()) {
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
            if (!protectedOf(this)._isDestroyed) {
               protectedOf(this)._isDestroyed = true;
               for (var n in protectedOf(this)._producers) {
                  protectedOf(this)._producers[n].destroy();
                  _unregister(n);
               }
               if (_channel) {
                  _channel.notifyWithTarget('ondestroy', manager);
                  _channel.unsubscribeAll();
                  _channel.destroy();
                  _channel = null;
               }
               if (_tabChannel) {
                  _tabChannel.notify('LongOperations:Manager:onActivity', {type:'die', tab:protectedOf(this)._tabKey});
                  _tabChannel.unsubscribe('LongOperations:Manager:onActivity', _tabListener);
                  _tabChannel.destroy();
                  _tabChannel = null;
               }
               protectedOf(this)._tabCalls.destroy();
               protectedOf(this)._tabCalls = null;
               //^^^protectedOf.clear(this);//^^^ Допилить ?
            }
         }
      });

      // Раскрыть константы
      Object.defineProperty(manager, 'DEFAULT_FETCH_SORTING', {value:DEFAULT_FETCH_SORTING, /*writable:false,*/ enumerable:true});
      Object.defineProperty(manager, 'DEFAULT_FETCH_LIMIT', {value:DEFAULT_FETCH_LIMIT, /*writable:false,*/ enumerable:true});

      // Инициализировать
      protectedOf(manager)._producers = {};
      protectedOf(manager)._tabManagers = {};



      /**
       * Набор защищённых методов модуля
       */

      /**
       * Зарегистрировать продюсер длительных операций
       * @protected
       * @param {SBIS3.CONTROLS.LongOperations.IProducer} producer Продюсер длительных операций
       */
      var _register = function (producer) {
         if (!producer || !CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.LongOperations.IProducer')) {
            throw new TypeError('Argument "producer" must be SBIS3.CONTROLS.LongOperations.IProducer');
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
         var already = protectedOf(manager)._producers[name] === producer;
         if (!already) {
            if (protectedOf(manager)._producers[name]) {
               throw new Error('Other producer with such name already registered');
            }
            if (_searchName(producer)) {
               throw new Error('This producer with other name already registered');
            }
            // Добавить в список
            protectedOf(manager)._producers[name] = producer;
            // Подписаться на события
            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted'].forEach(function (eventType) {
               producer.subscribe(eventType, _eventListener);
            });
             // Уведомить другие вкладки
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:'register', tab:protectedOf(manager)._tabKey, producer:name, isCrossTab:producer.hasCrossTabData(), hasHistory:_canHasHistory(producer)});
            // Если есть уже выполняющиеся запросы данных - присоединиться к ним
            if (protectedOf(manager)._fetchCalls) {
               var queries = protectedOf(manager)._fetchCalls.listPools();
               for (var i = 0; i < queries.length; i++) {
                  var q = queries[i];
                  protectedOf(manager)._fetchCalls.add(q, {tab:protectedOf(manager)._tabKey, producer:name}, protectedOf(manager)._producers[name].fetch(q.where, q.orderBy, q.offset, q.limit, q.extra));
               }
            }
            // И уведомить своих подписчиков
            _channel.notifyWithTarget('onproducerregistered', manager);
         }
      };

      /**
       * Удалить продюсер длительных операций из списка зарегистрированных
       * @protected
       * @param {SBIS3.CONTROLS.LongOperations.IProducer|string} producer Продюсер длительных операций или его имя
       * @return {boolean}
       */
      var _unregister = function (producer) {
         if (!producer || (typeof producer !== 'string' && !CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.LongOperations.IProducer'))) {
            throw new TypeError('Argument "producer" must be SBIS3.CONTROLS.LongOperations.IProducer or string');
         }
         var name;
         if (typeof producer === 'string') {
            name = producer;
            if (!protectedOf(manager)._producers[name]) {
               return false;
            }
         }
         else {
            name = producer.getName();
            if (!name || protectedOf(manager)._producers[name] !== producer) {
               name =  _searchName(producer);
            }
         }
         var done = false;
         if (name) {
            // Отцепить события
            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted'].forEach(function (eventType) {
               protectedOf(manager)._producers[name].unsubscribe(eventType, _eventListener);
            });
            // Если есть выполняющийся запрос данных - отсоединиться от него
            if (protectedOf(manager)._fetchCalls) {
               protectedOf(manager)._fetchCalls.remove(null, {tab:protectedOf(manager)._tabKey, producer:name});
            }
            // Удалить из списка
            delete protectedOf(manager)._producers[name];
            // Почистить protectedOf(manager)._offsetBunch
            protectedOf(manager)._offsetBunch.removeAll({tab:protectedOf(manager)._tabKey, producer:name});
            done = true;
            // Уведомить другие вкладки
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:'unregister', tab:protectedOf(manager)._tabKey, producer:name});
            // И уведомить своих подписчиков
            if (!protectedOf(manager)._isDestroyed) {
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
       * @param {SBIS3.CONTROLS.LongOperations.IProducer} producer Продюсер длительных операций
       * @return {string}
       */
      var _searchName = function (producer) {
         for (var n in protectedOf(manager)._producers) {
            if (producer === protectedOf(manager)._producers[n]) {
               return n;
            }
         }
      };

      /**
       * Определить, может ли продюсер иметь историю
       * @protected
       * @param {SBIS3.CONTROLS.LongOperations.IProducer} producer Продюсер длительных операций
       * @return {boolean}
       */
      var _canHasHistory = function (producer) {
         return CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.LongOperations.IHistoricalProducer');
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
         for (var prodName in prodInfo) {
            // Если продюсер во вкладке имеет не cross-tab данные - использовать его
            // или имеет cross-tab данные, но не зарегистрирован в текущей вкладке
            if (!protectedOf(manager)._tabManagers[tabKey][prodName].hasCrossTabData || !protectedOf(manager)._producers[prodName]) {
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
         if (protectedOf(manager)._isDestroyed) {
            return;
         }
         var producer;
         if (!dontCrossTab) {
            if (!data.producer || typeof data.producer !== 'string') {
               throw new TypeError('Unknown event');
            }
            producer = protectedOf(manager)._producers[data.producer];
            if (!producer) {
               throw new Error('Unknown event');
            }
            // Если произошло событие в продюсере и есть выполняющиеся fetch запросы - выполнить запросы к этому продюсеру повторно
            // (все - и завершённые, и даже не завершённые, так как не завершённые уже могут быть "на подходе" со старыми данными)
            // TODO: ### Для уменьшения количества запросов можно попробовать рассмотреть компромисный вариант - переспрашивать только если уже прошло достаточно много времени
            var member = {tab:protectedOf(manager)._tabKey, producer:data.producer};
            if (protectedOf(manager)._fetchCalls) {
               var queries = protectedOf(manager)._fetchCalls.listPools(member/*, true*/);
               for (var i = 0; i < queries.length; i++) {
                  var query = queries[i];
                  protectedOf(manager)._fetchCalls.replace(query, member, producer.fetch(query));
               }
            }
         }
         var eventType = typeof evtName === 'object' ? evtName.name : evtName;
         _channel.notifyWithTarget(eventType, manager, !dontCrossTab ? (data ? ObjectAssign({tabKey:protectedOf(manager)._tabKey}, data) : {tabKey:protectedOf(manager)._tabKey}) : data);
         if (!dontCrossTab && !producer.hasCrossTabEvents()) {
            _tabChannel.notify('LongOperations:Manager:onActivity', {type:eventType, tab:protectedOf(manager)._tabKey, isCrossTab:producer.hasCrossTabData(), hasHistory:_canHasHistory(producer), data:data});
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
               protectedOf(manager)._tabManagers[tab] = {};
               var prodData = {};
               for (var n in protectedOf(manager)._producers) {
                  prodData[n] = {isCrossTab:protectedOf(manager)._producers[n].hasCrossTabData(), hasHistory:_canHasHistory(protectedOf(manager)._producers[n])};
               }
               _tabChannel.notify('LongOperations:Manager:onActivity', {type:'handshake', tab:protectedOf(manager)._tabKey, producers:prodData});
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
         if (!(tabKey in protectedOf(manager)._tabManagers)) {
            protectedOf(manager)._tabManagers[tabKey] = {};
         }
         var tabProds = protectedOf(manager)._tabManagers[tabKey];
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
            if (protectedOf(manager)._fetchCalls) {
               var queries = protectedOf(manager)._fetchCalls.listPools();
               if (queries.length) {
                  var targets = protectedOf(manager)._tabTargets(null, tabKey, newProds);
                  if (targets) {
                     var members = protectedOf(manager)._expandTargets(targets);
                     for (var i = 0; i < queries.length; i++) {
                        var q = queries[i];
                        var promises;
                        if (0 < q.offset) {
                           promises = [];
                           for (var list = targets[tabKey], i = 0; i < list.length; i++) {
                              promises.push(protectedOf(manager)._tabCalls.call(tabKey, list[i], 'fetch', [ObjectAssign({}, q, {offset:0})], LongOperationEntry));
                           }
                        }
                        else {
                           promises = protectedOf(manager)._tabCalls.callBatch(targets, 'fetch', [q], LongOperationEntry);
                        }
                        protectedOf(manager)._fetchCalls.addList(q, members, promises);
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
         if (tabKey in protectedOf(manager)._tabManagers) {
            // Если есть выполняющийся запрос данных - отсоединиться от него
            if (protectedOf(manager)._fetchCalls) {
               protectedOf(manager)._fetchCalls.remove(null, prodName ? {tab:tabKey, producer:prodName} : {tab:tabKey});
            }
            if (prodName) {
               delete protectedOf(manager)._tabManagers[tabKey][prodName];
            }
            else {
               delete protectedOf(manager)._tabManagers[tabKey];
            }
            // Почистить protectedOf(manager)._offsetBunch
            protectedOf(manager)._offsetBunch.removeAll(prodName ? {tab:tabKey, producer:prodName} : {tab:tabKey});
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
      protectedOf(manager)._tabKey = _uniqueHex(50);

      // Создать каналы событий
      _channel = EventBus.channel();
      _tabChannel = new TabMessage();

      // Создать объект межвкладочных вызовов
      protectedOf(manager)._tabCalls = new LongOperationsTabCalls(
         /*tabKey:*/protectedOf(manager)._tabKey,
         /*router:*/manager.getByName,
         /*packer:*/function (v) {
            // Упаковщик для отправки. Ожидается, что все объекты будут экземплярами SBIS3.CONTROLS.LongOperations.Entry
            return v && typeof v.toSnapshot === 'function' ? v.toSnapshot() : v;
         },
         /*channel:*/_tabChannel
      );

      protectedOf(manager)._offsetBunch = new LongOperationsBunch();

      // Опубликовать свои события
      _channel.publish('onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted');

      // И подписаться на события во вкладках
      _tabChannel.subscribe('LongOperations:Manager:onActivity', _tabListener);
      _tabChannel.notify('LongOperations:Manager:onActivity', {type: 'born', tab: protectedOf(manager)._tabKey});

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
