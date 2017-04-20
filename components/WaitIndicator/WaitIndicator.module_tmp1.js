define('js!SBIS3.CONTROLS.WaitIndicator',
   [
      'css!SBIS3.CONTROLS.WaitIndicator'
   ],

   /**
    * Класс, описывающий индикатор ожидания завершения процесса. Позволяет инициировать отображение индикатора(ов), задавать свойсва отображения и
    * прекращения его(их) работы.
    * <br/>
    * Различаются глобальные и локальные индикаторы. Локальные индикаторы имеют конкретный объект привязки на пользовательском интерфейсе (то есть
    * элемент интерфейса, поверх которого они отображаются). Глобальные - не имеют (или, что то же самое, объектом их привязки являются такие объекты
    * как window, document или document.body). В один и тот же момент времени глобальный индикатор может быть только один, локальных индикаторов может
    * быить несколько одновременно, однако только по одному индикатору на каждый объект привязки. В качестве объекта привязки могут быть указаны:
    * <ul>
    *    <li>Элемент DOM</li>
    *    <li>Коллекция jQuery, при этом в качестве объекта привязки будет использован первый элемент</li>
    *    <li>Контролы (экземпляры класса SBIS3.CORE.Control и его потомки)</li>
    *    <li>null или undefined</li>
    * </ul>
    * Во всех случаях, когда объект привязки не указан или эквивалентен объектам window, document или document.body - создаётся глобальный индикатор.
    * <br/>
    * Индикатор может иметь стандартный или уменьшеный размер
    * <br/>
    * Индикатор может отображаться с оверлэем или без. Оверлэй может быть прозрачным (по умолчанию) или с затенением. Маленькие индикаторы всегда
    * отображаются без оверлэя.
    * <br/>
    * Индикатор может отображаться с сообщением, если оно задано. Маленькие индикаторы всегда отображаются без сообщения.
    * <br/>
    * При вызове индикатора можно указать задержку перед началом его отображения. Задержка указывается в миллисекундах.
    * <br/>
    * <b>Стандартный способ использования</b>.
    * <br/>
    * Для отображения индикатора используется статический метод класса WaitIndicator.make:
    * <pre>
    *    WaitIndicator.make({
    *       target: dataGrid,
    *       message: 'Данные загружаются...',
    *       scroll: 'bottom',
    *       stopper: stopper,
    *    });
    * </pre>
    * <br/>
    * Созданный таким способом индикатор можно остановить с помощью отложенного стопа stopper, который представляет собой экземпляр класса Promise
    * или Deferred. При разрешении стопа индикатор будет удалён. При разрешении стопа может быть указано время задержки, тогда индикатор будет удалён
    * с задержкой
    * <br/>
    * Полный список параметров:
    * <ul>
    *    <li>{HTMLElement|jQuery|SBIS3.CORE.Control} target - Объект привязки индикатора</li>
    *    <li>{string} message - Текст сообщения индикатора</li>
    *    <li>{number} delay - Задержка перед началом показа индикатора. Если указана неотрицательная закаржка - она будет использована, если нет - будет использована задержка по умолчанию в 2 секунды</li>
    *    <li>{Promise|Deferred} stopper - Отложенный стоп, при срабатывании которого индикатор будет удалён</li>
    *    <li>{string} scroll - Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom</li>
    *    <li>{string} overlay - Настройка оверлэя, допустимые значения - dark, no, none. Если не задан, используется прозрачный оверлэй</li>
    *    <li>{boolean} small - Использовать уменьшеный размер</li>
    *    <li>{string} align - Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom. Если не задан - индикатор центрируется</li>
    *    <li>{string[]} mods - Массив произвольных модификаторов, для каждого из котороых к DOM элементу индикатора будет добавлен класс вида "ws-wait-indicator_mod-<модификатор>". Все недопустимые для имени класса символы будут удалены</li>
    * </ul>
    * При использовании глобальных и локальных индикаторов одновременно глобальный индикатор подавляет отображение локальных.
    * <br/>
    * Несколько примеров можно посмотреть в классе демо MyWaitIndicator, а также на локальном стенде на страницах /pages/WaitIndicator.html и /pages/WaitIndicatorTable.html
    * <br/>
    * Альтернативный способ использования.
    * В некоторых случаях может потребоваться больше возможностей по управлению индикаторами. В таких случаях можно создать экземпляр индикатора
    * с помощью конструктора:
    * <pre>
    *    var indicator = new WaitIndicator(target, message, look, delay);
    * </pre>
    * Где объект look содержит описанные выше параметры внешнего вида индикатора.
    * <br/>
    * Созданный экземпляр индикатора содержит три ключевые метода
    * <pre>
    *    <Promise|Deferred> = <WaitIndicator>.start(delay)
    *    <Promise|Deferred> = <WaitIndicator>.suspend(delay)
    *    <Promise|Deferred> = <WaitIndicator>.remove(delay)
    * </pre>
    * Метод start запускает индикатор, метод remove - удаляет индикатор, метод suspend - скрывает индикатор без удаления его из DOM-а.
    * <br/>
    * Все три метода принимают в качестве аргумента время задержки исполнения. В случае, если она указана, все три метода возвращают объект с
    * отложенным результатом. Эти же объекты доступны (пока существуют) как свойства:
    * <pre>
    *    <Promise|Deferred> = <WaitIndicator>.nextStart
    *    <Promise|Deferred> = <WaitIndicator>.nextSuspend
    *    <Promise|Deferred> = <WaitIndicator>.nextRemove
    * </pre>
    * <br/>
    * Один экземпляр индикатора можно использовать для неограниченного количества запусков и остановов индикатора. Могут быть также использованы
    * несколько конкуретных индикаторов одновременно. При этом обеспечивается присутствие в DOM-е не более одного элемента индикатора на каждый объект
    * привязки. При конкуретном отображении нескольких индикаторов для одного объекта привязки приоритет отображения всегда имеет более ранний.
    * <br/>
    * Примеры использования конкуретных индикаторов можно посмотреть в классе демо MyWaitIndicator, а также на локальном стенде на страницах /pages/WaitIndicator.html и /pages/WaitIndicatorTable.html
    * <br/>
    * При использовании метода suspend не происходит удаления элемента индикатора из DOM. Это может использоваться в ситуациях, критичных к
    * производительности и времени отклика. Однако при длительном скрытом состоянии индикатора он будет вычищен из DOM-а автоматически. Время жизни
    * определяется константами WaitIndicator.SUSPEN_LIFETIME (15 секунд), WaitIndicator.SUSPEND_MAX_LIFETIME (600 сек) и настраиваемым параметром
    * suspendLifetime.
    * Для установки и получения настраиваемых параметров suspendLifetime и defaultDelay использубтся статические методы:
    * <pre>
    *    WaitIndicator.setParam(name, valuae)
    *    var value = WaitIndicator.getParam(name)
    * </pre>
    * <br/>
    *
    * @class SBIS3.CONTROLS.WaitIndicator
    * @public
    *
    * @demo SBIS3.CONTROLS.Demo.MyWaitIndicator
    * @demo SBIS3.CONTROLS.Demo.MyWaitIndicatorTable
    */

   function () {
      'use strict';





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
       * @param {string[]} look.mods Массив произвольных модификаторов, для каждого из котороых к DOM элементу индикатора будет добавлен класс
       *                            вида "ws-wait-indicator_mod-<модификатор>". Все недопустимые для имени класса символы будут удалены
       * @param {number} delay Задержка перед началом показа индикатора. Если указана и неотрицательна - индикатор будет показан, если нет - не будет
       */
      function WaitIndicator (target, message, look, delay, useDeferred) {
         var oLook = {
            scroll: null,
            overlay: null,
            small: false,
            align: null,
            mods: []
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
         pSelf.useDeferred = useDeferred;
         if (typeof delay === 'number' && 0 <= delay) {
            this.start(delay);
         }
      };

      /**
       * Константа - имя модуля
       * @protected
       * @static
       * @type {string}
       */
      Object.defineProperty(WaitIndicator, '_moduleName', {value:'SBIS3.CONTROLS.WaitIndicator', writable:false, enumerable:true});

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
       * @param {string} options.scroll Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom
       * @param {string} options.overlay Настройка оверлэя, допустимые значения - dark, no, none. Если не задан, используется прозрачный оверлэй
       * @param {boolean} options.small Использовать уменьшеный размер
       * @param {string} options.align Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom.
       *                               Если не задан - индикатор центрируется
       * @param {string[]} options.mods Массив произвольных модификаторов, для каждого из котороых к DOM элементу индикатора будет добавлен класс
       *                            вида "ws-wait-indicator_mod-<модификатор>". Все недопустимые для имени класса символы будут удалены
       * @return {function}
       */
      WaitIndicator.make = function (options) {
         var indicator = new WaitIndicator(
            options ? options.target : null,
            options ? options.message : null,
            options,
            options && typeof options.delay === 'number' && 0 <= options.delay ? options.delay : WaitIndicator.getParam('defaultDelay')
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

      WaitIndicator.prototype = /** @lends SBIS3.CONTROLS.WaitIndicator.prototype */{
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
            var promInf = emptyPromise(pSelf.useDeferred);
            if (typeof delay === 'number' && 0 < delay) {
               promInf.id = setTimeout(function () {
                  var pSelf = WaitIndicatorProtected(this),
                     prev = pSelf[storing];
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
            var Deferred = require('Core/Deferred') || (typeof useDeferred === 'function' ? useDeferred : null);
            promise = new Deferred();
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
            // Будем определять instanceOf SBIS3.CORE.Control не прямо, чтобы не создавать зависимости и не подгружать класс (утиная типизация)
            if (typeof target.getContainer === 'function' && ['superclass', 'extend', 'beforeExtend'].every(function (method) { return typeof target.constructor[method] !== 'undefined'; })) {
               target = target.getContainer();
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
               var mods = [];
               if (look.mods && Array.isArray(look.mods) && look.mods.length) {
                  mods = look.mods.reduce(function (acc, v) {
                     var mod = v && typeof v == 'string' ? v.replace(/[^a-z0-9_\-]+/i, '') : null;
                     if (mod) {
                        acc.push(mod);
                     }
                     return acc;
                  }, []);
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
               var modPrefix = 'ws-wait-indicator_mod-';
               for (var i = 0; i < cls.length; i++) {
                  var c = cls.item(i);
                  if (c.indexOf(modPrefix) === 0) {
                     if (!mods.length || mods.indexOf(c.substring(modPrefix.length)) === -1) {
                        cls.remove(c);
                     }
                  }
               }
               if (mods.length) {
                  mods.forEach(function (mod) {
                     cls.add(modPrefix + mod);
                  });
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
