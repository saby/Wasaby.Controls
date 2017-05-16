define('js!SBIS3.CONTROLS.WaitIndicator',
   [
      'Core/core-extend',
      'Core/Deferred',
      'js!SBIS3.CORE.Control',
      'Core/js-template-doT',
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
    *          target: dataGrid,
    *          message: 'Данные загружаются...',
    *          scroll: 'bottom'
    *       },
    *       stopper
    *    );
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
    *
    * @class SBIS3.CONTROLS.WaitIndicator
    * @public
    *
    * @demo SBIS3.CONTROLS.Demo.MyWaitIndicator
    * @demo SBIS3.CONTROLS.Demo.MyWaitIndicatorTable
    */

   function (CoreExtend, Deferred, CoreControl, doT) {
      'use strict';

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
      var WaitIndicatorInstance = CoreExtend.extend({
         //_moduleName: 'SBIS3.CONTROLS.WaitIndicator',

         constructor: function (target, message, look, delay, useDeferred) {
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
            this._id = ++WaitIndicatorCounter;
            this._container = WaitIndicatorInner.getContainer(target);
            this.setMessage(message);
            this._look = oLook;
            //this._starting = null;
            //this._suspending = null;
            //this._removing = null;
            this._useDeferred = !!useDeferred;
            if (typeof delay === 'number' && 0 <= delay) {
               this.start(delay);
            }
         },

         /**
          * Геттер свойства, возвращает идентификатор
          * @public
          * @type {number}
          */
         getId: function () {
            return this._id;
         },

         /**
          * Геттер свойства, возвращает DOM элемент контейнера
          * @public
          * @type {HTMLElement}
          */
         getContainer: function () {
            return this._container;
         },

         /**
          * Сеттер свойства, устанавливает текст сообщения
          * @public
          * @type {string}
          */
         setMessage: function (msg) {
            var prevMsg = this._message,
               newMsg = msg && typeof msg === 'string' ? msg : null;
            if (newMsg !== prevMsg) {
               this._message = newMsg;
               var poolItem = WaitIndicatorPool.search(this._container);
               if (poolItem && poolItem.indicators.length && poolItem.indicators[0] === this) {
                  WaitIndicatorInner.update(poolItem, prevMsg, this._look);
               }
            }
         },

         /**
          * Геттер свойства, возвращает текст сообщения
          * @public
          * @type {string}
          */
         getMessage: function () {
            return this._message;
         },

         /**
          * Геттер свойства, возвращает параметры внешнего вида
          * @public
          * @type {object}
          */
         getLook: function () {
            return this._look;
         },

         /**
          * Начать показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise|Deferred}
          */
         start: function (delay) {
            return this._callDelayed('start', '_starting', delay);
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
            return this._callDelayed('suspend', '_suspending', delay);
         },

         /**
          * Завершить показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise|Deferred}
          */
         remove: function (delay) {
            return this._callDelayed('remove', '_removing', delay);
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
            for (var storings = ['_starting', '_suspending', '_removing'], i = 0; i < storings.length; i++) {
               var key = storings[i];
               var inf = this[key];
               if (inf) {
                  clearTimeout(inf.id);
                  if (inf.fail) {
                     if (inf.promise.catch) {
                        inf.promise.catch(function (err) {});
                     }
                     inf.fail.call();
                  }
                  this[key] = null;
               }
            }
            var promInf = emptyPromise(this._useDeferred);
            if (typeof delay === 'number' && 0 < delay) {
               promInf.id = setTimeout(function () {
                  var prev = this[storing];
                  this[storing] = null;
                  WaitIndicatorInner[method](this);
                  prev.success.call(null, this);
               }.bind(this), delay);
               this[storing] = promInf;
            }
            else {
               WaitIndicatorInner[method](this);
               promInf.success.call(null, this);
            }
            return promInf.promise;
         }
      });



      var WaitIndicator = {
         /**
          * Константа - время задержки по умолчанию перед показом индикатора
          * @public
          * @static
          * @type {number}
          */
         DEFAULT_DELAY: 2000,

         /**
          * Константа - время по умолчанию до удаления приостановленных индикаторов из DOM-а
          * @public
          * @static
          * @type {number}
          */
         SUSPEND_LIFETIME: 15000,

         /**
          * Создаёт индикатор ожидания завершения процесса, поведение и состояние определяется указанными опциями. Отложенный стоп будет использован
          * для последующего удаления индикатора. С задержкой, если она будет указана при вызове колбэка
          * @public
          * @static
          * @param {object} options Опции конфигурации
          * @param {HTMLElement|jQuery|SBIS3.CORE.Control} options.target Объект привязки индикатора
          * @param {string} options.message Текст сообщения индикатора
          * @param {number} options.delay Задержка перед началом показа/скрытия индикатора
          * @param {string} options.scroll Отображать для прокручивания объекта привязки, допустимые значения - left, right, top, bottom
          * @param {string} options.overlay Настройка оверлэя, допустимые значения - dark, no, none. Если не задан, используется прозрачный оверлэй
          * @param {boolean} options.small Использовать уменьшеный размер
          * @param {string} options.align Ориентация индикатора при уменьшенном размере, допустимые значения - left, right, top, bottom.
          *                               Если не задан - индикатор центрируется
          * @param {string[]} options.mods Массив произвольных модификаторов, для каждого из котороых к DOM элементу индикатора будет добавлен класс
          *                            вида "ws-wait-indicator_mod-<модификатор>". Все недопустимые для имени класса символы будут удалены
          * @param {Promise|Deferred} stopper Отложенный стоп, при срабатывании которого индикатор будет удалён
          */
         make: function (options, stopper) {
            var method = typeof Promise !== 'undefined' && stopper instanceof Promise ? 'then' : (stopper instanceof Deferred ? 'addCallbacks' : null);
            if (!method) {
               throw new Error('Valid stopper is not supplied');
            }
            var indicator = new WaitIndicatorInstance(
               options ? options.target : null,
               options ? options.message : null,
               options,
               options && typeof options.delay === 'number' && 0 <= options.delay ? options.delay : WaitIndicator.DEFAULT_DELAY
            );
            stopper[method](function (delay) {
               indicator.remove(delay);
            }, function (err) {
               indicator.remove();
            });
         }
      };

      /**
       * Счётчик экземпляров класа WaitIndicatorInstance
       * @protected
       * @type {number}
       */
      var WaitIndicatorCounter = 0;



      var emptyPromise = function (useDeferred) {
         var promise,
            success,
            fail;
         if (useDeferred || typeof Promise === 'undefined') {
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
         },

         /**
          * Запросить помещение DOM-элемент индикатора в DOM. Будет выполнено, если элемента ещё нет в DOM-е
          * @public
          * @param {WaitIndicatorInstance} indicator Индикатор
          */
         start: function (indicator) {
            var container = indicator.getContainer(),
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
               var spinner = WaitIndicatorSpinner.create(container, indicator.getMessage(), indicator.getLook());
               WaitIndicatorPool.add({container:container, spinner:spinner, indicators:[indicator]});
            }
         },

         /**
          * Запросить скрытие DOM-элемент индикатора без удаления из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {WaitIndicatorInstance} indicator Индикатор
          */
         suspend: function (indicator) {
            this._remove(indicator, false);
         },

         /**
          * Запросить удаление DOM-элемент индикатора из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {WaitIndicatorInstance} indicator Индикатор
          */
         remove: function (indicator) {
            this._remove(indicator, true);
         },

         /**
          * Общая реализация для методов suspend и remove
          * @protected
          * @param {WaitIndicatorInstance} indicator Индикатор
          * @param {boolean} force Удалить из DOM-а совсем, не просто скрыть
          */
         _remove: function (indicator, force) {
            var container = indicator.getContainer(),
               isGlobal = !container,
               poolItem = WaitIndicatorPool.search(container);
            if (poolItem) {
               var inds = poolItem.indicators,
                  id = indicator.getId(),
                  i = -1;
               if (inds.length) {
                  for (var j = 0; j < inds.length; j++) {
                     if (inds[j].getId() === id) {
                        i = j;
                        break;
                     }
                  }
               }
               if (i !== -1) {
                  if (1 < inds.length) {
                     inds.splice(i, 1);
                     this.update(poolItem, indicator.getMessage(), indicator.getLook());
                  }
                  else {
                     if (!force) {
                        inds.splice(i, 1);
                        WaitIndicatorSpinner.hide(poolItem.spinner);
                        // Начать отсчёт времени до принудительного удаления из DOM-а
                        poolItem.clearing = setTimeout(function () {
                           this._delete(poolItem);
                        }.bind(this), WaitIndicator.SUSPEND_LIFETIME);
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
          * Проверить, и обновить, если нужно, отображение индикатора
          * @public
          * @param {object} poolItem Элемент пула
          * @param {string} prevMessage Текущее (отображаемое) сообщение
          * @param {object} prevLook Текущие (отображаемые) параметры внешнего вида
          */
         update: function (poolItem, prevMessage, prevLook) {
            var inds = poolItem.indicators;
            if (inds.length) {
               var msg = inds[0].getMessage();
               var look = inds[0].getLook();
               // Сейчас look неизменяемый, такого сравнения достаточно
               if (prevMessage !== msg || look !== prevLook) {
                  poolItem.spinner = WaitIndicatorSpinner.change(poolItem.spinner, poolItem.container, msg, look);
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
          * Функция-шаблон
          * @protected
          * @type {function}
          */
         _dotTplFn: doT.template('<div class="ws-wait-indicator{{?it.isGlob}} ws-wait-indicator_global{{??}} ws-wait-indicator_local{{?}}{{?it.message}} ws-wait-indicator_text{{?}}{{?it.scroll}} ws-wait-indicator_scroll-{{=it.scroll}}{{?}}{{?it.small}} ws-wait-indicator_small{{=it.small !== \'yes\' ? \'-\' + it.small : \'\'}}{{?}}{{?it.overlay}} ws-wait-indicator_overlay-{{=it.overlay}}{{?}}{{~it.mods :mod:i}} ws-wait-indicator_mod-{{=mod}}{{~}}"{{?it.rect}} style="left: {{=it.rect.x}}px; top: {{=it.rect.y}}px; width: {{=it.rect.w}}px; height: {{=it.rect.h}}px;"{{?}}><div class="ws-wait-indicator-in">{{=it.message}}</div></div>'),

         /**
          * Создать и добавить в DOM элемент индикатора
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @return {HTMLElement}
          */
         create: function (container, message, look) {
            return this.change(null, container, message, look);
         },

         /**
          * Изменить DOM-элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @return {HTMLElement}
          */
         change: function (spinner, container, message, look) {
            var options = this._prepareOptions(container, message, look);
            var $next = $(this._dotTplFn(options));
            if (spinner) {
               $(spinner).replaceWith($next);
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
            var p = spinner.parentNode;
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
          * Приготовить параметры шаблона
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @return {object}
          */
         _prepareOptions: function (container, message, look) {
            var options = {
               isGlob: !container
            };
            if (!(look && look.small) && message) {
               options.message = message;
            }
            if (look && typeof look === 'object') {
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
