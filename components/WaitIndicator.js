define('SBIS3.CONTROLS/WaitIndicator',
   [
      'Core/Deferred',
      'Core/WindowManager',
      'Lib/Control/Control',
      'SBIS3.CONTROLS/Utils/ProtectedScope',
      'tmpl!SBIS3.CONTROLS/WaitIndicator/WaitIndicator',
      'css!SBIS3.CONTROLS/WaitIndicator/WaitIndicator'
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
    *    <li>Контролы (экземпляры класса Lib/Control/Control и его потомки)</li>
    *    <li>null или undefined</li>
    * </ul>
    * Во всех случаях, когда объект привязки не указан или эквивалентен объектам window, document или document.body - создаётся глобальный индикатор.
    * <br/>
    * Следует осмотрительно выбирать объекты привязки для локальных индикаторов. Если размер объекта привязки будет меньше размера индикатора (или
    * вовсе нулевой), то визуально это может выглядеть не так, как вам хотелось бы. Кроме того, если объект привязки имеет ccs-свойство position
    * равное "static", то начало отсчёта координат будет определяться каким-то из вышележащих элементов с position "relative", "fixed" или "absolute".
    * Если в какой-то момент жизни индикатора этот родительский элемент изменит своё свойство position - изменится и начало отсчёта, что отразится на
    * индикаторе. В таких случаях нужно приемлемым образом перераспределить свойство position у объекта привязки и/или у его родительских элементов.
    * <br/>
    * Индикатор может иметь стандартный или уменьшеный размер
    * <br/>
    * Индикатор может отображаться с оверлэем или без. Оверлэй может быть бесцветным (по умолчанию) или с затенением. Маленькие индикаторы всегда
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
    *          target: dataGrid,
    *          message: 'Данные загружаются...',
    *          scroll: 'bottom'
    *       },
    *       stopper
    *    );
    * </pre>
    * <br/>
    * Созданный таким способом индикатор можно остановить с помощью отложенного стопа stopper, который представляет собой экземпляр класса Promise
    * или Deferred. При разрешении стопа индикатор будет удалён
    * <br/>
    * Полный список параметров:
    * <ul>
    *    <li>{HTMLElement|jQuery|Lib/Control/Control} target - Объект привязки индикатора</li>
    *    <li>{string} message - Текст сообщения индикатора</li>
    *    <li>{number} delay - Задержка перед началом показа индикатора. Если указана неотрицательная закаржка - она будет использована, если нет - будет использована задержка по умолчанию в 2 секунды</li>
    *    <li>{string} overlay - Настройка оверлэя, допустимые значения - dark, none. Если не задан, используется бесцветный оверлэй</li>
    *    <li>{boolean} immediate Показывать бесцветный оверлэй сразу после создания, не дожидаясь реального старта индикатора
    *    <li>{string} scroll - Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom</li>
    *    <li>{boolean} small - Использовать уменьшеный размер</li>
    *    <li>{string} align - Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom. Если не задан - индикатор центрируется</li>
    *    <li>{string[]} mods - Массив произвольных модификаторов, для каждого из котороых к DOM элементу индикатора будет добавлен класс вида "ws-wait-indicator_mod-<модификатор>". Все недопустимые для имени класса символы будут удалены</li>
    * </ul>
    * При использовании глобальных и локальных индикаторов одновременно глобальный индикатор подавляет отображение локальных.
    * <br/>
    * В редких случаях есть потребность изменять сообщение индикатора в процессе его показа. В таком случае можно использовать метод индикатора setMessage:
    * <pre>
    *    var indicator = new WaitIndicator(target, 'Данные загружаются...', {overlay:'dark', immediate:true}, 1000);
    *    ...
    *    indicator.setMessage('Будьте терпеливы...');
    *    ...
    *    indicator.remove();
    * </pre>
    * <br/>
    * Несколько примеров можно посмотреть в классе демо MyWaitIndicator, а также на локальном стенде на страницах /pages/WaitIndicator.html и /pages/WaitIndicatorTable.html
    * <br/>
    *
    * @public
    * @class SBIS3.CONTROLS/WaitIndicator
    *
    * @author Спирин В.А.
    *
    * @demo Examples/WaitIndicator/MyWaitIndicator/MyWaitIndicator
    * @demo Examples/WaitIndicator/MyWaitIndicatorTable/MyWaitIndicatorTable
    */

   function (Deferred, WindowManager, CoreControl, ProtectedScope, dotTplFn) {
      'use strict';



      /**
       * Конструктор
       * @public
       * @constructor
       * @param {HTMLElement|jQuery|Lib/Control/Control} target Объект привязки индикатора
       * @param {string} message Текст сообщения индикатора
       * @param {object} look Параметры внешнего вида индикатора:
       * @param {string} look.overlay Настройка оверлэя, допустимые значения - dark, none. Если не задан, используется бесцветный оверлэй
       * @param {boolean} look.immediate Показывать бесцветный оверлэй сразу после создания, не дожидаясь реального старта индикатора
       * @param {string} look.scroll Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom
       * @param {boolean} look.small Использовать уменьшеный размер
       * @param {string} look.align Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom.
       *                            Если не задан - индикатор центрируется
       * @param {string[]} look.mods Массив произвольных модификаторов, для каждого из котороых к DOM элементу индикатора будет добавлен класс
       *                            вида "ws-wait-indicator_mod-<модификатор>". Все недопустимые для имени класса символы будут удалены
       * @param {number} delay Задержка перед началом показа индикатора. Если указана и неотрицательна - индикатор будет показан, если нет - не будет
       */
      var WaitIndicator = function (target, message, look, delay) {
         var oLook = {
            overlay: undefined,
            immediate: false,
            scroll: undefined,
            small: false,
            align: undefined,
            mods: []
         };
         if (look && typeof look === 'object') {
            Object.keys(oLook).forEach(function (name) {
               if (name in look) {
                  oLook[name] = look[name];
               }
            });
         }
         var pr0tected = protectedOf(this);
         pr0tected.id = ++waitIndicatorCounter;
         pr0tected.container = _getContainer(target);
         this.setMessage(message);
         pr0tected.look = oLook;
         //pr0tected._starting = null;
         //pr0tected._removing = null;
         if (typeof delay === 'number' && 0 <= delay) {
            this.start(delay);
         }
      };

      WaitIndicator.prototype = /** @lends SBIS3.CONTROLS/WaitIndicator.prototype */{
         /**
          * Геттер свойства, возвращает идентификатор
          * @public
          * @type {number}
          */
         get id () {
            return protectedOf(this).id;
         },

         /**
          * Геттер свойства, возвращает DOM элемент контейнера
          * @public
          * @type {HTMLElement}
          */
         get container () {
            return protectedOf(this).container;
         },

         /**
          * Сеттер свойства, устанавливает текст сообщения
          * @public
          * @type {string}
          */
         setMessage: function (msg) {
            if (msg !=/*Не !==*/ null && typeof msg !== 'string') {
               throw new Error('String required');
            }
            var pr0tected = protectedOf(this);
            var prevMsg = pr0tected.message,
               newMsg = msg && typeof msg === 'string' ? msg : null;
            if (newMsg !== prevMsg) {
               pr0tected.message = newMsg;
               var poolItem = waitIndicatorManager.search(pr0tected.container);
               if (poolItem && poolItem.indicators.length && poolItem.indicators[0] === this) {
                  waitIndicatorManager.update(poolItem, prevMsg, pr0tected.look);
               }
            }
         },

         /**
          * Геттер свойства, возвращает текст сообщения
          * @public
          * @type {string}
          */
         getMessage: function () {
            return protectedOf(this).message;
         },

         /**
          * Геттер свойства, возвращает параметры внешнего вида
          * @public
          * @type {object}
          */
         get look () {
            return protectedOf(this).look;
         },

         /**
          * Начать показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise|Deferred}
          */
         start: function (delay) {
            if (delay !=/*Не !==*/ null && !(typeof delay === 'number' && 0 <= delay)) {
               throw new Error('Positive number required');
            }
            var method;
            var pr0tected = protectedOf(this);
            if (pr0tected.look.immediate) {
               pr0tected.overlayOnly = true;
               waitIndicatorManager.start(this);
               method = function () {
                  delete pr0tected.overlayOnly;
                  waitIndicatorManager.start(this);
               }.bind(this);
            }
            return _callDelayed(this, method || waitIndicatorManager.start.bind(waitIndicatorManager), '_starting', delay);
         },

         /**
          * Завершить показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise|Deferred}
          */
         remove: function (delay) {
            if (delay !=/*Не !==*/ null && !(typeof delay === 'number' && 0 <= delay)) {
               throw new Error('Positive number required');
            }
            return _callDelayed(this, waitIndicatorManager.remove.bind(waitIndicatorManager), '_removing', delay);
         }
      };

      /**
       * Геттер защищённой области
       * @private
       * @type {function}
       */
      var protectedOf = ProtectedScope.create();

      /**
       * Геттер свойства, возвращает логическоен значение, показывающее как отображать индикатор
       * @private
       * @param {SBIS3.CONTROLS/WaitIndicator} self Этот объект
       * @return {boolean}
       */
      var _isOverlayOnly = function (self) {
         return protectedOf(self).overlayOnly;
      };

      /**
       * Общая реализация для методов start и remove
       * @private
       * @param {SBIS3.CONTROLS/WaitIndicator} self Этот объект
       * @param {function} method Подлежащий метод
       * @param {string} storing Имя защищённого свойства для хранения данных об отложенном вызове
       * @param {number} delay Время задержки в миллисекундах
       * @return {Promise|Deferred}
       */
      var _callDelayed = function (self, method, storing, delay) {
         var pr0tected = protectedOf(self);
         for (var storings = ['_starting', '_removing'], i = 0; i < storings.length; i++) {
            var key = storings[i];
            var inf = pr0tected[key];
            if (inf) {
               clearTimeout(inf.id);
               if (inf.fail) {
                  if (inf.promise.catch) {
                     inf.promise.catch(function (err) {});
                  }
                  inf.fail.call();
               }
               pr0tected[key] = null;
            }
         }
         var promInf = {};
         if (typeof Deferred !== 'undefined') {
            var dfr = new Deferred();
            promInf.promise = dfr;
            promInf.success = dfr.callback.bind(dfr);
            promInf.fail = dfr.errback.bind(dfr);
         }
         else {
            promInf.promise = new Promise(function (resolve, reject) {
               promInf.success = resolve;
               promInf.fail = reject;
            });
         }
         if (typeof delay === 'number' && 0 < delay) {
            promInf.id = setTimeout(function () {
               var prev = pr0tected[storing];
               pr0tected[storing] = null;
               method(self);
               prev.success.call(null, self);
            }.bind(self), delay);
            pr0tected[storing] = promInf;
         }
         else {
            method(self);
            promInf.success.call(null, self);
         }
         return promInf.promise;
      };

      /**
       * Определить элемент DOM, соответствующий указанному объекту привязки
       * @private
       * @param {HTMLElement|jQuery|Lib/Control/Control} target Объект привязки индикатора
       * @return {HTMLElement}
       */
      var _getContainer = function (target) {
         if (!target || typeof target !== 'object' || target === window || target === document) {
            return null;
         }
         if (target instanceof CoreControl.Control) {
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
      };

      /**
       * Константа - время задержки по умолчанию перед показом индикатора
       * @alias SBIS3.CONTROLS/WaitIndicator
       * @public
       * @static
       * @type {number}
       */
      Object.defineProperty(WaitIndicator, 'DEFAULT_DELAY', {value:2000, /*writable:false,*/ enumerable:true});

      /**
       * Создаёт индикатор ожидания завершения процесса, поведение и состояние определяется указанными опциями. Отложенный стоп будет использован
       * для последующего удаления индикатора. С задержкой, если она будет указана при вызове колбэка
       * @alias SBIS3.CONTROLS/WaitIndicator
       * @public
       * @static
       * @param {object} options Опции конфигурации
       * @param {HTMLElement|jQuery|Lib/Control/Control} options.target Объект привязки индикатора
       * @param {string} options.message Текст сообщения индикатора
       * @param {number} options.delay Задержка перед началом показа/скрытия индикатора
       * @param {string} options.overlay Настройка оверлэя, допустимые значения - dark, none. Если не задан, используется бесцветный оверлэй
       * @param {boolean} options.immediate Показывать бесцветный оверлэй сразу после создания, не дожидаясь реального старта индикатора
       * @param {string} options.scroll Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom
       * @param {boolean} options.small Использовать уменьшеный размер
       * @param {string} options.align Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom.
       *                               Если не задан - индикатор центрируется
       * @param {string[]} options.mods Массив произвольных модификаторов, для каждого из котороых к DOM элементу индикатора будет добавлен класс
       *                            вида "ws-wait-indicator_mod-<модификатор>". Все недопустимые для имени класса символы будут удалены
       * @param {Promise|Deferred} stopper Отложенный стоп, при срабатывании которого индикатор будет удалён
       */
      WaitIndicator.make = function (options, stopper) {
         var method = typeof Promise !== 'undefined' && stopper instanceof Promise ? 'then' : (stopper instanceof Deferred ? 'addCallbacks' : null);
         if (!method) {
            throw new Error('Valid stopper is not supplied');
         }
         var indicator = new WaitIndicator(
            options ? options.target : null,
            options ? options.message : null,
            options,
            options && typeof options.delay === 'number' && 0 <= options.delay ? options.delay : WaitIndicator.DEFAULT_DELAY
         );
         var callback = function (value) {
            indicator.remove();
            return value;
         };
         stopper[method](callback, callback);
      };

      /**
       * Счётчик экземпляров класа WaitIndicator
       * @private
       * @type {number}
       */
      var waitIndicatorCounter = 0;



      /**
       * Менеджер, управляющий показом экземпляров индикаторов ожидания
       * @private
       * @type {object}
       */
      var waitIndicatorManager = {
         /**
          * Запросить помещение DOM-элемент индикатора в DOM. Будет выполнено, если элемента ещё нет в DOM-е
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         start: function (indicator) {
            var container = indicator.container,
               isGlobal = !container;
            if (isGlobal) {
               waitIndicatorManager._pool.forEach(function (item) {
                  if (item.container) {
                     waitIndicatorDOMHelper.hide(item.spinner);
                     item.isLocked = true;
                  }
               });
            }
            var poolItem = waitIndicatorManager.search(container);
            if (poolItem) {
               var indicators = poolItem.indicators;
               // Индикатор уже есть в DOM-е
               var i = indicators.indexOf(indicator);
               if (i === -1) {
                  indicators.push(indicator);
               }
               else
               if (i === 0) {
                  waitIndicatorManager.update(poolItem);
               }
            }
            else {
               // Индикатора в DOM-е не содержиться
               var spinner = waitIndicatorDOMHelper.create(container, indicator.getMessage(), indicator.look, _isOverlayOnly(indicator));
               waitIndicatorManager._pool.push({container:container, spinner:spinner, indicators:[indicator]});
            }
         },

         /**
          * Запросить удаление DOM-элемент индикатора из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         remove: function (indicator) {
            var container = indicator.container,
               isGlobal = !container,
               poolItem = waitIndicatorManager.search(container);
            if (poolItem) {
               var indicators = poolItem.indicators,
                  id = indicator.id,
                  i = -1;
               if (indicators.length) {
                  for (var j = 0; j < indicators.length; j++) {
                     if (indicators[j].id === id) {
                        i = j;
                        break;
                     }
                  }
               }
               if (i !== -1) {
                  if (1 < indicators.length) {
                     indicators.splice(i, 1);
                     waitIndicatorManager.update(poolItem, indicator.getMessage(), indicator.look);
                  }
                  else {
                     // Удалить из DOM-а
                     waitIndicatorDOMHelper.remove(poolItem.spinner, isGlobal);
                     // Удалить из пула
                     var j = waitIndicatorManager._pool.indexOf(poolItem);
                     if (j !== -1) {
                        waitIndicatorManager._pool.splice(j, 1);
                     }
                  }
               }
            }
            if (isGlobal) {
               waitIndicatorManager._pool.forEach(function (item) {
                  if (item.container) {
                     waitIndicatorDOMHelper.show(item.spinner);
                     item.isLocked = false;
                  }
               });
            }
         },

         /**
          * Проверить, и обновить, если нужно, отображение индикатора
          * @public
          * @param {object} poolItem Элемент пула
          * @param {string} prevMessage Текущее (отображаемое) сообщение
          * @param {object} prevLook Текущие (отображаемые) параметры внешнего вида
          */
         update: function (poolItem, prevMessage, prevLook) {
            var indicators = poolItem.indicators;
            if (indicators.length) {
               var indicator = indicators[0];
               var msg = indicator.getMessage();
               var look = indicator.look;
               if ((prevMessage == null && prevLook == null) || prevMessage !== msg || Object.keys(look).some(function (v) { return look[v] !== prevLook[v]; })) {
                  poolItem.spinner = waitIndicatorDOMHelper.change(poolItem.spinner, poolItem.container, msg, look, _isOverlayOnly(indicator));
               }
            }
         },

         /**
          * Найти элемента пула по контейнеру
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @return {object}
          */
         search: function (container) {
            if (waitIndicatorManager._pool.length) {
               for (var j = 0; j < waitIndicatorManager._pool.length; j++) {
                  var item = waitIndicatorManager._pool[j];
                  if (item.container === container) {
                     return item;
                  }
               }
            }
         },

         /**
          * Пул содержащий информацию о находящихся в DOM-е элементах индикаторов
          * @protected
          * @type {object[]}
          */
         _pool: []
      };



      /**
       * Объект, в котором собраны методы, непосредственно оперирующими с DOM-ом
       * @private
       * @type {object}
       */
      var waitIndicatorDOMHelper = {
         /**
          * Функция-шаблон
          * @protected
          * @type {function}
          */
         _dotTplFn: dotTplFn,

         /**
          * Создать и добавить в DOM элемент индикатора
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @param {boolean} overlayOnly Отображать ли только как оверлэй
          * @return {HTMLElement}
          */
         create: function (container, message, look, overlayOnly) {
            return this.change(null, container, message, look, overlayOnly);
         },

         /**
          * Изменить DOM-элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @param {boolean} overlayOnly Отображать ли только как оверлэй
          * @return {HTMLElement}
          */
         change: function (spinner, container, message, look, overlayOnly) {
            var options = this._prepareOptions(container, message, look, overlayOnly);
            var $prev = spinner ? $(spinner) : null;
            options.z = spinner ? +$prev.css('z-index') : WindowManager.acquireZIndex(false, false, false);
            var $next = $(this._dotTplFn(options));
            if (spinner) {
               $prev.replaceWith($next);
            }
            else {
               $(container || document.body).append($next);
            }
            var next = $next[0];
            if (container && getComputedStyle(container, null).position === 'static') {
               this._place(next);
               this._watchResize(next);
            }
            return next;
         },

         /**
          * Позиционировать элемент индикатора на странице
          * @protected
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         _place: function (spinner) {
            var parent = spinner.parentNode;
            if (parent) {
               var child = spinner.firstElementChild;
               var w = child.offsetWidth;
               var h = child.offsetHeight;
               var w0 = parent.offsetWidth;
               var h0 = parent.offsetHeight;
               var x = parent.offsetLeft;
               var y = parent.offsetTop;
               var style = spinner.style;
               style.left = (w <= w0 ? x : x - Math.floor((w - w0)/2)) + 'px';
               style.top = (h <= h0 ? y : y - Math.floor((h - h0)/2)) + 'px';
               style.width = w < w0 ? w0 + 'px' : 'auto';
               style.height = h < h0 ? h0 + 'px' : 'auto';
            }
         },

         /**
          * Удалить из DOM элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {boolean} isGlobal Индикатор является глобальным
          */
         remove: function (spinner, isGlobal) {
            var p = spinner.parentNode;
            if (p) {
               WindowManager.releaseZIndex(+$(spinner).css('z-index'));//^^^
               this._unwatchResize(spinner);
               p.removeChild(spinner);
            }
         },

         /**
          * Приготовить параметры шаблона
          * @protected
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @param {boolean} overlayOnly Отображать ли только как оверлэй
          * @return {object}
          */
         _prepareOptions: function (container, message, look, overlayOnly) {
            var useSpinner = !overlayOnly;
            var options = {
               isGlob: !container,
               useSpinner: useSpinner
            };
            if (useSpinner && !(look && look.small) && message) {
               options.message = message;
            }
            if (useSpinner && look && typeof look === 'object') {
               // Раобрать параметры с учётом приоритетности
               var sides = ['left', 'right', 'top', 'bottom'];
               if (look.scroll && typeof look.scroll === 'string') {
                  options.scroll = this._checkValue(look.scroll.toLowerCase(), sides);
               }
               if (!options.scroll) {
                  var small = look.small ? (typeof look.small === 'string' ? this._checkValue(look.small.toLowerCase(), sides, 'yes') : 'yes') : null;
                  if (small === 'yes' && look.align && typeof look.align === 'string') {
                     small = this._checkValue(look.align.toLowerCase(), sides, 'yes');
                  }
                  options.small = small;
                  options.overlay = small ? null : (look.overlay && typeof look.overlay === 'string' ? this._checkValue(look.overlay.toLowerCase(), ['none', 'dark']) : null);
               }
               if (look.mods && Array.isArray(look.mods) && look.mods.length) {
                  options.mods = look.mods.reduce(function (acc, v) {
                     var mod = v && typeof v === 'string' ? v.replace(/[^a-z0-9_\-]+/i, '') : null;
                     if (mod) {
                        acc.push(mod);
                     }
                     return acc;
                  }, []);
               }
            }
            return options;

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
