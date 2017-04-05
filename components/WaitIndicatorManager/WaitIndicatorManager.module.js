/**
 * Модуль WaitIndicatorManager
 */
define('js!SBIS3.CONTROLS.WaitIndicatorManager',
   [
      'css!SBIS3.CONTROLS.WaitIndicatorManager'
   ],
   function () {
      'use strict';

      /*
       * TODO: (+) Разобраться с target
       * TODO: (+) Добавить события или промисы на начало/конец показа индикатора
       * TODO: (-) Понять, нужно ли Proxy-рование
       * TODO: (+) Применить опции
       * TODO: (+) Локальные индикаторы
       * TODO: ### Будем ли использовать Component-ы в качестве объектов привязки ?
       * TODO: (-) Нужен ли cancel как псевдоним remove ?
       * TODO: (+) Нужен ли массив экземпляров индикаторов (не в DOM-е)? Если нужен, то как его чистить ?
       * TODO:     Если не нужен, то как контролировать единственность неглобальных?
       * TODO: (+) Добавить приостановку индикатора, без удаления из DOM-а
       * TODO: (+) Объединить схожий код в start, suspend и remove, clearDelays
       * TODO: (+) Добавить очистку DOM-а по тайауту ?
       * TODO: (+) Может, перенести работу с target-ами полностью в manager ?
       * TODO: (+) Добавить опцию для настройки времени удаления приостановленных индикаторов
       * TODO:     и ограничивающую максимальную константу
       * TODO: (+) Сделать реальный шаблон индикатора
       * TODO: ### Актуальны ли много-элементные объекты привязки (наборы элементов)
       * TODO: (+) Привести к новым реалиям isVisible
       * TODO: (+) Модуляризировать в requirejs
       * TODO: (+) Перенести методы _start, _suspend, _remove в менеджер с контолем единственности
       * TODO: (+) Предусмотреть очередь в менеджере
       * TODO: (+) Перенести страховочную очистку DOM-а в менеджер
       * TODO: (+) Добавить сообщения
       * TODO: (+) Добавить идентификаторы
       * TODO: (+) Поправить страховочное очистку DOM-а (в связи с очередью)
       * TODO: (+) Переименовать очередь в Pool (это ведь не очередь)
       * TODO: (+) Объединить suspend и remove (в inner) во избежание дублирования кода
       * TODO: (+) Обособить методы, связанные с DOM-ом
       * TODO: (+) Добавить локально-глобальную блокировку
       * TODO: (+) Перейти от тестов к демо
       * TODO: (+) Убрать lastUse
       * TODO: (+) Стилевые классы на все случаи
       * TODO: (+) Сообщение меняется с ошибкой
       * TODO: (+) Избавиться от jQuery
       * TODO: (+) Возможно стоит механизировать разбор опций ?
       * TODO: ### Разобраться с урлами картинок
       * TODO: (+) Пересмотреть аргументы методов класса Inner
       * TODO: (+) Добавить возможность менять сообщение на лету
       * TODO: (+) Сделать подробные описания к демам
       * TODO: (+) Сделать вывод поясняющих сообщений в демо (псевдо-консоль)
       * TODO: (+) Собрать всё про Pool в класс
       * TODO: (+) Стоит ли убрать совсем методы _start, _suspend, _remove ?
       * TODO: (+) Отправлять в промисы при разрешении инстанс индикатора
       * TODO: (+) Совсем не показывать индикаторы с параметром hidden
       * TODO: ### Возможно, нужна поддержка настраиваемых цветов для оверлея (не просто тёмный или прозрачный) ?
       * TODO: (+) Оверлей для локальных индикаторов
       * TODO: ### Сделать конверторы promise <--> Deffered ?
       * TODO: (+) Переименовать константу SUSPEND_TIME в SUSPEND_LIFETIME
       * TODO: (+) Есть ошибка при установке сообщения
       * TODO: (+) Порефакторить аргументы _remove в Inner
       * TODO: (+) Порефакторить формат элементов пула
       * TODO: (+) Возможно, лучше не удалять при локально-глобальной блокировке ?
       * TODO: (+) Похоже есть задержка при локально-глобальной блокировке - проверить/разобраться
       * TODO: (+) Возможно, стоит ограничит набор глобальных параметров дефолтными ?
       * TODO: (+) Выделить защищённые члены классов в важных местах
       * TODO: (+) Сделать слежение за изменением геометрии области локальных индикаторов (тогда, когда это нужно)
       * TODO: (+) Привязка мелких локальных индикаторов
       * TODO: ### Почистить код, откоментировать неоткоментированное
       * TODO: (+) Привести к ES5
       * TODO: !### Изменить API с более очевидным простейшим способом использования. Описать API. (~WaitIndicatorManager.register(message, deferred, cfg))
       * TODO: !### Повсеместно учесть дуализм Promise/Deferred
       * TODO: ### Сделатьь примеры с прокруткой таблиц
       * TODO: ###
       */



      /**
       * Класс для создания индикаторов ожидания завершения процессов
       * @class SBIS3.CONTROLS.WaitIndicatorManager
       * @public
       */
      function WaitIndicatorManager () {
      };
      WaitIndicatorManager.prototype.constructor = WaitIndicatorManager;

      /**
       * Константа - время задержки по умолчанию перед показом индикатора
       * @public
       * @static
       * @type {number}
       */
      Object.defineProperty(WaitIndicatorManager, 'DEFAULT_DELAY', {value:2000, writable:false, enumerable:true});

      /**
       * Константа - время по умолчанию до удаления приостановленных индикаторов из DOM-а
       * @public
       * @static
       * @type {number}
       */
      Object.defineProperty(WaitIndicatorManager, 'SUSPEND_LIFETIME', {value:15000, writable:false, enumerable:true});

      /**
       * Константа - максимальное время до удаления приостановленных индикаторов из DOM-а
       * @public
       * @static
       * @type {number}
       */
      Object.defineProperty(WaitIndicatorManager, 'SUSPEND_MAX_LIFETIME', {value:600000, writable:false, enumerable:true});

      /**
       * Возвращает индикатор ожидания завершения процесса, поведение и состояние определяется указанными опциями
       * @public
       * @param {object} options Опции конфигурации
       * @param {jQuery|HTMLElement} options.target Объект привязки индикатора
       * @param {boolean} options.delay Задержка перед началом показа/скрытия индикатора
       * @param {boolean} options.hidden Состояние - скрыть / показать
       * @return {WaitIndicator}
       */
      WaitIndicatorManager.getWaitIndicator = function (options) {
         // Разобрать опции
         var target = options ? options.target : null,
            message = options ? options.message : null,
            delay = options ? options.delay : -1,
            hidden = options ? options.hidden : false;

         var look = {overlay:null, small:false, align:null};
         Object.keys(look).forEach(function (name) {
            if (name in options) {
               look[name] = options[name];
            }
         });

         var id = ++WaitIndicatorCounter,
            container = WaitIndicatorManager._getContainer(target),
            indicator = new WaitIndicator(id, container, message, look);
         if (!hidden) {
            indicator.start(0 <= delay ? delay : WaitIndicatorManager.getParam('defaultDelay'));
         }

         /*###var list = WaitIndicatorManager._instances;
         if (!list) {
            WaitIndicatorManager._instances = list = [];
         }

         // Запрошен ли глобальный индикатор?
         var container = WaitIndicatorManager._getContainer(target),
            isGlobal = !container,
            indicator;
         if (isGlobal) {
            // Запрошен глобальный индикатор, он может быть только один - попробовать найти существующий
            indicator = list.length ? list.find(function (item) { return item.isGlobal; }) : null;
         }
         else {
            // Запрошен локальный индикатор, их может быть много, но только один на каждый объект привязки
            indicator = list.length ? list.find(function (item) { return item.container === container; }) : null;
         }
         if (indicator) {
            // Найден существующий индикатор - использовать применимые опции
            if (hidden) {
               indicator.remove(delay);
            }
            else {
               indicator.start(delay);
            }
         }
         else {
            // индикатор не найден - создать новый
            var id = ++WaitIndicatorCounter;
            indicator = new WaitIndicator(id, container, message);
            if (!hidden) {
               indicator.start(delay);
            }
            list.push(indicator);
         }*/

         // и вернуть
         return indicator;
      };

      /**
       * Установить глобальные параметры.
       * Принимаются только параметры с именами defaultDelay и suspendLifetime
       * Все значения параметров должны быть неотрицательными числами
       * @public
       * @static
       * @param {object} params Набор параметров
       */
      WaitIndicatorManager.putParams = function (params) {
         if (params && typeof params === 'object') {
            //###Object.assign(WaitIndicatorParams, params);
            for (var name in params) {
               WaitIndicatorManager.setParam(name, params[name]);
            }
         }
      };

      /**
       * Установить значение глобального параметра по имени. Возвращает предыдущее значение
       * Принимаются только параметры с именами defaultDelay и suspendLifetime
       * Все значения параметров должны быть неотрицательными числами
       * @public
       * @static
       * @param {string} name Имя параметра
       * @param {number} value Значение параметра
       * @return {number}
       */
      WaitIndicatorManager.setParam = function (name, value) {
         if (name in WaitIndicatorParams && typeof value === 'number' && 0 <= value) {
            var prev = WaitIndicatorParams[name];
            WaitIndicatorParams[name] = value;
            return prev;
         }
      };

      /**
       * Получить глобальный параметр по имени
       * @public
       * @static
       * @param {string} name Имя параметра
       * @return {number}
       */
      WaitIndicatorManager.getParam = function (name) {
         return WaitIndicatorParams[name];
      };

      /**
       * Определить элемент DOM, соответствующий указанному объекту привязки
       * @protected
       * @static
       * @param {jQuery|HTMLElement} target Объект привязки индикатора
       * @return {HTMLElement}
       */
      WaitIndicatorManager._getContainer = function (target) {
         if (!target || typeof target !== 'object') {
            return null;
         }
         var container = target;
         if (target.jquery && typeof target.jquery === 'string') {
            if (!target.length) {
               return null;
            }
            container = target[0];
         }
         return container !== window && container !== document && container !== document.body ? container : null;
      };

      /**
       * Счётчик экземпляров
       * @type {number}
       */
      var WaitIndicatorCounter = 0;

      /**
       * Глобальные параметры
       * @type {object}
       */
      var WaitIndicatorParams = {
         defaultDelay: WaitIndicatorManager.DEFAULT_DELAY,
         suspendLifetime: WaitIndicatorManager.SUSPEND_LIFETIME
      };





      /**
       * Класс для создания защищённых членов классов
       * @class Pr0tected
       * @protected
       */
      function Pr0tected () {
         this.members = null;
      }

      /**
       * Константа, показывающая достуность WeakMap
       * @public
       * @type {boolean}
       */
      Object.defineProperty(Pr0tected, 'hasWeakMap', {value:typeof WeakMap != 'undefined', /*writable:false,*/ enumerable:true});

      /**
       * Константа, содержащая имя свойства-идентификатора
       * @public
       * @type {string}
       */
      if (!Pr0tected.hasWeakMap) {
         Object.defineProperty(Pr0tected, 'idProp', {value:'__pr0tectedId__', /*writable:false,*/ enumerable:true});
      }

      /**
       * Возвращает хранилище защищённых свойств в виде функции
       * @public
       * @static
       * @return {function}
       */
      Pr0tected.create = function () {
         var p = new Pr0tected();
         var f = p.scope.bind(p);
         f.clear = p.clear.bind(p)
         return f;
      };

      Pr0tected.prototype = {
         /**
          * Возвращает объект - хранилище защищённых свойств для указанного объекта-владельцаа
          * @public
          * @param {object} obj Владелец защищённых свойств
          * @return {object}
          */
         scope: Pr0tected.hasWeakMap ?
            function (obj) {
               var map = this.members;
               if (!this.members) {
                  map = this.members = new WeakMap();
               }
               if (!map.has(obj)) {
                  map.set(obj, {});
               }
               return map.get(obj);
            } :
            function (obj) {
               var map = this.members;
               if (!map) {
                  map = this.members = {};
               }
               var idProp = Pr0tected.idProp;
               if (!(idProp in obj)) {
                  var n = 'counter' in this ? this.counter + 1 : 1;
                  Object.defineProperty(obj, idProp, {value:n});
                  this.counter = n;
               }
               var id = obj[idProp];
               if (!(id in map)) {
                  map[id] = {};
               }
               return map[id];
            },

         /**
          * Очищает хранилище защищённых свойств для указанного объекта-владельцаа
          * @public
          * @param {object} obj Владелец защищённых свойств
          */
         clear: Pr0tected.hasWeakMap ?
            function (obj) {
               if (this.members) {
                  this.members.delete(obj);
               }
            } :
            function (obj) {
               if (this.members) {
                  var idProp = Pr0tected.idProp;
                  if (idProp in obj) {
                     delete this.members[obj[idProp]];
                  }
               }
            }
      };

      Pr0tected.prototype.constructor = Pr0tected;





      /**
       * Класс содержащий методы управления индикатором
       * @class WaitIndicator
       * @protected
       */
      /**
       * Конструктор
       * @public
       * @constructor
       * @param {number} id Идентификатор индикатора
       * @param {HTMLElement} container Контейнер индикатора
       * @param {string} message Текст сообщения индикатора
       * @param {object} look Параметры внешнего вида индикатора
       */
      function WaitIndicator (id, container, message, look) {
         //////////////////////////////////////////////////
         console.log('DBG: WaitIndicator: arguments.length=', arguments.length, '; arguments=', arguments, ';');
         //////////////////////////////////////////////////
         var pSelf = WaitIndicatorProtected(this);
         pSelf.id = id;
         pSelf.container = container;
         this.message = message;
         pSelf.look = look && typeof look === 'object' ? look : null;
         //pSelf.starting = null;
         //pSelf.suspending = null;
         //pSelf.removing = null;
      };

      /**
       * Хранилище защищённых членов класа WaitIndicator
       */
      var WaitIndicatorProtected = Pr0tected.create();

      WaitIndicator.prototype = {
         /**
          * Геттер свойства, возвращает идентификатор
          * @public
          * @type {number}
          */
         get id () {
            return WaitIndicatorProtected(this).id;
         },

         /**
          * Геттер свойства, возвращает DOM элемент контейнера
          * @public
          * @type {HTMLElement}
          */
         get container () {
            return WaitIndicatorProtected(this).container;
         },

         /**
          * Геттер свойства, указывает, что индикатор является глобальным
          * @public
          * @type {boolean}
          */
         get isGlobal () {
            return !this.container;
         },

         /**
          * Геттер свойства, указывает, что индикатор показывается в данный момент
          * @public
          * @type {boolean}
          */
         get isVisible () {
            var poolItem = WaitIndicatorPool.search(this.container);
            //return poolItem ? WaitIndicatorSpinner.isVisible(poolItem.spinner) : false;
            return poolItem ? !(poolItem.isLocked || !poolItem.indicators.length) : false;
         },

         /**
          * Геттер свойства, указывает, что элемент индикатора находиться в DOM-е
          * @public
          * @type {boolean}
          */
         get isInTheDOM () {
            return WaitIndicatorPool.searchIndex(this.container) !== -1;
         },

         /**
          * Сеттер свойства, устанавливает текст сообщения
          * @public
          * @type {string}
          */
         set message (msg) {
            var prevMsg = this.message,
               newMsg = msg && typeof msg === 'string' ? msg : null;
            if (newMsg !== prevMsg) {
               WaitIndicatorProtected(this).message = newMsg;
               var poolItem = WaitIndicatorPool.search(this.container);
               if (poolItem) {
                  WaitIndicatorInner.checkMessage(poolItem, prevMsg);
               }
            }
         },

         /**
          * Геттер свойства, возвращает текст сообщения
          * @public
          * @type {string}
          */
         get message () {
            return WaitIndicatorProtected(this).message;
         },

         /**
          * Геттер свойства, возвращает параметры внешнего вида
          * @public
          * @type {object}
          */
         get look () {
            return WaitIndicatorProtected(this).look;
         },

         /**
          * Начать показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         start: function (delay) {
            return this._callDelayed('start', 'starting', delay);
         },

         /**
          * ВРЕМЕННО скрыть индикатор (без удаления из DOM) через (опциональное) время задержки
          * Будьте осторожны при использовании, не забывайте очищать DOM вызовом метода remove
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         suspend: function (delay) {
            return this._callDelayed('suspend', 'suspending', delay);
         },

         /**
          * Завершить показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         remove: function (delay) {
            return this._callDelayed('remove', 'removing', delay);
         },

         /**
          * Общая реализация для методов start, suspend и remove
          * @protected
          * @param {string} method Имя подлежащего метода
          * @param {string} storing Имя защищённого свойства для хранения данных об отложенном вызове
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         _callDelayed: function (method, storing, delay) {
            var pSelf = WaitIndicatorProtected(this);
            //////////////////////////////////////////////////
            console.log('DBG: _callDelayed/_clearDelays: starting=', pSelf.starting, '; suspending=', pSelf.suspending, '; removing=', pSelf.removing, ';');
            //////////////////////////////////////////////////
            for (var storings = ['starting', 'suspending', 'removing'], i = 0; i < storings.length; i++) {
               var storing = storings[i];
               var o = pSelf[storing];
               if (o) {
                  clearTimeout(o.id);
                  if (o.fail) {
                     o.fail.call();
                  }
                  pSelf[storing] = null;
               }
            }
            //////////////////////////////////////////////////
            console.log('DBG: callDelayed/_clearDelays: starting=', pSelf.starting, '; suspending=', pSelf.suspending, '; removing=', pSelf.removing, ';');
            //////////////////////////////////////////////////
            if (typeof delay === 'number' && 0 < delay) {
               var success, fail, promise = new Promise(function (resolve, reject) {
                  success = resolve;
                  fail = reject;
               });
               pSelf[storing] = {
                  id: setTimeout(function () {
                     var pSelf = WaitIndicatorProtected(this);
                     //////////////////////////////////////////////////
                     console.log('DBG: ' + method + ': TIMEOUT ' + storing + '=', pSelf[storing], ';');
                     //////////////////////////////////////////////////
                     WaitIndicatorInner[method](this);
                     pSelf[storing].success.call(null, this);
                     pSelf[storing] = null;
                  }.bind(this), delay),
                  success: success,
                  fail: fail,
                  promise: promise
               };
               return promise.catch(function (err) {});
            }
            else {
               WaitIndicatorInner[method](this);
               return Promise.resolve(this);
            }
         },

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода start. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise}
          */
         get nextStart () {
            var o = WaitIndicatorProtected(this).starting;
            return o ? o.promise : null;
         },

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода suspend. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise}
          */
         get nextSuspend () {
            var o = WaitIndicatorProtected(this).suspending;
            return o ? o.promise : null;
         },

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода remove. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise}
          */
         get nextRemove () {
            var o = WaitIndicatorProtected(this).removing;
            return o ? o.promise : null;
         }
      };

      WaitIndicator.prototype.constructor = WaitIndicator;





      /**
       * Объект с внутренними методами модуля
       * @type {object}
       * @protected
       */
      var WaitIndicatorInner = {
         /**
          * Запросить помещение DOM-элемент индикатора в DOM. Будет выполнено, если элемента ещё нет в DOM-е
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         start: function (indicator) {
            var container = indicator.container,
               isGlobal = !container;
            if (isGlobal) {
               WaitIndicatorPool.each(function (item) {
                  if (item.container) {
                     WaitIndicatorSpinner.hide(item.spinner);
                     item.isLocked = true;
                  }
               });
            }
            var poolItem = WaitIndicatorPool.search(container);
            if (poolItem) {
               // Индикатор уже есть в DOM-е
               if (!poolItem.indicators.length) {
                  WaitIndicatorSpinner.show(poolItem.spinner);
               }
               poolItem.indicators.push(indicator);
               // Сбросить отсчёт времени до принудительного удаления из DOM-а
               this._unclear(poolItem);
            }
            else {
                // Индикатора в DOM-е не содержиться
               var spinner = WaitIndicatorSpinner.create(container, indicator.message, indicator.look);
               WaitIndicatorPool.add({container:container, spinner:spinner, indicators:[indicator]});
            }
         },

         /**
          * Запросить скрытие DOM-элемент индикатора без удаления из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         suspend: function (indicator) {
         this._remove(indicator, false);
         },

         /**
          * Запросить удаление DOM-элемент индикатора из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         remove: function (indicator) {
         this._remove(indicator, true);
         },

         /**
          * Общая реализация для методов suspend и remove
          * @protected
          * @param {WaitIndicator} indicator Индикатор
          * @param {boolean} force Удалить из DOM-а совсем, не просто скрыть
          */
         _remove: function (indicator, force) {
            var container = indicator.container,
               isGlobal = !container,
               poolItem = WaitIndicatorPool.search(container);
            if (poolItem) {
               var inds = poolItem.indicators,
                  id = indicator.id,
                  i = -1;
               if (inds.length) {
                  for (var j = 0; j < inds.length; j++) {
                     if (inds[j].id === id) {
                        i = j;
                        break;
                     }
                  }
               }
               if (i !== -1) {
                  if (1 < inds.length) {
                     inds.splice(i, 1);
                     this.checkMessage(poolItem, indicator.message);
                  }
                  else {
                     if (!force) {
                        inds.splice(i, 1);
                        WaitIndicatorSpinner.hide(poolItem.spinner);
                        // Начать отсчёт времени до принудительного удаления из DOM-а
                        poolItem.clearing = setTimeout(function () {
                           this._delete(poolItem);
                        }.bind(this), Math.min(WaitIndicatorManager.getParam('suspendLifetime'), WaitIndicatorManager.SUSPEND_MAX_LIFETIME));
                     }
                     else {
                        // Удалить из DOM-а и из пула
                        this._delete(poolItem);
                     }
                  }
               }
            }
            if (isGlobal) {
               WaitIndicatorPool.each(function (item) {
                  if (item.container) {
                     WaitIndicatorSpinner.show(item.spinner);
                     item.isLocked = false;
                  }
               });
            }
         },

         /**
          * Удалить из DOM-а и из пула
          * @protected
          * @param {object} poolItem Элемент пула
          */
         _delete: function (poolItem) {
            // Сбросить отсчёт времени до принудительного удаления из DOM-а
            this._unclear(poolItem);
            // Удалить из DOM-а
            WaitIndicatorSpinner.remove(poolItem.spinner);
            // Удалить из пула
            WaitIndicatorPool.remove(poolItem);
         },

         /**
          * Проверить, и обновить, если нужно, отображаемое сообщение
          * @public
          * @param {object} poolItem Элемент пула
          * @param {string} prevMessage Текущее (отображаемое) сообщение
          */
         checkMessage: function (poolItem, prevMessage) {
            var inds = poolItem.indicators;
            if (inds.length) {
               var msg = inds[0].message;
               if (prevMessage !== msg) {
                  WaitIndicatorSpinner.changeMessage(poolItem.spinner, msg);
               }
            }
         },

         /**
          * Сбросить отсчёт времени до принудительного удаления из DOM-а
          * @protected
          * @param {object} poolItem Элемент пула
          */
         _unclear: function (poolItem) {
            if ('clearing' in poolItem) {
               clearTimeout(poolItem.clearing);
               delete poolItem.clearing;
            }
         }
      };





      /**
       * Пул содержащий информацию о находящихся в DOM-е элементах индикаторов
       * @type {object}
       * @protected
       */
      var WaitIndicatorPool = {
         /**
          * Список элементов пула
          * @protected
          * @type {object[]}
          */
         _list: [],

         /**
          * Добавить элемент пула
          * @public
          * @param {object} item Элемент пула
          */
         add: function (item) {
            this._list.push(item);
         },

         /**
          * Найти индекс элемента пула по контейнеру
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @return {number}
          */
         searchIndex: function (container) {
            if (this._list.length) {
               for (var j = 0; j < this._list.length; j++) {
                  var item = this._list[j];
                  if (item.container === container) {
                     return j;
                  }
               }
            }
            return -1;
         },

         /**
          * Найти элемента пула по контейнеру
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @return {object}
          */
         search: function (container) {
            var i = this.searchIndex(container);
            return i !== -1 ? this._list[i] : null;
         },

         /**
          * Удалить элемент пула
          * @public
          * @param {object} item Элемент пула
          */
         remove: function (item) {
            if (this._list.length) {
               var i = this._list.indexOf(item);
               if (i !== -1) {
                  this._list.splice(i, 1);
               }
            }
         },

         /**
          * Выполнить указанную функцию со всеми элементами
          * @public
          * @param {function} func Функция
          */
         each: function (func) {
            this._list.forEach(func);
         }
      };





      /**
       * Объект, в котором собраны методы, непосредственно оперирующими с DOM-ом
       * @protected
       * @type {object}
       */
      var WaitIndicatorSpinner = {
         /**
          * Создать и добавить в DOM элемент индикатора
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @return {HTMLElement}
          */
         create: function (container, message, look) {
            //###var _dotTplFn = $ws.doT.template('<div class="WaitIndicator">{{message}}</div>');
            //////////////////////////////////////////////////
            console.log('DBG: Spinner create: look=', look, ';');
            //////////////////////////////////////////////////
            var hasMsg = !(look && look.small) && !!message;
            var html = '<div class="ws-wait-indicator"><div class="ws-wait-indicator-in" data-node="message">' + (hasMsg ? message : '') + '</div></div>';

            var p = document.createElement('div');
            p.innerHTML = html;
            var spinner = p.firstElementChild;
            p.removeChild(spinner);
            /*if (hasMsg) {
               this.changeMessage(spinner, message);
            }*/
            var cls = spinner.classList;
            cls.add(container ? 'ws-wait-indicator_local' : 'ws-wait-indicator_global');
            if (look) {
               if (look.small) {
                  cls.add('ws-wait-indicator_small');
                  var aligns = {
                     left: 'ws-wait-indicator_left',
                     right: 'ws-wait-indicator_right',
                     top: 'ws-wait-indicator_top',
                     bottom: 'ws-wait-indicator_bottom'
                  };
                  if (look.align && aligns[look.align]) {
                     cls.add(aligns[look.align]);
                  }
               }
               var overlay = look.overlay && typeof look.overlay === 'string' ? look.overlay.toLowerCase() : null;
               if (look.small || overlay === 'no' || overlay === 'none') {
                  cls.add('ws-wait-indicator_no-overlay');
               }
               if (!look.small && overlay === 'dark') {
                  cls.add('ws-wait-indicator_dark-overlay');
               }
            }
            if (hasMsg) {
               cls.add('ws-wait-indicator_text');
            }
            this.insert(container, spinner);
            return spinner;
         },

         /**
          * Добавить в DOM элемент индикатора
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         insert: function (container, spinner) {
            var p = container || document.body;
            if (p !== spinner.parentNode) {
               var needPlace = !!container && getComputedStyle(p, null).position === 'static';
               if (needPlace) {
                  this._place(spinner, p);
               }
               p.insertBefore(spinner, p.firstChild);
               if (needPlace) {
                  this._watchResize(spinner);
               }
            }
         },

         /**
          * Позиционировать элемент индикатора на странице
          * @protected
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {HTMLElement} parent Родительский элемент DOM-а (опционально)
          */
         _place: function (spinner, parent) {
            var p = spinner.parentNode || parent;
            if (p) {
               var s = spinner.style;
               s.left = p.offsetLeft + 'px';
               s.top = p.offsetTop + 'px';
               s.width = p.offsetWidth + 'px';
               s.height = p.offsetHeight + 'px';
            }
         },

         /**
          * Удалить из DOM элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         remove: function (spinner) {
            var p = spinner.parentNode;
            if (p) {
               this._unwatchResize(spinner);
               p.removeChild(spinner);
            }
         },

         /**
          * Изменить сообщение в DOM-элементе индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {string} message Текст сообщения индикатора
          */
         changeMessage: function (spinner, message) {
            if (!('ws' in spinner)) {
               spinner.ws = {};
            }
            if (!('message' in spinner.ws)) {
               spinner.ws.message = [].slice.call(spinner.querySelectorAll('[data-node="message"]'));
            }
            spinner.ws.message.forEach(function (node) { node.innerHTML = message || ''; });
         },

         /**
          * Показать временно скрытый элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         show: function (spinner) {
            spinner.style.display = '';
            this._watchResize(spinner);
         },

         /**
          * Временно скрыть элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         hide: function (spinner) {
            this._unwatchResize(spinner);
            spinner.style.display = 'none';
         },

         /**
          * Определить, является ли элемент индикатора видимым
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @return {boolean}
          */
         isVisible: function (spinner) {
            return getComputedStyle(spinner, null).style.display !== 'none';
         },

         /**
          * Включить наблюдение за изменением размеров страницы
          * @protected
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         _watchResize: function (spinner) {
            if (!('ws' in spinner)) {
               spinner.ws = {};
            }
            if (!('onResize' in spinner.ws)) {
               spinner.ws.onResize = this._place.bind(null, spinner);
            }
            window.addEventListener('resize', spinner.ws.onResize);
         },

         /**
          * Выключить наблюдение за изменением размеров страницы
          * @protected
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         _unwatchResize: function (spinner) {
            if (spinner.ws && spinner.ws.onResize) {
               window.removeEventListener('resize', spinner.ws.onResize);
            }
         }
      };



      return WaitIndicatorManager;
   }
);
