/**
 * Индикатор ожидания завершения процесса WaitIndicator
 * @public
 * @class SBIS3.CONTROLS.WaitIndicator
 */
define('js!SBIS3.CONTROLS.WaitIndicator',
   [
      'css!SBIS3.CONTROLS.WaitIndicator'
   ],
   function () {
      'use strict';

      /*
       * TODO: (+) Разобраться с target
       * TODO: (+) Добавить события или промисы на начало/конец показа индикатора
       * TODO: (-) Понять, нужно ли Proxy-рование
       * TODO: (+) Применить опции
       * TODO: (+) Локальные индикаторы
       * TODO: (+) Будем ли использовать Component-ы в качестве объектов привязки ?
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
       * TODO: (-) Актуальны ли много-элементные объекты привязки (наборы элементов)
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
       * TODO: (+-) Сделать конверторы promise <--> Deffered ?
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
       * TODO: (+) Изменить API с более очевидным простейшим способом использования. (~WaitIndicatorManager.register(message, deferred, cfg))
       * TODO: ### Описать API
       * TODO: (+) Повсеместно учесть дуализм Promise/Deferred
       * TODO: (+-) Сделать примеры с прокруткой таблиц
       * TODO: (+) Добавить экономную реализацию приватоности для страых браузеров
       * TODO: (+-) Исправить недоработку при конкуренции индикаторов
       */





      /**
       * Класс для создания защищённых членов классов
       * @protected
       * @class Pr0tected
       * @param {boolean} oldForced Для старых браузеров обеспечить сокрытие несмотря на больший расход памяти
       */
      function Pr0tected (oldForced) {
         this.oldForced = oldForced;
      }

      /**
       * Константа, показывающая достуность WeakMap
       * @public
       * @type {boolean}
       */
      Object.defineProperty(Pr0tected, 'hasWeakMap', {value:typeof WeakMap !== 'undefined', /*writable:false,*/ enumerable:true});

      /**
       * Константа, содержащая имя свойства-идентификатора
       * @public
       * @type {string}
       */
      if (!Pr0tected.hasWeakMap) {
         Object.defineProperty(Pr0tected, 'oldProp', {value:'__pr0tected__', /*writable:false,*/ enumerable:true});
      }

      /**
       * Возвращает хранилище защищённых свойств в виде функции
       * @public
       * @static
       * @param {boolean} oldForced Для старых браузеров обеспечить сокрытие несмотря на больший расход памяти
       * @return {function}
       */
      Pr0tected.create = function (oldForced) {
         var p = new Pr0tected(oldForced);
         var f = p.scope.bind(p);
         f.clear = p.clear.bind(p)
         return f;
      };

      Pr0tected.prototype = {
         /**
          * Возвращает объект - хранилище защищённых свойств для указанного объекта-владельцаа
          * @public
          * @param {object} owner Владелец защищённых свойств
          * @return {object}
          */
         scope: Pr0tected.hasWeakMap ?
            function (owner) {
               var map = this.members;
               if (!this.members) {
                  map = this.members = new WeakMap();
               }
               if (!map.has(owner)) {
                  map.set(owner, {});
               }
               return map.get(owner);
            } :
            function (owner) {
               var prop = Pr0tected.oldProp;
               if (this.oldForced) {
                  var map = this.members;
                  if (!map) {
                     map = this.members = {};
                  }
                  if (!(prop in owner)) {
                     var n = 'oldCounter' in this ? this.oldCounter + 1 : 1;
                     Object.defineProperty(owner, prop, {value:n});
                     this.oldCounter = n;
                  }
                  var id = owner[prop];
                  if (!(id in map)) {
                     map[id] = {};
                  }
                  return map[id];
               }
               else {
                  if (!(prop in owner)) {
                     owner[prop] = {};
                  }
                  return owner[prop];
               }
            },

         /**
          * Очищает хранилище защищённых свойств для указанного объекта-владельцаа
          * @public
          * @param {object} owner Владелец защищённых свойств
          */
         clear: Pr0tected.hasWeakMap ?
            function (owner) {
               if (this.members) {
                  this.members.delete(owner);
               }
            } :
            function (owner) {
               var prop = Pr0tected.oldProp;
               if (prop in owner) {
                  if (this.oldForced) {
                     if (this.members) {
                        delete this.members[owner[prop]];
                     }
                  }
                  else {
                     delete owner[prop];
                  }
               }
            }
      };

      Pr0tected.prototype.constructor = Pr0tected;





      /**
       * Класс описывающий индикаторы ожидания завершения процесса
       * @class WaitIndicator
       * @public
       */
      /**
       * Конструктор
       * @public
       * @constructor
       * @param {HTMLElement|jQuery|SBIS3.CORE.Control} target Объект привязки индикатора
       * @param {string} message Текст сообщения индикатора
       * @param {object} look Параметры внешнего вида индикатора:
       * @param {string} look.scroll Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom
       * @param {string} look.overlay Настройка оверлэя, допустимые значения - dark, no, none. Если не задан, используется прозрачный оверлэй
       * @param {boolean} look.small Использовать уменьшеный размер
       * @param {string} look.align Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom.
       *                            Если не задан - индикатор центрируется
       * @param {number} delay Задержка перед началом показа индикатора. Если указана и неотрицательна - индикатор будет показан, если нет - не будет
       */
      function WaitIndicator (target, message, look, delay, useDeferred) {
         //////////////////////////////////////////////////
         console.log('DBG: WaitIndicator: arguments.length=', arguments.length, '; arguments=', arguments, ';');
         //////////////////////////////////////////////////
         var oLook = {
            scroll: null,
            overlay: null,
            small: false,
            align: null
         };
         if (look && typeof look === 'object') {
            Object.keys(oLook).forEach(function (name) {
               if (name in look) {
                  oLook[name] = look[name];
               }
            });
         }
         var pSelf = WaitIndicatorProtected(this);
         pSelf.id = ++WaitIndicatorCounter;
         pSelf.container = WaitIndicatorInner.getContainer(target);
         this.message = message;
         pSelf.look = oLook;
         //pSelf.starting = null;
         //pSelf.suspending = null;
         //pSelf.removing = null;
         if (useDeferred) {
            pSelf.useDeferred = typeof useDeferred === 'function' ? useDeferred : true;
         }
         if (typeof delay === 'number' && 0 <= delay) {
            this.start(delay);
         }
         //////////////////////////////////////////////////
         console.log('DBG: WaitIndicator: this=', this, ';');
         //////////////////////////////////////////////////
      };

      /**
       * Константа - время задержки по умолчанию перед показом индикатора
       * @public
       * @static
       * @type {number}
       */
      Object.defineProperty(WaitIndicator, 'DEFAULT_DELAY', {value:2000, writable:false, enumerable:true});

      /**
       * Константа - время по умолчанию до удаления приостановленных индикаторов из DOM-а
       * @public
       * @static
       * @type {number}
       */
      Object.defineProperty(WaitIndicator, 'SUSPEND_LIFETIME', {value:15000, writable:false, enumerable:true});

      /**
       * Константа - максимальное время до удаления приостановленных индикаторов из DOM-а
       * @public
       * @static
       * @type {number}
       */
      Object.defineProperty(WaitIndicator, 'SUSPEND_MAX_LIFETIME', {value:600000, writable:false, enumerable:true});

      /**
       * Создаёт индикатор ожидания завершения процесса, поведение и состояние определяется указанными опциями. Если в опциях присутствует отложенный
       * стоп - он будет использован для удаления индикатора. Возвращает колбэк, при вызове которого индикатор будет удалён. С задержкой, если она
       * будет указана при вызове колбэка.
       * @public
       * @static
       * @param {object} options Опции конфигурации
       * @param {HTMLElement|jQuery|SBIS3.CORE.Control} options.target Объект привязки индикатора
       * @param {string} options.message Текст сообщения индикатора
       * @param {number} options.delay Задержка перед началом показа/скрытия индикатора
       * @param {Promise|Deferred} options.stopper Отложенный стоп, при срабатывании которого индикатор будет удалён
       * @param {boolean} options.hidden Не показывать созданный индикатор
       * @param {string} options.scroll Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom
       * @param {string} options.overlay Настройка оверлэя, допустимые значения - dark, no, none. Если не задан, используется прозрачный оверлэй
       * @param {boolean} options.small Использовать уменьшеный размер
       * @param {string} options.align Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom.
       *                               Если не задан - индикатор центрируется
       * @return {function}
       */
      WaitIndicator.make = function (options) {
         var indicator = new WaitIndicator(
            options ? options.target : null,
            options ? options.message : null,
            options,
            options.hidden ? null : options && typeof options.delay === 'number' && 0 <= options.delay ? options.delay : WaitIndicator.getParam('defaultDelay')
         );
         var cb = function (delay) {
            indicator.remove(delay);
         };
         if (options && options.stopper) {
            var erfun = function (err) {
               indicator.remove();
            };
            if (typeof Promise !== 'undefined' && options.stopper instanceof Promise) {
               options.stopper.then(cb, erfun);
            }
            else
            // Будем определять instanceOf Deferred не прямо, чтобы не создавать зависимости и не подгружать класс (утиная типизация)
            if (['addBoth', 'addCallback', 'addCallbacks', 'addErrback', 'callback', 'errback'].every(function (method) { return typeof options.stopper[method] === 'function'; })) {
               options.stopper.addCallbacks(cb, erfun);
            }
         }
         return cb;
      };

      /**
       * Хранилище защищённых членов класа WaitIndicator
       * @protected
       * @type {function}
       */
      var WaitIndicatorProtected = Pr0tected.create(true);

      /**
       * Счётчик экземпляров класа WaitIndicator
       * @protected
       * @type {number}
       */
      var WaitIndicatorCounter = 0;

      /**
       * Статические параметры
       * @protected
       * @type {object}
       */
      var WaitIndicatorParams = {
         defaultDelay: WaitIndicator.DEFAULT_DELAY,
         suspendLifetime: WaitIndicator.SUSPEND_LIFETIME
      };

      /**
       * Установить статические параметры.
       * Принимаются только параметры с именами defaultDelay и suspendLifetime
       * Все значения параметров должны быть неотрицательными числами
       * @public
       * @static
       * @param {object} params Набор параметров
       */
      WaitIndicator.putParams = function (params) {
         if (params && typeof params === 'object') {
            for (var name in params) {
               WaitIndicator.setParam(name, params[name]);
            }
         }
      };

      /**
       * Установить значение статического параметра по имени. Возвращает предыдущее значение
       * Принимаются только параметры с именами defaultDelay и suspendLifetime
       * Все значения параметров должны быть неотрицательными числами
       * @public
       * @static
       * @param {string} name Имя параметра
       * @param {number} value Значение параметра
       * @return {number}
       */
      WaitIndicator.setParam = function (name, value) {
         if (name in WaitIndicatorParams && typeof value === 'number' && 0 <= value) {
            var prev = WaitIndicatorParams[name];
            WaitIndicatorParams[name] = value;
            return prev;
         }
      };

      /**
       * Получить статический параметр по имени
       * @public
       * @static
       * @param {string} name Имя параметра
       * @return {number}
       */
      WaitIndicator.getParam = function (name) {
         return WaitIndicatorParams[name];
      };

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
          * @return {Promise|Deferred}
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
          * @return {Promise|Deferred}
          */
         suspend: function (delay) {
            return this._callDelayed('suspend', 'suspending', delay);
         },

         /**
          * Завершить показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise|Deferred}
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
          * @return {Promise|Deferred}
          */
         _callDelayed: function (method, storing, delay) {
            var pSelf = WaitIndicatorProtected(this);
            //////////////////////////////////////////////////
            //console.log('DBG: _callDelayed/_clearDelays: starting=', pSelf.starting, '; suspending=', pSelf.suspending, '; removing=', pSelf.removing, ';');
            //////////////////////////////////////////////////
            for (var storings = ['starting', 'suspending', 'removing'], i = 0; i < storings.length; i++) {
               var key = storings[i];
               var inf = pSelf[key];
               if (inf) {
                  clearTimeout(inf.id);
                  if (inf.fail) {
                     if (inf.promise.catch) {
                        inf.promise.catch(function (err) {});
                     }
                     inf.fail.call();
                  }
                  pSelf[key] = null;
               }
            }
            //////////////////////////////////////////////////
            //console.log('DBG: callDelayed/_clearDelays: starting=', pSelf.starting, '; suspending=', pSelf.suspending, '; removing=', pSelf.removing, ';');
            //////////////////////////////////////////////////
            var promInf = emptyPromise(pSelf.useDeferred);
            if (typeof delay === 'number' && 0 < delay) {
               promInf.id = setTimeout(function () {
                  var pSelf = WaitIndicatorProtected(this),
                     prev = pSelf[storing];
                  //////////////////////////////////////////////////
                  //console.log('DBG: ' + method + ': TIMEOUT ' + storing + '=', prev, ';');
                  //////////////////////////////////////////////////
                  pSelf[storing] = null;
                  WaitIndicatorInner[method](this);
                  prev.success.call(null, this);
               }.bind(this), delay);
               pSelf[storing] = promInf;
            }
            else {
               WaitIndicatorInner[method](this);
               promInf.success.call(null, this);
            }
            return promInf.promise;
         },

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода start. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise|Deferred}
          */
         get nextStart () {
            var o = WaitIndicatorProtected(this).starting;
            return o ? o.promise : null;
         },

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода suspend. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise|Deferred}
          */
         get nextSuspend () {
            var o = WaitIndicatorProtected(this).suspending;
            return o ? o.promise : null;
         },

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода remove. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise|Deferred}
          */
         get nextRemove () {
            var o = WaitIndicatorProtected(this).removing;
            return o ? o.promise : null;
         }
      };

      WaitIndicator.prototype.constructor = WaitIndicator;





      var emptyPromise = function (useDeferred) {
         var promise,
            success,
            fail;
         if (useDeferred || typeof Promise === 'undefined') {
            promise = new (typeof useDeferred === 'function' ? useDeferred : $ws.proto.Deferred)();
            success = promise.callback.bind(promise);
            fail = promise.errback.bind(promise);
         }
         else {
            promise = new Promise(function (resolve, reject) {
               success = resolve;
               fail = fail;
            });
         }
         return {
            promise: promise,
            success: success,
            fail: fail
         };
      }





      /**
       * Объект с внутренними методами модуля
       * @protected
       * @type {object}
       */
      var WaitIndicatorInner = {
         /**
          * Определить элемент DOM, соответствующий указанному объекту привязки
          * @protected
          * @static
          * @param {HTMLElement|jQuery|SBIS3.CORE.Control} target Объект привязки индикатора
          * @return {HTMLElement}
          */
         getContainer: function (target) {
            if (!target || typeof target !== 'object' || target === window || target === document) {
               return null;
            }
            var container;
            if (target instanceof Element) {
               container = target;
            }
            else
            if (target.jquery && typeof target.jquery === 'string') {
               if (!target.length) {
                  return null;
               }
               container = target[0];
            }
            else
            // Будем определять instanceOf SBIS3.CORE.Control не прямо, чтобы не создавать зависимости и не подгружать класс (утиная типизация)
            if (typeof target.getContainer === 'function' && ['superclass', 'extend', 'beforeExtend'].every(function (method) { return typeof target.constructor[method] !== 'undefined'; })) {
               container = target.getContainer()[0];
            }
            return container !== window && container !== document && container !== document.body ? container : null;
         },

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
                     this.updateLook(poolItem, indicator.look);
                  }
                  else {
                     if (!force) {
                        inds.splice(i, 1);
                        WaitIndicatorSpinner.hide(poolItem.spinner);
                        // Начать отсчёт времени до принудительного удаления из DOM-а
                        poolItem.clearing = setTimeout(function () {
                           this._delete(poolItem);
                        }.bind(this), Math.min(WaitIndicator.getParam('suspendLifetime'), WaitIndicator.SUSPEND_MAX_LIFETIME));
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
          * Обновить внешний вид индикатор
          * @public
          * @param {object} poolItem Элемент пула
          */
         updateLook: function (poolItem, prevLook) {
            var inds = poolItem.indicators;
            if (inds.length) {
               var look = inds[0].look;
               WaitIndicatorSpinner.changeLook(poolItem.spinner, look);
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
       * @protected
       * @type {object}
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
            if (hasMsg) {
               cls.add('ws-wait-indicator_text');
            }
            if (look) {
               this.changeLook(spinner, look);
            }
            this._insert(container, spinner);
            return spinner;
         },

         /**
          * Добавить в DOM элемент индикатора
          * @protected
          * @param {HTMLElement} container Контейнер индикатора
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         _insert: function (container, spinner) {
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
            spinner.classList[message ? 'add' : 'remove']('ws-wait-indicator_text');
         },

         /**
          * Изменить внешний вид DOM-элемента индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {object} look Параметры внешнего вида индикатора
          */
         changeLook: function (spinner, look) {
            if (look && typeof look == 'object') {
               // Раобрать параметры с учётом приоритетности
               var sides = ['left', 'right', 'top', 'bottom'];
               var scroll = look.scroll && typeof look.scroll === 'string' ? this._checkValue(look.scroll.toLowerCase(), sides) : null;
               var small;
               if (!scroll) {
                  small = look.small ? (typeof look.small === 'string' ? this._checkValue(look.small.toLowerCase(), sides, 'yes') : 'yes') : null;
                  if (small === 'yes' && look.align && typeof look.align === 'string') {
                     small = this._checkValue(look.align.toLowerCase(), sides, 'yes');
                  }
               }
               var overlay;
               if (scroll) {
                  overlay = null;
               }
               else
               if (small) {
                  overlay = 'no';
               }
               else {
                  overlay = look.overlay && typeof look.overlay === 'string' ? this._checkValue(look.overlay.toLowerCase(), ['none', 'dark']) : null;
               }
               // Применить параметры
               var cls = spinner.classList;
               var scrolls = {
                  left: 'ws-wait-indicator_scroll-left',
                  right: 'ws-wait-indicator_scroll-right',
                  top: 'ws-wait-indicator_scroll-top',
                  bottom: 'ws-wait-indicator_scroll-bottom'
               };
               for (var p in scrolls) {
                  cls[p === scroll ? 'add' : 'remove'](scrolls[p]);
               }
               var smalls = {
                  yes: 'ws-wait-indicator_small',
                  left: 'ws-wait-indicator_small-left',
                  right: 'ws-wait-indicator_small-right',
                  top: 'ws-wait-indicator_small-top',
                  bottom: 'ws-wait-indicator_small-bottom'
               };
               for (var p in smalls) {
                  cls[p === small ? 'add' : 'remove'](smalls[p]);
               }

               var overlays = {
                  none: 'ws-wait-indicator_overlay-none',
                  dark: 'ws-wait-indicator_overlay-dark'
               };
               for (var p in overlays) {
                  cls[p === overlay ? 'add' : 'remove'](overlays[p]);
               }
            }
         },

         /**
          * Проверить значение по списку допустимых
          * @protected
          * @param {string} value Проверяемое значение
          * @param {string[]} allowed Список допустимых значений
          * @return {string}
          */
         _checkValue: function (value, allowed, defValue) {
            return allowed.some(function (v) { return v === value; }) ? value : defValue;
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



      return WaitIndicator;
   }
);
